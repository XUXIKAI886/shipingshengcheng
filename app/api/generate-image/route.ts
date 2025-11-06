/**
 * Gemini AI 生图 API 路由
 *
 * 调用 Gemini 2.5 Flash Image 模型，基于产品图生成电影级尾图
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * Gemini API 配置
 */
const GEMINI_API_CONFIG = {
  baseURL: 'https://newapi.pockgo.com/v1',
  endpoint: '/chat/completions',
  apiKey: 'sk-nonnwG0UNTsUcnyUDEkKfm4uBqSlRhBIBEMEOwDNJ2mvYM3o',
  model: 'gemini-2.5-flash-image',
  aspectRatio: '16:9', // 视频比例
  timeout: 60000, // 60秒超时
} as const

/**
 * 生成尾图的提示词模板
 * 生成食材爆炸分层图，各层食材按次序垂直散开
 */
const TAIL_IMAGE_PROMPT = `Generate an "exploded view" or "deconstructed" image of this food dish, showing all ingredients separated and floating in vertical layers.

CORE CONCEPT - EXPLODED/DECONSTRUCTED VIEW:
Transform the food into a vertical exploded diagram where each ingredient layer is separated and floating at different heights above an empty base (bowl/plate/bun). All components maintain their original shape and position but are physically separated with visible gaps between each layer.

LAYERING STRUCTURE (from bottom to top):
1. BOTTOM: Empty base container (empty bowl, plate, or bottom bun) - positioned at the lowest level
2. MIDDLE LAYERS: Individual ingredients separated vertically in their natural stacking order
   - Each ingredient floats independently with 2-5cm gap from layers above and below
   - Maintain the circular/horizontal alignment - ingredients stay centered above the base
   - Preserve ingredient shapes, sizes, and textures exactly as in original image
3. TOP: Final garnish or top layer (top bun, garnish, etc.) - positioned highest

EXAMPLES BY FOOD TYPE:

For BURGERS/SANDWICHES (bottom to top):
- Empty bottom bun (base level)
- First patty layer (floating 3cm above)
- Cheese slice (floating 3cm above patty)
- Second patty layer (if present)
- Vegetables (lettuce, tomato, onion - each floating separately)
- Sauce layer
- Top bun (highest position)

For BOWLS/RICE DISHES (bottom to top):
- Empty bowl (base level)
- Rice/noodle base (floating 3cm above bowl)
- Protein layer (meat, tofu, etc.)
- Vegetable layers (each type separated)
- Sauce/toppings
- Final garnish

For DESSERTS/CAKES (bottom to top):
- Empty plate or bottom layer
- Each cake layer separated
- Cream/filling layers
- Toppings/decorations
- Final garnish

VISUAL EXECUTION:
- Each layer appears to be frozen mid-air in a perfectly vertical stack
- Maintain perfect center alignment - all layers share the same central axis
- Gaps between layers are consistent (2-5cm depending on item size)
- Ingredients retain 100% of their original color, texture, and appearance
- Slight shadow beneath each floating layer suggesting suspension in space
- Clean separation - no ingredients touching or overlapping

LIGHTING:
- Bright, even professional food photography lighting
- Warm color temperature (3200K) creating appetizing glow
- Soft shadows beneath each floating layer enhancing 3D depth
- Highlights on ingredient surfaces showing texture and freshness
- Well-lit background with subtle gradient (darker at edges, lighter at center)

BACKGROUND:
- Clean solid color background matching the original image tone
- Typically warm orange, amber, or neutral beige
- Subtle vignette darkening at frame edges
- NO distracting elements or patterns
- 16:9 horizontal landscape format

COLOR AND DETAIL:
- Boost color saturation by 20-30% making food ultra-appetizing
- Enhance micro-details: see grain of bread, meat texture, vegetable freshness
- Rich, vibrant food colors - reds deep and rich, greens vivid, browns warm
- Glossy surfaces on sauces, cheese, and wet ingredients
- Sharp focus on all layers simultaneously (deep depth of field)

TECHNICAL REQUIREMENTS:
- 16:9 horizontal landscape orientation
- All ingredient layers clearly visible and well-separated
- Professional commercial food photography quality
- High resolution with sharp details on every layer
- Consistent lighting across all floating elements

STRICT RULES:
- Use ONLY ingredients present in the original image
- Do NOT add new ingredients or elements not in the source
- Maintain exact ingredient shapes, colors, and quantities
- NO text, logos, watermarks, or graphic overlays
- NO smoke, steam, or particle effects (clean exploded view only)
- Empty base container must be at bottom (empty bowl, empty plate, or bottom bun with nothing on it)

FINAL RESULT:
A clean, professional "exploded diagram" of the food showing how it's assembled, with each ingredient layer floating in perfect vertical alignment above an empty base, creating an educational yet visually stunning deconstructed view of the dish.`

/**
 * POST /api/generate-image
 *
 * 接收产品图，调用 Gemini API 生成电影级尾图
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body = await request.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数：imageUrl',
        },
        { status: 400 }
      )
    }

    console.log('开始生成尾图...')
    console.log('产品图 URL:', imageUrl)

    // 2. 调用 Gemini API
    const response = await fetch(`${GEMINI_API_CONFIG.baseURL}${GEMINI_API_CONFIG.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: GEMINI_API_CONFIG.model,
        extra_body: {
          imageConfig: {
            aspectRatio: GEMINI_API_CONFIG.aspectRatio,
          },
        },
        messages: [
          {
            role: 'system',
            content: JSON.stringify({
              imageConfig: {
                aspectRatio: GEMINI_API_CONFIG.aspectRatio,
              },
            }),
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: TAIL_IMAGE_PROMPT,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(GEMINI_API_CONFIG.timeout),
    })

    // 3. 检查响应状态
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API 错误:', errorText)

      return NextResponse.json(
        {
          success: false,
          error: `Gemini API 调用失败: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      )
    }

    // 4. 解析响应
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json()
    console.log('Gemini API 响应:', JSON.stringify(data, null, 2))

    // 5. 提取生成的图片 URL
    // gemini-2.5-flash-image 返回格式：choices[0].message.content 包含图片URL或markdown格式
    let generatedImageUrl = ''

    // 尝试从choices[0].message.content提取
    const messageContent = data.choices?.[0]?.message?.content
    if (messageContent) {
      console.log('Message content:', messageContent)

      // 如果content是字符串，可能包含markdown格式的图片链接
      if (typeof messageContent === 'string') {
        // 尝试提取markdown格式的图片: ![...](url)
        const markdownImageMatch = messageContent.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/)
        if (markdownImageMatch) {
          generatedImageUrl = markdownImageMatch[1]
          console.log('从Markdown提取URL:', generatedImageUrl)
        } else {
          // 尝试提取纯URL
          const urlMatch = messageContent.match(/(https?:\/\/[^\s]+)/)
          if (urlMatch) {
            generatedImageUrl = urlMatch[1]
            console.log('从文本提取URL:', generatedImageUrl)
          }
        }
      }
    }

    // 如果还没找到，尝试其他字段
    if (!generatedImageUrl) {
      generatedImageUrl =
        data.data?.url ||
        data.url ||
        data.image_url ||
        data.choices?.[0]?.url ||
        ''
    }

    // 最后一次检查：如果获取到的值是 markdown 格式，提取纯 URL
    if (generatedImageUrl && typeof generatedImageUrl === 'string') {
      const markdownMatch = generatedImageUrl.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/)
      if (markdownMatch) {
        generatedImageUrl = markdownMatch[1]
        console.log('从最终值中提取markdown URL:', generatedImageUrl)
      }
    }

    if (!generatedImageUrl) {
      console.error('无法从响应中提取图片 URL')
      console.error('完整响应:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        {
          success: false,
          error: '生成的图片 URL 未找到，请查看服务器日志了解详情',
        },
        { status: 500 }
      )
    }

    console.log('尾图生成成功:', generatedImageUrl)

    // 6. 返回成功结果
    return NextResponse.json({
      success: true,
      data: {
        tailImageUrl: generatedImageUrl,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    // 7. 错误处理
    console.error('尾图生成错误:', error)

    if (error instanceof Error) {
      // 超时错误
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        return NextResponse.json(
          {
            success: false,
            error: '请求超时，尾图生成时间过长',
          },
          { status: 408 }
        )
      }

      // 网络错误
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          {
            success: false,
            error: '网络连接失败，请检查网络后重试',
          },
          { status: 503 }
        )
      }
    }

    // 未知错误
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '服务器内部错误',
      },
      { status: 500 }
    )
  }
}
