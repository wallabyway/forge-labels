## Forge Labels for 3D

Add "**Text Labels**" to your 3D Models in ForgeViewer, using `THREE.CSS2DRenderer`

[THREE.CSS2DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer) offers faster performance than other DIV-element techniques.  It also uses a familar API from Three.js

### DEMO: https://wallabyway.github.io/forge-labels/

##### Screenshot:
![3d-labels](https://user-images.githubusercontent.com/440241/88363461-fa53a280-cd34-11ea-9b7e-a5fbc48498a3.jpg)



#### How to use:

> Steps:

1. add `<script src="./labelsExtension.js"></script>` to your `index.html`
2. add an array of labels with dbid and text, then call `initLabels()` like this...

```
	let labels = [ {dbid:2253, id:"desk"}, {dbid:2253, id:"chair"}, ... etc  ];
	const ext = viewer.getExtension("LabelsExtension");
	ext.initLabels( labels );
```


> (optional) if you want to click on something to make a new label appear, add this eventListener ...
> 
> `viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, e => ext.onClickAddLabel(e));`

3. Add this CSS to your `index.html` file

> Customize this CSS to give your labels a unique style.  Add CSS transition animations, SVG or images.

```
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

```
