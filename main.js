import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import proj4 from "proj4";
import { get as getProjection, transformExtent } from 'ol/proj';
import { register } from 'ol/proj/proj4.js';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic.js';
import RasterSource from 'ol/source/Raster';

const extent = [-473979, -95678, 84021, 204322];
proj4.defs(
    'my-projection',
    '+proj=lcc +lat_1=45.848999 +lon_0=11.400000 +lat_0=46.008598 +units=m +R=6370'
);
register(proj4);
const myProjection = getProjection('my-projection');

const rawLayer = new ImageLayer({
  source: new Static({
    url: 'data.png',
    projection: myProjection,
    imageExtent: extent,
    interpolate: false,
  })
});

const colors = [];
for (let i = 0 ; i < 256 ; i++) {
  colors[i] = [i, 256 - i, i, 255];
}

const rasterSource = new RasterSource({
  sources: [rawLayer],
  operationType: 'pixel',
  operation: (pixels) => {
    const pixel = pixels[0];
    return colors[pixel[2]];
  },
});

const imageLayer = new ImageLayer({
  source: rasterSource
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    imageLayer,
  ],
  view: new View()
});

map.getView().fit(transformExtent(extent, myProjection, map.getView().getProjection()));
