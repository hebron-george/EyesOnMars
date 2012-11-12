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
			var MyMaterial = new THREE.MeshBasicMaterial({ map:MyMap, transparent: true, opacity: 0.9 });
			planeArr[i].material = MyMaterial;
			planeArr[i].visible = true;

			// planeArr[i].lookAt(planeArr[i].EOMmarsLocation);

			// app.camera.position = planeArr[i].EOMmarsLocation;


			// app.camera.position.set(
			// 						planeArr[i].marsLocation.x,
			// 						planeArr[i].marsLocation.y,
			// 						planeArr[i].marsLocation.z
			// 						);
			
			// console.log("Adding image to array");
			somebodyStopMe++;
		}
		else
		{
			planeArr[i].visible = false;
			var MyMap = new THREE.Texture();
			planeArr[i].material.map = new THREE.MeshBasicMaterial( {map:MyMap, transparent: true, opacity: 0.9});
			planeArr[i].material.map.needsUpdate = true;
		}






		if (somebodyStopMe >= 50) {break;}

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
		driveSwitching(
			extractSite(ValidSiteDrive[index]),
			extractDrive(ValidSiteDrive[index])
			);
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
