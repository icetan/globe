// Generated by CoffeeScript 1.4.0
var Proj, WGS84, proj4node, projection, tileUrl, transformation, _ref;

_ref = require('proj4node'), WGS84 = _ref.WGS84, Proj = _ref.Proj, proj4node = _ref.transform;

projection = function(projection, transform, scale) {
  var proj, scales, _ref1;
  if (typeof projection !== 'string') {
    _ref1 = projection, projection = _ref1.projection, transform = _ref1.transform, scale = _ref1.scale, scales = _ref1.scales;
  }
  if (projection == null) {
    projection = '+proj=merc +a=1 +b=1 +lat_ts=0.0 +lon_0=0.0\
 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs';
  }
  if (transform == null) {
    transform = [0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5];
  }
  if (transform instanceof Array) {
    transform = transformation.apply(void 0, transform);
  }
  if (scale == null) {
    scale = scales != null ? (function(z) {
      return scales[z];
    }) : (function(z) {
      return Math.pow(2, z + 8);
    });
  }
  proj = new Proj(projection);
  return {
    project: function(point, zoom) {
      point = proj4node(WGS84, proj, point);
      point = transform.transform(point);
      return this.scale(point, zoom);
    },
    unproject: function(point, zoom) {
      point = this.scale(point, void 0, zoom);
      point = transform.untransform(point);
      return proj4node(proj, WGS84, point);
    },
    scale: function(point, to, from) {
      var p;
      if (from != null) {
        p = scale(from);
        point = {
          x: point.x / p,
          y: point.y / p
        };
      }
      if (to != null) {
        p = scale(to);
        point = {
          x: point.x * p,
          y: point.y * p
        };
      }
      return point;
    }
  };
};

transformation = function(a, b, c, d) {
  return {
    transform: function(p) {
      return {
        x: a * p.x + b,
        y: c * p.y + d
      };
    },
    untransform: function(p) {
      return {
        x: p.x - b / a,
        y: p.y - d / c
      };
    }
  };
};

tileUrl = function(tmpl) {
  return function(tile, zoom) {
    return tmpl.replace(/{Z}/i, zoom.toFixed(0)).replace(/{X}/i, tile.x.toFixed(0)).replace(/{Y}/i, tile.y.toFixed(0));
  };
};

module.exports = {
  projection: projection,
  transformation: transformation,
  tileUrl: tileUrl
};
