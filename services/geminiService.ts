
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async generateNotification(context: { type: string, customerName: string, detail: string }) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a professional and empathetic push notification and email content for an insurance customer.
      Context: ${context.type}
      Customer Name: ${context.customerName}
      Specific Detail: ${context.detail}
      Keep it concise, clear, and include a call to action.`,
    });
    return response.text;
  },

  async analyzeClaim(claimDescription: string, documents: string[]) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a senior insurance claims adjuster. Analyze the following claim description and simulate document validation.
      Description: ${claimDescription}
      Documents Provided: ${documents.join(', ')}
      Provide a summary of validity risk and a recommendation (Accept, Further Investigation, or Reject).`,
    });
    return response.text;
  },

  async getStrategicInsights(data: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the following insurance business data and provide 3 high-level strategic recommendations to increase retention and profitability.
      Data: ${JSON.stringify(data)}`,
    });
    return response.text;
  }
};
