/**
 * 图片上传 API 路由
 *
 * 处理图片上传到第三方图床，返回可访问的图片URL
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * POST /api/upload-image
 * 上传图片到图床
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: '请提供图片文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只支持图片文件' },
        { status: 400 }
      )
    }

    // 验证文件大小（最大5MB）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: '图片大小不能超过5MB' },
        { status: 400 }
      )
    }

    // 使用 Catbox.moe 免费图床（完全匿名，无限制）
    const uploadFormData = new FormData()
    uploadFormData.append('reqtype', 'fileupload')
    uploadFormData.append('fileToUpload', image)

    const uploadResponse = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: uploadFormData
    })

    if (!uploadResponse.ok) {
      console.error('Catbox上传失败:', await uploadResponse.text())
      return NextResponse.json(
        { error: '图片上传失败，请稍后重试' },
        { status: 500 }
      )
    }

    // Catbox 直接返回图片URL文本
    const imageUrl = await uploadResponse.text()

    if (!imageUrl || !imageUrl.startsWith('https://')) {
      console.error('Catbox返回无效URL:', imageUrl)
      return NextResponse.json(
        { error: '图片上传失败，返回URL无效' },
        { status: 500 }
      )
    }

    console.log('图片上传成功:', imageUrl)

    // 返回图片URL
    return NextResponse.json({
      success: true,
      url: imageUrl.trim(),
    })

  } catch (error) {
    console.error('图片上传错误:', error)
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    )
  }
}
