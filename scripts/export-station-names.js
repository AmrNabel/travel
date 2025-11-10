const fs = require('fs');
const path = require('path');

const stationsFile = path.resolve(__dirname, '../src/data/stations.json');
const publicDir = path.resolve(__dirname, '../public');

function ensureExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required path: ${filePath}`);
  }
}

function readStations() {
  ensureExists(stationsFile);
  const raw = fs.readFileSync(stationsFile, 'utf8');
  return JSON.parse(raw);
}

function extractNames(stations, field) {
  const seen = new Set();
  return Object.keys(stations)
    .map(Number)
    .sort((a, b) => a - b)
    .map((key) => stations[String(key)][field])
    .filter((value) => {
      if (!value || typeof value !== 'string') {
        return false;
      }
      const trimmed = value.trim();
      if (trimmed.length === 0 || seen.has(trimmed)) {
        return false;
      }
      seen.add(trimmed);
      return true;
    });
}

function writeJson(filename, data) {
  const outputPath = path.join(publicDir, filename);
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return outputPath;
}

function main() {
  ensureExists(publicDir);
  const stations = readStations();

  const englishNames = extractNames(stations, 'en');
  const arabicNames = extractNames(stations, 'ar');

  const enPath = writeJson('stations-en.json', englishNames);
  const arPath = writeJson('stations-ar.json', arabicNames);

  console.log(`Generated ${englishNames.length} English station names at: ${enPath}`);
  console.log(`Generated ${arabicNames.length} Arabic station names at: ${arPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

