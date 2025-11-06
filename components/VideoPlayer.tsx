'use client'

/**
 * 视频播放器组件
 *
 * 提供视频预览、播放控制和下载功能
 */

import { useState } from 'react'
import { Download, CheckCircle2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { downloadVideo } from '@/lib/api'
import { resizeVideo, downloadProcessedVideo } from '@/lib/videoProcessor'
import { Progress } from '@/components/ui/progress'

interface VideoPlayerProps {
  videoUrl: string
  category: string
}

export function VideoPlayer({ videoUrl, category }: VideoPlayerProps) {
  const [downloading, setDownloading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')

  /**
   * 处理原始下载（不调整尺寸）
   */
  const handleDownload = () => {
    try {
      setDownloading(true)
      downloadVideo(videoUrl, category)

      // 下载成功提示
      setTimeout(() => {
        setDownloading(false)
      }, 1000)
    } catch (error) {
      console.error('下载失败:', error)
      setDownloading(false)
      alert('下载失败,请稍后重试')
    }
  }

  /**
   * 处理调整尺寸并下载
   */
  const handleResizeAndDownload = async () => {
    try {
      setProcessing(true)
      setProgress(0)
      setProgressText('正在初始化...')

      // 调整视频尺寸为 692×390
      const processedBlobUrl = await resizeVideo(
        videoUrl,
        692,
        390,
        (prog, status) => {
          setProgress(prog)
          setProgressText(status)
        }
      )

      // 下载处理后的视频
      const timestamp = new Date().getTime()
      const filename = `店铺视频_${category}_692x390_${timestamp}.mp4`
      downloadProcessedVideo(processedBlobUrl, filename)

      setProgressText('下载完成！')
      setTimeout(() => {
        setProcessing(false)
        setProgress(0)
        setProgressText('')
      }, 2000)
    } catch (error) {
      console.error('视频处理失败:', error)
      setProcessing(false)
      setProgress(0)
      setProgressText('')
      alert('视频处理失败，请重试或直接下载原始视频')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              视频生成成功
            </CardTitle>
            <CardDescription>
              品类：{category} | 格式：MP4
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleResizeAndDownload}
              disabled={downloading || processing}
              variant="default"
              size="sm"
            >
              <Settings className="mr-2 h-4 w-4" />
              {processing ? '处理中...' : '下载 (692×390)'}
            </Button>
            <Button
              onClick={handleDownload}
              disabled={downloading || processing}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading ? '下载中...' : '下载原始视频'}
            </Button>
          </div>
        </div>

        {/* 处理进度条 */}
        {processing && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {progressText} ({progress}%)
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 视频播放器 */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            id="video-player"
            src={videoUrl}
            className="w-full h-full"
            controls
            preload="metadata"
          >
            您的浏览器不支持视频播放
          </video>
        </div>

        {/* 操作提示 */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>使用播放器控件进行播放、暂停、调节音量等操作</p>
          <p className="text-xs">
            提示：右键点击视频可查看更多选项
          </p>
        </div>

        {/* 视频规格说明 */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="text-sm font-semibold text-green-800 mb-2">
            视频规格要求
          </h4>
          <ul className="text-xs text-green-700 space-y-1">
            <li>✓ 格式：MP4</li>
            <li>✓ 尺寸：692 × 390 像素</li>
            <li>✓ 时长：30-50 秒</li>
            <li>✓ 大小：≤ 50MB</li>
          </ul>
        </div>

        {/* 使用说明 */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• 生成的视频符合外卖平台店招规范</p>
          <p>• 点击&ldquo;下载视频&rdquo;按钮保存到本地</p>
          <p>• 文件名格式：店铺视频_&#123;品类&#125;_&#123;时间戳&#125;.mp4</p>
        </div>
      </CardContent>
    </Card>
  )
}
