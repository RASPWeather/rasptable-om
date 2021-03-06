// Version 0.4
// Darren Hatcher
// Main JavaScript Build file

	if (bNoSetSize == false ) // disable reset size functions as not needed for CMS working
	{
		document.body.style.overflow = "hidden"; // Disable Scrolling
		window.onresize = function(){setSize();}
		console.log("Using reset size functions.");
	} else {
		document.body.style.overflow = "visible"; // Enable Scrolling
		console.log("Reset size functions disabled.");
	}
	var titleObj = document.getElementById("theTitle");
	var sideScaleObj = document.getElementById("theSideScale");
	var scaleObj = document.getElementById("theBotScale");

    // Build Up Selectors
	var gsSelectedParameter = scDefaultParameter; // to be able to stick to the last used parameter
    
    // Build hours supported for the model for the day
    AddModelPeriods(scDefaultModel,0); // start of first item
    
    // Build parameters, based on default model selected
	var bParamButtonState = true; // true is short, false is full
    AddModelParameters(scDefaultModel, bParamButtonState);

    // Build Days and models in one go
    AddDayAndModelPeriods(scDefaultModel);
    
    // Get the centre
    var aCentre = GetModelCentre(scDefaultModel);
	
    // Create the map
	var map = L.map('map', {
		center: aCentre,
		zoomControl: true,
		zoom: icDefaultZoom
	});
    
    var gSoundingOverlay;
    var gSoundingLayer;
    var gMapControl;
	var gAirfieldLayer; // for airfields 
	var gTPLayer; // for turn points

	if (bAirSpaceEnabled){
		var gAirSpace_A;
		var gAirSpace_C;
		var gAirSpace_D;
		var gAirSpace_E;
		var gAirSpace_G;
		var gAirSpace_X;
	}

	var gfOpacityLevel = 0.5;
	var gfOpacityDelta = 0.1;
	
	BuildMarkerLayers();
	
    BuildSoundingControl(scDefaultModel,"",scDefaultParameterTime);

    // add scale
    L.control.scale().addTo(map);

	// set zoom control position
	map.zoomControl.setPosition(scZoomLocation);
    
	// add attribution text
    AddAttribution(L);
	
	// add water mark
    AddWaterMark (L);

	// add opacity buttons
	var gloPanel = AddOpacityPanel(L);
		
    var gAImageBounds = GetModelCorners(scDefaultModel);
    var sDefaultURL = CreateDefaultURL(); // to get us going

	// Add the image layer to the map
    var lPlotOverlay = L.imageOverlay(sDefaultURL, gAImageBounds,{opacity: gfOpacityLevel}).addTo(map);
    
    // add input handlers ...
	document.getElementById("sTimeSelect").onchange   = UpdateOverlay;
	document.getElementById("sParamSelect").onchange  = doParameterChange;
	document.getElementById("sModelDaySelect").onchange  = doModelDayChange;
	document.getElementById("btnParameterSelect").onclick  = doSwitchParamList;
    
	map.on('click', onMapClick); // left single click
	map.on('contextmenu', onMapRightClick); // right single click

	// default the layer control to expanded so aware what options there are
	gMapControl.expand();
	
	setSize();
	UpdateOverlay( false );
	
	// end of main body
// ---------------------------------------------------------------------------------------
function doModelDayChange()
{
	var sElement = document.getElementById("sModelDaySelect");
	var sText = sElement.options[sElement.selectedIndex].value;
	var sResult = sText.split("+");
 
	console.log("Clicked: "+ sElement.selectedIndex + " " +sText + "...."+sResult[0]+ "="+sResult[1]);

	if ( sText != "None") // i.e. it's not a list box section separator
	{ 
		var sRegion = sResult[0];
		if (sResult[1] == "0")
		{
			var sDay = "";
			var iHourPtr = 0;
		} else{
			var sDay = "+"+sResult[1];
			var iHourPtr = sResult[1];
		}

		// need to reset the time periods in case has more or less ...
		AddModelPeriods(sRegion,iHourPtr);

		// we need to reset the supported parameters as well
		AddModelParameters(sRegion, bParamButtonState);

		var sParameterTimeElement  = document.getElementById("sTimeSelect");
		var sParameterTimeText = sParameterTimeElement.options[sParameterTimeElement.selectedIndex].value;
		
		UpdateOverlay(true);
		
		// recentre as model/region may be different
		var aCentre = GetModelCentre(sRegion);
		
		map.panTo(new L.LatLng(aCentre[0], aCentre[1]));

		oaList = JSON.parse(jcFullSupportedModels);
		for (i = 0; i< oaList.models.length; i++ )
		{
			if ( (oaList.models[i].enabled == true) && (oaList.models[i].name == sRegion) ){
				// enabled and is the right one
				// now go to default zoom
				map.setView(aCentre, oaList.models[i].zoom);
				break;
			}
		}

	}
}
// ---------------------------------------------------------------------------------------
function AddDayAndModelPeriods()
{
	    console.log("---AddDayAndModelPeriods()");
    
	const dayName   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var i = 0;
	var Now = new Date().getTime();	   // Time now - in milliSec(!)
	var mS_Day = 24 * 60 * 60 * 1000;  // mS in a day
	var T = new Date();			       // Instantiate a Date object
    
    oaList = JSON.parse(jcFullSupportedModels);
    console.log("Total elements found for models: "+oaList.models.length);

    // Get the selector
    var selector = document.getElementById("sModelDaySelect");	
    // empty the list
    selector.options.length = 0;
    
    for (i = 0; i< oaList.models.length; i++ )
    {
        // now add the days supported
        if ((oaList.models[i].enabled == true)){
			console.log("Found Model Name: "+oaList.models[i].name);
			// add the days
			var days = oaList.models[i].days;
			console.log("Days found: "+days+" # of days:"+days.length);
			var sDayName = "";
			
			T.setTime(Now);					// Today/right now

			for (j = 0; j< days.length; j++ )
			{
				// now work out the day/date                
				T.setTime( Now+(mS_Day*j) );
				sDayName = dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()] + " - " +oaList.models[i].description;
				
				if (days[j] == "") // is day zero
				{
					var option = new Option(sDayName, oaList.models[i].name + "+0");      
					console.log("Adding: "+sDayName+"|"+oaList.models[i].name + "+0");
				} else 
				{
					console.log("Adding: "+sDayName+"|"+oaList.models[i].name + days[j]);
					var option = new Option(sDayName, oaList.models[i].name + days[j]);      
				}
				
				selector.add(option);
				if (j == 0){ // select or highlight the first day in the list 
					selector.options[j].selected = true;
				}
			}
			selector.add(new Option("--------------------------","None"));
            
        } else {console.log("Skipped Model Name: "+oaList.models[i].name);}
    }
    console.log("---AddDayAndModelPeriods added.");    
}

// ---------------------------------------------------------------------------------------
function BuildSoundingControl(sModel,sDay, sTime)
{
    console.log("---BuildSoundingControl(sModel)");

    if ( gSoundingLayer != undefined ) // has existed previously
    {
        gSoundingLayer.clearLayers( );
    }
    
    if ( gMapControl != undefined )
    {
        map.removeControl(gMapControl);
    }
    if ( gSoundingOverlay != undefined) // has existed previously
    {
        map.removeLayer(gSoundingOverlay);
    }

    // rebuild everything (note we reuse the existing layers for TPs, airfields, airspace etc.)    
    
	// Get the Marker Layer for the default model
	gSoundingLayer = GetSoundingMarkers(L,sModel,sDay, sTime);
	
    // Add any controllable layers like maps and soundings ...
	gMapControl = L.control.layers().addTo(map);   
	
	// Create the layer control, add the layers then add it to the map
	gMapControl.addOverlay(gSoundingLayer, "Sounding/SkewT");
	gMapControl.addOverlay(gAirfieldLayer, "Gliding Sites");
	gMapControl.addOverlay(gTPLayer,       "BGA Turn Points"); 
	
	if (bAirSpaceEnabled){
		if (gAirSpace_A != undefined) { 
			gMapControl.addOverlay(gAirSpace_A,    "Class A"); 
		} else {
			console.log("Airspace A undefined - not added");
		}
		if (gAirSpace_C != undefined) { 
			gMapControl.addOverlay(gAirSpace_C,    "Class C"); 
		} else {
			console.log("Airspace C undefined - not added");
		}
		if (gAirSpace_D != undefined) { 
			gMapControl.addOverlay(gAirSpace_D,    "Class D"); 
		} else {
			console.log("Airspace D undefined - not added");
		}
		if (gAirSpace_E != undefined) { 
			gMapControl.addOverlay(gAirSpace_E,    "Class E"); 
		} else {
			console.log("Airspace E undefined - not added");
		}
		if (gAirSpace_G != undefined) { 
			gMapControl.addOverlay(gAirSpace_G,    "Class G"); 
		} else {
			console.log("Airspace G undefined - not added");
		}
		if (gAirSpace_X != undefined) { 
			gMapControl.addOverlay(gAirSpace_X,    "Class X"); 
		} else {
			console.log("Airspace X undefined - not added");
		}
	}
    console.log("+++BuildSoundingControl(sModel)");
}
// ---------------------------------------------------------------------------------------
function onMapRightClick(e) {
    
    var aLaLo = L.latLng(e.latlng);
    
    console.log("Clicked the map at " + aLaLo.lat + ", "+aLaLo.lng);
    
	var sElement = document.getElementById("sModelDaySelect");
	var sText = sElement.options[sElement.selectedIndex].value;
	var sResult = sText.split("+");
 
	console.log("Clicked: "+ sElement.selectedIndex + " " +sText + "...."+sResult[0]+ "="+sResult[1]);

	if ( sText != "None")
	{ 
		var sRegion = sResult[0];
		if (sResult[1] == "0")
		{
			var sDay = "";
		} else{
			var sDay = sResult[1];
		}
			
		var sParameterElement = document.getElementById("sParamSelect");
		var sParameterText = sParameterElement.options[sParameterElement.selectedIndex].value;
		
		var sParameterTimeElement  = document.getElementById("sTimeSelect");
		var sParameterTimeText = sParameterTimeElement.options[sParameterTimeElement.selectedIndex].value;

		var sFinalParameter = sParameterText;	
		// there are some parameters which have other data - e.g. blwind is blwindspd and blwinddir as the image name and data name are not the same
		switch (sParameterText) {
			case "blwind":
				sFinalParameter = "blwindspd blwinddir";
				break;		
			case "wstar_bsratio":
				sFinalParameter = "wstar bsratio";
				break;		
			case "sfcwind0":
				sFinalParameter = "sfcwind0spd sfcwind0dir";
				break;		
			case "sfcwind":
				sFinalParameter = "sfcwindspd sfcwinddir";
				break;		
			case "bltopwind":
				sFinalParameter = "bltopwindspd bltopwinddir";
				break;		
			case "press1000":
				sFinalParameter = "press1000 press1000wspd press1000wdir";
				break;		
			case "press950":
				sFinalParameter = "press950 press950wspd press950wdir";
				break;		
			case "press850":
				sFinalParameter = "press850 press850wspd press850wdir";
				break;		
			case "press700":
				sFinalParameter = "press700 press700wspd press700wdir";
				break;		
			case "press500":
				sFinalParameter = "press500 press500wspd press500wdir";
				break;		
			case "wind950":
				sFinalParameter = "wind950spd wind950dir";
				break;		
			case "wind850":
				sFinalParameter = "wind850spd wind850dir";
				break;		
			default:
				sFinalParameter = sParameterText;
				break;
		}
		
		var sPlotURL = sForecastServerRoot + "/cgi-bin/get_rasp_blipspot_2.cgi";
		sPlotURL = sPlotURL + "?region=" + sRegion + "&grid=d2&day=" + sDay + "&linfo=1";
		sPlotURL = sPlotURL + "&lat=" + aLaLo.lat + "&lon=" + aLaLo.lng + "&time=" + sParameterTimeText +"lst";     
		sPlotURL = sPlotURL + "&param=" + sFinalParameter; 
		
		var sContent = "<p><img src='http://app.stratus.org.uk/blip/help/app.php?region="+sRegion+"&period="+sDay+"&lat="+aLaLo.lat+"&lon="+aLaLo.lng+"&time="+sParameterTimeText+"&output=img&type="+sFinalParameter+"'>";
		console.log("Popup URL="+sContent);
		
		var popup = L.popup({"minWidth":200}) 
		.setLatLng(aLaLo)
		.setContent(sContent)
		.openOn(map);
	}
}
// ---------------------------------------------------------------------------------------
function onMapClick(e) {
    console.log("Clicked the map at " + e.latlng);
        
    // if single click
	DoClickUpdateOverlay();
}
    
// ---------------------------------------------------------------------------------------
function DoClickUpdateOverlay()
{
	// move selector forward
    var sParameterTimeElement  = document.getElementById("sTimeSelect");
    var sParameterTimeText = sParameterTimeElement.options[sParameterTimeElement.selectedIndex].index;
	
	console.log("Selector "+sParameterTimeElement.length+" "+sParameterTimeElement.selectedIndex);
	
	// if not the last one just increment, otherwise go to the first
	if (sParameterTimeElement.selectedIndex < (sParameterTimeElement.length-1)){
		sParameterTimeElement.selectedIndex = sParameterTimeElement.selectedIndex + 1;
	} else {
		sParameterTimeElement.selectedIndex = 0;
	}
	
	UpdateOverlay(false);	
}
    
// ---------------------------------------------------------------------------------------
function doSwitchParamList()
{
   // change the parameter list shown to short or long
   
   // we need the model name for the right parameters
	var sElement = document.getElementById("sModelDaySelect");
	var sText = sElement.options[sElement.selectedIndex].value;
	var sResult = sText.split("+");
    var sRegion = sResult[0]; // ok, done
	
	// empty the parameter list
	var selector = document.getElementById("sParamSelect");
    selector.options.length = 0;
	
	bParamButtonState = !bParamButtonState;
	AddModelParameters(sRegion, bParamButtonState);
	
	var sButtonElement  = document.getElementById("btnParameterSelect");
	if (bParamButtonState) // short list
	{
		sButtonElement.innerHTML = "Switch to Full Parameter List";
	} else {
		sButtonElement.innerHTML = "Switch to Short Parameter List";		
	}
    
}
// ---------------------------------------------------------------------------------------
function doParameterChange(sModel)
{
    console.log("---doParameterChange");
    UpdateOverlay( false );
	// keep a copy of what was last set
	var sParameterElement = document.getElementById("sParamSelect");
	gsSelectedParameter = sParameterElement.options[sParameterElement.selectedIndex].value
}    
// ---------------------------------------------------------------------------------------
function UpdateOverlay(bUpdateSoundingControl)
{
    console.log("---UpdateOverlay");

	var sElement = document.getElementById("sModelDaySelect");
	var sText = sElement.options[sElement.selectedIndex].value;
	var sResult = sText.split("+");
 
	console.log("Clicked: "+ sElement.selectedIndex + " " +sText + "...."+sResult[0]+ "="+sResult[1]);

    var sRegion = sResult[0];
	if (sResult[1] == "0")
	{
		var sDay = "";
	} else{
		var sDay = "+"+sResult[1];
	}
		
    var sParameterTimeElement  = document.getElementById("sTimeSelect");
    var sParameterTimeText = sParameterTimeElement.options[sParameterTimeElement.selectedIndex].value;

	if (bUpdateSoundingControl) { // only if there is a need to 
		BuildSoundingControl(sRegion, sDay, sParameterTimeText);
	}
	
    // set the image to the value of the various selectors
    var sModelText = sRegion;

    var sDayText = sDay;
    
    var sParameterElement = document.getElementById("sParamSelect");
    var sParameterText = sParameterElement.options[sParameterElement.selectedIndex].value;
    
    var sParameterTimeElement  = document.getElementById("sTimeSelect");
    var sParameterTimeText = sParameterTimeElement.options[sParameterTimeElement.selectedIndex].value;
    
    var sPlotURL = sForecastServerRoot + "/"+sModelText+sDayText+"/FCST/"+sParameterText +".curr."+sParameterTimeText +"lst.d2.body.png";
    console.log ("Body="+sPlotURL);
    
    var sScaleURL = sForecastServerRoot + "/"+sModelText+sDayText+"/FCST/"+sParameterText +".curr."+sParameterTimeText +"lst.d2.side.png";
    console.log("Side="+sScaleURL);

    var sBottomScaleURL = sForecastServerRoot + "/"+sModelText+sDayText+"/FCST/"+sParameterText +".curr."+sParameterTimeText +"lst.d2.foot.png";
    console.log("Bottom="+sScaleURL);
    
    var sTitleURL = sForecastServerRoot + "/"+sModelText+sDayText+"/FCST/"+sParameterText +".curr."+sParameterTimeText +"lst.d2.head.png";
    console.log ("Title="+sTitleURL);
    
    // set bounds
    var gAImageBounds = GetModelCorners(sModelText); //[[49.4383430, -10.7258911], [59.3545303, 2.7919922]];
    lPlotOverlay.setBounds(gAImageBounds);
    
    //update image in overlay
    lPlotOverlay.setUrl(sPlotURL);    

    // repeat for header
    var divTitle = document.getElementById("theTitle"); 
    divTitle.src=sTitleURL;
    divTitle.width = icMapWidth;
    
    // repeat for scale if different
    var divScale= document.getElementById("theSideScale"); 
    divScale.src=sScaleURL;
    //divScale.height = icMapHeight;

    // repeat for scale if different
    var divBottomScale= document.getElementById("theBotScale"); 
    divBottomScale.src=sBottomScaleURL;
    //divScale.height = icMapHeight;

}
// ---------------------------------------------------------------------------------------
function doTimeChange(sModel)
{
    console.log("---doTimeChange");
    
    UpdateOverlay(false);
}
// ---------------------------------------------------------------------------------------
function AddAttribution(oMap)
{
    console.log("---AddAttribution(oMap)");
     
    // Attribution
	oMap.tileLayer(scAttributionOSM, {
    		attribution: scAttribution
		}).addTo(map);

}
// ---------------------------------------------------------------------------------------
function AddScalePanel(oMap)
{
    console.log("---AddScalePanel(oMap)");

    // Add watermark top right
	oMap.Control.ScalePanel = oMap.Control.extend({
    		onAdd: function(map) {
        		var img = oMap.DomUtil.create('img');

        		img.src = scScalePanelDefault ;
        		img.style.width = '55px';

        		return img;
    		},

    		onRemove: function(map) {
        	// Nothing to do here
    		}
	});

	oMap.control.scalepanel = function(opts) {
    		return new oMap.Control.ScalePanel(opts);
	}

	// Set Title Panel
	oMap.control.scalepanel({ position: 'bottomleft' }).addTo(map);
}
// ---------------------------------------------------------------------------------------
function AddWaterMark (oMap)
{
    console.log("---AddWaterMark (oMap)");

    // Add watermark top right
	oMap.Control.Watermark = oMap.Control.extend({
    		onAdd: function(map) {
        		var img = oMap.DomUtil.create('img');

        		img.src = scWatermarkLogoLocation;
        		img.style.width = '160px';

        		return img;
    		},

    		onRemove: function(map) {
        	// Nothing to do here
    		}
	});

	oMap.control.watermark = function(opts) {
    		return new oMap.Control.Watermark(opts);
	}

	// Set Water Mark
	oMap.control.watermark({ position: scWaterMarkLocation }).addTo(map);
}
// ---------------------------------------------------------------------------------------
function AddModelPeriods(sModel,iPeriod) // hours selector with iPeriod as the day outwards
{
    console.log("---AddModelPeriods for: "+sModel);
    var i = 0;
    
    oaList = JSON.parse(jcFullSupportedModels);
    
    // get the selector to fill up
    var time = document.getElementById("sTimeSelect");
	
	// Clear any there so can reset to the right number
	document.getElementById("sTimeSelect").options.length = 0;
	 
    for (i = 0; i< oaList.models.length; i++ )
    {
        if ( (oaList.models[i].enabled == true) && (oaList.models[i].name == sModel) ){
            console.log("Model Name: "+oaList.models[i].name + " i=" + i + " Period=" + iPeriod);
            console.log("Total hour elements found: "+oaList.models[i].plot_hours[iPeriod].hours+ " | Element count:"+oaList.models[i].plot_hours[iPeriod].hours.length);
            // now add the hours            
            for (j = 0; j< oaList.models[i].plot_hours[iPeriod].hours.length; j++ ) {
				console.log("Adding: "+oaList.models[i].plot_hours[iPeriod].hours[j]);
				
                time.options[j] = new Option(oaList.models[i].plot_hours[iPeriod].hours[j], oaList.models[i].plot_hours[iPeriod].hours[j]);
                
				if (time.options[j].value == scDefaultParameterTime){ // select or highlight the first day in the list 
                    time.options[j].selected = true;
                }
            }
			break; // no needed to continue
        } else { console.log("Skipping Model Name: "+oaList.models[i].name);}
    }

    console.log("---Model hour/periods added.");    
}
// ---------------------------------------------------------------------------------------
function GetModelCentre(sModel)
{
    console.log("---GetModelCentre(sModel)");
    var i = 0;
    
    oaList = JSON.parse(jcFullSupportedModels);
    console.log("Total elements found: "+oaList.models.length);
    
    for (i = 0; i< oaList.models.length; i++ )
    {
        console.log("Model Name: "+oaList.models[i].name);
        
        if (oaList.models[i].name == sModel){
            console.log("Found: "+oaList.models[i].name);
            return oaList.models[i].centre;
        }
    }
    console.log(sModel+ " not found so using centre defaults.");
    var aDefault = [51.0, -1.0];
    
    return aDefault;
}
// ---------------------------------------------------------------------------------------
function AddModelParameters(sModel, bStateFlag)
{
    console.log(">>>AddModelParameters()");
    var i = 0;
	var aNames = []; // used to do a lookup for the text name
	var aPrimary = [];
    
    oaList = JSON.parse(jcFullSupportedModels); // this is the list of models and their settings
    console.log("Total models found: "+oaList.models.length);

    oaParameters = JSON.parse(jcFullSupportedParameters); // this is the full list, whether used by that model or not
    console.log("Total parameters found: "+oaParameters.parameters.length);
	for (j = 0; j< oaParameters.parameters.length; j++ )
	{
		aNames[oaParameters.parameters[j].name] = oaParameters.parameters[j].longname;
		console.log("aNames[oaParameters.parameters[j].name]: "+aNames[oaParameters.parameters[j].name])
		aPrimary[oaParameters.parameters[j].name] = oaParameters.parameters[j].primary;
	}
		
    
    // Get the selector
    var selector = document.getElementById("sParamSelect");

    var iPtr = 0;
	var iShort=0;
    for (i = 0; i< oaList.models.length; i++ )
    {
        console.log("Model Name: "+oaList.models[i].name+ " Enabled = "+oaList.models[i].enabled+ " Button StateFlag:"+bStateFlag+ " Number of parameters: "+oaList.models[i].parameters.length);

        if (oaList.models[i].enabled == true){ // great, we do populate

			if (oaList.models[i].name == sModel) // we only want the model passed in
			{				
				for (j = 0; j< oaList.models[i].parameters.length; j++ )
				{
					console.log("Found: "+oaList.models[i].parameters[j]);						
					// only add depending on the button state flag
					// if the bStateFlag = true it's short list, defined as true in the "primary" field of JSON for the parameter long names
					if (bStateFlag == true)
					{
						if (aPrimary[oaList.models[i].parameters[j]] == true) 
						{
							console.log("Adding to a short list: "+oaList.models[i].parameters[j]+"|"+aNames[oaList.models[i].parameters[j]]);
							selector.options[iShort] = new Option(aNames[oaList.models[i].parameters[j]],oaList.models[i].parameters[j]);                       
							if (selector.options[iShort].value == gsSelectedParameter){ // select or highlight the default
								selector.options[iShort].selected = true;
							}

							selector.options[iShort].style.color = "blue";
							
							iShort++;
						}
					} else { // just add it as we want all the parameters
					
						console.log("Just adding: "+oaList.models[i].parameters[j]+"|"+aNames[oaList.models[i].parameters[j]]);
						selector.options[j] = new Option(aNames[oaList.models[i].parameters[j]],oaList.models[i].parameters[j]);            
						
						if (selector.options[j].value == gsSelectedParameter){ // select or highlight the default
							selector.options[j].selected = true;
						}
						if (oaParameters.parameters[j].primary == true){ // make option blue
							selector.options[j].style.color = "blue";
						}
					}
					
				}
			}
        }
    }
	if (selector.selectedIndex <= 0){ // nothing selected, so set to first item
		selector.options[0].selected = true;
	}

    console.log("<<<Model parameters added.");    
}
function FindLongTextOfParameter(sShortName)
{

	return "";
}
// ---------------------------------------------------------------------------------------
function GetModelCorners(sModel)
{
    console.log("---GetModelCorners(sModel)");
    var i = 0;
    
    oaList = JSON.parse(jcFullSupportedModels);
    console.log("Total elements found: "+oaList.models.length);
    
    for (i = 0; i< oaList.models.length; i++ )
    {
        console.log("Model Name: "+oaList.models[i].name);
        
        if (oaList.models[i].name == sModel){
            console.log("Found: "+oaList.models[i].name);
            // using array of two arrays SW,NE
            var aCorners = [ [oaList.models[i].swcorner[0],oaList.models[i].swcorner[1]], [oaList.models[i].necorner[0],oaList.models[i].necorner[1] ]];
            console.log("Corners: "+aCorners);
            return aCorners ;
        }
    }
    console.log(sModel+ " not found so using defaults.");
    var aDefault = [[49.4383430, -10.7258911], [59.3545303, 2.7919922]];
    
    return aDefault;
}
// ---------------------------------------------------------------------------------------
function CreateDefaultURL()
{
    return sForecastServerRoot + "/"+scDefaultModel+"/FCST/"+scDefaultParameter +".curr."+scDefaultParameterTime +"lst.d2.body.png";
}
// ---------------------------------------------------------------------------------------
function GetSoundingMarkers(L,sModel,sDay, sTime)
{
    console.log("---GetSoundingMarkers(L,sModel)");
    var i = 0;
    var fLat = 0;
    var fLon = 0; 
    var sName = "No Name";
	var sParameter = "sounding";
	var oMarkers = [];
	var iPtr = 0;
	var sClickURL = "empty";
	var sDetails = "empty";
	var sContent = "empty";
    
    var myIcon = L.icon({
        iconUrl: scPathToIcons+'sndmkr.png',
        iconSize: [25, 25],
        iconAnchor: [15, 15],
        popupAnchor: [0, -5]
    });

    oaList = JSON.parse(jcModelSoundings);
    console.log("Total elements found: "+oaList.soundings.length);
	
	var sFront = "<br><img style='width:"+scDefaultSoundingPopupSize+"='px;height:"+scDefaultSoundingPopupSize+"px' width='"+scDefaultSoundingPopupSize+"' height='"+scDefaultSoundingPopupSize+"' src='"+sForecastServerRoot;
	var sBack = "lst.d2.png'></div>";
		
    for (i = 0; i< oaList.soundings.length; i++ )
    {
        console.log("Looking for "+sModel+". Found Model Name: "+oaList.soundings[i].model);
        
       if (oaList.soundings[i].model == sModel){
            console.log("Match Found: "+oaList.soundings[i].model);            
            for (j = 0; j < oaList.soundings[i].location.length; j++ ) {
                fLat = oaList.soundings[i].location[j].centre[0];
                fLon = oaList.soundings[i].location[j].centre[1];
                sName = oaList.soundings[i].location[j].name + " "+(j+1); // this trailing number is used to identify later on for a dynamic popup
				sDetails = oaList.soundings[i].location[j].name+ " at "+oaList.soundings[i].location[j].centre + " ("+sModel+")";
                console.log("Found and adding ...: "+sDetails+sDay);
                // add sounding e.g. -> http://rasp.mrsap.org/UK2/FCST/sounding7.curr.1200lst.d2.png
				sClickURL = sDetails+sFront + "/"+sModel+sDay+"/FCST/"+sParameter+(j+1)+".curr." + sTime + sBack;
				console.log("Adding sounding img:"+sClickURL);
				var sClassName = sParameter +(j+1);
				oMarkers[iPtr] = L.marker([fLat,fLon],{icon: myIcon})
					.bindTooltip(sName)
					.bindPopup(L.popup({maxWidth:scDefaultSoundingPopupSize})
					);

				oMarkers[iPtr].on('popupopen',function(e) { 
					var sElement = document.getElementById("sModelDaySelect");
					var sText = sElement.options[sElement.selectedIndex].value;
					var sResult = sText.split("+");
					var sModel = sResult[0];
					if (sResult[1]=="0"){
						var sDay = ""; // no +X
					}else { 
						var sDay = "+" + sResult[1];
					}

					var sParameterElement = document.getElementById("sParamSelect");
					var sParameterText = sParameterElement.options[sParameterElement.selectedIndex].value;

					var sParameterTimeElement  = document.getElementById("sTimeSelect");
					var sTime = sParameterTimeElement.options[sParameterTimeElement.selectedIndex].value;
					
					var popup = e.target.getPopup();
					var tooltip = e.target.getTooltip();
					var aParam = tooltip._content.split(" "); // trailing number used - bit of a fudge

					var sFront = "<img style='width:"+scDefaultSoundingPopupSize+"='px;height:"+scDefaultSoundingPopupSize+"px' width='"+scDefaultSoundingPopupSize+"' height='"+scDefaultSoundingPopupSize+"' src='"+sForecastServerRoot;
					var sBack = "lst.d2.png'></div>";
					
					var sClickURL = sFront + "/"+sModel+sDay+"/FCST/sounding"+aParam[aParam.length-1]+".curr." + sTime + sBack;

					popup.setContent( sClickURL );				
				});	
				
				iPtr++;
            }
        }
	}
    console.log("+++GetSoundingMarkers(L,sModel)");
	
	return L.layerGroup(oMarkers);
}

// ---------------------------------------------------------------------------------------
function GetAirfieldMarkers(L,sModel,sTime)
{
    console.log("---GetAirfieldMarkers(L,sModel,sTime)");
    var i = 0;
    var fLat = 0;
    var fLon = 0; 
    var sName = "No Name";
	var sParameter = "sounding";
	var oMarkers = [];
	var iPtr = 0;
	var sClickURL = "empty";
	var sDetails = "empty";
	var sContent = "empty";
    
    var myIcon = L.icon({
        iconUrl: scPathToIcons+'gliding-club-inv.png',
        iconSize: [20, 20],
        iconAnchor: [15, 15],
        popupAnchor: [0, -5]
    });

    oaList = JSON.parse(jcAirfieldLayer);
    console.log("Total elements found: "+oaList.airfield.length);
		
    for (i = 0; i< oaList.airfield.length; i++ )
    {
		console.log("Looking for airfield->class->gliding. Found class Name: "+oaList.airfield[i].class);
        
       if (oaList.airfield[i].class == "gliding"){
            console.log("Match Found: "+oaList.airfield[i].class);            
            for (j = 0; j < oaList.airfield[i].location.length; j++ ) {
                fLat = oaList.airfield[i].location[j].centre[0];
                fLon = oaList.airfield[i].location[j].centre[1];
                sName = oaList.airfield[i].location[j].name;
				sDetails = oaList.airfield[i].location[j].location+ " at "+oaList.airfield[i].location[j].centre;
                console.log("Found and adding ...: "+sDetails);
				sClickURL = sDetails;
				console.log("Adding:"+sClickURL);
				oMarkers[iPtr] = L.marker([fLat,fLon],{icon: myIcon})
					.bindTooltip(sName)
					.bindPopup(L.popup({maxWidth:scDefaultSoundingPopupSize})
					.setContent(sClickURL) );
				iPtr++;
            }
        }
	}
    console.log("+++GetAirfieldMarkers(L,sModel,sTime)");
	
	return L.layerGroup(oMarkers);

}
// ---------------------------------------------------------------------------------------
function RemoveAirfieldMarkers(oMarkers)
{
    console.log("---RemoveAirfieldMarkers(oMarkers)");
    for (j = 0; j < oMarkers.length; j++ ) {
        console.log("Removing ..."+oMarkers[j]);
        oMarkers[j].remove();
    }
    console.log("+++RemoveAirfieldMarkers(oMarkers)");
 
}    
// ---------------------------------------------------------------------------------------
function RemoveMarkers(oMarkers)
{
    console.log("---RemoveMarkers(oMarkers)");
    for (j = 0; j < oMarkers.length; j++ ) {
        console.log("Removing ..."+oMarkers[j]);
        oMarkers[j].remove();
    }
    console.log("+++RemoveMarkers(oMarkers)");
 
}    
// ---------------------------------------------------------------------------------------
function AddOpacityPanel()
{
    console.log("---AddOpacityPanel()");

	L.Control.OpacityPanel = L.Control.extend({
                    
    		onAdd: function(map) {
        		var infopanel = L.DomUtil.create('div','opacitypanel');
				// set the button icons and div areas
				sText = "<div id='opacitypanelup' align='right'><button title= 'Increase Opacity' onclick=OpacityUp(); style='align=center; width: 50px; height: 38px;'><img src='higherOpacity.png'></button></div>"; 
				sText = sText + "<div id='opacitypaneldn' align='right'><button title= 'Decrease Opacity' onclick=OpacityDn(); style='align=center; width: 50px; height: 38px;'><img src='lowerOpacity.png'></button></div>"; 
        		infopanel.innerHTML = sText;
        		infopanel.style.width = '100px';
        		infopanel.style.height = '80px';

				infopanel.onclick = function( ev ){
					console.log("infopanel.onclick = function() - stop cascade.");
					L.DomEvent.stopPropagation(ev);
				}
				
				return infopanel;
    		},

    		onRemove: function(map) {
        	// Nothing to do here
    		},
    		
			updateOpacity: function (value) {
				lPlotOverlay.setOpacity(value);
			}
    		
	});

    
	var gloPanel = function(opts) {
    		return new L.Control.OpacityPanel(opts);
	}

	// Set Title Panel
	gloPanel({ position: scOpacityLocation }).addTo(map);
    
    console.log("+++AddOpacityPanel()");
    return gloPanel;

}
// ---------------------------------------------------------------------------------------
function OpacityUp(e)
{
	gfOpacityLevel = gfOpacityLevel + gfOpacityDelta;

	if (gfOpacityLevel < 1.0) {
		gloPanel().updateOpacity(gfOpacityLevel);
	} else {
		gfOpacityLevel = 1.0; // stop going higher
	}
	
	console.log("Level="+gfOpacityLevel);
}
// ---------------------------------------------------------------------------------------
function OpacityDn(e)
{
	gfOpacityLevel = gfOpacityLevel - gfOpacityDelta;
	if (gfOpacityLevel > 0.0) {
		gloPanel().updateOpacity(gfOpacityLevel);
	} else {
		gfOpacityLevel = 0.0; // stop going lower
	}

	console.log("Level="+gfOpacityLevel);
}
// ---------------------------------------------------------------------------------------
function BuildMarkerLayers()
{	
	// Set the gliding club markers
	gAirfieldLayer = GetAirfieldMarkers(L,scDefaultModel,scDefaultParameterTime); 
	
	// --------------------------------------------------------------------
	// Set the BGA TP markers
	let xhr = new XMLHttpRequest();
	xhr.open('GET', scTPJSONFile);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.responseType = 'json';

	gTPLayer = new L.LayerGroup();
	
	xhr.onload = function() {
		if (xhr.status !== 200) return
		gTPGeoJson = L.geoJson(xhr.response, {
		  style: style,
		  onEachFeature: onEachTPFeature
		}).addTo(gTPLayer);
		console.log("---Added GeoJSON BGA TP elements");
	};		
	xhr.send();	
	
	if (bAirSpaceEnabled){
		// --------------------------------------------------------------------
		// Set the Class A markers
		var sFileName = GetAirspaceFileName("A");	
		if (sFileName != "") // we have a filename to load
		{	
			console.log("Using airspace JSON file of: "+sFileName)
			let xhra = new XMLHttpRequest();
			xhra.open('GET', scCDNURL + sFileName);
			xhra.setRequestHeader('Content-Type', 'application/json');
			xhra.responseType = 'json';

			gAirSpace_A = new L.LayerGroup();
			
			xhra.onload = function() {
				if (xhra.status !== 200) return
				gGeoJsonA = L.geoJson(xhra.response, {
				  style: AirSpaceStyle,
				  onEachFeature: onEachClassFeature
				}).addTo(gAirSpace_A);
				console.log("---Added GeoJSON gAirSpace_A elements");
			};		
			xhra.send();	
		} else { console.log("Airspace A JSON filename empty"); gAirSpace_A = undefined; }
		// --------------------------------------------------------------------
		// Set the Class C markers
		sFileName = GetAirspaceFileName("C");	
		if (sFileName != "") // we have a filename to load
		{	
			let xhrc = new XMLHttpRequest();
			xhrc.open('GET', scCDNURL + sFileName);
			xhrc.setRequestHeader('Content-Type', 'application/json');
			xhrc.responseType = 'json';

			gAirSpace_C = new L.LayerGroup();
			
			xhrc.onload = function() {
				if (xhrc.status !== 200) return
				gGeoJsonC = L.geoJson(xhrc.response, {
				  style: AirSpaceStyle,
				  onEachFeature: onEachClassFeature
				}).addTo(gAirSpace_C);
				console.log("---Added GeoJSON gAirSpace_C elements");
			};		
			xhrc.send();	
		} else { console.log("Airspace C JSON file name empty"); gAirSpace_C = undefined; }
		// --------------------------------------------------------------------
		// Set the Class D markers
		sFileName = GetAirspaceFileName("D");	
		if (sFileName != "") // we have a file name to load
		{	
			let xhrd = new XMLHttpRequest();
			xhrd.open('GET', scCDNURL + sFileName);
			xhrd.setRequestHeader('Content-Type', 'application/json');
			xhrd.responseType = 'json';

			gAirSpace_D = new L.LayerGroup();
			
			xhrd.onload = function() {
				if (xhrd.status !== 200) return
				gGeoJsonD = L.geoJson(xhrd.response, {
				  style: AirSpaceStyle,
				  onEachFeature: onEachClassFeature
				}).addTo(gAirSpace_D);
				console.log("---Added GeoJSON gAirSpace_D elements");
			};		
			xhrd.send();
		} else { console.log("Airspace D JSON file name empty"); gAirSpace_D = undefined; }

		// --------------------------------------------------------------------
		// Set the Class E markers
		sFileName = GetAirspaceFileName("E");	
		if (sFileName != "") // we have a file name to load
		{	
			let xhre = new XMLHttpRequest();
			xhre.open('GET', scCDNURL + 'class_e.json');
			xhre.setRequestHeader('Content-Type', 'application/json');
			xhre.responseType = 'json';

			gAirSpace_E = new L.LayerGroup();
			
			xhre.onload = function() {
				if (xhre.status !== 200) return
				gGeoJsonE = L.geoJson(xhre.response, {
				  style: AirSpaceStyle,
				  onEachFeature: onEachClassFeature
				}).addTo(gAirSpace_E);
				console.log("---Added GeoJSON gAirSpace_E elements");
			};		
			xhre.send();	
		} else { console.log("Airspace E JSON file name empty"); gAirSpace_E = undefined; }
		// --------------------------------------------------------------------
		// Set the Class G markers
		sFileName = GetAirspaceFileName("G");	
		if (sFileName != "") // we have a file name to load
		{	
			let xhrg = new XMLHttpRequest();
			xhrg.open('GET', scCDNURL + 'class_g.json');
			xhrg.setRequestHeader('Content-Type', 'application/json');
			xhrg.responseType = 'json';

			gAirSpace_G = new L.LayerGroup();
			
			xhrg.onload = function() {
				if (xhrg.status !== 200) return
				gGeoJsonG = L.geoJson(xhrg.response, {
				  style: AirSpaceStyle,
				  onEachFeature: onEachClassFeature
				}).addTo(gAirSpace_G);
				console.log("---Added GeoJSON gAirSpace_G elements");
			};		
			xhrg.send();	
		} else { console.log("Airspace G JSON file name empty"); gAirSpace_G = undefined; }

		// --------------------------------------------------------------------
		// Set the Class X markers
		sFileName = GetAirspaceFileName("X");	
		if (sFileName != "") // we have a file name to load
		{			
			let xhrx = new XMLHttpRequest();
			xhrx.open('GET', scCDNURL + 'class_x.json');
			xhrx.setRequestHeader('Content-Type', 'application/json');
			xhrx.responseType = 'json';

			gAirSpace_X = new L.LayerGroup();
			
			xhrx.onload = function() {
				if (xhrx.status !== 200) return
				gGeoJsonX = L.geoJson(xhrx.response, {
				  style: AirSpaceStyle,
				  onEachFeature: onEachClassFeature
				}).addTo(gAirSpace_X);
				console.log("---Added GeoJSON gAirSpace_X elements");
			};		
			xhrx.send();	
		} else { console.log("Airspace X JSON file name empty"); gAirSpace_X = undefined; }
		// --------------------------------------------------------------------
	}
}
// ---------------------------------------------------------------------------------------
function GetAirspaceFileName(sClass)
{
   console.log(">>>GetAirspaceFilename(sClass)");	
   var sResponse = "";
   
	var oaList = JSON.parse(jcAirSpaceFileNameList);
    console.log("Airspace total elements found: "+oaList.airspace.length);

    for (var i = 0; i< oaList.airspace.length; i++ )
    {
		console.log("Looking for class "+sClass+". Found class: "+oaList.airspace[i].name);
        if (sClass == oaList.airspace[i].name) {
			console.log("Match Found: "+oaList.airspace[i].name+ " Filename:"+ oaList.airspace[i].filename);            			
			if (oaList.airspace[i].enabled == true)  {
				console.log("Is enabled: "+oaList.airspace[i].name);      
				sResponse = oaList.airspace[i].filename; // assumes is in there and correct
				break;
			} else {
				// found but disabled
			}
		}
	}

	if (sResponse == "" ){
		console.log("No match found for:"+sClass);
	}
    console.log("<<<GetAirspaceFilename(sClass)");	
	
	return sResponse; // is empty if not found or disabled
}
// ---------------------------------------------------------------------------------------
