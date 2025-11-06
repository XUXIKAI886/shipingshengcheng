/**
 * API 调用封装模块
 *
 * 提供类型安全的 API 调用函数，处理请求和响应
 */

import { VideoResult, VideoErrorType, ApiResponse } from '@/types/video'
import { VIDEO_PROMPT_TEMPLATE, IMAGE_TO_VIDEO_PROMPT, FIRST_LAST_FRAME_VIDEO_PROMPT, MODEL_SHOWCASE_VIDEO_PROMPT, validateCategory } from './prompts'

/**
 * 生成视频
 *
 * @param category - 店铺经营品类（文字生成模式）
 * @param imageUrl - 图片URL（图片生成模式）
 * @param customPrompt - 自定义提示词（可选，如果提供则使用此提示词而不是默认模板）
 * @param headImageUrl - 首图URL（首尾帧生成模式 & 模特正面照）
 * @param tailImageUrl - 尾图URL（首尾帧生成模式 & 模特背面照）
 * @returns Promise<VideoResult> - 视频生成结果
 * @throws Error - 当 API 调用失败时抛出错误
 *
 * @example
 * ```ts
 * // 文字生成模式（使用默认模板）
 * const result1 = await generateVideo('盖浇饭炒菜')
 *
 * // 文字生成模式（使用自定义 Prompt）
 * const result2 = await generateVideo('盖浇饭炒菜', undefined, '优化后的提示词...')
 *
 * // 图片生成模式
 * const result3 = await generateVideo(undefined, 'https://example.com/image.jpg')
 *
 * // 首尾帧生成模式（食品）
 * const result4 = await generateVideo(undefined, undefined, undefined, 'head.jpg', 'tail.jpg')
 *
 * // 模特展示模式（正面照+背面照）
 * const result5 = await generateVideo(undefined, undefined, undefined, 'front.jpg', 'back.jpg')
 * ```
 */
export async function generateVideo(
  category?: string,
  imageUrl?: string,
  customPrompt?: string,
  headImageUrl?: string,
  tailImageUrl?: string
): Promise<VideoResult> {
  // 1. 验证：至少提供一种模式
  if (!category && !imageUrl && !headImageUrl) {
    throw new Error('请提供品类、图片或首尾帧图片')
  }

  // 2. 首尾帧模式验证（包括食品和模特展示）
  if (headImageUrl && !tailImageUrl) {
    throw new Error('首尾帧模式需要同时提供首图和尾图')
  }

  // 3. 文字模式验证（仅在没有自定义 Prompt 时验证品类）
  if (category && !customPrompt) {
    const validation = validateCategory(category)
    if (!validation.valid) {
      throw new Error(validation.error || VideoErrorType.VALIDATION_ERROR)
    }
  }

  // 4. 构建提示词
  // 注意：首尾帧模式既可能是食品（FIRST_LAST_FRAME）也可能是模特（MODEL_SHOWCASE）
  // 由于两者都使用 headImageUrl 和 tailImageUrl，后端需要根据上下文判断
  // 这里默认如果只有首尾帧，使用食品模式；如果前端明确是模特模式，会使用相同的prompt结构
  const prompt = customPrompt
    ? customPrompt // 使用 Coze 优化后的 Prompt
    : imageUrl
      ? IMAGE_TO_VIDEO_PROMPT() // 图片生成模式
      : headImageUrl && tailImageUrl
        ? FIRST_LAST_FRAME_VIDEO_PROMPT() // 首尾帧模式（食品或模特都使用此prompt）
        : VIDEO_PROMPT_TEMPLATE(category!) // 文字生成模式

  try {
    // 5. 调用后端 API 路由
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        category,
        imageUrl,
        headImageUrl,
        tailImageUrl,
      }),
    })

    // 4. 处理响应
    if (!response.ok) {
      // HTTP 错误
      const errorText = await response.text()
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`)
    }

    // 5. 解析 JSON
    const data: ApiResponse<VideoResult> = await response.json()

    // 6. 检查业务逻辑错误
    if (!data.success) {
      throw new Error(data.error?.message || VideoErrorType.API_ERROR)
    }

    if (!data.data) {
      throw new Error('服务器返回数据为空')
    }

    return data.data
  } catch (error) {
    // 7. 错误处理和转换
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(VideoErrorType.NETWORK_ERROR)
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error(VideoErrorType.UNKNOWN_ERROR)
  }
}

/**
 * 下载视频文件
 *
 * @param videoUrl - 视频 URL
 * @param category - 品类名称（用于文件命名）
 */
export function downloadVideo(videoUrl: string, category: string): void {
  try {
    // 生成文件名：店铺视频_{品类}_{时间戳}.mp4
    const timestamp = new Date().getTime()
    const filename = `店铺视频_${category}_${timestamp}.mp4`

    // 创建临时下载链接
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = filename
    link.target = '_blank' // 在新标签页打开，避免导航离开当前页面

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载失败:', error)
    throw new Error('视频下载失败，请稍后重试')
  }
}

/**
 * 重试配置
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 2000,
  backoffMultiplier: 2,
}

/**
 * 带重试机制的请求函数（高级功能，可选使用）
 *
 * @param fn - 需要重试的异步函数
 * @param retries - 当前重试次数
 * @returns Promise - 函数执行结果
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 0
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries < RETRY_CONFIG.maxRetries) {
      // 计算延迟时间（指数退避）
      const delay = RETRY_CONFIG.retryDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, retries)

      // 等待后重试
      await new Promise((resolve) => setTimeout(resolve, delay))

      return withRetry(fn, retries + 1)
    }

    // 重试次数用尽，抛出错误
    throw error
  }
}
