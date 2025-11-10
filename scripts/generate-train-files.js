const fs = require('fs');
const path = require('path');

// Read all data files
const dataDir = path.join(__dirname, '../src/data');
const publicDir = path.join(__dirname, '../public');
const trainsDir = path.join(publicDir, 'trains');

// Create trains directory if it doesn't exist
if (!fs.existsSync(trainsDir)) {
  fs.mkdirSync(trainsDir, { recursive: true });
}

// Load all JSON files
const trainsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'data.json'), 'utf8'));
const trainsList = JSON.parse(fs.readFileSync(path.join(dataDir, 'trainsList.json'), 'utf8'));
const stations = JSON.parse(fs.readFileSync(path.join(dataDir, 'stations.json'), 'utf8'));
const types = JSON.parse(fs.readFileSync(path.join(dataDir, 'types.json'), 'utf8'));

// Create a map for quick lookup of train info from trainsList
const trainInfoMap = {};
trainsList.forEach(train => {
  trainInfoMap[train.i] = train;
});

// Process each train
let processedCount = 0;
let errorCount = 0;

Object.keys(trainsData).forEach(trainId => {
  try {
    const trainData = trainsData[trainId];
    const trainInfo = trainInfoMap[trainId];
    
    // Get train type information
    const trainType = types[trainData.typeId] || null;
    
    // Get from and to station information
    let fromStation = null;
    let toStation = null;
    if (trainInfo) {
      fromStation = stations[trainInfo.f] || null;
      toStation = stations[trainInfo.t] || null;
    }
    
    // Process cities/stations with full details
    const stationsWithDetails = trainData.cities.map(city => {
      const stationInfo = stations[city.id.toString()];
      return {
        stationId: city.id,
        stationName: stationInfo ? {
          en: stationInfo.en,
          ar: stationInfo.ar
        } : null,
        arrivalTime: city.a || null,
        departureTime: city.d || null
      };
    });
    
    // Get start time (first departure time)
    const startTime = trainData.cities.find(city => city.d)?.d || null;
    
    // Get end time (last arrival time)
    const endTime = trainData.cities.filter(city => city.a).pop()?.a || null;
    
    // Build comprehensive train details object
    const trainDetails = {
      trainNumber: trainId,
      trainType: trainType ? {
        id: trainData.typeId,
        name: {
          en: trainType.en,
          ar: trainType.ar
        },
        description: trainType.description || null
      } : null,
      route: {
        from: fromStation ? {
          stationId: trainInfo.f,
          name: {
            en: fromStation.en,
            ar: fromStation.ar
          }
        } : null,
        to: toStation ? {
          stationId: trainInfo.t,
          name: {
            en: toStation.en,
            ar: toStation.ar
          }
        } : null
      },
      schedule: {
        startTime: startTime,
        endTime: endTime,
        stations: stationsWithDetails,
        totalStations: stationsWithDetails.length
      },
      status: {
        working: trainData.working || null,
        lastUpdate: trainData.lastUpdate || null
      },
      notes: {
        en: trainData.tNoteEn || null,
        ar: trainData.tNoteAr || null
      }
    };
    
    // Create filename (sanitize train ID for filename)
    const filename = `train-${trainId.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    const filePath = path.join(trainsDir, filename);
    
    // Write file with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(trainDetails, null, 2), 'utf8');
    
    processedCount++;
    
    if (processedCount % 100 === 0) {
      console.log(`Processed ${processedCount} trains...`);
    }
  } catch (error) {
    console.error(`Error processing train ${trainId}:`, error.message);
    errorCount++;
  }
});

console.log(`\n✅ Successfully processed ${processedCount} trains`);
if (errorCount > 0) {
  console.log(`⚠️  Encountered ${errorCount} errors`);
}
console.log(`📁 Train files saved to: ${trainsDir}`);

