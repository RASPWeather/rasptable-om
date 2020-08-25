<?php
	$DEBUG = FALSE;
	$sHostName = "rasp.mrsap.org";
	
// ------------------------------------------------------------------------------
    if (isset($_GET['api'])) {
        echo "<br>This application gets a spot forecast and then outputs either the text or an image of the text as  PNG.
        <br>Options:
        <br><code>
		<br>      Output type: 	'output=img' or 'output=text' - default if not set is text
		<br>      Region: 		'region=UK2' - must be set Examples can be UK2 or UK4 or Monday
		<br>      Latitude:  	'lat=52.2' - must be set (negative is South, positive is North)
        <br>      Longitude: 	'lon=-1.0 - must be set (negative is West, positive is East)
        <br>      Parameter: 	'type=stars' - must be set ( other parameters can be comma delimited)
        <br>      Parameter: 	'time=1400' - must be set - do not use colon or other elements
        <br>
        ";
        exit(0);
    }

	/* 
	This application is reliant on a far-end CGI script to provide a response as XML for the point concerned. That perl script is not in this
	repository.
	
	A good XML response looks like:
	
		 <results>
			 <header>
				 <produced>Tue May 28 08:25:33 2019</produced>
			 </header>
			 <wstar>
				 <timeperiods>1300lst </timeperiods>
				 <data>403 </data>
			 </wstar>
			 <stars>
				 <timeperiods>1300lst </timeperiods>
				 <data>2.35 </data>
			 </stars>
		 </results>

		 // Call the function like this for an image:
		 http://app.stratus.org.uk/blip/help/app.php?region=UK2&lat=53.02711917902359&lon=-1.9555664062500002&type=stars&output=img&time=1400&period=1
		
		or for text version
		 http://app.stratus.org.uk/blip/help/app.php?region=UK2&lat=53.02711917902359&lon=-1.9555664062500002&type=stars&output=text&time=1400&period=1
	*/
    date_default_timezone_set('Europe/London');
    
	if (!isset($_GET['output'])) {
		$gOutput = "";
	} else {
		// check what put in - valid is "img" or nothing
		$gOutput  = $_GET['output'];
		if ( $gOutput == "img" ){
			$gOutput = "img";
		} else {
			$gOutput = ""; // set to text as not valid
		}
	}

	// Do we have an lat to use?
	if (isset($_GET['lat'])) {
		$gLat = $_GET['lat'];
	} else {
		echo "\nLatitude not set. Use &lat=52.9 (-90 to 90)"; 
		exit(1);
	}

	// Do we have an lon to use?
	if (isset($_GET['lon'])) {
		$gLon = $_GET['lon'];
		// check it here
	} else {
		echo "\nLongitude not set. Use &lon=-2.1 (-180 to 180)"; 
		exit(1);
	}

	if (isset($_GET['region'])) {
	    $gDay = $_GET['region'];
		// check it here
	} else {
		echo "\nDay not set. Use &region=Monday or &region=UK4"; 
		exit(1);
	}

	// This is the days out so 1=tomorrow, 2=day after tomorrow, etc
	if (isset($_GET['period'])) {
	    $gPeriod = $_GET['period'];
		if ($gPeriod != "") // is set
		{
			// check if "1" to "6" here
			$gPeriod = "%2b".$gPeriod;
		} else {
			$gPeriod = $_GET['period'];
		}
		// check it here
	} else {
		echo "\nPeriod (days in future) not set. Use &period=1 or &period=2"; 
		exit(1);
	}
	
	
	if (isset($_GET['type'])) { // RASP parameter
	    $gParam = $_GET['type']; // get "," 
		$gParam = str_replace(" ", "%20", $gParam); // make sure space is not mangled
		// check it here
	} else {
		echo "\nParameter not set. Use &type=stars or &type=blwinddir"; 
		exit(1);
	}
	// Time period to use - if not set will do full day
	if (isset($_GET['time'])) { // RASP parameter
	    $gTime = "&time=".$_GET['time']."lst";
		// check it here
	} else {
		$gTime = "";
	}
	
    /*
	The usual human-sensible view of this data (legacy version) looks like this:
	
	BLIPSPOT:  28 May 2019
	UK2 d2 gridpt= 175,376
	Lat,Lon= 56.77971,-4.03818
	--------------------
	  VALID.TIME  1200lst 
	  ForecastPd    17.0h 
	--------------------
			  W*      490 
	*/
	
	$gurl_front = "http://".$sHostName."/cgi-bin/get_rasp_blipspot_ng.cgi?region=".$gDay.$gPeriod."&grid=d2&day=0&linfo=3".$gTime; // linfo=3 is XML
	$gurl_back = "&param=".$gParam; 

    $gSource = $gurl_front."&lat=".$gLat."&lon=".$gLon.$gurl_back;
	if ($DEBUG) {echo "\n<code>Using:$gSource</code>\n"; }

    // Now go and get the data --------------------- ---------------------

    $xml = file_get_contents($gSource);
	// check if $xml is empty or small
	// if so output debug message - one parameter XML response should provide abour 450 byts
	if (strlen($xml) < 400)
	{
		NoMatchFound ( $_GET['time'] );
		exit(-1);
	}

	if ($DEBUG) {file_put_contents("results.txt", $xml);} // useful to check raw contents returned 
    if ($DEBUG) {echo "\n<pre>\n$xml\n</pre>\n"; }
	
    $results = simplexml_load_string($xml);
    
    if ($DEBUG) {print("\nresults:\n"); print_r($results);}

	//---------------------------------------------------------------------------------
	// Now output what it should be at the moment

    $time_now = date("H:i:m");

	if ($gOutput == "img"){

		$delta_y = 12;
		$iYSize = $delta_y + ($delta_y/2);

		//firstly count up how many results we have to determine the size of the image
		// we have 4 lines for the header and 2 lines per parameter
		$iLines = 0;
		foreach ( $results->details as $aItem ){		
			foreach ($aItem as $aElement) 
			{
				$iYSize += $delta_y+11;
			}
		}

		$root_x = 1;
		$root_y = 1;
		$top_x = 598;
		$top_y = 68;

		// compute size of image based on number of parameters and times....
		$iWidth = 200;
		$iHeight = $iYSize + (4 * $delta_y); //100;

		header ('Content-type: image/png');
		$im = @imagecreatetruecolor($iWidth, $iHeight)
			  or die('Cannot Initialize new GD image stream');

		$BLACK = imagecolorallocate($im,0,0,0);        
		$WHITE = imagecolorallocate($im,255,255,255);    
		$ROYAL_BLUE = imagecolorallocate($im,065,105,225);
		$RED = imagecolorallocate($im,255,0,0);

		imagefilledrectangle( $im, 0, 0, $iWidth, $iHeight, $WHITE ); // no border
		$current_x = $root_x + 1; //1

		$delat_y = 12;
		$current_y = $root_y;
		imagestring($im, 2, $current_x, $current_y, "Model      : ".$results->header->region, $ROYAL_BLUE);
		$current_y = $current_y + $delta_y;
		imagestring($im, 2, $current_x, $current_y, "Valid      : ".$results->header->mapinfo, $ROYAL_BLUE);
		$current_y = $current_y + $delat_y;
		imagestring($im, 2, $current_x, $current_y, "Grid Loc   : ".$results->header->grid." ".$results->header->gridi.",".$results->header->gridj, $ROYAL_BLUE);
		$current_y = $current_y + $delta_y;
		imagestring($im, 2, $current_x, $current_y, "Lat / Lon  : ".$results->header->lat." ".$results->header->lon, $ROYAL_BLUE);
		$current_y = $current_y + $delta_y + $delta_y;
		
		// move in slightly
		$current_x = $current_x +10;
		
		foreach ( $results->details as $aItem ){		
			// for each parameter pulled ...
			foreach ($aItem as $aElement) 
			{
				// for each value of the parameter ...
				$sLine = "(".$aElement->getName().") ";
				// build minitable

				$aTimePeriods = explode(" ",$aElement->timeperiods);
				// for each value of the parameter ...
				for ($iLoop = 0; $iLoop <sizeof($aTimePeriods); $iLoop++ )
				{
					$sLine .= sprintf("%6s",$aTimePeriods[$iLoop]);
				}
				imagestring($im, 2, $current_x, $current_y, $sLine, $RED);
				$current_y = $current_y + $delta_y;
				
				$sLine = "";
				$aData = explode (" ", $aElement->data);
				for ($iLoop = 0; $iLoop <sizeof($aData); $iLoop++ )
				{
					$sLine .= sprintf("%6s ",$aData[$iLoop]); // " ".$aData[$iLoop]." ";
				}
				imagestring($im, 2, $current_x+60, $current_y, $sLine, $RED);
				$current_y = $current_y + $delta_y;
			}
		}
		
		imagepng($im);
		imagedestroy($im);
		exit(0);
	}
	// else text only
	header('Content-type: text/html');
	echo "<style>
		body {
		  background-color: white;
		}

		table {
		  font-family: arial;
		  font-size: 0.75em;
		  background-color:rgb(204, 255, 255);
		}
		</style>
	";

	$iLines = 1;
	foreach ( $results->details as $aItem ){		
		foreach ($aItem as $aElement) 
		{
			$iLines = $iLines +1;
		}
	}
	if ($DEBUG) {print("\nLines=".$iLines); }
	
	echo "<p>";
	echo "<table frame='box'>";
	echo "<tr><td>Model:</td><td>".$results->header->region."</td></tr>";
	echo "<tr><td>Valid:</td><td>".$results->header->mapinfo."</td></tr>";
	echo "<tr><td>Grid:</td><td>".$results->header->grid." ".$results->header->gridi.",".$results->header->gridj."</td></tr>";
	echo "<tr><td>Lat/Lon:</td><td>".$results->header->lat." ".$results->header->lon."</td></tr>";
	foreach ( $results->details as $aItem ){	
		foreach ($aItem as $aElement) 
		{
			echo "<tr><td>Results (".$aElement->getName().")</td><td>";
			// build minitable
			$aTimePeriods = explode(" ",$aElement->timeperiods);
			echo "<table>";
			echo "<tr>";
			for ($iLoop = 0; $iLoop <sizeof($aTimePeriods); $iLoop++ )
			{
				echo "<td>".$aTimePeriods[$iLoop]."</td>";
			}
			echo "</tr><tr>";
			$aData = explode (" ", $aElement->data);
			for ($iLoop = 0; $iLoop <sizeof($aData); $iLoop++ )
			{
				echo "<td style='color:rgb(255, 0, 0);'>".$aData[$iLoop]."</td>";
			}
			echo "</tr>";
			echo "</table>";
			
		}
	}
	//echo $xml;
	echo "<tr><td>Process Time:</td><td>".$time_now."</td></tr>";
	echo "</table>";
	echo "</p>";

// end main body ------------------------------------------------------------------  
//---------------------------------------------------------------------------------
function DebugMessage ()
{
   header ('Content-type: image/png');
   $im = @imagecreatetruecolor(400, 70)
         or die('Cannot Initialize new GD image stream');
   $BLACK = imagecolorallocate($im,0,0,0);        
   $ROYAL_BLUE = imagecolorallocate($im,065,105,225);
   $WHITE = imagecolorallocate($im,255,255,255);    
   imagefilledrectangle( $im, 1, 1, 398, 68, $WHITE );
   imagestring($im, 4, 75, 25, "RASP period forecast unavailable", $ROYAL_BLUE );
   imagepng($im);
   imagedestroy($im);
}
//---------------------------------------------------------------------------------
function NoMatchFound ( $time )
{
	global $gOutput;

   if ($gOutput =="img") {
	   header ('Content-type: image/png');
	   $im = @imagecreatetruecolor(200, 70)
        	 or die('Cannot Initialize new GD image stream');
	   $BLACK = imagecolorallocate($im,0,0,0);        
	   $ROYAL_BLUE = imagecolorallocate($im,065,105,225);
	   $WHITE = imagecolorallocate($im,255,255,255);    
	   imagefilledrectangle( $im, 1, 1, 198, 68, $WHITE );
	   imagestring($im, 1, 15, 25, "RASP forecast for ".$time." unavailable", $ROYAL_BLUE );
	   imagepng($im);
		imagedestroy($im);
   } else {
	   echo "RASP forecast for ".$time." unavailable.";
   }
}
//---------------------------------------------------------------------------------
?>