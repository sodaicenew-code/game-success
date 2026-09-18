const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeOne(img) {
  const data = fs.readFileSync('src/assets/images/' + img);
  const base64 = data.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // wait, earlier it said use gemini-2.5-flash not available? Wait, what models are available?
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64 } },
          { text: 'Analyze this image. What is depicted? Where is the victim, furniture, floor, specific objects? Give bounding boxes or center x%, y% for objects.' }
        ]
      }
    ]
  });
  return response.text;
}
