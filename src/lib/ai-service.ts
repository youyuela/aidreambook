import OpenAI from 'openai';
import { prisma } from './prisma';
import type {
  DreamInput,
  DreamAnalysis,
  GeneratedNovel,
  GeneratedImage,
  GeneratedVideo
} from './ai-generator';

// OpenAI 客户端配置
const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
};

// 检查是否配置了真实的OpenAI API
const hasValidOpenAIKey = openaiConfig.apiKey &&
  openaiConfig.apiKey !== "" &&
  openaiConfig.apiKey !== "sk-your-openai-api-key-here" &&
  openaiConfig.apiKey.startsWith('sk-');

const openai = hasValidOpenAIKey ? new OpenAI(openaiConfig) : null;

// AI 服务提供商类型
export type AIProvider = 'openai' | 'anthropic' | 'local';

// AI 生成配置
export interface AIGenerationConfig {
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  style?: string;
  quality?: 'standard' | 'hd' | '4k';
  speed?: 'fast' | 'standard' | 'slow';
}

// 默认配置
export const DEFAULT_CONFIGS = {
  analysis: {
    provider: 'openai' as AIProvider,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1500,
  },
  novel: {
    provider: 'openai' as AIProvider,
    model: 'gpt-4',
    temperature: 0.8,
    maxTokens: 3000,
  },
  image: {
    provider: 'openai' as AIProvider,
    model: 'dall-e-3',
    quality: 'hd' as const,
    style: 'vivid',
  },
  video: {
    provider: 'runwayml' as AIProvider,
    model: 'gen-2',
    quality: 'hd' as const,
    duration: 15,
  },
};

// 专业梦境解析提示词
const DREAM_ANALYSIS_PROMPT = `你是一位专业的梦境心理分析师，具有丰富的弗洛伊德、荣格等心理学理论知识。请对以下梦境进行深度分析：

梦境内容：{dreamContent}

请从以下几个维度进行分析，并以JSON格式返回：

1. symbols: 梦境中的重要符号及其心理学含义
2. emotions: 识别的情感及其强度（0-100）
3. themes: 主要心理主题
4. interpretation: 综合解读（200-300字）
5. psychologicalInsights: 心理学洞察（3-5条）
6. recommendations: 建议和指导（3-5条）

请确保分析专业、深入且富有洞察力。`;

const NOVEL_GENERATION_PROMPT = `你是一位富有创意的作家，擅长将梦境转化为引人入胜的小说。请基于以下梦境内容和分析结果创作一篇约1000字的小说：

梦境内容：{dreamContent}
梦境分析：{analysis}
风格要求：{mood}

创作要求：
1. 保持梦境的核心元素和象征意义
2. 发展完整的故事情节（开端、发展、高潮、结局）
3. 刻画生动的人物和场景
4. 融入梦境的超现实和象征性特质
5. 文字优美，富有诗意
6. 长度控制在900-1100字

请以JSON格式返回：
{
  "title": "小说标题",
  "content": "完整小说内容",
  "wordCount": 字数,
  "genre": "文学类型",
  "mood": "情感基调"
}`;

// 增强的梦境分析
export async function analyzeDeamWithAI(
  dreamInput: DreamInput,
  config?: Partial<AIGenerationConfig>
): Promise<DreamAnalysis> {
  const finalConfig = { ...DEFAULT_CONFIGS.analysis, ...config };

  // 检查是否有真实的OpenAI API配置
  if (!hasValidOpenAIKey || !openai) {
    console.log('使用本地模拟AI分析（未配置OpenAI API）');
    const { analyzeDream } = await import('./ai-generator');
    return analyzeDream(dreamInput);
  }

  try {
    const prompt = DREAM_ANALYSIS_PROMPT.replace('{dreamContent}', dreamInput.content);

    const completion = await openai.chat.completions.create({
      model: finalConfig.model,
      messages: [
        {
          role: 'system',
          content: '你是专业的梦境心理分析师，请提供科学、深入的梦境分析。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: finalConfig.temperature,
      max_tokens: finalConfig.maxTokens,
      response_format: { type: 'json_object' }
    });

    const analysisResult = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      symbols: analysisResult.symbols || [],
      emotions: analysisResult.emotions || [],
      themes: analysisResult.themes || [],
      interpretation: analysisResult.interpretation || '分析生成失败',
      psychologicalInsights: analysisResult.psychologicalInsights || [],
      recommendations: analysisResult.recommendations || []
    };

  } catch (error) {
    console.error('OpenAI API分析错误，降级到本地分析:', error);
    // 降级到本地分析
    const { analyzeDream } = await import('./ai-generator');
    return analyzeDream(dreamInput);
  }
}

// 增强的小说生成
export async function generateNovelWithAI(
  dreamInput: DreamInput,
  analysis: DreamAnalysis,
  config?: Partial<AIGenerationConfig>
): Promise<GeneratedNovel> {
  const finalConfig = { ...DEFAULT_CONFIGS.novel, ...config };

  // 检查是否有真实的OpenAI API配置
  if (!hasValidOpenAIKey || !openai) {
    console.log('使用本地模拟小说生成（未配置OpenAI API）');
    const { generateNovel } = await import('./ai-generator');
    return generateNovel(dreamInput, analysis);
  }

  try {
    const prompt = NOVEL_GENERATION_PROMPT
      .replace('{dreamContent}', dreamInput.content)
      .replace('{analysis}', JSON.stringify(analysis, null, 2))
      .replace('{mood}', dreamInput.mood || 'mysterious');

    const completion = await openai.chat.completions.create({
      model: finalConfig.model,
      messages: [
        {
          role: 'system',
          content: '你是富有创意的小说家，擅长创作基于梦境的超现实主义文学作品。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: finalConfig.temperature,
      max_tokens: finalConfig.maxTokens,
      response_format: { type: 'json_object' }
    });

    const novelResult = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return {
      title: novelResult.title || '梦境奇遇',
      content: novelResult.content || '小说生成失败',
      wordCount: novelResult.wordCount || 0,
      genre: novelResult.genre || '奇幻',
      mood: novelResult.mood || dreamInput.mood || 'mysterious'
    };

  } catch (error) {
    console.error('OpenAI API小说生成错误，降级到本地生成:', error);
    // 降级到本地生成
    const { generateNovel } = await import('./ai-generator');
    return generateNovel(dreamInput, analysis);
  }
}

// 增强的图片生成
export async function generateImageWithAI(
  dreamInput: DreamInput,
  config?: Partial<AIGenerationConfig>
): Promise<GeneratedImage> {
  const finalConfig = { ...DEFAULT_CONFIGS.image, ...config };

  // 检查是否有真实的OpenAI API配置
  if (!hasValidOpenAIKey || !openai) {
    console.log('使用本地模拟图片生成（未配置OpenAI API）');
    const { generateImage } = await import('./ai-generator');
    return generateImage(dreamInput);
  }

  try {
    // 优化图片生成提示词
    const imagePrompt = await generateImagePrompt(dreamInput);

    const response = await openai.images.generate({
      model: finalConfig.model as 'dall-e-2' | 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: finalConfig.quality === '4k' ? '1792x1024' : '1024x1024',
      quality: finalConfig.quality === '4k' ? 'hd' : 'standard',
      style: finalConfig.style as 'vivid' | 'natural' || 'vivid',
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return {
      url: imageUrl,
      prompt: imagePrompt,
      style: dreamInput.style || 'surreal',
      dimensions: {
        width: finalConfig.quality === '4k' ? 1792 : 1024,
        height: finalConfig.quality === '4k' ? 1024 : 1024,
      },
      metadata: {
        model: finalConfig.model,
        quality: finalConfig.quality,
        style: finalConfig.style,
      }
    };

  } catch (error) {
    console.error('OpenAI API图片生成错误，降级到本地生成:', error);
    // 降级到本地生成
    const { generateImage } = await import('./ai-generator');
    return generateImage(dreamInput);
  }
}

// 生成优化的图片提示词
async function generateImagePrompt(dreamInput: DreamInput): Promise<string> {
  // 如果没有OpenAI API，使用简单的提示词模板
  if (!hasValidOpenAIKey || !openai) {
    return `${dreamInput.content}, ${dreamInput.style || 'surreal'} style, dreamlike atmosphere, ethereal lighting, highly detailed, fantasy art`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是专业的AI图像生成提示词专家。请将梦境描述转化为详细、生动的DALL-E提示词。'
        },
        {
          role: 'user',
          content: `请为以下梦境内容生成专业的DALL-E提示词，要求：
1. 突出梦境的视觉元素和氛围
2. 包含艺术风格描述
3. 添加光影和色彩描述
4. 保持超现实主义特征
5. 限制在500字符内

梦境内容：${dreamInput.content}
期望风格：${dreamInput.style || 'surreal'}`
        }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || `${dreamInput.content}, ${dreamInput.style || 'surreal'} style, dreamlike atmosphere, ethereal lighting`;
  } catch (error) {
    console.error('图片提示词生成错误:', error);
    return `${dreamInput.content}, ${dreamInput.style || 'surreal'} style, dreamlike atmosphere, ethereal lighting`;
  }
}

// 视频生成（模拟，可替换为真实API）
export async function generateVideoWithAI(
  dreamInput: DreamInput,
  config?: Partial<AIGenerationConfig>
): Promise<GeneratedVideo> {
  // TODO: 集成 RunwayML 或其他视频生成API
  // 目前使用模拟实现
  const { generateVideo } = await import('./ai-generator');
  return generateVideo(dreamInput);
}

// 使用配额管理
export async function checkAndConsumeQuota(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      monthlyQuota: true,
      usedQuota: true,
      quotaResetDate: true,
      subscriptionTier: true,
    }
  });

  if (!user) return false;

  // 检查是否需要重置配额
  if (user.quotaResetDate && new Date() > user.quotaResetDate) {
    const { SUBSCRIPTION_PLANS } = await import('./stripe');
    const newQuota = SUBSCRIPTION_PLANS[user.subscriptionTier].quota;

    await prisma.user.update({
      where: { id: userId },
      data: {
        usedQuota: 0,
        monthlyQuota: newQuota === -1 ? 999999 : newQuota,
        quotaResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    });

    return true;
  }

  // 检查配额
  if (user.monthlyQuota === -1 || user.usedQuota < user.monthlyQuota) {
    // 消费配额
    await prisma.user.update({
      where: { id: userId },
      data: {
        usedQuota: {
          increment: 1,
        }
      }
    });

    return true;
  }

  return false;
}

// 获取用户配额状态
export async function getUserQuotaStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      monthlyQuota: true,
      usedQuota: true,
      quotaResetDate: true,
      subscriptionTier: true,
    }
  });

  if (!user) return null;

  const { getUsageStats } = await import('./stripe');
  return getUsageStats(user.subscriptionTier, user.usedQuota);
}

// 批量生成功能（专业版以上）
export async function batchGenerate(
  userId: string,
  dreams: DreamInput[]
): Promise<{ success: boolean; results?: Array<Record<string, unknown>>; error?: string }> {
  // 检查用户权限
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true }
  });

  if (!user || !['PRO', 'EXPERT'].includes(user.subscriptionTier)) {
    return { success: false, error: '批量生成功能需要专业版或专家版订阅' };
  }

  // 检查配额
  const quotaNeeded = dreams.length * 4; // 每个梦境需要4次生成（分析+小说+图片+视频）
  const quotaStatus = await getUserQuotaStatus(userId);

  if (quotaStatus && quotaStatus.remaining < quotaNeeded && !quotaStatus.unlimited) {
    return { success: false, error: '配额不足，无法完成批量生成' };
  }

  // 执行批量生成
  const results = [];
  for (const dream of dreams) {
    try {
      const analysis = await analyzeDeamWithAI(dream);
      const novel = await generateNovelWithAI(dream, analysis);
      const image = await generateImageWithAI(dream);
      const video = await generateVideoWithAI(dream);

      results.push({
        dream,
        analysis,
        novel,
        image,
        video,
        status: 'completed'
      });

      // 消费配额
      await prisma.user.update({
        where: { id: userId },
        data: { usedQuota: { increment: 4 } }
      });

    } catch (error) {
      results.push({
        dream,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return { success: true, results };
}
