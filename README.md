## Description
This is a basic Node.js program that will smoothen lines in GeoJSON format.
The program will output a new GeoJSON file that will reproduce the input geometry types but with smoother lines / edges.

This program relies on 2 existing libs for the operation :
- first it uses [Simplify.js] to extract samples of the input lines
- then it applies a Bezier curve transformation using [Turf.js] to smoothen the sampled path

[Simplify.js]: https://mourner.github.io/simplify-js/
[Turf.js]: http://turfjs.org/docs/#bezierSpline

## Usage
The program currently works with https-served GeoJSON files using WGS84 coordinates. It can be called via :

`npm run smoothen -- "https://..."`

or just :

`node index.js "https://..."`

_Note : this program provides a way to smoothen GeoJSON files in the CLI, it is currently not optimized for runtime use._

 

