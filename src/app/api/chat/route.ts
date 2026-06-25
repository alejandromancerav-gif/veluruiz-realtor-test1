import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { propertyService } from '@/services/property.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages || [];

    // OBTENER PROPIEDADES DEL BACKEND
    const properties = await propertyService.getAllProperties();

    // FORMATEAR PROPIEDADES
    const formattedProperties = properties
      .map((property: any) => {
        return `
Property Title: ${property.title}
City: ${property.city}
Price: ${property.price}
Type: ${property.type}
Bedrooms: ${property.bedrooms}
Bathrooms: ${property.bathrooms}
Description: ${property.description}
`;
      })
      .join('\n');

    // PROMPT IA
    const systemPrompt = `
You are VeluRuiz AI, a professional real estate assistant for VeluRuiz Realty.

IMPORTANT:

- ONLY talk about properties available in the VeluRuiz database.
- NEVER invent fake properties.
- NEVER recommend external properties.
- ONLY use the catalog provided below.
- Help users schedule appointments.
- Help users explore the catalog.
- Respond in the SAME language as the user.
- If the user writes in Spanish, respond ONLY in Spanish.
- If the user writes in English, respond ONLY in English.
- Be professional, modern, and concise.

VELURUIZ PROPERTY CATALOG:

${formattedProperties}
`;

    // IA RESPONSE
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),

      system: systemPrompt,

      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return NextResponse.json({
      text: result.text,
    });
  } catch (error) {
    console.error('ERROR COMPLETO GROQ:', error);

    return NextResponse.json(
      {
        text: 'Error processing request.',
      },
      { status: 500 }
    );
  }
}