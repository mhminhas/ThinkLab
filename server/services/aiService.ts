import OpenAI from "openai";

class AIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not provided. AI features will not work until configured.");
    }
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || "sk-fake-key-for-fallback"
    });
  }

  async generateText(prompt: string, maxTokens: number = 1000): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("OpenAI text generation error:", error);
      throw new Error("Failed to generate text");
    }
  }

  async generateImage(prompt: string): Promise<{ url: string }> {
    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      return { url: response.data?.[0]?.url || "" };
    } catch (error) {
      console.error("OpenAI image generation error:", error);
      throw new Error("Failed to generate image");
    }
  }

  async generateCode(prompt: string, language: string): Promise<string> {
    try {
      const codePrompt = `Generate ${language} code for the following requirement: ${prompt}. 
      Return only the code without explanations.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: codePrompt }],
        max_tokens: 2000,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("OpenAI code generation error:", error);
      throw new Error("Failed to generate code");
    }
  }

  async summarizeText(text: string): Promise<string> {
    try {
      const prompt = `Please summarize the following text concisely while maintaining key points:\n\n${text}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("OpenAI text summarization error:", error);
      throw new Error("Failed to summarize text");
    }
  }

  async analyzeData(data: any, analysisType: string): Promise<any> {
    try {
      const prompt = `Analyze the following data using ${analysisType} analysis. 
      Provide insights, patterns, and recommendations. 
      Respond with JSON in this format: { "insights": [...], "patterns": [...], "recommendations": [...] }
      
      Data: ${JSON.stringify(data)}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a data analysis expert. Analyze the data and provide insights in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("OpenAI data analysis error:", error);
      throw new Error("Failed to analyze data");
    }
  }

  async optimizeSEO(content: string, keywords: string[]): Promise<any> {
    try {
      const prompt = `Optimize the following content for SEO with these target keywords: ${keywords.join(', ')}.
      Provide recommendations for title, meta description, headings, and content improvements.
      Respond with JSON in this format: { "title": "...", "metaDescription": "...", "headings": [...], "recommendations": [...] }
      
      Content: ${content}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an SEO expert. Analyze content and provide optimization recommendations in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("OpenAI SEO optimization error:", error);
      throw new Error("Failed to optimize SEO");
    }
  }
}

export const aiService = new AIService();
