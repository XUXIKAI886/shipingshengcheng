/**
 * 视频生成相关的 TypeScript 类型定义
 */

/**
 * 视频生成请求接口
 */
export interface VideoGenerationRequest {
  model: string          // 模型名称，如 'sora-2-landscape'
  prompt: string         // 完整的提示词
  size?: string          // 视频尺寸，如 '692x390'
  duration?: number      // 时长（秒）
}

/**
 * 视频生成响应接口
 */
export interface VideoGenerationResponse {
  id: string                                          // 任务ID
  status: 'pending' | 'processing' | 'completed' | 'failed'  // 任务状态
  video_url?: string     // 视频URL
  error?: string         // 错误信息
  created_at: string     // 创建时间
}

/**
 * 视频信息接口
 */
export interface VideoInfo {
  url: string            // 视频URL
  duration: number       // 时长（秒）
  size: string           // 尺寸
  fileSize: number       // 文件大小（字节）
  category: string       // 品类
}

/**
 * 错误类型枚举
 */
export enum VideoErrorType {
  NETWORK_ERROR = '网络连接失败',
  API_ERROR = 'API调用失败',
  TIMEOUT_ERROR = '生成超时',
  VALIDATION_ERROR = '参数验证失败',
  UNKNOWN_ERROR = '未知错误'
}

/**
 * API 响应基础接口
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    type: VideoErrorType
    message: string
  }
}

/**
 * 视频生成结果接口
 */
export interface VideoResult {
  video_url: string
  category: string
  timestamp: string
}

/**
 * Veo API 配置接口
 */
export interface VeoApiConfig {
  baseURL: string
  endpoint: string
  apiKey: string
  model: string
  timeout: number
}
