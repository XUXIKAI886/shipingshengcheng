/**
 * 视频生成 API 路由
 *
 * Next.js App Router API 端点
 * 负责调用云雾 API (Veo 3.1) 生成视频
 */

import { NextRequest, NextResponse } from 'next/server'
import { VEO_API_CONFIG, VIDEO_SPECS } from '@/lib/prompts'
import { VideoResult, VideoErrorType } from '@/types/video'

/**
 * POST /api/generate-video
 *
 * 接收前端请求，调用云雾 Sora API 生成视频
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body = await request.json()
    const { prompt, category } = body
    let imageUrl = body.imageUrl // 使用 let 允许重新赋值
    let headImageUrl = body.headImageUrl // 首图
    let tailImageUrl = body.tailImageUrl // 尾图

    if (!prompt || (!category && !imageUrl && !headImageUrl)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: VideoErrorType.VALIDATION_ERROR,
            message: '缺少必要参数：prompt 或 category/imageUrl/headImageUrl',
          },
        },
        { status: 400 }
      )
    }

    // 2. 直接使用 Base64 图片（不再上传到图床）
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      console.log('检测到 Base64 图片，直接使用')
    }

    // 3. 直接使用首尾帧 Base64 图片
    if (headImageUrl && headImageUrl.startsWith('data:image/')) {
      console.log('检测到首图 Base64，直接使用')
    }

    if (tailImageUrl && tailImageUrl.startsWith('data:image/')) {
      console.log('检测到尾图 Base64，直接使用')
    }

    // 确定生成模式
    const mode = headImageUrl ? '首尾帧生成' : (imageUrl ? '图片生成' : '文字生成')
    console.log('开始生成视频，模式:', mode)
    console.log('品类:', category || `(${mode})`)
    console.log('图片URL:', imageUrl || '(无)')
    console.log('首图URL:', headImageUrl || '(无)')
    console.log('尾图URL:', tailImageUrl || '(无)')
    console.log('提示词:', prompt)

    // 4. 准备图片数组
    let images: string[] = []
    if (headImageUrl && tailImageUrl) {
      // 首尾帧模式：传递首图和尾图
      images = [headImageUrl, tailImageUrl]
    } else if (imageUrl) {
      // 图片生成模式：传递单张图片
      images = [imageUrl]
    }

    // 5. 调用云雾 Veo API
    const veoResponse = await fetch(`${VEO_API_CONFIG.baseURL}${VEO_API_CONFIG.endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VEO_API_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: VEO_API_CONFIG.model,
        prompt: prompt,
        aspect_ratio: VIDEO_SPECS.aspectRatio, // Veo 使用宽高比
        enhance_prompt: VIDEO_SPECS.enhancePrompt, // 自动将中文转英文
        enable_upsample: VIDEO_SPECS.enableUpsample, // 超采样（可选）
        images: images, // 图片URL数组（单图或首尾帧）
      }),
      signal: AbortSignal.timeout(VEO_API_CONFIG.timeout),
    })

    // 4. 检查响应状态
    if (!veoResponse.ok) {
      const errorText = await veoResponse.text()
      console.error('云雾 Veo API 错误:', errorText)

      return NextResponse.json(
        {
          success: false,
          error: {
            type: VideoErrorType.API_ERROR,
            message: `云雾 Veo API 调用失败: ${veoResponse.status} ${veoResponse.statusText}`,
          },
        },
        { status: veoResponse.status }
      )
    }

    // 5. 解析 Veo API 响应
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const veoData: any = await veoResponse.json()
    console.log('云雾 Veo API 响应:', JSON.stringify(veoData, null, 2))

    // 6. 处理不同的响应状态
    if (veoData.status === 'failed') {
      return NextResponse.json(
        {
          success: false,
          error: {
            type: VideoErrorType.API_ERROR,
            message: veoData.error || '视频生成失败',
          },
        },
        { status: 500 }
      )
    }

    // 7. 如果是异步任务，需要轮询（queued、pending、processing、prompt_enhancing、prompt_enhancement_checking 都需要等待）
    if (veoData.status === 'queued' ||
        veoData.status === 'pending' ||
        veoData.status === 'processing' ||
        veoData.status === 'prompt_enhancing' ||
        veoData.status === 'prompt_enhancement_checking') {
      console.log(`任务状态: ${veoData.status}, 开始轮询...`)
      // 实现轮询逻辑
      const videoUrl = await pollVideoStatus(veoData.id)

      if (!videoUrl) {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: VideoErrorType.TIMEOUT_ERROR,
              message: '视频生成超时，请稍后重试',
            },
          },
          { status: 408 }
        )
      }

      // 返回成功结果
      console.log('视频生成成功，URL:', videoUrl)
      const result: VideoResult = {
        video_url: videoUrl,
        category: category || '图片生成',
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        data: result,
      })
    }

    // 8. 如果已经完成，直接返回
    if (veoData.status === 'completed' && veoData.video_url) {
      const result: VideoResult = {
        video_url: veoData.video_url,
        category: category || '图片生成',
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        data: result,
      })
    }

    // 9. 尝试从其他可能的字段中获取视频URL
    const videoUrl = veoData.video_url || veoData.videoUrl || veoData.url || veoData.data?.video_url || veoData.data?.url

    if (videoUrl) {
      console.log('从响应中提取到视频URL:', videoUrl)
      const result: VideoResult = {
        video_url: videoUrl,
        category: category || '图片生成',
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        data: result,
      })
    }

    // 10. 其他情况 - 记录完整响应用于调试
    console.error('无法处理的响应格式:', JSON.stringify(veoData, null, 2))
    return NextResponse.json(
      {
        success: false,
        error: {
          type: VideoErrorType.UNKNOWN_ERROR,
          message: `未知的响应状态。响应数据: ${JSON.stringify(veoData).substring(0, 200)}`,
        },
      },
      { status: 500 }
    )
  } catch (error) {
    // 11. 错误处理
    console.error('视频生成错误:', error)

    if (error instanceof Error) {
      // 超时错误
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: VideoErrorType.TIMEOUT_ERROR,
              message: '请求超时，视频生成时间过长',
            },
          },
          { status: 408 }
        )
      }

      // 网络错误
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              type: VideoErrorType.NETWORK_ERROR,
              message: '网络连接失败，请检查网络后重试',
            },
          },
          { status: 503 }
        )
      }
    }

    // 未知错误
    return NextResponse.json(
      {
        success: false,
        error: {
          type: VideoErrorType.UNKNOWN_ERROR,
          message: error instanceof Error ? error.message : '服务器内部错误',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * 轮询视频生成状态
 *
 * @param taskId - 任务ID
 * @returns Promise<string | null> - 视频URL，如果超时则返回 null
 */
async function pollVideoStatus(taskId: string): Promise<string | null> {
  const maxAttempts = 120 // 最多轮询120次（10分钟）
  const pollInterval = 5000 // 每5秒轮询一次

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // 等待指定时间
      await new Promise((resolve) => setTimeout(resolve, pollInterval))

      // 查询任务状态 - 使用正确的 API 端点
      const endpoints = [
        `${VEO_API_CONFIG.baseURL}/video/status/${taskId}`,
        `${VEO_API_CONFIG.baseURL}/video/${taskId}`,
        `${VEO_API_CONFIG.baseURL}/videos/${taskId}`,
      ]

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any = null
      let lastError: string = ''

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${VEO_API_CONFIG.apiKey}`,
            },
          })

          if (response.ok) {
            data = await response.json()
            console.log(`轮询响应 (attempt ${attempt + 1}):`, JSON.stringify(data, null, 2))
            break
          } else {
            lastError = `${response.status} ${response.statusText}`
          }
        } catch (e) {
          lastError = e instanceof Error ? e.message : String(e)
        }
      }

      if (!data) {
        console.error(`轮询失败 (attempt ${attempt + 1}): ${lastError}`)
        continue
      }

      // 检查状态 - 支持多种状态值
      const status = data.status || data.state
      const progress = data.progress || 0

      console.log(`轮询进度: ${attempt + 1}/${maxAttempts}, 状态: ${status}, 进度: ${progress}%`)

      // 如果完成，尝试从多个可能的字段获取视频 URL
      if (status === 'completed' || status === 'done' || status === 'success') {
        const videoUrl = data.video_url || data.videoUrl || data.url ||
                        data.result?.video_url || data.result?.url ||
                        data.data?.video_url || data.data?.url ||
                        data.output_url || data.file_url

        if (videoUrl) {
          console.log('成功获取视频 URL:', videoUrl)
          return videoUrl
        } else {
          console.error('视频已完成但未找到 URL:', JSON.stringify(data, null, 2))
        }
      }

      // 如果失败
      if (status === 'failed' || status === 'error') {
        const errorMsg = data.error || data.message || data.error_message || '未知错误'
        console.error('视频生成失败:', errorMsg)
        return null
      }

      // 继续等待（queued, pending, processing, running 等状态）
    } catch (error) {
      console.error(`轮询错误 (attempt ${attempt + 1}):`, error)
      // 继续尝试
    }
  }

  // 超时
  console.error('视频生成超时')
  return null
}
