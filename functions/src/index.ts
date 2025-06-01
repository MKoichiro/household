/**
 * OpenAI のapiコールは、functionsサーバー上で行う。
 * - api key をプロジェクトの .env に置くより、サーバー上の環境変数に置く方が安全なため。
 * - フロント側にAPIをたたく処理をおくと、攻撃者がプロンプトを自由に変えて、サービスの意図とは異なり、chatGPTとして濫用される可能性があるため。
 */
import {onCall} from "firebase-functions/v2/https";
import OpenAI from "openai";

/**
 * フロントエンドから「prompt」を受け取り、OpenAI の ChatCompletion を呼び出して結果を返す
 */
export const generateAIResponse = onCall(
  {region: "asia-northeast1", secrets: ["OPENAI_API_KEY"]},
  async (req) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({apiKey});

    const prompt = req.data.prompt as string;
    if (!prompt) {
      throw new Error("Prompt が指定されていません");
    }

    try {
      const response = await openai.responses.create({
        model: "gpt-4.1",
        input: prompt,
      });
      return {text: response.output_text};
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("応答の生成中にエラーが発生しました");
    }
  }
);
