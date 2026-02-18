/**
 * 火山引擎 (Volcengine ARK) 自定义 Provider
 * 
 * 火山引擎 API 基于 OpenAI 兼容格式，但对于多模态内容（视频、音频）
 * 需要使用特定的格式：
 * - 图片: { type: 'image_url', image_url: { url: '...' } }
 * - 视频: { type: 'video_url', video_url: { url: '...' } }
 * - 音频: { type: 'input_audio', input_audio: { data: '...', format: '...' } }
 * 
 * 参考文档:
 * - https://www.volcengine.com/docs/82379/1399008
 * - https://www.volcengine.com/docs/82379/1362931
 */

import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

/** 火山引擎 Provider 配置 */
export interface VolcengineProviderConfig {
  /** API Key */
  apiKey: string;
  /** Base URL，默认为北京区域 */
  baseURL?: string;
}

/** 消息内容部分类型 */
interface ContentPart {
  type: string;
  text?: string;
  image?: string;
  image_url?: { url: string; detail?: string };
  data?: string;
  mimeType?: string;
  url?: string;
  // 火山引擎特定格式
  video_url?: { url: string };
  input_audio?: { data: string; format: string };
}

/** 消息类型 */
interface Message {
  role: string;
  content: string | ContentPart[];
}

/** 请求体类型 */
interface RequestBody {
  messages?: Message[];
  [key: string]: unknown;
}

/**
 * 从 MIME 类型获取音频格式
 */
function getAudioFormat(mimeType: string): string {
  const formatMap: Record<string, string> = {
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/mp3': 'mp3',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg',
    'audio/flac': 'flac',
    'audio/webm': 'webm',
    'audio/m4a': 'm4a',
    'audio/aac': 'aac',
  };
  return formatMap[mimeType] || 'wav';
}

/**
 * 从 URL 提取 base64 数据
 * 支持 data URL 格式: data:audio/wav;base64,xxxxx
 */
function extractBase64FromDataUrl(url: string): { data: string; mimeType: string } | null {
  if (!url.startsWith('data:')) return null;
  
  const match = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match || !match[1] || !match[2]) return null;
  
  return {
    mimeType: match[1],
    data: match[2],
  };
}

/**
 * 转换 AI SDK 的内容格式为火山引擎格式
 */
function transformContentPart(part: ContentPart): ContentPart {
  // 文本类型，直接返回
  if (part.type === 'text') {
    return part;
  }
  
  // AI SDK 图片格式: { type: 'image', image: url }
  if (part.type === 'image' && part.image) {
    return {
      type: 'image_url',
      image_url: { url: part.image },
    };
  }
  
  // AI SDK 文件格式: { type: 'file', data: url, mimeType: '...' }
  if (part.type === 'file' && part.mimeType) {
    const url = part.data || part.url || '';
    
    // 图片文件
    if (part.mimeType.startsWith('image/')) {
      return {
        type: 'image_url',
        image_url: { url },
      };
    }
    
    // 视频文件 - 火山引擎使用 video_url 格式
    if (part.mimeType.startsWith('video/')) {
      return {
        type: 'video_url',
        video_url: { url },
      };
    }
    
    // 音频文件 - 火山引擎使用 input_audio 格式
    if (part.mimeType.startsWith('audio/')) {
      // 尝试从 data URL 提取 base64
      const extracted = extractBase64FromDataUrl(url);
      if (extracted) {
        return {
          type: 'input_audio',
          input_audio: {
            data: extracted.data,
            format: getAudioFormat(extracted.mimeType),
          },
        };
      }
      
      // 如果是普通 URL，火山引擎可能需要先下载
      // 这里暂时使用 URL 格式，实际可能需要服务端处理
      return {
        type: 'input_audio',
        input_audio: {
          data: url,
          format: getAudioFormat(part.mimeType),
        },
      };
    }
  }
  
  // 其他格式，保持原样
  return part;
}

/**
 * 转换请求体中的消息格式
 */
function transformRequestBody(body: RequestBody): RequestBody {
  if (!body.messages) return body;
  
  const transformedMessages = body.messages.map((message: Message) => {
    // 如果 content 是字符串，直接返回
    if (typeof message.content === 'string') {
      return message;
    }
    
    // 如果 content 是数组，转换每个部分
    if (Array.isArray(message.content)) {
      return {
        ...message,
        content: message.content.map(transformContentPart),
      };
    }
    
    return message;
  });
  
  return {
    ...body,
    messages: transformedMessages,
  };
}

/**
 * 创建火山引擎 Provider
 */
export function createVolcengine(config: VolcengineProviderConfig) {
  return createOpenAICompatible({
    name: 'volcengine',
    apiKey: config.apiKey,
    baseURL: config.baseURL || 'https://ark.cn-beijing.volces.com/api/v3',
    transformRequestBody: (body) => transformRequestBody(body as RequestBody),
    // 启用流式响应中的 token 使用统计
    includeUsage: true,
  });
}
