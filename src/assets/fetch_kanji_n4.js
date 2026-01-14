// Script to fetch JLPT N4 kanji and details from kanjiapi.dev and save as Kanji_N4.json
const fs = require('fs');
const axios = require('axios');

async function fetchKanjiN4() {
  const jlptLevel = 4;
  const kanjiListRes = await axios.get(`https://kanjiapi.dev/v1/kanji/jlpt-${jlptLevel}`);
  const kanjiChars = kanjiListRes.data;
  const kanjiDetails = [];
  for (const char of kanjiChars) {
    const [kanjiRes, wordsRes] = await Promise.all([
      axios.get(`https://kanjiapi.dev/v1/kanji/${char}`),
      axios.get(`https://kanjiapi.dev/v1/words/${char}`)
    ]);
    const k = kanjiRes.data;
    const words = wordsRes.data;
    const examples = (Array.isArray(words) ? words : []).map(w => ({
      word: w.variants?.[0]?.written || '',
      reading: w.variants?.[0]?.pronounced || '',
      meaning: w.meanings?.[0]?.glosses?.[0] || ''
    }));
    kanjiDetails.push({
      id: k.kanji,
      character: k.kanji,
      meaning: k.meanings[0] || '',
      meanings: k.meanings,
      onyomi: k.on_readings || [],
      kunyomi: k.kun_readings || [],
      strokes: k.stroke_count,
      jlptLevel: k.jlpt,
      grade: k.grade,
      unicode: k.unicode,
      examples,
      radicals: [],
    });
  }
  fs.writeFileSync('src/assets/Kanji_N4.json', JSON.stringify(kanjiDetails, null, 2));
  console.log('Kanji_N4.json created with', kanjiDetails.length, 'kanji');
}

fetchKanjiN4();
