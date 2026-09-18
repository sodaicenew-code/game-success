const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function checkImg(name) {
  const data = fs.readFileSync('src/assets/images/' + name);
  const base64 = data.toString('base64');
  const res = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [{
      role: 'user',
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64 } },
        { text: 'Analyze this crime scene photo. Describe exact elements and their coordinates (X%, Y%): victim/person body, wounds, weapons, stains, puddles, equipment. Give X, Y for each.' }
      ]
    }]
  });
  console.log('RESULT FOR ' + name + ':\n' + res.text);
}

checkImg(process.argv[2]).catch(console.error);
