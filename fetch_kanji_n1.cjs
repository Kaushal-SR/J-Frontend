// fetch_kanji_n1.cjs
// Node.js script to fetch all JLPT N1 kanji from kanjiapi.dev and save as Kanji_N1.json

const fs = require('fs');
const https = require('https');

const JLPT_LEVEL = '1';
const API_URL = `https://kanjiapi.dev/v1/kanji/jlpt-level-${JLPT_LEVEL}`;
const DETAILS_URL = 'https://kanjiapi.dev/v1/kanji/';
const OUTPUT_PATH = './src/assets/Kanji_N1.json';

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
  try {
    const kanjiList = await fetch(API_URL);
    const result = [];
    for (const kanji of kanjiList) {
      try {
        const details = await fetch(DETAILS_URL + kanji);
        result.push(details);
      } catch (err) {
        console.error(`Failed to fetch details for ${kanji}:`, err);
      }
    }
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Saved ${result.length} kanji to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('Error fetching N1 kanji:', err);
  }
})();
