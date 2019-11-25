const https = require('https');
const fs = require('fs');
const turf = require("@turf/helpers");
const bezier = require("@turf/bezier-spline").default;
const simplify = require("simplify-js");

const config = {
  bezier: {resolution: 20000, sharpness: 0.85},
  simplify: {tolerance: 0.1, highQuality: true}
};

function smoothenFile(geojsonFile) {
  https.get(geojsonFile, (res) => {
    const { statusCode } = res;

    let error;
    if (statusCode !== 200) {
      error = new Error("Request failed - Status Code: " + statusCode);
      console.error(error.message);
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const data = JSON.parse(rawData);
        if (data.type === 'FeatureCollection') {
          for (const feature of data.features) {
            feature.geometry.coordinates = smoothenCoords(feature.geometry.type, feature.geometry.coordinates);
          }
          writeOutputFile(geojsonFile, data);
        } else if (data.type === 'Feature') {
          data.geometry.coordinates = smoothenCoords(data.geometry.type, data.geometry.coordinates);
          writeOutputFile(geojsonFile, data);
        } else {
          console.error("Unsupported data type : " + data.type);
        }
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error("Remote file retrieval error: " + e.message);
  });
}

function writeOutputFile(inputFilePath, data) {
  const outputFilePath = "output/smooth-" + inputFilePath.replace(/\?[^.\/]+$/, '').match(/[^.\/?]+(\.[^.\/?]+)?$/)[0];
  fs.writeFile(outputFilePath, JSON.stringify(data), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("Smoothly wrote to output file : " + outputFilePath);
  });
}

function smoothenCoords(type, coords) {
  if (type === 'LineString') {
    let simplifiedCoords = simplifyCoords(coords);
    return bezierifyCoords(simplifiedCoords).geometry.coordinates;
  } else if (type === 'Polygon' || type === 'MultiLineString') {
    let simplifiedCoords = coords.map((lineCoord) => simplifyCoords(lineCoord));
    return simplifiedCoords.map((lineCoord) => {
      let bCoords = bezierifyCoords(lineCoord).geometry.coordinates;
      if (type === 'Polygon') {
        bCoords.push(bCoords[0]);
      }
      return bCoords;
    });
  } else if (type === 'MultiPolygon') {
    return coords.map(polygonCoords => smoothenCoords('Polygon', polygonCoords));
  } else {
    return coords;
  }
}

function simplifyCoords(coords) {
  let coordsObjs = coords.map((coord) => { return {x: coord[0], y: coord[1]}; });
  return simplify(coordsObjs, config.simplify.tolerance, config.simplify.highQuality)
    .map((coordObj) => [coordObj.x, coordObj.y]);
}

function bezierifyCoords(coords) {
  return bezier(turf.lineString(coords), config.bezier);
}

if (process.argv.length === 3) {
  smoothenFile(process.argv[2]);
} else {
  console.error('Please provide a valid GeoJSON file as single argument');
}
