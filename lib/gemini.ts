import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export function initGemini(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function getGeminiResponse(prompt: string, apiKey: string): Promise<string> {
  try {
    if (!genAI) {
      initGemini(apiKey);
    }
    
    if (!genAI) {
      throw new Error("Gemini APIの初期化に失敗しました");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Geminiレスポンスの取得エラー:", error);
    return "申し訳ありません。現在コンテンツを生成できません。後でもう一度お試しください。";
  }
}

export function generateRandomPrompt(): string {
  const categories = {
    クイズ: [
      "日本の歴史に関する面白いクイズを作成してください",
      "科学に関する3択クイズを作成してください",
      "世界の雑学クイズを作成してください",
      "動物に関する意外な事実をクイズ形式で教えてください",
      "食べ物に関する豆知識クイズを作成してください"
    ],
    創作: [
      "短い物語のプロットを考えてください",
      "架空の生き物の特徴を詳しく説明してください",
      "未来の技術についてのアイデアを提案してください",
      "不思議な場所の描写を書いてください",
      "独創的なスーパーヒーローの設定を考えてください"
    ],
    チャレンジ: [
      "頭の体操になる論理パズルを出題してください",
      "言葉遊びの問題を作成してください",
      "視覚的な錯覚を言葉で説明してください",
      "謎解きを作成してください",
      "数学的な面白い問題を出題してください"
    ],
    発見: [
      "意外な科学の法則について教えてください",
      "日常生活で使える心理学のテクニックを紹介してください",
      "世界の不思議な文化や習慣を紹介してください",
      "驚きの歴史的事実を教えてください",
      "自然界の予想外な現象について説明してください"
    ]
  };

  const categoryNames = Object.keys(categories);
  const randomCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
  const prompts = categories[randomCategory as keyof typeof categories];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return `${randomPrompt}。回答や解説も含めて、簡潔（200文字以内）に書いてください。`;
}