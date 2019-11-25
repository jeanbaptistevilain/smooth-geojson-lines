## Description
This is a basic Node.js program that will smoothen lines in GeoJSON format.
The program will output a new GeoJSON file that will reproduce the input geometry types but with smoother lines / edges.

This program relies on 2 existing libs for the operation :
- first it uses [Simplify.js] to extract samples of the input lines
- then it applies a Bezier curve transformation using [Turf.js] to smoothen the sampled path

[Simplify.js]: https://mourner.github.io/simplify-js/
[Turf.js]: http://turfjs.org/docs/#bezierSpline

## Configuration
The output can currently be configured using the config object at the beginning of the script. This object exposes the main params of Simplify.js and Turf.js via the `simplify` and `bezier` keys respectively.
Please refer to the corresponding [Simplify.js] and [Turf.js] docs in order to adjust the output for your scenario.


## Usage
The program currently works with https-served GeoJSON files using WGS84 coordinates. It can be called via :

`npm run smoothen -- "https://raw.githubusercontent.com/jeanbaptistevilain/smooth-geojson-lines/master/example/france_metropolitaine.geojson"`

or just :

`node index.js "https://raw.githubusercontent.com/jeanbaptistevilain/smooth-geojson-lines/master/example/france_metropolitaine.geojson"`

_Note : this program provides a way to smoothen GeoJSON files via an offline command, it is currently not optimized for runtime use._

 

