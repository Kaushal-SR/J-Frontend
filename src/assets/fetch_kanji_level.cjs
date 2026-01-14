// fetch_kanji_level.cjs
// Usage: node fetch_kanji_level.cjs N3
const fs = require('fs');
const https = require('https');

const level = process.argv[2];
if (!level || !['N1','N2','N3'].includes(level)) {
  console.error('Usage: node fetch_kanji_level.cjs N3|N2|N1');
  process.exit(1);
}

const jlptMap = { N1: 1, N2: 2, N3: 3 };
const apiLevel = jlptMap[level];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

(async () => {
  const kanjiChars = await fetch(`https://kanjiapi.dev/v1/kanji/jlpt-${apiLevel}`);
  const kanjiList = [];
  for (const char of kanjiChars) {
    const k = await fetch(`https://kanjiapi.dev/v1/kanji/${char}`);
    const words = await fetch(`https://kanjiapi.dev/v1/words/${char}`);
    const examples = Array.isArray(words) ? words.map(w => ({
      word: w.variants?.[0]?.written || '',
      reading: w.variants?.[0]?.pronounced || '',
      meaning: w.meanings?.[0]?.glosses?.[0] || ''
    })) : [];
    kanjiList.push({
      id: k.kanji,
      character: k.kanji,
      meaning: Array.isArray(k.meanings) && k.meanings.length > 0 ? k.meanings[0] : '',
      onyomi: k.on_readings || [],
      kunyomi: k.kun_readings || [],
      strokes: k.stroke_count,
      jlptLevel: level,
      radicals: [],
      status: 'new',
      reviewCount: 0,
      isBookmarked: false,
      examples
    });
  }
  fs.writeFileSync(`src/assets/Kanji_${level}.json`, JSON.stringify(kanjiList, null, 2));
  console.log(`Saved src/assets/Kanji_${level}.json with ${kanjiList.length} kanji.`);
})();
