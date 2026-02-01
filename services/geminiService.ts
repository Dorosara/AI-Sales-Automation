import { GoogleGenAI, Type } from "@google/genai";
import { LeadData, ScriptType } from "../types";

const SYSTEM_INSTRUCTION = `You are an expert AI Sales Automation Agent.
Your role is to:
- Generate high-converting, personalized sales scripts
- Adapt tone, length, and CTA based on lead data
- Output clean, structured JSON only
- Never add explanations, markdown, or extra text

You specialize in:
- B2B & B2C sales outreach
- Short-form video scripts
- AI voice call scripts
- WhatsApp & SMS sales messages

Rules:
1. Personalize every message using lead data
2. Be concise, natural, and human-like
3. Avoid spammy words
4. Always include a soft CTA
5. Output VALID JSON ONLY`;

export const generateScript = async (lead: LeadData, type: ScriptType): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let prompt = "";
  let responseSchema = {};

  switch (type) {
    case 'video':
      prompt = `Generate a personalized AI video sales script.
Lead Details:
Name: ${lead.name}
Company: ${lead.company}
Industry: ${lead.industry}
Pain Point: ${lead.painPoint}

Product/Service:
${lead.productDescription}

Tone:
${lead.tone}

Language:
${lead.language}

Rules:
- 20–30 seconds
- First-name personalization
- Conversational and natural
- One clear CTA at the end`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          main_message: { type: Type.STRING },
          personalization_line: { type: Type.STRING },
          cta: { type: Type.STRING },
        },
      };
      break;

    case 'voice':
      prompt = `Create a natural AI voice call script.
Lead Info:
Name: ${lead.name}
Role: ${lead.role}
Company: ${lead.company}

Offer/Product:
${lead.productDescription}

Tone:
${lead.tone}

Rules:
- Sounds like a real sales rep
- Under 45 seconds
- No robotic phrasing
- Clear pause points for TTS`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          greeting: { type: Type.STRING },
          pitch: { type: Type.STRING },
          value_statement: { type: Type.STRING },
          cta: { type: Type.STRING },
          fallback_if_no_response: { type: Type.STRING },
        },
      };
      break;

    case 'whatsapp':
      prompt = `Write a short WhatsApp/SMS sales message.
Lead:
Name: ${lead.name}
Company: ${lead.company}

Offer:
${lead.productDescription}

Tone:
${lead.tone}

Rules:
- Max 2 lines
- No spam words
- Personal and casual`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING },
        },
      };
      break;

    case 'followup':
      prompt = `Create a polite follow-up message.
Context:
Previous message was sent ${lead.daysAgo || '3'} days ago.
No response received.

Lead:
Name: ${lead.name}

Tone:
Gentle, non-pushy`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          follow_up_message: { type: Type.STRING },
        },
      };
      break;

    case 'variations':
      prompt = `Generate 3 variations of a sales message.
Lead:
Name: ${lead.name}
Pain Point: ${lead.painPoint}

Offer:
${lead.productDescription}`;
      responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                variation: { type: Type.STRING },
                message: { type: Type.STRING }
            }
        }
      };
      break;
    
    case 'optout':
        prompt = `Generate a compliant opt-out message. Channel: ${lead.channel}`;
        responseSchema = {
            type: Type.OBJECT,
            properties: {
                opt_out_text: { type: Type.STRING }
            }
        };
        break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text generated");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let message = "Failed to generate script. Please try again.";

    // Map common errors to user-friendly messages
    if (error.message) {
        if (error.message.includes("API key") || error.message.includes("401")) {
             message = "Invalid or missing API Key. Please check your settings.";
        } else if (error.message.includes("429")) {
             message = "Usage limit exceeded. Please wait a moment and try again.";
        } else if (error.message.includes("503") || error.message.includes("500")) {
             message = "AI service is currently unavailable. Please try again later.";
        } else if (error.message.includes("fetch failed") || error.message.includes("Network")) {
             message = "Network connection failed. Please check your internet.";
        }
    }

    throw new Error(message);
  }
};