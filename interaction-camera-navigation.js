var camera, controls;

// Constructor
SceneViewer = function()
{

	Sim.App.call(this);
}

// Subclass Sim.App
SceneViewer.prototype = new Sim.App();

// Our custom initializer
SceneViewer.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create a point light to show off the scene
	var light = new THREE.PointLight( 0xffffff, 1, 200);
	light.position.set(0, 20, 0);
	this.scene.add(light);

	light = new THREE.PointLight( 0xffffff, 1, 200);
	light.position.set(0, 0, 0);
	this.scene.add(light);
	
	var amb = new THREE.AmbientLight( 0x808080, 1);
	this.scene.add(amb);
	
	this.camera.position.set(0.5, 1.5, 0.5);	
	this.camera.lookAt(this.root.position);
	this.camera.near = 0.001;
	
	this.root.rotation.y = -Math.PI / 2;
	
    // Create the model and add it to our sim
    var content = new Scene();
    content.init();
    this.addObject(content);    

    this.content = content;    
	
    this.createCameraControls();
	document.addEventListener( 'dblclick', ondblclick, false );

}

SceneViewer.prototype.createCameraControls = function()
{
	controls = new THREE.FirstPersonControls(this.camera);

	controls.movementSpeed = 10;
	controls.lookSpeed = 0.05;

	// Allow tilt up/down
	controls.lookVertical = true;

	// Don't move camera without click
	controls.activeLook = false;

	// var controls = new THREE.DragControls( this.camera );
	this.controls = controls;
	this.clock = new THREE.Clock();


	//Trackball controls

	/*controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
	controls.target.set(0,0,0);
	var radius = SceneViewer.CAMERA_RADIUS;
	
	controls.rotateSpeed = SceneViewer.ROTATE_SPEED;
	controls.zoomSpeed = SceneViewer.ZOOM_SPEED;
	controls.panSpeed = SceneViewer.PAN_SPEED;
	controls.dynamicDampingFactor = SceneViewer.DAMPING_FACTOR;
	controls.noZoom = true;
	controls.noPan = false;
	controls.staticMoving = false;

	controls.minDistance = radius * SceneViewer.MIN_DISTANCE_FACTOR;
	controls.maxDistance = radius * SceneViewer.MAX_DISTANCE_FACTOR;

	this.controls = controls;*/
}

SceneViewer.prototype.update = function()
{
	this.controls.update(this.clock.getDelta());
    Sim.App.prototype.update.call(this);

    //this.controls.update();
    //Sim.App.prototype.update.call(this);
}

SceneViewer.CAMERA_START_Z = 22;
SceneViewer.CAMERA_RADIUS = 1;
SceneViewer.MIN_DISTANCE_FACTOR = 1.0;
SceneViewer.MAX_DISTANCE_FACTOR = 1.0;
SceneViewer.ROTATE_SPEED = 1.0;
SceneViewer.ZOOM_SPEED = 3;
SceneViewer.PAN_SPEED = 0.2;
SceneViewer.DAMPING_FACTOR = 0.6;

// Custom model class
Scene = function()
{
	Sim.Object.call(this);
}

Scene.prototype = new Sim.Object();

Scene.prototype.init = function(param)
{
	// Create an empty group to hold the content
	var group = new THREE.Object3D;

    // Tell the framework about our object
    this.setObject3D(group);

	this.addCuriosityPics();
	this.addStars();

}

Scene.prototype.addCuriosityPics = function()
{
	getLocationDataArray();
	getImageDataArray();
	
	if (getUrlVars()["id"])
	{

		var first = getUrlVars()["id"];
		alert(first);
	}
	if (getUrlVars()["page"])
	{
		var second = getUrlVars()["page"];
		alert(second);
	}
	
	var targetDate = null;
	
	if (getUrlVars()["date"])
	{
		targetDate = getUrlVars()["date"];
	}

	//targetDate = "2012-09-17";

	var targetDrive = null;
	
	if (getUrlVars()["drive"])
	{
		targetDrive = getUrlVars()["drive"];
		// console.log("Drive number from URL is: " + targetDrive)
	}


	var targetSite = null;
	
	if (getUrlVars()["site"])
	{
		targetSite = getUrlVars()["site"];
		// console.log("Site number from URL is: " + targetSite)
	}
	
	var MyMapArray = new Array();

	var MyVector = null; 
	
	var tempImageIndex = 0;
	var tempMapIndex = 0;
	
	var counter = 0;
	
	for ( var i=SiteLocation.length; i > 0; i--)
	{
		if (SiteLocation[i])
		{
			for (var j=SiteLocation[i].length; j > 0; j--) 
			{
				if ( SiteLocation[i][j])
				{
					if ( SiteLocation[i][j].images)
					{
						for (var k=0; k < SiteLocation[i][j].images.length; k++)
						{
							
							if (true)// if (i == targetSite && j == targetDrive) 
							{
								
								if ( SiteLocation[i][j].images[k].instrument != "FHAZ_RIGHT_A" && SiteLocation[i][j].images[k].instrument != "RHAZ_RIGHT_A" && SiteLocation[i][j].images[k].instrument != "NAV_RIGHT_A" )
								{
									counter++;
									
									MyMapArray[MyMapArray.length] = new THREE.Texture();
									tempMapIndex = MyMapArray.length-1;
									
									
									if ( SiteLocation[i][j].images[k].instrument == "FHAZ_LEFT_A" 
										||
										SiteLocation[i][j].images[k].instrument == "FHAZ_RIGHT_A" 
										||
										SiteLocation[i][j].images[k].instrument == "RHAZ_LEFT_A" 
										||
										SiteLocation[i][j].images[k].instrument == "RHAZ_RIGHT_A" )
									{
										var MyMaterial = new THREE.MeshBasicMaterial({ 	map: MyMapArray[tempMapIndex], 
																					transparent: true, 
																					opacity: 0.9 });										
										var MyGeometry = new THREE.PlaneGeometry(2.5,2.5);	
									}
									else
									{
										var MyMaterial = new THREE.MeshBasicMaterial({ 	map: MyMapArray[tempMapIndex], 
																					transparent: true, 
																					opacity: 0.2 });
										var MyGeometry = new THREE.PlaneGeometry(1,1);	
									}
									

									var MyPlane = new THREE.Mesh(MyGeometry, MyMaterial);
									var MyQuaternion = SiteLocation[i][j].images[k].attitude;
									var MyCameraPosition = SiteLocation[i][j].images[k].cameraPosition;
									var tempNumberX = MyCameraPosition.x;
									var tempNumberY = MyCameraPosition.y;
									var tempNumberZ = MyCameraPosition.z;
									MyCameraPosition.x = tempNumberY;
									MyCameraPosition.y = -1*tempNumberZ;
									MyCameraPosition.z = -1*tempNumberX;

									var MyCameraVector =  SiteLocation[i][j].images[k].cameraVector;
									tempNumberX = MyCameraVector.x;
									tempNumberY = MyCameraVector.y;
									tempNumberZ = MyCameraVector.z;
									MyCameraVector.x = tempNumberY;
									MyCameraVector.y = -1*tempNumberZ;
									MyCameraVector.z = -1*tempNumberX;
									MyCameraVector.setLength(1);

									MyVector = new THREE.Vector3( MyCameraPosition.x, MyCameraPosition.y, MyCameraPosition.z);

									MyVector.addSelf(MyCameraVector);
									var MyMarsLocation = new THREE.Vector3( 
																		SiteLocation[i][j].x/100,
																		(-1)*SiteLocation[i][j].y/100,
																		(-1)*SiteLocation[i][j].z/100
																		)
	
									MyPlane.position.set(MyVector.x, MyVector.y, MyVector.z);
									
									var MyLookVector = MyCameraPosition;
									MyPlane.rotationAutoUpdate = true;
									MyPlane.lookAt(MyLookVector);
									MyPlane.EOMsrcForImage = SiteLocation[i][j].images[k].urlList;
									MyPlane.EOMsite = i;
									MyPlane.EOMdrive = j;
									MyPlane.visible = false;

									this.object3D.add(MyPlane);

									planeArr[planeArr.length] = MyPlane;
									planeArr[planeArr.length-1].EOMmarsLocation = MyMarsLocation;
									planeArr[planeArr.length-1].EOMinstrument = SiteLocation[i][j].images[k].instrument;

								}
							}

						}
					}
				}
			}
		}
	}
	cameraLookAtVector = MyVector;

}

// Stars
Scene.prototype.addStars = function()
{
	var radius = 50;
	var starsGeometry = new THREE.Geometry();

	for ( var i = 0; i < 1500; i ++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2 - 1;
		vertex.y = Math.random() * 2 - 1;
		vertex.z = Math.random() * 2 - 1;
		vertex.multiplyScalar( radius );

		starsGeometry.vertices.push( vertex );

	}

	var stars,
	starsMaterials = [
		new THREE.ParticleBasicMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
		new THREE.ParticleBasicMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
		new THREE.ParticleBasicMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
		new THREE.ParticleBasicMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
		new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
		new THREE.ParticleBasicMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
	];

	for ( i = 10; i < 30; i ++ ) {

		stars = new THREE.ParticleSystem( starsGeometry, starsMaterials[ i % 6 ] );

		stars.rotation.x = Math.random() * 6;
		stars.rotation.y = Math.random() * 6;
		stars.rotation.z = Math.random() * 6;

		var s = i * 10;
		stars.scale.set( s, s, s );

		stars.matrixAutoUpdate = false;
		stars.updateMatrix();

		this.object3D.add( stars );

	}
}

Scene.CAMERA_START_Z = 25;

//Custom model class
Model = function()
{
	Sim.Object.call(this);
}

Model.prototype = new Sim.Object();

Model.prototype.init = function(param)
{
	var group = new THREE.Object3D;

	var that = this;

	var url = param.url || "";
	if (!url)
		return;

	this.materials = param.materials;
	var scale = param.scale || 1;
	
	this.scale = new THREE.Vector3(scale, scale, scale);
	var loader = new THREE.BinaryLoader();
	loader.load( url, function( data ) { 
		that.handleLoaded(data) } );

    // Tell the framework about our object
    this.setObject3D(group);
}


Model.prototype.handleLoaded = function(data)
{
	if (data instanceof THREE.Geometry)
	{
		var geometry = data;
		var material = null;
		if (this.materials)
		{
			material = new THREE.MeshFaceMaterial();
	
			var i, len = this.materials.length;
			for (i = 0; i < len; i++)
			{
				geometry.materials[i] = this.materials[i];
			}
		}
		else
		{
			material = new THREE.MeshFaceMaterial();
		}
		mesh = new THREE.Mesh( geometry, material );

		this.object3D.add( mesh );
		
		this.object3D.scale.copy(this.scale);
	}
}


function ondblclick( event )
{

	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	var projector = new THREE.Projector();
	projector.unprojectVector( vector, camera );

	var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

	 intersects = ray.intersectObjects( planeArr );

	if ( intersects.length > 0 ) {

		// intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

		// var particle = new THREE.Particle( particleMaterial );
		// particle.position = intersects[ 0 ].point;
		// particle.scale.x = particle.scale.y = 8;
		// app.scene.add( particle );	

		var src = intersects[0].object.EOMsrcForImage;
		
		$("#container").after('<div class="lightbox"><div class="img_container"><img src="' + src + '" /></div></div>');

		/* Close the grey area */
		var mouse_is_inside = true;
		$(".img_container").hover(function () {
			mouse_is_inside = true;
		}, function () {
			mouse_is_inside = false;
		});
		if (!$.browser.msie) {
			$("body").mouseup(function () {
				if (!mouse_is_inside) {
					$(".lightbox").remove();
				}
			});
		}

	}

}
