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
	
	this.camera.position.set(0, 0, 0);	
	this.camera.lookAt(this.root.position);
	this.camera.near = 0.001;
	
	this.root.rotation.y = -Math.PI / 2;
	
    // Create the model and add it to our sim
    var content = new Scene();
    content.init();
    this.addObject(content);    

    this.content = content;    
	
    this.createCameraControls();
}

SceneViewer.prototype.createCameraControls = function()
{
	// Set up the FP controls
	var controls = new THREE.FirstPersonControls( this.camera );

	controls.movementSpeed = 2;
	controls.lookSpeed = 0.05;
	
	// Allow tilt up/down
	controls.lookVertical = true;
	
	// Don't move camera without click
	controls.activeLook = false;

	// var controls = new THREE.DragControls( this.camera );
	
	
	
	this.controls = controls;
	
	this.clock = new THREE.Clock();
}

SceneViewer.prototype.update = function()
{
	this.controls.update(this.clock.getDelta());
    Sim.App.prototype.update.call(this);
}

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

    //this.createWalls();
    //this.createFloor();
	this.addCuriosityPics();
	this.addStars();

    //this.loadModels();
}

Scene.prototype.addCuriosityPics = function()
{
	//alert("about to start adding curiosity pic.");
	
	// var Images = new Array();
	// Images[0] = new Image();
	// Images[0].crossOrigin = '';
	// Images[0].src = 'http://msl-raws.s3.amazonaws.com/msl-raw-images/proj/msl/redops/ods/surface/sol/00024/opgs/edr/ncam/NLA_399621461EDR_F0030308NCAM00404M_.JPG' 
			// + '?' + escape(new Date());	
	// var map = new THREE.Texture(Images[0]);
	// map.needsUpdate = true;
	// Images[0].onload = function () { map.needsUpdate = true; };
	// var material = new THREE.MeshBasicMaterial({ map: map, transparent: true, opacity: 0.9 });
	// var geometry = new THREE.PlaneGeometry(1, 1);
	// plane = new THREE.Mesh(geometry, material);
	// var q = new THREE.Quaternion(0.795134,-0.0211898,-0.0459318,0.604321);
	// var v3 = new THREE.Vector3( 1, 1, 1);
	// q.multiplyVector3(v3);
	// plane.position.set(v3.x, v3.y, v3.z);	
	// this.object3D.add(plane);
	
	

	// Images[1] = new Image();
	// Images[1].crossOrigin = '';
	// Images[1].src = 'http://msl-raws.s3.amazonaws.com/msl-raw-images/proj/msl/redops/ods/surface/sol/00024/opgs/edr/ncam/NLA_399626500EDR_F0030372SAPP07712M_.JPG' 
			// + '?' + escape(new Date());	
	// var map2 = new THREE.Texture(Images[1]);
	// //map2.needsUpdate = true;
	// Images[1].onload = function () { map2.needsUpdate = true; };
	// var material2 = new THREE.MeshBasicMaterial({ map: map2, transparent: true, opacity: 0.9 });
	// var geometry2 = new THREE.PlaneGeometry(1, 1);
	// plane2 = new THREE.Mesh(geometry2, material2);
	// var q2 = Drives[4][0].attitude;//new THREE.Quaternion(0.526266,0.00595213,-0.0177436,0.850114);
	// var v32 = new THREE.Vector3( 1, 1, 1);
	// q2.multiplyVector3(v32);
	// plane2.position.set(v32.x, v32.y, v32.z);	
	// this.object3D.add(plane2);

	getLocationDataArray();
	getImageDataArray();
	console.log(SiteLocation[00001][0].images[0].urlList);
	
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

	// if (!targetDrive || !targetSite)
	// {
	// 	alert("Please add ?site=#&drive=# to the URL.  I suggest ?site=5&drive=68 ");
	// 	AbortJavaScript()
	// }
	
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
						// console.log("SiteLocation["+i+"]["+j+"] is valid.")

						for (var k=0; k < SiteLocation[i][j].images.length; k++)
						{
							/*if ( SiteLocation[i][j].images[k].instrument != "FHAZ_RIGHT_A" && SiteLocation[i][j].images[k].instrument != "RHAZ_RIGHT_A" )
							{
								continue;
							}
							else
							{
								for (var andy = 0; andy < SiteLocation[i][j].images.length; andy++)
								{
									if (SiteLocation[i][j].images[k].itemName.slice(4,35) == SiteLocation[i][j].images[andy].itemName.slice(4,35))
									{
										SiteLocation[i][j].images[andy] == null;
									}
								}
							}*/
						//}
						//for (var k=0; k < SiteLocation[i][j].images.length; k++)
						//{
							if (true)// if (i == targetSite && j == targetDrive) 
							{
								// console.log("Length of Drives["+i+"] is: "+Drives[i].length);
								// //console.log(SiteLocation[i][j].images[k]);
								// console.log(targetDate);
								// console.log(SiteLocation[i][j].images[k].utc.indexOf(targetDate));
								// console.log(							SiteLocation[i][j].images[k].utc.indexOf(targetDate) != -1
								// 		 || //or
								// 		i == targetDrive);
								if ( SiteLocation[i][j].images[k].instrument != "FHAZ_RIGHT_A" && SiteLocation[i][j].images[k].instrument != "RHAZ_RIGHT_A" && SiteLocation[i][j].images[k].instrument != "NAV_RIGHT_A" )
								{
									counter++;
									// var MyImage = new Image();
									// imageArr[imageArr.length] = MyImage;
									// MyImage.crossOrigin = '';
									// MyImage.src = SiteLocation[i][j].images[k].urlList;
									// MyMapArray[MyMapArray.length] = new THREE.Texture( MyImage );
									MyMapArray[MyMapArray.length] = new THREE.Texture();
									tempMapIndex = MyMapArray.length-1;
									// $(MyImage).data("index", tempMapIndex);
									
									// MyImage.onload = function () 
									// {
									// 	// console.log($(this).data("index"))							
									// 	MyMapArray[$(this).data("index")].needsUpdate = true;
									// 	// setTimeout(function() {$(this).src = ""; console.log("set img object src to empty string.")},1250); 
										
									// };
									var MyMaterial = new THREE.MeshBasicMaterial({ 	map: MyMapArray[tempMapIndex], 
																					transparent: true, 
																					opacity: 0.9 });
									// Finds duplicate images and keeps only the left one
									/*if (SiteLocation[i][j].images[k].itemName.slice(4,35) == SiteLocation[i][j].images[k].itemName.slice(4,35))
									{

									 	continue;
									}*/
									
									if ( SiteLocation[i][j].images[k].instrument == "FHAZ_LEFT_A" )
									{
										var MyGeometry = new THREE.PlaneGeometry(2.5,1);	
									}
									else
									{
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
									MyCameraVector.setLength(3);

									// console.log(MyQuaternion);
									MyVector = new THREE.Vector3( MyCameraPosition.x, MyCameraPosition.y, MyCameraPosition.z);
									// MyQuaternion.multiplyVector3(MyVector);
									MyVector.addSelf(MyCameraVector);
									var MyMarsLocation = new THREE.Vector3( 
																		SiteLocation[i][j].y/100,
																		(-1)*SiteLocation[i][j].z/100,
																		(-1)*SiteLocation[i][j].x/100
																		)
									MyVector.addSelf(MyMarsLocation);

									MyPlane.position.set(MyVector.x, MyVector.y, MyVector.z);
									
									var MyLookVector = MyCameraPosition;
									MyPlane.rotationAutSoUpdate = true;
									MyPlane.lookAt(MyLookVector);
									MyPlane.EOMsrcForImage = SiteLocation[i][j].images[k].urlList;
									MyPlane.EOMsite = i;
									MyPlane.EOMdrive = j;
									MyPlane.visible = false;

									this.object3D.add(MyPlane);
									// MyPlane.visible = false;
									planeArr[planeArr.length] = MyPlane;
									planeArr[planeArr.length-1].marsLocation = MyMarsLocation;

									
									// var MyText = new THREE.TextGeometry("Testing i=" + i + ", j =" + j);
									// var MyTextPlane = new THREE.Mesh(MyText, MyMaterial);
									// MyTextPlane.position.set(counter, counter, counter);
									// this.object3D.add(MyTextPlane);

								}
							}
							// else
							// {
							// 	alert("SiteLocation["+i+"]["+j+"].images was NULL, this shouldn't happen.");
							// }
							// if (counter > 0) {break;};
						}
						// if (counter > 0) {break;};
					}
				}
			}
		}
	}

	
	cameraLookAtVector = MyVector;

}








				// stars
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












Scene.prototype.createWalls = function()
{
	var geometry = new THREE.CubeGeometry(.1, 20, 66);
	// Brick texture adapted from http://wdc3d.com/wp-content/uploads/2010/05/red-brick-seamless-1000-x-1000.jpg
	// From set http://wdc3d.com/2d-textures/6-seamless-tileable-brick-textures/
	var map = THREE.ImageUtils.loadTexture('/images/red-brick-seamless-512-x-512.jpg');
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(3,3);
	var material = new THREE.MeshLambertMaterial({ map : map});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(-33, 10, 0);
	this.object3D.add(mesh);

	var geometry = new THREE.CubeGeometry(.1, 20, 66);
	var material = new THREE.MeshLambertMaterial({ map : map});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(33, 10, 0);
	this.object3D.add(mesh);

	var geometry = new THREE.CubeGeometry(66, 20, .1);
	var material = new THREE.MeshLambertMaterial({ map : map});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 10, -33);
	this.object3D.add(mesh);
	
}

Scene.prototype.createFloor = function()
{
	geometry = new THREE.PlaneGeometry(66, 66, 66, 66);
	var map = THREE.ImageUtils.loadTexture('/images/great-marble-texture_w725_h544-TP.jpg');
    map.repeat.set(11,11);
    map.wrapS = map.wrapT = THREE.MirroredRepeatWrapping;
    material = new THREE.MeshLambertMaterial({ambient:0xffffff, map : map});
	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = -.01;
	this.object3D.add(mesh);
}

Scene.prototype.loadModels = function()
{
    // Create the model and add it to our sim
	var sb = "/images/SwedishRoyalCastle/";
	var urls = [ sb + "px.jpg", sb + "nx.jpg",
	             sb + "py.jpg", sb + "ny.jpg",
	             sb + "pz.jpg", sb + "nz.jpg" ];

	var textureCube = THREE.ImageUtils.loadTextureCube( urls );
	//textureCube = null;
	
	var camaroMaterials = {

			body: new THREE.MeshLambertMaterial( { color: 0xff6600, envMap: textureCube, combine: THREE.MixOperation, reflectivity: 0.3 } ),
			chrome: new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: textureCube } ),
			darkchrome: new THREE.MeshLambertMaterial( { color: 0x444444, envMap: textureCube } ),
			glass: new THREE.MeshBasicMaterial( { color: 0x223344, envMap: textureCube, opacity: 0.25, combine: THREE.MixOperation, reflectivity: 0.25, transparent: true } ),
			tire: new THREE.MeshLambertMaterial( { color: 0x050505 } ),
			interior: new THREE.MeshPhongMaterial( { color: 0x050505, shininess: 20 } ),
			black: new THREE.MeshLambertMaterial( { color: 0x000000 } )

		}

	var materials = [];
	materials.push(camaroMaterials.body); // car body
	materials.push(camaroMaterials.chrome); // wheels chrome
	materials.push(camaroMaterials.chrome); // grille chrome
	materials.push(camaroMaterials.darkchrome); // door lines
	materials.push(camaroMaterials.glass); // windshield
	materials.push(camaroMaterials.interior); // interior
	materials.push(camaroMaterials.tire); // tire
	materials.push(camaroMaterials.black); // tireling
	materials.push(camaroMaterials.black); // behind grille
	
	// Model from Turbosquid
	// http://www.turbosquid.com/Search/Artists/dskfnwn
	// http://www.turbosquid.com/FullPreview/Index.cfm/ID/411348
	var model = new Model();
    model.init({ url : "/models/Camaro/CamaroNoUv_bin.js" , materials : materials });
    this.addChild(model);
    
    model.object3D.position.set(6.67, 3, -15.67);
    model.object3D.rotation.y = Math.PI / 12;

	// Model from Turbosquid
    // http://www.turbosquid.com/Search/Artists/JiMDeviL
    // http://www.turbosquid.com/FullPreview/Index.cfm/ID/642678
	var model = new Model();
    model.init({ url : "/models/garbagecan/garbagecan.js" , materials : null, scale:.075 });
    this.addChild(model);
    
    model.object3D.position.set(20, 0, -27);

	materials = [];
	materials.push(
			new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map:THREE.ImageUtils.loadTexture('/models/LampPost/LampPost copy.jpg'), 
		}));
	materials.push(
			new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map:THREE.ImageUtils.loadTexture('/models/LampPost/LampPostBump.jpg'), 
		}));

	// Model from Turbosquid
	// http://www.turbosquid.com/Search/Artists/Ashley-Hornbaker
	// http://www.turbosquid.com/FullPreview/Index.cfm/ID/499750
	var model = new Model();
    model.init({ url : "/models/LampPost/LampPost.js" , materials : materials, scale : .67 });
    this.addChild(model);
    
    model.object3D.position.set(26, 0, -30);
    model.object3D.rotation.y = -Math.PI / 4;
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