<html>
	<head>
		<title>Locations XML</title>
	</head>

	<body>
		<h2>Locations XML Parsing</h2>

		<?
			$filePath = "locations.xml";
			$file = file_get_contents($filePath);
			$count = 1;
			$fileToWrite = "locations.js";
			$fh = fopen($fileToWrite, 'w');
			if ($fh == false || $file == false)
			{
				echo "There was an error opening the file to read or write from!";
			}
			else
			{
				fwrite($fh, "function LocationInfo() {\n");
				fwrite($fh, "\tthis.site = 0;\n");
				fwrite($fh, "\tthis.itemName = 0;\n");
				fwrite($fh, "\tthis.lon = 0;\n");
				fwrite($fh, "\tthis.lat = 0;\n");
				fwrite($fh, "\tthis.rot = 0;\n");
				fwrite($fh, "\tthis.startSol = 0;\n");
				fwrite($fh, "\tthis.endSol = 0;\n");
				fwrite($fh, "\tthis.dateAdded = 0;\n");
				fwrite($fh, "\tthis.arrivalTime = 0;\n");
				fwrite($fh, "\tthis.mapPixelH = 0;\n");
				fwrite($fh, "\tthis.contributor = 0;\n");
				fwrite($fh, "\tthis.drive = 0;\n");
				fwrite($fh, "\tthis.mapPixelV = 0;\n");
				fwrite($fh, "\tthis.x = 0;\n");
				fwrite($fh, "\tthis.y = 0;\n");
				fwrite($fh, "\tthis.z = 0;\n");
				fwrite($fh, "\tthis.images = null;\n");
				fwrite($fh, "}\n\n");


				fwrite($fh, "var SiteLocation = new Array();\n");

				fwrite($fh, "function getLocationDataArray()\n");
				fwrite($fh, "{\n");
				$locations = new SimpleXMLElement($file);

				foreach ($locations as $l)
				{
					fwrite($fh, "\tvar location".$count." = new LocationInfo();\n");
					fwrite($fh, "\tlocation".$count.".itemName = ".$l->itemName.";\n");
					fwrite($fh, "\tlocation".$count.".lon = ".$l->lon.";\n");
					fwrite($fh, "\tlocation".$count.".lat = ".$l->lat.";\n");
					fwrite($fh, "\tlocation".$count.".rot = \"".$l->rot."\";\n");
					fwrite($fh, "\tlocation".$count.".startSol = ".$l->startSol.";\n");
					fwrite($fh, "\tlocation".$count.".endSol = ".$l->endSol.";\n");
					fwrite($fh, "\tlocation".$count.".dateAdded = \"".$l->dateAdded."\";\n");
					fwrite($fh, "\tlocation".$count.".arrivalTime = \"".$l->arrivalTime."\";\n");
					fwrite($fh, "\tlocation".$count.".mapPixelH = ".$l->mapPixelH.";\n");http://www.trancearoundtheworld.com/
					fwrite($fh, "\tlocation".$count.".mapPixelV = ".$l->mapPixelV.";\n");
					fwrite($fh, "\tlocation".$count.".contributor = \"".$l->contributor."\";\n");
					fwrite($fh, "\tlocation".$count.".x = ".$l->x.";\n");
					fwrite($fh, "\tlocation".$count.".y = ".$l->y.";\n");
					fwrite($fh, "\tlocation".$count.".z = ".$l->z.";\n");
					fwrite($fh, "\tif(!SiteLocation[".$l->site."])\n");
					fwrite($fh, "\t{\n");
					fwrite($fh, "\t\tSiteLocation[".$l->site."] = new Array();\n");
					fwrite($fh, "\t\tSiteLocation[".$l->site."][$l->drive] = location".$count.";\n");
					fwrite($fh, "\t}\n");
					fwrite($fh, "\telse\n");
					fwrite($fh, "\t{\n");
					fwrite($fh, "\t\tSiteLocation[".$l->site."][".$l->drive."] = location".$count.";\n");
					fwrite($fh, "\t}\n");
					// fwrite($fh, "\t}\n");
					$count++;
					fwrite($fh, "\n");
				}
				fwrite($fh, "}\n");
				fclose($fh);
			}
		?>
	</body>
</html>