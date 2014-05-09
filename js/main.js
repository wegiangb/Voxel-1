var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );

var rootCube = new THREE.Object3D();
scene.add(rootCube);

var cubes = [];

var vertexShader = document.getElementById( 'vertexShader' ).textContent;
var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;

var colorWire = 0xcccccc;
var dimension = 8;

function Automata(cellCount) {
	this.cells = [];
	for (var i = 0; i < cellCount; i++) {
		this.cells.push(new Cell(i, (Math.random() > 0.5 ? true : false)));
	}
}

Automata.prototype.cellAt = function(index) {
	return this.cells[index];
}

Automata.prototype.cellIsAlive = function (index) {
	return this.cellAt(index).alive;
}

function Cell(index, visible) {
	this.index = index;
	var position = getPosition(index);
	this.object = createCube(position);
	this.object.visible = visible;
	this.alive = visible;
}

Cell.prototype.neighborCount = function () {
	var top = checkCell(this.index - dimension);
	var bottom = checkCell(this.index + dimension);
	var left = checkCell(this.index - 1);
	var right = checkCell(this.index + 1);
	return top + bottom + left + right;
}

Cell.prototype.spawn = function() {
	this.object.visible = true;
	this.alive = true;
}

Cell.prototype.live = function() {
	this.object.visible = true;
	this.alive = true;
}

Cell.prototype.die = function() {
	this.object.visible = false;
	this.alive = false;
}


function createCube(position) {
	var geometry = new THREE.BoxGeometry(1,1,1);
	var attributes = { center: { type: 'v3', boundTo: 'faceVertices', value: [] }  };
	var values = attributes.center.value;
	setupAttributes( geometry, values );
	var material = new THREE.ShaderMaterial( { uniforms: {}, attributes: attributes, vertexShader: vertexShader, fragmentShader: fragmentShader } );
	var cube = new THREE.Mesh( geometry, material );
	cube.position = position;
	rootCube.add(cube);
	cubes.push(cube);
	return cube
}

var automata = new Automata(dimension * dimension);
window.setInterval(checkAutomata, 100);

/**************************/

function render() {
	requestAnimationFrame(render);
	
	renderer.render(scene, camera);
}

render();

/***********************/

function checkAutomata() {
	for (var i = 0; i < dimension * dimension; i++) {
		var cell = automata.cellAt(i);
		var neighborCount = cell.neighborCount();
		switch (neighborCount) {
			default :
			case 0 : 
				cell.die(); 
				break;
			case 1 :
				cell.spawn();
				break;
			case 2 : 
			case 3 :
				cell.live(); 
				break;
		}
	}
}

function checkCell(index) {
	return (index >= 0 ? (index < dimension * dimension ? (automata.cellIsAlive(index) ? 1 : 0 ) : 0) : 0);
	alert(index);
}

function getPosition(index) {
	return new THREE.Vector3(index % dimension, Math.floor(index / dimension), 0.0);
}

function setupAttributes( geometry, values ) {

	for( var f = 0; f < geometry.faces.length; f ++ ) {

		values[ f ] = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];

	}

}
