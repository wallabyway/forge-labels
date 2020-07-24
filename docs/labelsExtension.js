// CSS labelExtension.js

/* 
How to use:
1. add `<script src="./labelsExtension.js"></script>` to your `index.html`
2. add an array of labels with dbid and text, then call `initLabels()` like this...

	let labels = [ {dbid:2253, id:"desk"}, {dbid:2253, id:"chair"}, ... etc  ];
	const ext = viewer.getExtension("LabelsExtension");
	ext.initLabels( labels );


> (optional) if you want to click on something to make a new label appear, add this eventListener ...
	viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, e => ext.onClickAddLabel(e));

3. Add this CSS to your `index.html` file

	<style>
		.label:hover { font-size:14px; z-index:2; width:36px;  opacity: 0.8; background-color: grey; border: 3px solid white }
		.label:focus { font-size:16px; z-index:2; width:36px;  opacity: 1; background-color: brown; border: 4px solid white; outline: none;}
		.label {
			width:26px;
			font-size:12px;
			overflow: hidden;
			border: 1px solid white;
			border-radius: 10px;
			background: black;
			color: white;
			padding: 0 8px 0 8px;
			opacity: 0.6;
		}
	</style>

> Customize this CSS to give your labels a unique style.  Add CSS transition animations, SVG or images.
*/

class LabelsExtension extends Autodesk.Viewing.Extension {
	constructor(viewer, options) {
        super(viewer, options);
        this.scene = new THREE.Scene();
        this.b = new Float32Array(6);
    }

    initLabels(labels) {
        labels.map ((m,i) => {
        	m.cp = this.computeCenterPoint(m.dbid);
            this.addLabel(`${m.id}${i}`, m.cp ).onclick = (e) => {
                e.target.setAttribute('tabindex', '0');
                e.target.focus();
            };
        });
    }

    onClickAddLabel(e) {
        const dbid = e.selections[0].dbIdArray[0]; // triggered on LMV's Aggregate-Selection event
        this.addLabel(`new${dbid}`, this.computeCenterPoint(dbid) );
        viewer.applyCamera(viewer.impl.camera); //trigger a camera change event
    }

    computeCenterPoint(dbid) {
    	if (!this.it) this.it = this.viewer.model.getInstanceTree();
    	this.it.getNodeBox( dbid, this.b );
    	return {x:(this.b[0]+this.b[3])/2,  y:(this.b[1]+this.b[4])/2 , z: (this.b[2]+this.b[5])/2 };
    }

	addLabel(title, cp ) {
		var div = document.createElement( 'div' );
		div.className = 'label';
		div.textContent = title;
		div.style.marginTop = '-1em';
		div.style.cursor = "pointer";
		div.style.pointerEvents = "bounding-box";

		var label = new THREE.CSS2DObject( div );
		label.position.set( cp.x, cp.y, cp.z );
		this.scene.add( label );
		return div;
	}

    load() {
		let labelRenderer = new THREE.CSS2DRenderer( viewer.container );
		var self = this;
		this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, e => 
			labelRenderer.render( self.scene, e.camera ));
        return true;
    }

    unload() {
        return true;
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('LabelsExtension', LabelsExtension);


/* ********* ********** ********** ********** ********** ********* */

/**
 * 	THREE.JS R71: CSS2DRenderer
 *  @author mrdoob / http://mrdoob.com/
 *
 *  docs: https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer
 *  latest: https://raw.githubusercontent.com/mrdoob/three.js/master/examples/jsm/renderers/CSS2DRenderer.js
 *  examples: https://threejs.org/examples/#css2d_label
 **/

THREE.CSS2DObject = function ( element ) {

	THREE.Object3D.call( this );

	this.element = element;
	this.element.style.position = 'fixed';

	this.addEventListener( 'removed', function ( event ) {

		if ( this.element.parentNode !== null ) {

			this.element.parentNode.removeChild( this.element );

		}

	} );

};
THREE.CSS2DObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.CSS2DObject.prototype.constructor = THREE.CSS2DObject;


THREE.CSS2DRenderer = function ( div ) {

	console.log( 'THREE.CSS2DRenderer', THREE.REVISION );

	var _width, _height;
	var _widthHalf, _heightHalf;

	var vector = new THREE.Vector3();
	var viewMatrix = new THREE.Matrix4();
	var viewProjectionMatrix = new THREE.Matrix4();

	var domElement = document.createElement( 'div' );
	domElement.style.overflow = 'hidden';
	domElement.style.pointerEvents = "none";
	domElement.style.position = 'fixed';
	domElement.style.top = "65px";
	domElement.className = 'labels';
	div.appendChild( domElement );
	this.domElement = domElement;

	this.getSize = function () {

		return {
			width: _width,
			height: _height
		};

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

	};

	this.setSize( div.clientWidth, div.clientHeight );

	var renderObject = function ( object, camera ) {

		if ( object instanceof THREE.CSS2DObject ) {

			vector.setFromMatrixPosition( object.matrixWorld );
			vector.applyMatrix4( viewProjectionMatrix );

			var element = object.element;
			var style = 'translate(-50%,-50%) translate(' + ( vector.x * _widthHalf + _widthHalf ) + 'px,' + ( - vector.y * _heightHalf + _heightHalf ) + 'px)';

			element.style.transform = style;

			if ( element.parentNode !== domElement ) {

				domElement.appendChild( element );

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], camera );

		}

	};

	this.render = function ( scene, camera ) {

		scene.updateMatrixWorld();

		if ( camera.parent === null ) camera.updateMatrixWorld();

		viewMatrix.copy( camera.matrixWorldInverse );
		viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, viewMatrix );

		renderObject( scene, camera );

	};

};

/* end THREE.CSS2DRenderer ********* ********** ********** ********** ********** ********* */
