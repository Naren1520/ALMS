import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  '';

const GEMINI_PRIMARY = 'gemini-2.5-flash';
const GEMINI_FALLBACK = 'gemini-1.5-flash';

const geminiUrl = (model: string, key = GEMINI_API_KEY) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

const SYSTEM_PROMPT = `You are the ALMS (Artisan Linkage and Market System) Intelligent Support & Heritage Craft Assistant.
ALMS is an authentic digital marketplace and artisan empowerment platform sponsored by the Ministry of Social Justice and Empowerment (MoSJE) and ONDC-compliant in India.

YOUR CAPABILITIES & KNOWLEDGE:
1. Artisan Support:
   - Artisans keep 100% of their earnings (zero platform commission).
   - Registration requires basic artisan profile, guild/craft details, and bank verification.
   - ALMS provides an AI Studio Shot tool that enhances raw smartphone photos into luxury studio catalog photos while preserving original dimensions, aspect ratio, and authentic craft textures.
2. Buyer & B2B Inquiries:
   - Discerning retail buyers and institutional B2B bulk buyers can submit RFQs (Request for Quotation) directly to artisan clusters.
   - Milestones and payments are protected via secure escrow.
3. Authenticity & GI Tags:
   - Geographical Indication (GI) tags authenticate heritage crafts (e.g., Bastar Dhokra metal craft, Kanchipuram silk, Blue Pottery of Jaipur, Pashmina shawls, Madhubani paintings).
   - QR code authenticity tags and provenance tracking are embedded in every product.
4. Multilingual & Assisted Ground Network:
   - Last-mile CSC (Common Service Centre) and VLE (Village Level Entrepreneur) network assists artisans in remote villages with digital listing and order fulfillment.
   - Automatic translation between Indian languages (Hindi, Tamil, Telugu, Bengali, Gujarati, Marathi) and English for buyer-artisan communication.

RESPONSE GUIDELINES:
- Be warm, respectful, concise, and helpful (2-3 paragraphs max).
- Use clean Markdown formatting (bullet points, bold text for key terms).
- If relevant, provide practical next steps on how to use ALMS (e.g., navigating to /artisan/create-product, /b2b/rfq, /explore, or /craft-atlas).
- Maintain an encouraging and culturally proud tone.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      // Fallback response if key is missing in environment
      return NextResponse.json({
        reply:
          "Namaste! Welcome to ALMS. I'm your craft & support assistant. Our platform connects India's master artisans directly with global buyers at zero commission. How can I help you today? You can ask about artisan registration, GI craft authentication, B2B bulk orders, or our AI studio enhancement tool.",
      });
    }

    // Format conversation history for Gemini
    const contents = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to assist artisans and buyers on the ALMS platform with accurate, helpful, and courteous guidance.' }],
      },
      ...history.slice(-6).map((h: { sender: string; text: string }) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    let replyText = '';

    // Primary attempt
    try {
      const resp = await fetch(geminiUrl(GEMINI_PRIMARY), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (resp.ok) {
        const data = await resp.json();
        replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    } catch {
      // Ignore and try fallback
    }

    // Fallback model attempt
    if (!replyText) {
      try {
        const respFallback = await fetch(geminiUrl(GEMINI_FALLBACK), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        });

        if (respFallback.ok) {
          const dataFallback = await respFallback.json();
          replyText = dataFallback?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } catch {
        // Ignore
      }
    }

    if (!replyText) {
      replyText =
        "Namaste! I am here to help you explore ALMS. You can browse authentic GI-tagged crafts in our **Explore** catalog, register as an artisan with zero commission, or initiate bulk custom orders via **B2B RFQ**.";
    }

    return NextResponse.json({
      reply: replyText,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        reply:
          "Namaste! I am currently assisting several visitors. You can explore our crafts in the **Explore** section, submit an RFQ in **B2B Quotes**, or reach out to our ground VLE support team.",
      },
      { status: 200 }
    );
  }
}
