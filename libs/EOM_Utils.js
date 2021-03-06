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
						var MyMaterial = new THREE.MeshBasicMaterial({ map:MyMap, transparent: true, opacity: 0.0 });
					}
					else
					{
						var MyMaterial = new THREE.MeshBasicMaterial({ map:MyMap, transparent: true, opacity: 0.0 });						
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
					planeArr[i].material.map = new THREE.MeshBasicMaterial( {map:MyMap, transparent: true, opacity: 0.0});
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






		if (somebodyStopMe >= 60) {break;}

	}
	// console.log("driveSwitching finished with site: "+desiredSite+" and drive: "+desiredDrive);
	currentSite = desiredSite;
	currentDrive = desiredDrive;

	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 180); // 180 days
	document.cookie = 'site='+ currentSite +'; expires=' + exdate.toUTCString() +'; path=/';
	document.cookie = 'drive='+ currentDrive +'; expires=' + exdate.toUTCString() +'; path=/';

	gapi.plusone.render("gp",{"href":"http://www.eyesonmars.com/?site="+currentSite+"&drive="+currentDrive+"","size":"medium"});

	//Create cookie for current location
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
		fadeInImages();
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
		fadeInImages();
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
		fadeInImages();
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
		fadeInImages();
		return true;
	}
}

function whichStartDrive()
{
	var sorry = null;
	var UrlVarsSite = getUrlVars()["site"];
	var UrlVarsDrive = getUrlVars()["drive"];
	var site = undefined
	var drive = undefined;

	if(cookieSite != "undefined" && cookieDrive != "undefined")
	{
		if (!(-1 == ValidSiteDrive.indexOf(combineSiteDriveNums(cookieSite,cookieDrive))))
		{
			site = cookieSite;
			drive = cookieDrive;
		}
	}

	if (UrlVarsSite && !UrlVarsDrive)
	{
		sorry = "Sorry, URL must also include a drive.";
	}
	else if (!UrlVarsSite && UrlVarsDrive)
	{
		sorry = "Sorry, URL must also include a site.";
	}
	else if (UrlVarsSite && UrlVarsDrive)
	{
		if (-1 == ValidSiteDrive.indexOf(combineSiteDriveNums(UrlVarsSite,UrlVarsDrive)))
		{
			sorry = "Sorry, Site:"+UrlVarsSite+" and Drive:"+UrlVarsDrive+" is not available.";
		}
		else
		{
			site = UrlVarsSite;
			drive = UrlVarsDrive;
		}
	}


	if (site == undefined || drive == undefined)
	{
		site = extractSite( ValidSiteDrive[ValidSiteDrive.length-1] );
		drive = extractDrive( ValidSiteDrive[ValidSiteDrive.length-1]);
	}

	if (sorry != null)
	{
		__alert(sorry);
	}

	driveSwitching(site,drive);
	fadeInImages();
	return this;
}




function whichStartCamera()
{
	var lat = getUrlVars()["vertical"];
	var lon = getUrlVars()["horizontal"];
	if (lat & lon)
	{
		app.controls.lat = parseFloat(lat);
		app.controls.lon = parseFloat(lon);
	}

	return this;
}


var fadeOutID = -1;

function fadeOutImages(buttonCmd)
{
	if(buttonCmd == 'NEXT')
	{
		fadeOutID = window.setInterval(fadeOutNEXT,10);
	}
	else if(buttonCmd == 'PREV')
	{
		fadeOutID = window.setInterval(fadeOutPREV,10);
	}
	else if(buttonCmd == 'NEWEST')
	{
		fadeOutID = window.setInterval(fadeOutNEW,10);
	}
}

/* Goes to the most current site/drive when the circle button is pressed */

function fadeOutNEW()
{
	var newOpacity = planeArr[0].material.opacity - 0.01;

	if(newOpacity <= 0.01)
	{
		var site = extractSite( ValidSiteDrive[ValidSiteDrive.length-1] );
		var drive = extractDrive( ValidSiteDrive[ValidSiteDrive.length-1]);
		driveSwitching(site,drive);
		window.clearInterval(fadeOutID);
		fadeOutID = -1;
		fadeInImages();
	}
	else
	{
		for (var i = 0; i < planeArr.length; i++)
		{
			planeArr[i].material.opacity = newOpacity;
			planeArr[i].material.needsUpdate = true;
		}
	}
}

function fadeOutNEXT()
{
	var newOpacity = planeArr[0].material.opacity - 0.01;

	if(newOpacity <= 0.01)
	{
		gotoNextDrive();
		window.clearInterval(fadeOutID);
		fadeOutID = -1;
	}
	else
	{
		for (var i = 0; i < planeArr.length; i++)
		{
			planeArr[i].material.opacity = newOpacity;
			planeArr[i].material.needsUpdate = true;
		}
	}
}

function fadeOutPREV()
{
	var newOpacity = planeArr[0].material.opacity - 0.01;

	if(newOpacity <= 0.01)
	{
		gotoPrevDrive();
		window.clearInterval(fadeOutID);
		fadeOutID = -1;
	}
	else
	{
		for (var i = 0; i < planeArr.length; i++)
		{
			planeArr[i].material.opacity = newOpacity;
			planeArr[i].material.needsUpdate = true;
		}
	}
}


var fadeInID = -1;

function fadeInImages()
{
	if(fadeOutID != -1)
	{
		window.clearInterval(fadeOutID);
		fadeOutID = -1;
	}

	fadeInID = window.setInterval(fadeIn,10);
}

function fadeIn()
{
	var newOpacity = planeArr[0].material.opacity + 0.005;
	if(newOpacity >= 1)
	{
		window.clearInterval(fadeInID);
		fadeInID = -1;
	}
	else
	{
		for (var i = 0; i < planeArr.length; i++)
		{
			planeArr[i].material.opacity = newOpacity;
			planeArr[i].material.needsUpdate = true;
		}
	}
}

