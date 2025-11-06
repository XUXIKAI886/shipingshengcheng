/**
 * 主页面
 *
 * 外卖店铺视频生成系统首页
 */

import { VideoGenerator } from '@/components/VideoGenerator'
import { Video } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">
                外卖店铺视频生成系统
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Powered by Veo 3.1 AI
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* 介绍区域 */}
        <div className="text-center mb-8 space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">
            AI 智能生成专业视频店招
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            只需输入您的店铺经营品类，AI 将为您生成符合外卖平台规范的高质量视频店招
          </p>
        </div>

        {/* 视频生成器组件 */}
        <VideoGenerator />

        {/* 功能特点 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-lg mb-2">专业视觉效果</h3>
            <p className="text-sm text-gray-600">
              AI 精心设计每一帧画面，突出食物诱人外观，吸引顾客眼球
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-lg mb-2">快速生成</h3>
            <p className="text-sm text-gray-600">
              30-180 秒即可生成专业视频，节省时间成本，提高运营效率
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-semibold text-lg mb-2">平台规范</h3>
            <p className="text-sm text-gray-600">
              符合外卖平台所有技术要求，692×390尺寸，MP4格式
            </p>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="mt-16 py-8 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 外卖店铺视频生成系统 | 基于 Google Veo 3.1 AI 技术</p>
        </div>
      </footer>
    </main>
  )
}
