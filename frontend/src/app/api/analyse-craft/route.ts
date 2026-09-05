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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: NextRequest) {
  try {
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
    const recommendedRetail = Math.round(baseCost * 1.55);
    const recommendedWholesale = Math.round(baseCost * 1.25);
    const tier50 = Math.round(baseCost * 1.18);
    const tier100 = Math.round(baseCost * 1.12);

    // Build the Gemini request parts
    const parts: object[] = [];

    // System prompt requesting structured analysis based on image content
    const prompt = `You are a senior cultural heritage expert and luxury e-commerce market analyst specializing in Indian handcrafted artifacts (MoSJE & ONDC compliant).

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
- Calculated Cost Floor: ₹${baseCost}

${imageBase64 || imageUrl ? 'An image of the craft product is provided. ANALYZE THE IMAGE CAREFULLY to determine the actual craft type, technique, quality, colors, materials visible, and market potential.' : 'No image provided — base analysis on the metadata above.'}

Respond ONLY with a valid JSON object (no markdown, no code fences):
{
  "craftForm": "<Specific ancestral technique visible in the image, e.g. Lost-Wax Bell Metal Casting (Cire Perdue)>",
  "materialBlend": "<Material description derived from image + artisan notes with region origin>",
  "giStatus": "<Official GI registry status relevant to this craft and region>",
  "ecoGrade": "Grade A+ (Zero-Carbon Handcrafted)",
  "hsCode": "<Correct HS export tariff code for this craft type>",
  "imageResolutionScore": "<Based on image quality observed>",
  "edgeSharpnessScore": "<Image edge quality assessment>",
  "lightingQuality": "<Lighting quality observed in the image>",
  "demandVelocity": "<Market demand analysis for this specific craft>",
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
  "recommendedRetail": ${recommendedRetail},
  "recommendedWholesale": ${recommendedWholesale},
  "tierWholesale50": ${tier50},
  "tierWholesale100": ${tier100},
  "artisanMarginPct": <calculated integer percentage>,
  "priceCompetitiveness": "<Fair-trade benchmark statement with margin %>",
  "englishStory": "<Rich 160-250 word cultural heritage narrative about this specific craft based on the image and metadata>",
  "hindiStory": "<50-90 word evocative Hindi description>",
  "seoTags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"]
}`;

    parts.push({ text: prompt });

    // Add image if provided
    if (imageBase64) {
      try {
        // Strip data URL prefix if present
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
      // For external URLs, use file_data if possible, otherwise just rely on text context
      parts.push({
        file_data: {
          file_uri: imageUrl,
          mime_type: 'image/jpeg',
        },
      });
    }

    // Call Gemini API
    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errText);
      return NextResponse.json(
        { error: `Gemini API error: ${geminiResponse.status}`, details: errText },
        { status: 502 }
      );
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

    return NextResponse.json({ marketIntelligence: analysisResult }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('analyse-craft route error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
