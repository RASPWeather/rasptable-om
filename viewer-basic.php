<?php

	// check if we have a town in the URL
	if (isset($_GET['mode'])) {
		if ($_GET['mode'] == "normal" ){	
			// skip here and build using CMS
		} else { // do no CMS
			BuildNoCMS();
			exit;
		}
    } else { // default to no CMS
		BuildNoCMS();
		exit;		
	}
	require_once("../../class2.php");

	$BLIP_FORM = BuildMainContent();

	// This bit will cover any content build errors
	if (!$BLIP_FORM)
	{
		header("location:".e_BASE."index.php");
	        exit;
	}
	
	require_once(HEADERF);


	include_once(e_HANDLER.'shortcode_handler.php');
	$shortcodes = $tp -> e_sc -> parse_scbatch(__FILE__);
	$text = $tp->parseTemplate($BLIP_FORM, TRUE, $shortcodes);

	if(trim($text) != "")
	{
		$ns -> tablerender("OpenMaps RASP Viewer", $text, "");
	}

	require_once(FOOTERF);
exit;
// -----------------------------------------------------------------------
function BuildNoCMS()
{
	$s = BuildMainContent();
	echo $s;
	exit;	
}
// -----------------------------------------------------------------------
function ReturnMode( $input )
{
	// Work out what mode we are running in 
	// We support right side controls and top side controls
	switch ( $input ) {
		case "normal":
			return "normal";
			break;
		default:
			return "";
	}
	// should not get to here, but put it in anywayy
	return "top";
} 
// -----------------------------------------------------------------------
function BuildMainContent()
{
	$iTABLEBORDER = 0;
	$FORM = "
	<link rel='stylesheet' href='https://unpkg.com/leaflet@1.5.1/dist/leaflet.css'
   integrity='sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=='
   crossorigin=''/>
   <script src='https://unpkg.com/leaflet@1.5.1/dist/leaflet.js'
   integrity='sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=='
   crossorigin=''></script>

	<style>
		#map {
			width: 600px;
			height: 600px;
		}
		#soundingmap {
			width: 400px;
			height: 400px;
		}
		#img.sounding {
			width: 300px;
			height: 300px;
		}
		select {
		  width: 100%;
		  padding: 0px 0px;
		  border: 1;
		  border-radius: 0px;
		}
		td {
			align: center;
		}
		
	</style>";
	
	$FORM .= "
	
    <noscript>
		<h1 align=center> <font color=red>This page requires JavaScript to be enabled</font></h1>
    </noscript>";
    	
	$FORM .= "
	<table border='0'>
		<tr>
			<td align='left' >
				<a href=\"http://rasp.stratus.org.uk/\">
					<img src='http://rasp.stratus.org.uk/e_themes/rasp_sebes/images/logo1.png' width=102px height=45px alt=\"RASP Home\">	
				</a> 
			</td>
			<td id='imgdata' valign='top' > <!-- Title images goes here -->
				<img id='theTitle' src=''  alt='Parameter Information'>
			</td>
		</tr>

		<!-- next row are selectors then map then side scale-->

		<tr>
			<td valign='top' class='defaulttext' >	<!-- All the Selection Boxes -->
				<div class='defaulttext' id='selectorDiv'>                    
					<table valign='top' class='defaulttext' id='selectors' border=0 cellspacing='0' cellpadding='0'>
						<tr class='defaulttext' > 
							<td>
								<table id='selectors' class='selectors' style=\"width:100%;\">
									<tr>
										<td valign='top' align=center colspan=3 id='sModelRow2' class='defaulttext'>	<!-- Parameter -->
											<select title='Select Parameter' id='sModelDaySelect' size='12' class='defaulttext' >
												<option style='color: red;' value='nope1'>- - Model and day - -</option>
												<!-- Filled in by script -->
											</select>
										</td>
										<td>
											<select title='Select Time' id='sTimeSelect' size=12 class='defaulttext' >
												<option>0700</option>
											</select>
										</td>
									<tr>
								</table>
							</td>
						</tr>	
						<tr valign='top' >	
							<td valign='top' align=center colspan=3 id='sParamRow' class='defaulttext'>	<!-- Parameter -->
								<select title='Select Parameter' id='sParamSelect' size='12' class='defaulttext' >
									<option style='color: red;' value='nope1'>- - - THERMAL PARAMETERS - - -</option>
									<!-- Filled in by script -->
								</select>
							</td>
						</tr>   										
						<tr>
							<td align='left' class='defaulttext'>				
								<img align='center' src='http://rasp.stratus.org.uk/e_images/banners/raspheader.png' width=294px height=32px >
								<p style=\"font-size:10px\">&copy 2019 - @RASPWeather</p>
							</td>
						</tr>
					</table>
				</div> <!-- End selectors div -->
			<td >
				<table id='map-area' class='map-area'>
					<tr>
						<td>
							<div id='map'></div>
						</td>
						<td >
							<div id='SideScale'>
								<img align='left' valign='top' id='theSideScale' src='' alt='Side Scale' >
							</div>
						</td>
					</tr>
					<tr>
						<td >
							<div id='BotScale'>
								<img id='theBotScale' src='' alt='Bottom Scale' >
							</div>
						</td>

					</tr>
				</table>
			</td>
		</tr>
	</table>

	<!-- Include this javascript first -->
    <script src='config.js'></script>

    <script src='airfield_sites.js'></script>

    <script src='setsize.js'></script>
    
    <!-- Include this script last -->
    <script src='main.js'></script>

	";
	return $FORM;
}
// -----------------------------------------------------------------------

?>

