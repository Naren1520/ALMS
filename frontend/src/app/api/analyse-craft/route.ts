/**
 * /api/analyse-craft — Next.js App Router API Route
 *
 * Calls Gemini Vision API directly with the uploaded craft image and all metadata.
 * Performs true multimodal image analysis to generate market intelligence,
 * bilingual catalog copy, pricing, GI metadata, and SEO tags.
 *
 * This route BYPASSES the backend proxy and calls Gemini directly,
 * so it always returns real AI results regardless of backend availability.
 */
import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  '';
const GEMINI_PRIMARY = 'gemini-3.6-flash';
const GEMINI_FALLBACK = 'gemini-3.5-flash';
const geminiUrl = (model: string, key = GEMINI_API_KEY) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      craftTitle,
      category,
      material,
      region,
      artisanName,
      textInput,
      imageBase64,
      imageUrl,
      materialCost = 350,
      labourHours = 14,
      hourlyWage = 55,
      overhead = 80,
    } = body;

    const baseCost = Number(materialCost) + Number(labourHours) * Number(hourlyWage) + Number(overhead);

    const prompt = `You are a senior cultural heritage market economist and luxury e-commerce pricing analyst specializing in Indian handcrafted artifacts (MoSJE & ONDC compliant).

${imageBase64 || imageUrl ? 'IMPORTANT: An image of the craft product has been provided above. CAREFULLY EXAMINE THE ACTUAL IMAGE to assess the craft type, technique complexity, material density, physical finish, craftsmanship quality, and photo characteristics.' : 'No image provided — base analysis on the metadata below.'}

CONTEXT PROVIDED BY ARTISAN:
- Craft Title: ${craftTitle || 'Handcrafted Heritage Art'}
- Category: ${category || 'Heritage Handicraft'}
- Primary Material: ${material || 'Natural Indigenous Material'}
- Region & State: ${region || 'Bastar, Chhattisgarh'}
- Artisan Guild/Name: ${artisanName || 'Master Artisan Collective'}
- Artisan Description/Voice: ${textInput || 'Authentic handmade craft using ancestral techniques.'}
- Material Cost: ₹${materialCost}
- Labour Hours: ${labourHours} hrs @ ₹${hourlyWage}/hr
- Overhead: ₹${overhead}
- Calculated Living-Wage Cost Floor (Non-negotiable minimum): ₹${baseCost}

DYNAMIC PRICING & MARKET INTELLIGENCE INSTRUCTIONS:
You MUST use a HYBRID approach combining the strict Fair-Trade Living-Wage Cost Floor with your Multimodal AI Market Intelligence:
1. COST FLOOR RULE (Fair-Trade Protection): The artisan's cost floor is ₹${baseCost} (Materials ₹${materialCost} + ${labourHours} hrs @ ₹${hourlyWage}/hr + ₹${overhead} overhead). Every price tier you estimate MUST be greater than or equal to this floor (₹${baseCost}). Under no circumstances should an artisan sell below their production cost.
2. AI MARKET INTERFERENCE & INTELLIGENCE:
   - Inspect the image: evaluate the visual intricacy, workmanship hours, aesthetic luxury appeal, and rarity of the craft.
   - Analyze prevailing e-commerce and export supply-vs-demand for this craft category.
   - Benchmark against net market rates of comparable authentic handcrafted items sold across curated platforms (e.g. Fabindia, Jaypore, Okhai, ONDC luxury clusters, Etsy, and international fair-trade design galleries).
   - Estimate realistic market-clearing prices:
     * "recommendedRetail": Direct consumer (B2C) price reflecting the true craft rarity, market demand, and consumer willingness-to-pay (must be >= ₹${baseCost}, typically 1.4x to 3.2x depending on visual mastery and demand).
     * "recommendedWholesale": Institutional / boutique B2B rate for MOQ 10+ (typically 1.25x to 1.8x baseCost).
     * "tierWholesale50": Wholesale rate for MOQ 50+ (balancing volume with sustainable margin).
     * "tierWholesale100": Global bulk export tier for MOQ 100+ (must strictly remain >= ₹${baseCost}).
     * "artisanMarginPct": Direct Net Artisan Share percentage: round(((recommendedRetail - ${baseCost}) / recommendedRetail) * 100).
     * "priceCompetitiveness": AI economic statement justifying this price based on supply/demand, market rates of similar items, and net artisan surplus.
     * "marketComparableRange": Real-world retail price range of similar authentic items in premium craft markets (e.g. '₹2,200 – ₹3,400 across curated lifestyle stores').

Respond ONLY with a valid JSON object (no markdown, no code fences):
{
  "craftForm": "<Specific ancestral technique visible in the image, e.g. Lost-Wax Bell Metal Casting (Cire Perdue)>",
  "materialBlend": "<Material description derived from what you see in the image + artisan notes with region origin>",
  "giStatus": "<Official GI registry status relevant to this craft and region>",
  "ecoGrade": "Grade A+ (Zero-Carbon Handcrafted)",
  "hsCode": "<Correct HS export tariff code for this craft type>",
  "imageResolutionScore": "<Your assessment of the uploaded photo's resolution and framing quality e.g. '1200x1200px High-Res Studio Standard' or 'Medium Resolution - 640x480px Smartphone Shot'>",
  "edgeSharpnessScore": "<Your assessment of edge sharpness and detail clarity in the uploaded image e.g. '97.2% Edge Detail Precision' or 'Moderate Sharpness - Motion Blur Detected'>",
  "lightingQuality": "<Your assessment of lighting in the uploaded image e.g. '3200K Warm Studio Key Light' or 'Natural Daylight - Slightly Overexposed'>",
  "demandVelocity": "<Market demand analysis for this specific craft, e.g. 'Extremely High (Festive Procurement & Boutique Luxury Demand)'>",
  "demandScore": <number between 85-99>,
  "primeBuyerSegment": "<Primary institutional buyer segment for this craft>",
  "bestReceivers": [
    {"title": "<Buyer segment 1>", "desc": "<Why they buy this specific craft>", "demandRating": "<Demand %>", "badge": "<e.g. MOQ 50+>"},
    {"title": "<Buyer segment 2>", "desc": "<Buying pattern>", "demandRating": "<Rating>", "badge": "<Badge>"},
    {"title": "<Buyer segment 3>", "desc": "<Buying pattern>", "demandRating": "<Rating>", "badge": "<Badge>"},
    {"title": "<Buyer segment 4>", "desc": "<Buying pattern>", "demandRating": "<Rating>", "badge": "<Badge>"}
  ],
  "bestSellers": [
    {"clusterName": "<Artisan cluster name for this region>", "region": "${region || 'Bastar, Chhattisgarh'}", "monthlyTurnover": "<₹X Lakhs / month>", "velocityNote": "<Market velocity>"},
    {"clusterName": "${artisanName || 'Master Artisan Collective'}", "region": "${region || 'Bastar, Chhattisgarh'}", "monthlyTurnover": "<₹Y Lakhs / month>", "velocityNote": "<Velocity note>"}
  ],
  "topDemandCities": ["<City 1>", "<City 2>", "<City 3>", "<City 4>", "<City 5>", "<City 6>"],
  "seasonalPeak": "<Seasonal demand peaks for this craft>",
  "baseCost": ${baseCost},
  "recommendedRetail": <AI estimated B2C price as integer, >= ${baseCost}>,
  "recommendedWholesale": <AI estimated B2B MOQ 10+ price as integer, >= ${baseCost}>,
  "tierWholesale50": <AI estimated MOQ 50+ price as integer, >= ${baseCost}>,
  "tierWholesale100": <AI estimated MOQ 100+ bulk price as integer, >= ${baseCost}>,
  "artisanMarginPct": <calculated integer percentage>,
  "priceCompetitiveness": "<AI market statement citing supply, demand, and comparative benchmarks>",
  "marketComparableRange": "<Prevailing market price range for comparable crafts, e.g. '₹2,200 – ₹3,400'>",
  "englishStory": "<Rich 160-250 word cultural heritage narrative about this specific craft based on the image and metadata>",
  "hindiStory": "<50-90 word evocative Hindi description>",
  "seoTags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"]
}`;

    // Build the Gemini request parts — IMAGE FIRST so Gemini reads it before generating analysis
    const parts: object[] = [];

    // Add image FIRST (before text prompt) so Gemini reads image before generating analysis
    if (imageBase64) {
      try {
        let b64data = imageBase64;
        let mimeType = 'image/jpeg';
        if (imageBase64.startsWith('data:')) {
          const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/s);
          if (match) {
            mimeType = match[1];
            b64data = match[2];
          } else {
            b64data = imageBase64.split(',')[1] || imageBase64;
          }
        }
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: b64data,
          },
        });
      } catch {
        // Skip image part if processing fails
      }
    } else if (imageUrl && imageUrl.startsWith('http')) {
      parts.push({
        file_data: {
          file_uri: imageUrl,
          mime_type: 'image/jpeg',
        },
      });
    }

    // Text prompt comes after image
    parts.push({ text: prompt });

    // Call Gemini API — primary model first, then fallback
    const geminiPayload = JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    });

    let geminiResponse = await fetch(geminiUrl(GEMINI_PRIMARY), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: geminiPayload,
    });

    if (!geminiResponse.ok) {
      const primaryErr = await geminiResponse.text();
      console.warn(`Gemini primary (${GEMINI_PRIMARY}) failed [${geminiResponse.status}]: ${primaryErr}. Retrying with fallback (${GEMINI_FALLBACK})...`);

      geminiResponse = await fetch(geminiUrl(GEMINI_FALLBACK), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: geminiPayload,
      });

      if (!geminiResponse.ok) {
        const errText = await geminiResponse.text();
        console.error(`Gemini fallback (${GEMINI_FALLBACK}) also failed [${geminiResponse.status}]:`, errText);
        return NextResponse.json(
          { error: `Gemini API error: ${geminiResponse.status}`, details: errText },
          { status: 502 }
        );
      }
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the JSON response
    let analysisResult: Record<string, unknown>;
    try {
      // Strip markdown code fences if present
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      analysisResult = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse Gemini JSON response:', rawText);
      return NextResponse.json(
        { error: 'Gemini returned invalid JSON', raw: rawText },
        { status: 502 }
      );
    }

    // Safety verification: Living wage protection guarantee
    const formulaBaseCost = baseCost;
    analysisResult.baseCost = formulaBaseCost;

    let recRetail = Math.round(Number(analysisResult.recommendedRetail)) || Math.round(formulaBaseCost * 1.65);
    if (recRetail < formulaBaseCost) {
      recRetail = Math.round(formulaBaseCost * 1.65);
    }

    let recWholesale = Math.round(Number(analysisResult.recommendedWholesale)) || Math.round(formulaBaseCost * 1.3);
    if (recWholesale < formulaBaseCost || recWholesale >= recRetail) {
      recWholesale = Math.round(formulaBaseCost * 1.3);
    }

    let tier50 = Math.round(Number(analysisResult.tierWholesale50)) || Math.round(formulaBaseCost * 1.2);
    if (tier50 < formulaBaseCost || tier50 >= recWholesale) {
      tier50 = Math.round(formulaBaseCost * 1.2);
    }

    let tier100 = Math.round(Number(analysisResult.tierWholesale100)) || Math.round(formulaBaseCost * 1.12);
    if (tier100 < formulaBaseCost || tier100 >= tier50) {
      tier100 = Math.max(formulaBaseCost, Math.round(formulaBaseCost * 1.12));
    }

    analysisResult.recommendedRetail = recRetail;
    analysisResult.recommendedWholesale = recWholesale;
    analysisResult.tierWholesale50 = tier50;
    analysisResult.tierWholesale100 = tier100;
    analysisResult.artisanMarginPct = Math.round(((recRetail - formulaBaseCost) / recRetail) * 100);

    return NextResponse.json({ marketIntelligence: analysisResult }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('analyse-craft route error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
