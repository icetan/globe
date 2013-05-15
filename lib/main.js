var el = document.getElementById('icosphere');

if (!window.WebGLRenderingContext) {
  el.parentNode.removeChild(el);
  return;
}

var THREE = require('three'),
    createThing = require('./thing'),
    projection = require('./proj').projection,
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    proj = projection({}),
    imageData,
    ZOOM = 2,
    SIZE = 1024,
    centerCoordinate = proj.project({x:0, y:0}, ZOOM);

function coordinatePoint(coord) {
  // Return an x, y point on the map image for a given coordinate
  return {
    x: (SIZE / 2) + (coord.x) - centerCoordinate.x,
    y: (SIZE / 2) + (coord.y) - centerCoordinate.y
  };
}

function lnglatPoint(lnglat) {
  return coordinatePoint(proj.project({x:lnglat[0], y:lnglat[1]}, ZOOM));
}


canvas.width = canvas.height = SIZE;

function updateCanvas(min, span) {
  var shade, i;

  imageData = ctx.createImageData(canvas.width, canvas.height);
  for (i = imageData.data.length; (i-=4) >= 0;) {
    shade = ((Math.random() * span) | 0) + min;
    imageData.data[i] = shade;
    imageData.data[i+1] = shade;
    imageData.data[i+2] = shade;
    imageData.data[i+3] = 0xFF;
  }

  ctx.putImageData(imageData, 0, 0);
}

function main(el) {
  var thing = createThing(el),
      bumpTexture = new THREE.Texture(canvas),
      texture = THREE.ImageUtils.loadTexture('1024x1024.png'),
      material = new THREE.MeshPhongMaterial({
        map: texture,
        ambient: 0x552811,
        specular: 0x333333,
        shininess: 250,
        bumpMap: bumpTexture,
        metal: false
      }),
      icosphere = new THREE.Mesh(
        new THREE.SphereGeometry(20, 50, 50),
        material
      );

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 1;
  texture.repeat.y = 1;
  texture.offset.x = 0;
  texture.offset.y = 0;
  //texture.offset.y = ( 400 / 100 ) * texture.repeat.y;
  thing.scene.add( new THREE.AmbientLight( 0x555555 ) );

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  thing.scene.add(pointLight);

  texture.needsUpdate = true;
  bumpTexture.needsUpdate = true;

  thing.scene.add(icosphere);
  thing.on('frame', function(frame, time) {
    //if (!material.wireframe && frame % 6 === 0) {
    //    updateCanvas(0x8, 0x0F);
    //    bumpTexture.needsUpdate = true;
    //}
    icosphere.rotation.y = time/5000;
  });
  thing.start();
};

updateCanvas(0x08, 0x0F);
document.body.style.backgroundImage = 'url('+canvas.toDataURL()+')';

point = lnglatPoint([13,59]);
ctx.fillStyle = '#000000';
ctx.fillRect(0,0,SIZE,SIZE)
ctx.fillStyle = '#666';
ctx.fillRect(point.x,point.y,3,3);

main(el);

