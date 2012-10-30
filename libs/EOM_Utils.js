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
	console.log("driveSwitching called with site: "+desiredSite+" and drive: "+desiredDrive);
	for (var i = 0; i < planeArr.length; i++)
	{
		planeArr[i].visible = false;
		if(planeArr[i].EOMsite == desiredSite && planeArr[i].EOMdrive == desiredDrive)
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
			
			console.log("Adding image to array");
			somebodyStopMe++;
		}
		else
		{
			planeArr[i].visible = false;
			var MyMap = new THREE.Texture();
			planeArr[i].material.map = new THREE.MeshBasicMaterial( {map:MyMap, transparent: true, opacity: 0.9});
			planeArr[i].material.map.needsUpdate = true;
		}

		if (somebodyStopMe >= 30) {break;}

	}
	console.log("driveSwitching finished with site: "+desiredSite+" and drive: "+desiredDrive);
}