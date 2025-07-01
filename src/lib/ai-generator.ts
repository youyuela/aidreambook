// AI 生成功能的类型定义和工具函数

export interface DreamInput {
  content: string;
  mood?: 'peaceful' | 'mysterious' | 'adventure' | 'fantasy' | 'romantic' | 'dark';
  style?: 'realistic' | 'abstract' | 'surreal' | 'cartoon' | 'artistic';
  language?: 'zh' | 'en';
}

export interface DreamAnalysis {
  symbols: Array<{
    symbol: string;
    meaning: string;
    significance: 'high' | 'medium' | 'low';
  }>;
  emotions: Array<{
    emotion: string;
    intensity: number; // 0-100
  }>;
  themes: string[];
  interpretation: string;
  psychologicalInsights: string[];
  recommendations: string[];
}

export interface GeneratedNovel {
  title: string;
  content: string;
  wordCount: number;
  genre: string;
  mood: string;
  chapters?: Array<{
    title: string;
    content: string;
  }>;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  style: string;
  dimensions: {
    width: number;
    height: number;
  };
  metadata: {
    seed?: number;
    steps?: number;
    cfg_scale?: number;
    model?: string;
    quality?: string;
    style?: string;
  };
}

export interface GeneratedVideo {
  url: string;
  thumbnailUrl: string;
  duration: number; // seconds
  prompt: string;
  style: string;
  dimensions: {
    width: number;
    height: number;
  };
  fps: number;
}

export interface GenerationResult {
  id: string;
  dreamInput: DreamInput;
  analysis: DreamAnalysis;
  novel: GeneratedNovel;
  image: GeneratedImage;
  video: GeneratedVideo;
  createdAt: Date;
  status: 'generating' | 'completed' | 'failed';
  progress: number; // 0-100
}

// 模拟AI分析梦境内容
export async function analyzeDream(dreamInput: DreamInput): Promise<DreamAnalysis> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 基于内容关键词的简单分析逻辑
  const content = dreamInput.content.toLowerCase();

  const symbolsMap = {
    '水': { meaning: '情感流动、清洁、重生', significance: 'high' as const },
    '海洋': { meaning: '潜意识的深度、情感的广阔', significance: 'high' as const },
    '飞行': { meaning: '自由、超越、理想追求', significance: 'high' as const },
    '森林': { meaning: '未知的探索、内心的迷茫', significance: 'medium' as const },
    '星空': { meaning: '希望、指引、无限可能', significance: 'high' as const },
    '动物': { meaning: '本能、直觉、原始力量', significance: 'medium' as const },
    '房子': { meaning: '安全感、归属、自我认知', significance: 'medium' as const },
    '朋友': { meaning: '社交关系、支持系统', significance: 'low' as const },
    '光明': { meaning: '希望、觉醒、正面能量', significance: 'high' as const },
    '黑暗': { meaning: '恐惧、未知、潜在威胁', significance: 'medium' as const }
  };

  const emotions = {
    '快乐': 85, '兴奋': 90, '平静': 70, '神秘': 75,
    '恐惧': 80, '紧张': 85, '好奇': 70, '孤独': 60,
    '温暖': 75, '冷漠': 45, '愤怒': 90, '悲伤': 70
  };

  // 提取符号
  const symbols = Object.entries(symbolsMap)
    .filter(([symbol]) => content.includes(symbol))
    .map(([symbol, data]) => ({
      symbol,
      meaning: data.meaning,
      significance: data.significance
    }));

  // 分析情感
  const detectedEmotions = Object.entries(emotions)
    .filter(([emotion]) =>
      content.includes(emotion) ||
      (emotion === '神秘' && (content.includes('神秘') || content.includes('奇怪'))) ||
      (emotion === '快乐' && (content.includes('开心') || content.includes('愉快')))
    )
    .map(([emotion, intensity]) => ({ emotion, intensity }));

  // 如果没有检测到情感，添加默认情感
  if (detectedEmotions.length === 0) {
    detectedEmotions.push({ emotion: '好奇', intensity: 70 });
  }

  const themes = [];
  if (content.includes('飞') || content.includes('天空')) themes.push('超越与自由');
  if (content.includes('水') || content.includes('海')) themes.push('情感与潜意识');
  if (content.includes('追赶') || content.includes('逃跑')) themes.push('压力与逃避');
  if (content.includes('爱') || content.includes('恋人')) themes.push('情感关系');
  if (content.includes('死亡') || content.includes('消失')) themes.push('变化与转换');
  if (themes.length === 0) themes.push('个人成长', '内心探索');

  return {
    symbols,
    emotions: detectedEmotions,
    themes,
    interpretation: generateInterpretation(symbols, detectedEmotions, themes),
    psychologicalInsights: generatePsychologicalInsights(content),
    recommendations: generateRecommendations(detectedEmotions, themes)
  };
}

// 生成梦境小说
export async function generateNovel(dreamInput: DreamInput, analysis: DreamAnalysis): Promise<GeneratedNovel> {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const mood = dreamInput.mood || 'mysterious';
  const genres = {
    peaceful: '温馨治愈',
    mysterious: '奇幻悬疑',
    adventure: '冒险探索',
    fantasy: '魔幻史诗',
    romantic: '浪漫爱情',
    dark: '黑暗哥特'
  };

  // 基于梦境内容生成小说
  const title = generateNovelTitle(dreamInput.content, mood);
  const content = generateNovelContent(dreamInput, analysis);

  return {
    title,
    content,
    wordCount: content.length,
    genre: genres[mood],
    mood,
    chapters: [
      {
        title: '梦境降临',
        content: content.substring(0, Math.floor(content.length * 0.4))
      },
      {
        title: '深入探索',
        content: content.substring(Math.floor(content.length * 0.4), Math.floor(content.length * 0.8))
      },
      {
        title: '觉醒时刻',
        content: content.substring(Math.floor(content.length * 0.8))
      }
    ]
  };
}

// 生成梦境图片（模拟）
export async function generateImage(dreamInput: DreamInput): Promise<GeneratedImage> {
  await new Promise(resolve => setTimeout(resolve, 4000));

  // 基于梦境内容选择合适的unsplash图片
  const keywords = extractImageKeywords(dreamInput.content);
  const imageUrl = `https://images.unsplash.com/photo-${getRandomImageId(keywords)}?w=1024&h=1024&fit=crop`;

  return {
    url: imageUrl,
    prompt: generateImagePrompt(dreamInput),
    style: dreamInput.style || 'surreal',
    dimensions: { width: 1024, height: 1024 },
    metadata: {
      seed: Math.floor(Math.random() * 1000000),
      steps: 50,
      cfg_scale: 7.5
    }
  };
}

// 生成梦境视频（模拟）
export async function generateVideo(dreamInput: DreamInput): Promise<GeneratedVideo> {
  await new Promise(resolve => setTimeout(resolve, 5000));

  const keywords = extractImageKeywords(dreamInput.content);
  const thumbnailUrl = `https://images.unsplash.com/photo-${getRandomImageId(keywords)}?w=640&h=360&fit=crop`;

  return {
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    thumbnailUrl,
    duration: 15,
    prompt: generateVideoPrompt(dreamInput),
    style: dreamInput.style || 'cinematic',
    dimensions: { width: 640, height: 360 },
    fps: 24
  };
}

// 辅助函数
function generateInterpretation(symbols: DreamAnalysis['symbols'], emotions: DreamAnalysis['emotions'], themes: string[]): string {
  const symbolText = symbols.length > 0
    ? `您的梦境中出现的${symbols.map(s => s.symbol).join('、')}等符号，`
    : '您的梦境中的各种元素';

  const emotionText = emotions.length > 0
    ? `反映出${emotions.map(e => e.emotion).join('、')}等复杂情感`
    : '体现了内心的情感状态';

  const themeText = themes.length > 0
    ? `。主要主题围绕${themes.join('、')}展开`
    : '';

  return `${symbolText}${emotionText}${themeText}。这个梦境可能反映了您当前生活中的某些重要议题，值得进一步思考和探索。`;
}

function generatePsychologicalInsights(content: string): string[] {
  const insights = [
    '梦境是潜意识的表达，反映了您内心的真实想法',
    '重复出现的元素可能指向需要关注的生活领域',
    '情感的强度显示了这些议题对您的重要程度'
  ];

  if (content.includes('飞')) {
    insights.push('飞行梦境通常代表对自由和突破限制的渴望');
  }
  if (content.includes('追')) {
    insights.push('追赶情节可能反映现实中的压力或逃避心理');
  }
  if (content.includes('水')) {
    insights.push('水元素常常与情感流动和清洁净化相关');
  }

  return insights.slice(0, 4);
}

function generateRecommendations(emotions: DreamAnalysis['emotions'], themes: string[]): string[] {
  const recommendations = [
    '建议记录梦境日记，观察模式和变化',
    '可以尝试正念冥想来加深对梦境的理解'
  ];

  const highIntensityEmotions = emotions.filter(e => e.intensity > 80);
  if (highIntensityEmotions.length > 0) {
    recommendations.push('关注高强度情感，可能需要在现实中处理相关问题');
  }

  if (themes.includes('压力与逃避')) {
    recommendations.push('考虑采用压力管理技巧来改善生活质量');
  }

  if (themes.includes('情感关系')) {
    recommendations.push('多关注人际关系的健康发展');
  }

  return recommendations;
}

function generateNovelTitle(content: string, mood: string): string {
  const titleTemplates = {
    peaceful: ['温柔的', '宁静的', '祥和的'],
    mysterious: ['神秘的', '诡异的', '未知的'],
    adventure: ['冒险的', '危险的', '刺激的'],
    fantasy: ['魔幻的', '奇妙的', '超凡的'],
    romantic: ['浪漫的', '甜蜜的', '动人的'],
    dark: ['黑暗的', '阴郁的', '恐怖的']
  };

  const adjectives = titleTemplates[mood as keyof typeof titleTemplates] || titleTemplates.mysterious;
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  if (content.includes('海洋')) return `${adjective}海洋之梦`;
  if (content.includes('森林')) return `${adjective}森林漫步`;
  if (content.includes('星空')) return `${adjective}星空之旅`;
  if (content.includes('城市')) return `${adjective}城市传说`;

  return `${adjective}梦境奇遇`;
}

function generateNovelContent(dreamInput: DreamInput, analysis: DreamAnalysis): string {
  const baseStory = `
在一个${dreamInput.mood === 'dark' ? '阴霾密布' : '星光闪烁'}的夜晚，我踏入了一个超越现实的梦境世界。

${dreamInput.content}

这个梦境如此真实，仿佛每一个细节都蕴含着深层的意义。${analysis.symbols.map(s => `${s.symbol}在梦中显得格外突出，似乎在诉说着${s.meaning}的故事`).join('。')}。

随着梦境的深入，我开始理解这不仅仅是一场普通的梦。${analysis.themes.join('、')}的主题在整个经历中反复出现，引导着我探索内心最深处的秘密。

${analysis.emotions.map(e => `${e.emotion}的情感如潮水般涌来`).join('，')}，让我在梦境与现实之间徘徊。每一个转折，每一次选择，都让我更加接近真实的自己。

当梦境即将结束时，我意识到这次体验将永远改变我对生活的看法。那些${analysis.psychologicalInsights.join('，')}的启示，将成为我前行路上的明灯。

醒来后，梦境的记忆依然清晰如昨。我知道，这不仅仅是一个梦，而是心灵深处发出的呼唤，提醒我要${analysis.recommendations.join('，')}。

这个梦境，如同一本未曾打开的书，等待着我去解读每一页的奥秘。而我，也将带着这份收获，继续人生的旅程。
  `.trim();

  return baseStory;
}

function generateImagePrompt(dreamInput: DreamInput): string {
  const styleModifiers = {
    realistic: 'photorealistic, highly detailed',
    abstract: 'abstract art, geometric shapes',
    surreal: 'surreal, dreamlike, fantastical',
    cartoon: 'cartoon style, vibrant colors',
    artistic: 'artistic painting, impressionist style'
  };

  const style = styleModifiers[dreamInput.style || 'surreal'];
  return `${dreamInput.content}, ${style}, dream-like atmosphere, mystical lighting`;
}

function generateVideoPrompt(dreamInput: DreamInput): string {
  return `Cinematic video sequence of ${dreamInput.content}, slow motion, ethereal atmosphere, 15 seconds duration`;
}

function extractImageKeywords(content: string): string[] {
  const keywordMap = {
    '海洋': 'ocean',
    '森林': 'forest',
    '星空': 'stars',
    '城市': 'city',
    '山脉': 'mountain',
    '花园': 'garden',
    '沙漠': 'desert',
    '雪': 'snow',
    '火': 'fire',
    '云': 'clouds'
  };

  return Object.entries(keywordMap)
    .filter(([chinese]) => content.includes(chinese))
    .map(([, english]) => english);
}

function getRandomImageId(keywords: string[]): string {
  // 预设的高质量图片ID
  const imageIds = {
    ocean: ['1439066878-054d2da21e3b', '1506905925-1a7a2133fa7f', '1505852679-c7d5d3e02b3f'],
    forest: ['1441974231531-c6227db76b6e', '1518837695005-2083093c7d1a', '1540979388789-6cee28a55f3e'],
    stars: ['1419242902214-272b3f66ee7a', '1446776877081-d282a0f896e2', '1502134249126-9f3755a50d78'],
    city: ['1514924519778-4b6029f7cc3a', '1524644325898-42b1b3e6c473', '1475776408506-9a5371e7a068'],
    mountain: ['1464822759844-d150f920c928', '1506905925-1a7a2133fa7f', '1469474968028-56623f02e42e'],
    default: ['1518837695005-2083093c7d1a', '1540979388789-6cee28a55f3e', '1469474968028-56623f02e42e']
  };

  const keyword = keywords.length > 0 ? keywords[0] : 'default';
  const ids = imageIds[keyword as keyof typeof imageIds] || imageIds.default;
  return ids[Math.floor(Math.random() * ids.length)];
}
