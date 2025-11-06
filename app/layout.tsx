import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '外卖店铺视频生成系统 - AI智能生成视频店招',
  description: '基于 Google Veo 3.1 AI 技术，为外卖商家快速生成专业的视频店招（带音频）。只需输入店铺经营品类，即可获得符合平台规范的高质量视频。',
  keywords: ['外卖', '视频生成', 'AI', 'Veo', 'Google', '店招', '视频制作'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
