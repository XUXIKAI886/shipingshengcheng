/**
 * Coze AI Prompt 优化 API 路由
 *
 * 调用 Coze Bot 优化用户输入的品类和菜品信息，生成专业的视频提示词
 */

import { NextRequest, NextResponse } from 'next/server'

// Coze API 配置
const COZE_CONFIG = {
  apiUrl: 'https://api.coze.cn/v3/chat',
  botId: '7569143894404366377',
  accessToken: 'sat_7S2wJIRzYUoAKPaMAQzTfG8BVv3kqd8OB8Do3xzVnHIlyVk6SfgZPoQ8mzfViWp2',
}

/**
 * POST /api/optimize-prompt
 *
 * 请求体：
 * {
 *   "category": "经营品类",
 *   "dishName": "主推菜品名称"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body = await request.json()
    const { category, dishName } = body

    if (!category || !dishName) {
      return NextResponse.json(
        { error: '请提供经营品类和主推菜品名称' },
        { status: 400 }
      )
    }

    console.log('开始优化Prompt:', { category, dishName })

    // 2. 构建发送给 Coze 的消息
    const userMessage = `我是一个外卖店铺，经营品类是"${category}"，主推菜品是"${dishName}"。请帮我生成一个专业的视频生成提示词，用于生成外卖店铺的视频招牌。要求突出食物的色泽、质感和诱人外观，背景干净简洁，光线明亮温暖，整体氛围温馨诱人，适合横屏16:9格式视频。`

    // 3. 调用 Coze API (使用流式响应)
    const cozeResponse = await fetch(COZE_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_CONFIG.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: COZE_CONFIG.botId,
        user_id: `user_${Date.now()}`, // 使用时间戳生成唯一用户ID
        stream: true, // 使用流式响应
        auto_save_history: true, // 保存历史记录
        additional_messages: [
          {
            role: 'user',
            content: userMessage,
            content_type: 'text',
          }
        ]
      }),
    })

    // 4. 检查响应状态
    if (!cozeResponse.ok) {
      const errorText = await cozeResponse.text()
      console.error('Coze API 错误:', errorText)
      return NextResponse.json(
        { error: `Coze API 调用失败: ${cozeResponse.status}` },
        { status: cozeResponse.status }
      )
    }

    // 5. 解析流式响应
    const responseText = await cozeResponse.text()
    console.log('Coze API 原始响应:', responseText)

    // 6. 提取优化后的 Prompt
    // 流式响应格式：每行格式为 "event:xxx\ndata:xxx\n\n"
    let optimizedPrompt = ''

    const lines = responseText.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // 查找 conversation.message.completed 事件
      if (line === 'event:conversation.message.completed') {
        // 下一行应该是 data:
        const dataLine = lines[i + 1]
        if (dataLine && dataLine.startsWith('data:')) {
          try {
            const jsonData = JSON.parse(dataLine.substring(5)) // 移除 "data:" 前缀
            if (jsonData.role === 'assistant' && jsonData.type === 'answer' && jsonData.content) {
              optimizedPrompt = jsonData.content
              break
            }
          } catch (e) {
            console.error('解析 JSON 失败:', e)
          }
        }
      }
    }

    // 7. 如果没有获取到优化后的 Prompt，返回错误
    if (!optimizedPrompt) {
      console.error('无法从 Coze 响应中提取优化后的 Prompt')
      return NextResponse.json(
        { error: '无法生成优化后的提示词，请重试' },
        { status: 500 }
      )
    }

    console.log('优化后的 Prompt:', optimizedPrompt)

    // 8. 返回成功结果
    return NextResponse.json({
      success: true,
      optimizedPrompt,
      original: {
        category,
        dishName,
      }
    })

  } catch (error) {
    console.error('Prompt 优化错误:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '服务器内部错误'
      },
      { status: 500 }
    )
  }
}
