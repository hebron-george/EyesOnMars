//EOM_Utils.js


// Gets URL variables
function getUrlVars() {
var vars = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	vars[key] = value;
});
return vars;
}


// Switch between drives by loading and unloading
function driveSwitching(desiredSite, desiredDrive)
{
	planeArrVisible.length = 0;

	var somebodyStopMe = 0;
	// console.log("driveSwitching called with site: "+desiredSite+" and drive: "+desiredDrive);
	for (var i = 0; i < planeArr.length; i++)
	{
		planeArr[i].visible = false;
		if(		(planeArr[i].EOMsite == desiredSite 
				&& 
				planeArr[i].EOMdrive == desiredDrive)
			)
		{
			var MyImage = new Image();
			MyImage.crossOrigin = '';
			MyImage.src = planeArr[i].EOMsrcForImage;
			$(MyImage).data("index", i);
			MyImage.onload = function()
			{
				planeArr[$(this).data("index")].material.map.needsUpdate = true;
			}
			var MyMap = new THREE.Texture( MyImage );

					if ( planeArr[i].instrument == "FHAZ_LEFT_A" 
										||
										planeArr[i].instrument == "FHAZ_RIGHT_A" 
										||
										planeArr[i].instrument == "RHAZ_LEFT_A" 
										||
										planeArr[i].instrument == "RHAZ_RIGHT_A" )
					{
						var MyMaterial = new THREE.MeshBasicMaterial({ map:MyMap, transparent: true, opacity: 1 });
					}
					else
					{
						var MyMaterial = new THREE.MeshBasicMaterial({ map:MyMap, transparent: true, opacity: 1 });						
					}
			
			planeArr[i].material = MyMaterial;
			planeArrVisible[planeArrVisible.length] = planeArr[i];
			planeArr[i].visible = true;

			for (var i_vis = 0; i_vis < planeArrVisible.length; i_vis++)
			{
				if (!(planeArrVisible[i_vis] === planeArr[i]) 
					&& 
					(planeArrVisible[i_vis].position.distanceTo(planeArr[i].position)) < 0.1)
				{
					planeArr[i].visible = false;
					var MyMap = new THREE.Texture();
					planeArr[i].material.map = new THREE.MeshBasicMaterial( {map:MyMap, transparent: true, opacity: 0.9});
					planeArr[i].material.map.needsUpdate = true;					
				}
			}


			somebodyStopMe++;
		}
		else
		{
			planeArr[i].visible = false;
			var MyMap = new THREE.Texture();
			planeArr[i].material.map = new THREE.MeshBasicMaterial( {map:MyMap, transparent: true, opacity: 0.9});
			planeArr[i].material.map.needsUpdate = true;
		}






		if (somebodyStopMe >= 20) {break;}

	}
	// console.log("driveSwitching finished with site: "+desiredSite+" and drive: "+desiredDrive);
	currentSite = desiredSite;
	currentDrive = desiredDrive;

	alert("You are now viewing Site:"+currentSite +" Drive:"+currentDrive);
}


// Create keymap of valid site drives - 
//   Assumes that SiteLocation is already in ascending order
function createValidSiteDriveIndex()
{
	for (var i = 0; i < SiteLocation.length; i++)
	{
		for (var j = 0; j < SiteLocation[i].length; j++)
		{
			if (SiteLocation[i][j])		
			{
				if (SiteLocation[i][j].images != null)
				{
					if (SiteLocation[i][j].images.length > 10)
					{
						// Multiply site by 100000 and add to drive
						// example, site is 2 and drive 837 then
						// 200000 + 837 = 200837
						// to extract site do
						//   Math.floor(200837 / 100000)
						// to extract drive do
						//   200837 - (Math.floor(200837 / 100000) * 100000)
						ValidSiteDrive[ValidSiteDrive.length] = combineSiteDriveNums(i,j);
					}
				}
			}
		}
	}
}


function extractSite(SiteDriveNum)
{
	return Math.floor(SiteDriveNum/100000);
}

function extractDrive(SiteDriveNum)
{
	return SiteDriveNum - (extractSite(SiteDriveNum) * 100000);
}

function combineSiteDriveNums(site, drive)
{
	return parseInt(site * 100000) + parseInt(drive);
}

function gotoNextDrive()
{
	var index = ValidSiteDrive.indexOf(combineSiteDriveNums(currentSite,currentDrive));
	if (index == -1)
	{
		console.log("That is weird, this shouldn't happen.  "
			+"No, really, think about it.  "
			+"How did the currentSite and CurrentDrive get set to some"
			+"thing that doesn't exist in the first place? Hummm....");
		return false;
	}
	index++;
	if (index == ValidSiteDrive.length)
	{
		__alert("There are no more \"Next Drives\"");
		return false;
	}
	else
	{
		myEnded2 = false; 
		myEnded3 = false;
		// myAnimate2();
		driveSwitching(
			extractSite(ValidSiteDrive[index]),
			extractDrive(ValidSiteDrive[index])
			);
		// myAnimate3();
		return true;
	}
}

function gotoPrevDrive()
{
	var index = ValidSiteDrive.indexOf(combineSiteDriveNums(currentSite,currentDrive));
	if (index == -1)
	{
		console.log("That is weird, this shouldn't happen.  "
			+"No, really, think about it.  "
			+"How did the currentSite and CurrentDrive get set to some"
			+"thing that doesn't exist in the first place? Hummm....");
		return false;

	}
	index--;
	if (index == -1)
	{
		__alert("There are no more \"Prev Drives\"");
		return false;
	}
	else
	{
		myEnded2 = false; 
		myEnded3 = false;
		//myAnimate2();
		driveSwitching(
			extractSite(ValidSiteDrive[index]),
			extractDrive(ValidSiteDrive[index])
			);
		return true;
	}
}

function whichStartDrive()
{
	var siteDrive = null;
	var sorry = null;
	var site = getUrlVars()["site"];
	var drive = getUrlVars()["drive"];

		if (site && !drive)
		{
			sorry = "Sorry, URL must also include a drive.";
		}
		else if (!site && drive)
		{
			sorry = "Sorry, URL must also include a site.";
		}
		else if (site && drive)
		{
			if (-1 == ValidSiteDrive.indexOf(combineSiteDriveNums(site,drive)))
			{
				sorry = "Sorry, Site:"+site+" and Drive:"+drive+" is not available.";
				site = undefined;
				drive = undefined;
			}
		}

	if (sorry != null)
	{
		__alert(sorry);
	}


	if(site == undefined || drive == undefined)
	{	// If site is not valid then default to largest site and drive, 
		// therefore the latest
		site = extractSite( ValidSiteDrive[ValidSiteDrive.length-1] );
		drive = extractDrive( ValidSiteDrive[ValidSiteDrive.length-1]);
	}

	driveSwitching(site,drive);
	return this;
}



var myEnded2, myEnded3 = false;


/// Zoom out camera
function zoomOutCamera()
{
    var position, target;

    // app.camera.position.z = 10;

    position = -3.0;
    target = -10.0;
    myTween = new TWEEN.Tween(position).to(target, 30000);

    myTween.onUpdate(function(){
        // alert(position);
        app.camera.position.x = position;
    });

    myTween.onComplete(function() {
    	myEnded = true;
    });

    // myTween.onComplete(bananaphone(position));

    myTween.start(+new Date());
}

function zoomOutCamera2()
{
    var position, target;

    // app.camera.position.z = 10;

    position = { x:0.5};
    target = {x:-10.0};
    myTween2 = new TWEEN.Tween(position).to(target, 10000);
    myTween2.easing(TWEEN.Easing.Sinusoidal.InOut);

    myTween2.onUpdate(function(){
        // alert(position);
        app.camera.position.x = this.x;
    });

    myTween2.onComplete(function() {
    	myEnded2 = true;
    });

    myTween2.chain(myTween3);

    // myTween.onComplete(bananaphone(position));

    myTween2.start(+new Date());
}


function myAnimate2()
{


    if(!myEnded2)
    {
    requestAnimationFrame( myAnimate2);
    }
    myTween2.update(+new Date());
} 


function zoomOutCamera3()
{
    var position, target;

    // app.camera.position.z = 10;

    position = { x:-10.0};
    target = {x:0.5};
    myTween3 = new TWEEN.Tween(position).to(target, 10000);
    myTween3.easing(TWEEN.Easing.Sinusoidal.InOut);

    myTween3.onUpdate(function(){
        // alert(position);
        app.camera.position.x = this.x;
    });

    myTween3.onComplete(function() {
    	myEnded3 = true;
    });

    // myTween.onComplete(bananaphone(position));

    myTween3.start(+new Date());
}


function myAnimate3()
{


    if(!myEnded3)
    {
    requestAnimationFrame( myAnimate3);
    }
    myTween3.update(+new Date());
} 

function bananaphone(pos)
{
	__alert(pos);
}



( function () {

    var lastTime = 0;
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

    for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++ x ) {

        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];

    }

    if ( window.requestAnimationFrame === undefined ) {

        window.requestAnimationFrame = function ( callback, element ) {

            var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
            var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;

        };

    }

    window.cancelAnimationFrame = window.cancelAnimationFrame || function ( id ) { window.clearTimeout( id ) };

                                                                                   
}() );