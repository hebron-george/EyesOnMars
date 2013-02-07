<html>
	<head>
			<title>Xml Parsing Page</title>
	</head>

	<body>
	<h2>XML Parsing</h2>
	<?

		function writeImageToFile($i, $fh, $count)
		{
			if ($i->site == '00000')
				$i->site = '0';
			else
				$i->site = ltrim($i->site, '0');


			if ($i->drive == '00000')
				$i->drive = '0';
			else
				$i->drive = ltrim($i->drive, '0');

			//Replace the 'mars.jpl.nasa.gov' part of the url with 'msl-raws.s3.amazonaws.com'

			$i->urlList = str_replace("mars.jpl.nasa.gov", "msl-raws.s3.amazonaws.com", $i->urlList);
			//Add to Image
			fwrite($fh, "\n\tvar Image".$count." = new ImageInfo();\n");
			fwrite($fh, "\tImage".$count.".itemName = \"".$i->itemName."\";\n");
			fwrite($fh, "\tImage".$count.".site = ".$i->site.";\n");
			fwrite($fh, "\tImage".$count.".drive = ".$i->drive.";\n");
			fwrite($fh, "\tImage".$count.".sol = ".$i->sol.";\n");
			fwrite($fh, "\tImage".$count.".utc = \"".$i->utc."\";\n");
			fwrite($fh, "\tImage".$count.".instrument = \"".$i->instrument."\";\n");
			fwrite($fh, "\tImage".$count.".urlList = \"".$i->urlList."\";\n");
			fwrite($fh, "\tImage".$count.".attitude = new THREE.Quaternion".$i->attitude.";\n");

			if ($i->cameraPosition == "UNK")
			{
				fwrite($fh, "\tImage".$count.".cameraPosition = \"".$i->cameraPosition."\";\n");
			}
			else
			{
				fwrite($fh, "\tImage".$count.".cameraPosition = new THREE.Vector3".$i->cameraPosition.";\n");
			}
			if ($i->cameraVector == "UNK")
			{
				fwrite($fh, "\tImage".$count.".cameraVector = \"".$i->cameraVector."\";\n");
			}
			else
			{
				fwrite($fh, "\tImage".$count.".cameraVector = new THREE.Vector3".$i->cameraVector.";\n");
			}							
			fwrite($fh, "\tImage".$count.".mastAz = \"".$i->mastAz."\";\n");
			fwrite($fh, "\tImage".$count.".mastEl = \"".$i->mastEl."\";\n");
			fwrite($fh, "\tImage".$count.".xyz = new THREE.Vector3".$i->xyz.";\n");

			//Add to SiteLocation
			fwrite($fh, "\n\tif(!SiteLocation[$i->site]){SiteLocation[$i->site] = new Array();}");
			fwrite($fh, "\n\tif(!SiteLocation[$i->site][$i->drive]){SiteLocation[$i->site][$i->drive] = new Array();}");
			fwrite($fh, "\n\tif(!SiteLocation[".$i->site."][".$i->drive."].images)\n");
			fwrite($fh, "\t{\n");
			fwrite($fh, "\t\tSiteLocation[".$i->site."][".$i->drive."].images = new Array();\n");
			fwrite($fh, "\t\tSiteLocation[".$i->site."][".$i->drive."].images[0] = Image".$count.";\n");
			fwrite($fh, "\t}\n");
			fwrite($fh, "\telse\n");
			fwrite($fh, "\t{\n");
			fwrite($fh, "\t\tSiteLocation[".$i->site."][".$i->drive."].images[SiteLocation[".$i->site."][".$i->drive."].images.length] = Image".$count.";\n");
			fwrite($fh, "\t}\n");

		}

		function writeImageObjectDefinition($fh)
		{
			fwrite($fh, "function ImageInfo() {\n");
			fwrite($fh, "\tthis.itemName = 0;\n");
			fwrite($fh, "\tthis.site = 0;\n");
			fwrite($fh, "\tthis.drive = 0;\n");
			fwrite($fh, "\tthis.sol = 0;\n");
			fwrite($fh, "\tthis.utc = 0;\n");
			fwrite($fh, "\tthis.instrument = 0;\n");
			fwrite($fh, "\tthis.urlList = 0;\n");
			fwrite($fh, "\tthis.attitude = 0;\n");
			fwrite($fh, "\tthis.cameraPosition = 0;\n");
			fwrite($fh, "\tthis.cameraVector = 0;\n");
			fwrite($fh, "\tthis.mastAz = 0;\n");
			fwrite($fh, "\tthis.mastEl = 0;\n");
			fwrite($fh, "\tthis.xyz = 0;\n");
			fwrite($fh, "}\n\n");
			fwrite($fh, "function getImageDataArray()\n");
			fwrite($fh, "{\n");				
		}

		echo "The ability to destroy a planet is insignificant next to the power of the force.".'<br />'.'<br />'.'<br />'.'<br />';
		$mostRecentSol = file_get_contents('mostRecentSol.txt');
		$currentMostRecentSol = $mostRecentSol;
		echo "Beginning Sol: $mostRecentSol <br>";
		$filePath = 'http://curiouscat.jpl.nasa.gov/images?sol='.$mostRecentSol.'-now&firstItemIndex=0';
		$file = file_get_contents($filePath);
		$fileToWrite = "images.js";
		$count = 1;

		if ($mostRecentSol == 0)
		{
			$fh = fopen($fileToWrite, 'w');

			if ($fh == false || $file == false)
			{
				echo "There was an error writing to file. I blame Andrew. :(";
				break;
			}
			writeImageObjectDefinition($fh);

			while(true)
			{
				if ($file != false)
				{
					$pattern = '/msl.+/';
					preg_match($pattern, $file, $matches);
					$solPattern = '/sol="(.+)".+firstItemIndex="([0-9]+)".+numItemsReturned="([0-9]+)".+maxItemsPerRequest="([0-9]+)".+/';
					preg_match($solPattern, $matches[0], $solMatches);

					if ($solMatches === false)
					{
						echo "There was an issue parsing some data. The mutant mice are onto us! :(";
						break;
					}
					else
					{
						$currentSol = $solMatches[1];
						$currentFirstItemIndex = intval($solMatches[2]);
						$currentNumItemsReturned = intval($solMatches[3]);
						$currentMaxItemsPerRequest= intval($solMatches[4]);
					}
				
				}
				else
				{
					echo "There was an issue pulling the filez. The robots are coming for us! :(";
				}
				$images = new SimpleXMLElement($file);

				foreach ($images as $i)
				{
						if ($i->sampleType == "full" && $i->site != 'UNK' && $i->drive != 'UNK' && $i->sol != 'UNK' && $i->utc != 'UNK' && $i->instrument != 'UNK' && $i->urlList != 'UNK' && $i->attitude != 'UNK' && $i->cameraPosition != 'UNK' && $i->mastAz != 'UNK' && $i->mastEl != 'UNK' && $i->xyz != 'UNK')
						{
							$mostRecentSol = $i->sol;

							writeImageToFile($i, $fh, $count);

							$count++;							
						}
				
				}

				if ($currentNumItemsReturned < $currentMaxItemsPerRequest)
					break;
				$currentFirstItemIndex += 100;
				$filePath = 'http://curiouscat.jpl.nasa.gov/images?sol='.$currentMostRecentSol.'-now&firstItemIndex='.$currentFirstItemIndex;
				$file = file_get_contents($filePath);
			}


		}
		else
		{
			$file = file_get_contents('images.js');

			$pattern = '/.*var Image(\d+).*/s';
			preg_match($pattern, $file, $matches);
			$count = $matches[count($matches)-1] + 1;

			fclose($fh);
			$fh = fopen($fileToWrite, 'a');

			if ($fh == false)
			{
				echo "There was an error while trying to append to existing images file.";
				break;
			}

			foreach ($images as $i)
			{
				if ($i->sampleType == "full" && $i->site != 'UNK' && $i->drive != 'UNK' && $i->sol != 'UNK' && $i->utc != 'UNK' && $i->instrument != 'UNK' && $i->urlList != 'UNK' && $i->attitude != 'UNK' && $i->cameraPosition != 'UNK' && $i->mastAz != 'UNK' && $i->mastEl != 'UNK' && $i->xyz != 'UNK')
				{
					$mostRecentSol = $i->sol;

					writeImageToFile($i, $fh, $count);

					$count++;							
				}
			}
		}

		fwrite($fh, "}\n");
		fclose($fh);


		$file = "mostRecentSol.txt";
		$fh = fopen($file, 'w');
		fwrite($fh, $mostRecentSol);


		echo "<b>When 900 years old you reach, look as good you will not.".'<br />'.'<br />'.'<br />'.'<br />';
		echo "Finished at time: ". date(DATE_ATOM, time()) ."</b>";

	?>


	</body>
</html>


