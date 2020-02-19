var pointsOfIntersection = new THREE.Geometry();

var a = new THREE.Vector3(),
  b = new THREE.Vector3(),
  c = new THREE.Vector3();
var planePointA = new THREE.Vector3(),
  planePointB = new THREE.Vector3(),
  planePointC = new THREE.Vector3();
var lineAB = new THREE.Line3(),
  lineBC = new THREE.Line3(),
  lineCA = new THREE.Line3();

var pointOfIntersection = new THREE.Vector3();

function drawIntersectionPoints() {
  var mathPlane = new THREE.Plane();
  plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
  plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
  plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
  mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

  obj.geometry.faces.forEach(function(face) {
    obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
    obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
    obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
    lineAB = new THREE.Line3(a, b);
    lineBC = new THREE.Line3(b, c);
    lineCA = new THREE.Line3(c, a);
    setPointOfIntersection(lineAB, mathPlane);
    setPointOfIntersection(lineBC, mathPlane);
    setPointOfIntersection(lineCA, mathPlane);
  });

  var pointsMaterial = new THREE.PointsMaterial({
    size: 1,
    color: 0xffff00
  });
  var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
  scene.add(points);

  var lines = new THREE.LineSegments(pointsOfIntersection, new THREE.LineBasicMaterial({
    color: 0xffffff
  }));
  scene.add(lines);
}

function setPointOfIntersection(line, plane) {
  pointOfIntersection = plane.intersectLine(line);
  if (pointOfIntersection) {
    pointsOfIntersection.vertices.push(pointOfIntersection.clone());
  };
}

function getMesh(vertices_array){
var mesh = new THREE.ConvexGeometry( vertices_array );
return(mesh);
}
