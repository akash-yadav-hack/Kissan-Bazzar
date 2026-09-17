import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const { cropName, listedPrice, userMessage, offerPrice } = await request.json();

    // Check if GEMINI_API_KEY is provided in process.env
    const apiKey = process.env.GEMINI_API_KEY;

    let aiReplyText = "";
    let isAgreed = false;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const systemInstruction = `You are Ramesh Patil, a real, verified Indian farmer selling fresh ${cropName || 'produce'} on Kisan Bazaar.
Your goal is to negotiate directly with buyers in a friendly, authentic Indian farmer persona ("Namaste ji", "Ji", "Fresh harvest").
Context:
- Crop: ${cropName || 'Fresh Produce'}
- Listed Price: ₹${listedPrice || 20}/kg
Rules:
- Keep your reply concise (2-3 sentences max).
- If the buyer makes a reasonable price offer (close to listed price), accept it warmly and ask them to place the order.
- If the offer is too low, suggest a fair middle counter-price.
- Always sound like a genuine, honest farmer.`;

        let prompt = `Buyer message: "${userMessage}"`;
        if (offerPrice) {
          prompt += `\nBuyer proposed price offer: ₹${offerPrice}/kg.`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 150
          }
        });

        if (response && response.text) {
          aiReplyText = response.text.trim();
        }
      } catch (genAiError) {
        console.warn('Gemini API call failed, falling back to public LLM endpoint:', genAiError);
      }
    }

    // Fallback to Public LLM API if GEMINI_API_KEY is not set or failed
    if (!aiReplyText) {
      try {
        const systemPrompt = `You are Ramesh Patil, an authentic Indian farmer selling ${cropName || 'produce'} on Kisan Bazaar.
Listed Price: ₹${listedPrice || 20}/kg.
Persona: Respectful, polite ("Namaste ji", "Ji"), max 2 sentences.
Buyer message: "${userMessage}" ${offerPrice ? `Offer: ₹${offerPrice}/kg.` : ''}
Farmer Ramesh reply:`;

        const publicRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}?model=openai&cache=false`);
        if (publicRes.ok) {
          const raw = await publicRes.text();
          if (raw && raw.trim()) {
            aiReplyText = raw.trim();
          }
        }
      } catch (err) {
        console.warn('Public LLM fetch error:', err);
      }
    }

    // Dynamic smart response if API returns empty
    if (!aiReplyText) {
      if (offerPrice) {
        const offerNum = Number(offerPrice);
        if (offerNum >= (listedPrice - 2)) {
          aiReplyText = `Namaste ji! ₹${offerNum}/kg works for me. Produce is fresh from farm. Let's proceed with the order!`;
          isAgreed = true;
        } else {
          const counter = Math.ceil((listedPrice + offerNum) / 2);
          aiReplyText = `Ji, ₹${offerNum}/kg is a bit low for this high quality grade A harvest. Can we agree on ₹${counter}/kg?`;
        }
      } else {
        aiReplyText = `Namaste ji! All our ${cropName} are freshly harvested. What quantity would you like to buy?`;
      }
    }

    return NextResponse.json({
      reply: aiReplyText,
      isAgreed
    });

  } catch (err) {
    console.error('AI API Error:', err);
    return NextResponse.json({
      reply: "Namaste ji! Thank you for contacting me. Let's agree on a fair price."
    });
  }
}
