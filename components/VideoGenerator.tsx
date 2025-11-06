'use client'

/**
 * 视频生成表单组件
 *
 * 提供品类输入、生成按钮和状态管理
 */

import { useState, useEffect } from 'react'
import { Loader2, Sparkles, ImageIcon, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateVideo } from '@/lib/api'
import { VideoPlayer } from './VideoPlayer'
import { ImageUpload } from './ImageUpload'
import type { VideoResult } from '@/types/video'

export function VideoGenerator() {
  // 状态管理
  const [mode, setMode] = useState<'text' | 'image' | 'firstLast'>('firstLast') // 生成模式
  const [category, setCategory] = useState('')
  const [dishName, setDishName] = useState('') // 主推菜品名称
  const [optimizedPrompt, setOptimizedPrompt] = useState('') // Coze 优化后的 Prompt
  const [optimizing, setOptimizing] = useState(false) // Prompt 优化中
  const [imageUrl, setImageUrl] = useState<string | null>(null) // 上传的图片URL（图片生成模式）
  const [headImageUrl, setHeadImageUrl] = useState<string | null>(null) // 首图URL（首尾帧模式）
  const [tailImageUrl, setTailImageUrl] = useState<string | null>(null) // 尾图URL（首尾帧模式）
  const [generatingTailImage, setGeneratingTailImage] = useState(false) // 正在生成尾图
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  // 进度估算参数（基于实际测试：约5-6分钟）
  const PROGRESS_STAGES = [
    { time: 0, progress: 0, label: '正在提交任务...' },
    { time: 10, progress: 5, label: '任务排队中...' },
    { time: 80, progress: 15, label: '开始生成视频...' },
    { time: 120, progress: 35, label: '视频生成中 (44%)...' },
    { time: 180, progress: 55, label: '视频生成中 (81%)...' },
    { time: 240, progress: 75, label: '正在处理视频...' },
    { time: 300, progress: 90, label: '即将完成...' },
    { time: 330, progress: 95, label: '正在获取视频链接...' },
  ]

  // 定时器：更新进度
  useEffect(() => {
    if (!loading) {
      setProgress(0)
      setElapsedTime(0)
      return
    }

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1
        
        // 根据时间阶段计算进度
        const currentStage = PROGRESS_STAGES.reduce((acc, stage) => {
          if (newTime >= stage.time) return stage
          return acc
        }, PROGRESS_STAGES[0])
        
        // 平滑过渡到目标进度
        const nextStage = PROGRESS_STAGES.find(s => s.time > newTime) || PROGRESS_STAGES[PROGRESS_STAGES.length - 1]
        const timeInStage = newTime - currentStage.time
        const stageDuration = nextStage.time - currentStage.time
        const progressInStage = stageDuration > 0 ? (timeInStage / stageDuration) : 0
        const smoothProgress = currentStage.progress + (nextStage.progress - currentStage.progress) * progressInStage
        
        setProgress(Math.min(smoothProgress, 98)) // 最多到98%，等API返回后显示100%
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [loading])

  // 获取当前阶段描述
  const getCurrentStageLabel = () => {
    const stage = PROGRESS_STAGES.reduce((acc, s) => {
      if (elapsedTime >= s.time) return s
      return acc
    }, PROGRESS_STAGES[0])
    return stage.label
  }

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * 生成尾图 (调用 Gemini API)
   */
  const handleGenerateTailImage = async () => {
    // 重置错误状态
    setError(null)

    // 验证输入
    if (!headImageUrl) {
      setError('请先上传产品首图')
      return
    }

    setGeneratingTailImage(true)

    try {
      // 调用 Gemini API 生成尾图
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: headImageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('尾图生成失败')
      }

      const data = await response.json()

      if (!data.success || !data.data?.tailImageUrl) {
        throw new Error(data.error || '尾图生成失败')
      }

      // 设置生成的尾图
      setTailImageUrl(data.data.tailImageUrl)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '尾图生成失败，请稍后重试'
      setError(errorMessage)
      console.error('尾图生成错误:', err)
    } finally {
      setGeneratingTailImage(false)
    }
  }

  /**
   * 优化 Prompt (调用 Coze API)
   */
  const handleOptimizePrompt = async () => {
    // 重置错误状态
    setError(null)

    // 验证输入
    if (!category.trim()) {
      setError('请输入店铺经营品类')
      return
    }

    if (!dishName.trim()) {
      setError('请输入主推菜品名称')
      return
    }

    setOptimizing(true)

    try {
      // 调用 Coze API 优化 Prompt
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category.trim(),
          dishName: dishName.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Prompt 优化失败')
      }

      const data = await response.json()

      if (!data.success || !data.optimizedPrompt) {
        throw new Error(data.error || 'Prompt 优化失败')
      }

      // 设置优化后的 Prompt
      setOptimizedPrompt(data.optimizedPrompt)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Prompt 优化失败，请稍后重试'
      setError(errorMessage)
      console.error('Prompt 优化错误:', err)
    } finally {
      setOptimizing(false)
    }
  }

  /**
   * 处理视频生成
   */
  const handleGenerate = async () => {
    // 重置状态
    setError(null)
    setVideoResult(null)
    setProgress(0)
    setElapsedTime(0)

    // 验证输入
    if (mode === 'text') {
      if (!optimizedPrompt.trim()) {
        setError('请先点击"优化 Prompt"按钮生成提示词')
        return
      }
    }

    if (mode === 'image' && !imageUrl) {
      setError('请先上传店招图片')
      return
    }

    if (mode === 'firstLast') {
      if (!headImageUrl) {
        setError('请先上传产品首图')
        return
      }
      if (!tailImageUrl) {
        setError('请先生成尾图')
        return
      }
    }

    setLoading(true)

    try {
      // 调用 API 生成视频
      const result = await generateVideo(
        mode === 'text' ? category : undefined,
        mode === 'image' ? (imageUrl || undefined) : undefined,
        mode === 'text' ? optimizedPrompt : undefined, // 使用优化后的 Prompt
        mode === 'firstLast' ? headImageUrl : undefined, // 首图
        mode === 'firstLast' ? tailImageUrl : undefined // 尾图
      )
      setProgress(100) // 完成时设为100%
      setVideoResult(result)
    } catch (err) {
      // 错误处理
      const errorMessage = err instanceof Error ? err.message : '视频生成失败，请稍后重试'
      setError(errorMessage)
      console.error('视频生成错误:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 处理键盘回车事件
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 输入表单卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            外卖店铺视频生成
          </CardTitle>
          <CardDescription>
            选择生成方式：输入品类文字描述，或上传店招图片让AI动起来
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 模式切换 Tabs */}
          <Tabs value={mode} onValueChange={(value) => setMode(value as 'text' | 'image' | 'firstLast')} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="firstLast" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                首尾帧生成
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                图片生成
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                文字生成
              </TabsTrigger>
            </TabsList>

            {/* 文字生成模式 */}
            <TabsContent value="text" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* 经营品类输入框 */}
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    经营品类
                  </label>
                  <Input
                    id="category"
                    placeholder="例如：川菜馆"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading || optimizing}
                    className="text-base"
                    maxLength={50}
                  />
                </div>

                {/* 主推菜品输入框 */}
                <div className="space-y-2">
                  <label htmlFor="dishName" className="text-sm font-medium">
                    主推菜品名称
                  </label>
                  <Input
                    id="dishName"
                    placeholder="例如：水煮鱼"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    disabled={loading || optimizing}
                    className="text-base"
                    maxLength={50}
                  />
                </div>
              </div>

              {/* 优化 Prompt 按钮 */}
              <Button
                onClick={handleOptimizePrompt}
                disabled={optimizing || loading || !category.trim() || !dishName.trim()}
                className="w-full"
                variant="outline"
                size="lg"
              >
                {optimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在优化 Prompt...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    优化 Prompt
                  </>
                )}
              </Button>

              {/* 显示优化后的 Prompt */}
              {optimizedPrompt && (
                <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">✨ 优化后的提示词：</p>
                  <p className="text-sm text-blue-800 whitespace-pre-wrap">{optimizedPrompt}</p>
                </div>
              )}
            </TabsContent>

            {/* 图片生成模式 */}
            <TabsContent value="image" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  上传产品主图
                </label>
                <ImageUpload
                  onImageUploaded={(url) => setImageUrl(url)}
                  maxSizeMB={5}
                />
                <p className="text-xs text-muted-foreground">
                  上传产品主图，AI 将生成电影级广告视频：镜头从远到近推进，热气升腾，金色粒子环绕旋转并融入食物，专业打光与色彩，呈现好莱坞大片质感
                </p>
              </div>
            </TabsContent>

            {/* 首尾帧生成模式 */}
            <TabsContent value="firstLast" className="space-y-4">
              <div className="space-y-4">
                {/* 上传首图 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    1️⃣ 上传产品首图
                  </label>
                  <ImageUpload
                    onImageUploaded={(url) => setHeadImageUrl(url)}
                    maxSizeMB={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    上传产品图片作为视频首帧
                  </p>
                </div>

  
                {/* 生成尾图按钮 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    2️⃣ 生成电影级尾图
                  </label>
                  <Button
                    onClick={handleGenerateTailImage}
                    disabled={generatingTailImage || loading || !headImageUrl}
                    className="w-full"
                    variant="outline"
                    size="lg"
                  >
                    {generatingTailImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        正在生成尾图...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        生成尾图
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    AI 将基于首图生成尾图
                  </p>
                </div>

                {/* 显示尾图预览 */}
                {tailImageUrl && (
                  <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
                    <p className="text-sm font-medium text-blue-900 mb-2">✨ 尾图生成成功</p>
                    <img src={tailImageUrl} alt="尾图预览" className="w-full max-w-md rounded-md" />
                  </div>
                )}

                {/* 首尾帧对比预览 */}
                {headImageUrl && tailImageUrl && (
                  <div className="p-4 rounded-md bg-purple-50 border border-purple-200">
                    <p className="text-sm font-medium text-purple-900 mb-3">🎬 首尾帧对比预览</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-purple-700 mb-2">首帧（起始）</p>
                        <img src={headImageUrl} alt="首帧" className="w-full rounded-md border-2 border-purple-300" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-700 mb-2">尾帧（结束）</p>
                        <img src={tailImageUrl} alt="尾帧" className="w-full rounded-md border-2 border-purple-300" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* 生成按钮 */}
          <Button
            onClick={handleGenerate}
            disabled={
              loading ||
              (mode === 'text' && !category.trim()) ||
              (mode === 'image' && !imageUrl) ||
              (mode === 'firstLast' && (!headImageUrl || !tailImageUrl))
            }
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中，请稍候...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                生成视频
              </>
            )}
          </Button>

          {/* 错误提示 */}
          {error && (
            <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* 进度显示 */}
          {loading && (
            <div className="space-y-3 p-4 rounded-md bg-blue-50 border border-blue-200">
              {/* 进度条 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-800 font-medium">
                    {getCurrentStageLabel()}
                  </span>
                  <span className="text-blue-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* 时间和提示 */}
              <div className="flex justify-between items-center text-xs text-blue-700">
                <span>已用时：{formatTime(elapsedTime)}</span>
                <span>预计需要 5-6 分钟</span>
              </div>

              {/* 友好提示 */}
              <p className="text-xs text-blue-600 mt-2">
                💡 提示：视频生成需要一定时间，请耐心等待。您可以在此期间浏览其他页面。
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 视频播放器 - 生成成功后显示 */}
      {videoResult && (
        <VideoPlayer
          videoUrl={videoResult.video_url}
          category={videoResult.category}
        />
      )}
    </div>
  )
}
