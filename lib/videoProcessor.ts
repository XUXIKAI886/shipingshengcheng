/**
 * 视频处理工具
 * 使用 FFmpeg.wasm 在浏览器端处理视频
 */

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

let ffmpegInstance: FFmpeg | null = null
let isLoading = false

/**
 * 初始化 FFmpeg
 */
async function loadFFmpeg(onProgress?: (progress: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance) {
    return ffmpegInstance
  }

  if (isLoading) {
    // 等待加载完成
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return ffmpegInstance!
  }

  isLoading = true

  try {
    const ffmpeg = new FFmpeg()

    // 加载进度回调
    ffmpeg.on('log', ({ message }) => {
      console.log('FFmpeg:', message)
    })

    ffmpeg.on('progress', ({ progress }) => {
      if (onProgress) {
        onProgress(Math.round(progress * 100))
      }
    })

    // 从 CDN 加载 FFmpeg 核心文件
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    ffmpegInstance = ffmpeg
    isLoading = false
    return ffmpeg
  } catch (error) {
    isLoading = false
    console.error('FFmpeg 加载失败:', error)
    throw new Error('视频处理工具加载失败，请刷新页面重试')
  }
}

/**
 * 调整视频尺寸
 *
 * @param videoUrl - 原始视频 URL
 * @param width - 目标宽度
 * @param height - 目标高度
 * @param onProgress - 进度回调 (0-100)
 * @returns 处理后的视频 Blob URL
 */
export async function resizeVideo(
  videoUrl: string,
  width: number,
  height: number,
  onProgress?: (progress: number, status: string) => void
): Promise<string> {
  try {
    // 1. 加载 FFmpeg
    if (onProgress) onProgress(0, '正在加载视频处理工具...')
    const ffmpeg = await loadFFmpeg((p) => {
      if (onProgress && p < 20) {
        onProgress(p, '正在加载视频处理工具...')
      }
    })

    // 2. 获取原始视频文件
    if (onProgress) onProgress(20, '正在下载原始视频...')
    const videoData = await fetchFile(videoUrl)

    // 3. 写入 FFmpeg 虚拟文件系统
    if (onProgress) onProgress(30, '正在准备视频文件...')
    await ffmpeg.writeFile('input.mp4', videoData)

    // 4. 执行视频处理
    if (onProgress) onProgress(40, '正在调整视频尺寸...')

    // FFmpeg 命令：调整尺寸并保持质量
    // -i input.mp4: 输入文件
    // -vf scale=692:390: 调整尺寸为 692x390
    // -c:v libx264: 使用 H.264 编码
    // -preset fast: 快速编码
    // -crf 18: 高质量 (0-51, 越小质量越高)
    // -c:a copy: 复制音频流（不重新编码）
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', `scale=${width}:${height}`,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '18',
      '-c:a', 'copy',
      'output.mp4'
    ])

    // 5. 读取处理后的视频
    if (onProgress) onProgress(90, '正在生成下载文件...')
    const data = await ffmpeg.readFile('output.mp4')

    // 6. 创建 Blob URL
    const blob = new Blob([data], { type: 'video/mp4' })
    const blobUrl = URL.createObjectURL(blob)

    // 7. 清理虚拟文件系统
    try {
      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output.mp4')
    } catch (e) {
      console.warn('清理临时文件失败:', e)
    }

    if (onProgress) onProgress(100, '处理完成！')
    return blobUrl
  } catch (error) {
    console.error('视频处理失败:', error)
    throw new Error('视频尺寸调整失败，请重试')
  }
}

/**
 * 给视频添加水印
 *
 * @param videoUrl - 原始视频 URL
 * @param watermarkText - 水印文字
 * @param onProgress - 进度回调 (0-100)
 * @returns 带水印的视频 Blob URL
 */
export async function addWatermarkToVideo(
  videoUrl: string,
  watermarkText: string,
  onProgress?: (progress: number, status: string) => void
): Promise<string> {
  try {
    // 1. 加载 FFmpeg
    if (onProgress) onProgress(0, '正在加载视频处理工具...')
    const ffmpeg = await loadFFmpeg((p) => {
      if (onProgress && p < 20) {
        onProgress(p, '正在加载视频处理工具...')
      }
    })

    // 2. 获取原始视频文件
    if (onProgress) onProgress(20, '正在下载原始视频...')
    const videoData = await fetchFile(videoUrl)

    // 3. 写入 FFmpeg 虚拟文件系统
    if (onProgress) onProgress(30, '正在准备视频文件...')
    await ffmpeg.writeFile('input.mp4', videoData)

    // 4. 创建水印文字
    if (onProgress) onProgress(40, '正在生成水印...')

    // 使用 FFmpeg 的 drawtext 滤镜添加文字水印
    // 参数说明：
    // - fontfile: 字体文件（使用系统默认字体）
    // - text: 水印文字
    // - fontsize: 字体大小
    // - fontcolor: 字体颜色（白色半透明）
    // - x, y: 水印位置（右下角）
    // - shadow: 文字阴影，增强可读性
    const watermarkFilter = `drawtext=text='${watermarkText}':fontsize=24:fontcolor=white@0.7:x=w-tw-10:y=h-th-10:shadowx=2:shadowy=2:shadowcolor=black@0.5`

    // 5. 执行视频水印处理
    if (onProgress) onProgress(50, '正在添加水印...')

    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', watermarkFilter,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '18',
      '-c:a', 'copy',
      'output_watermarked.mp4'
    ])

    // 6. 读取处理后的视频
    if (onProgress) onProgress(90, '正在生成下载文件...')
    const data = await ffmpeg.readFile('output_watermarked.mp4')

    // 7. 创建 Blob URL
    const blob = new Blob([data], { type: 'video/mp4' })
    const blobUrl = URL.createObjectURL(blob)

    // 8. 清理虚拟文件系统
    try {
      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output_watermarked.mp4')
    } catch (e) {
      console.warn('清理临时文件失败:', e)
    }

    if (onProgress) onProgress(100, '水印添加完成！')
    return blobUrl
  } catch (error) {
    console.error('水印添加失败:', error)
    throw new Error('视频水印添加失败，请重试')
  }
}

/**
 * 下载处理后的视频
 *
 * @param blobUrl - 视频 Blob URL
 * @param filename - 文件名
 */
export function downloadProcessedVideo(blobUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 延迟清理 Blob URL，确保下载完成
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl)
  }, 5000)
}
