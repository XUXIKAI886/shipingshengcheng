'use client'

/**
 * 图片上传组件
 *
 * 支持拖拽上传、点击上传，并显示预览
 */

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  maxSizeMB?: number
}

export function ImageUpload({ onImageUploaded, maxSizeMB = 5 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * 将图片转为 Base64 编码
   * 直接返回 Base64 Data URL，避免依赖外部图床
   */
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('图片读取失败'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * 处理文件选择
   */
  const handleFile = useCallback(async (file: File) => {
    setError(null)

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件（JPG、PNG、GIF等）')
      return
    }

    // 验证文件大小
    const sizeMB = file.size / 1024 / 1024
    if (sizeMB > maxSizeMB) {
      setError(`图片大小不能超过 ${maxSizeMB}MB`)
      return
    }

    // 转换为 Base64
    setUploading(true)
    try {
      const base64Data = await convertToBase64(file)
      setPreview(base64Data)
      onImageUploaded(base64Data) // 直接传递 Base64 数据
    } catch (err) {
      setError(err instanceof Error ? err.message : '图片处理失败，请重试')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }, [maxSizeMB, onImageUploaded])

  /**
   * 处理拖拽进入
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  /**
   * 处理拖拽离开
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  /**
   * 处理拖拽放置
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  /**
   * 处理文件输入变化
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  /**
   * 移除图片
   */
  const handleRemove = useCallback(() => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className="space-y-4">
      {!preview ? (
        <Card
          className={`
            relative border-2 border-dashed transition-all cursor-pointer
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            ${uploading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {uploading ? (
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-primary" />
                )}
              </div>

              <div>
                <p className="text-base font-medium mb-1">
                  {uploading ? '处理中...' : '点击或拖拽上传产品图片'}
                </p>
                <p className="text-sm text-muted-foreground">
                  支持 JPG、PNG、GIF 格式，最大 {maxSizeMB}MB
                </p>
              </div>

              <Button type="button" variant="secondary" size="sm" disabled={uploading}>
                <ImageIcon className="mr-2 h-4 w-4" />
                选择图片
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </Card>
      ) : (
        <Card className="p-4">
          <div className="relative">
            <img
              src={preview}
              alt="上传的图片"
              className="w-full h-auto rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            ✓ 图片已准备就绪，点击生成按钮开始制作动态视频
          </p>
        </Card>
      )}

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}
