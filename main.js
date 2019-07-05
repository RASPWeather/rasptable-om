// Version 0.4
// Darren Hatcher
// Main JavaScript Build file

	document.body.style.overflow = "hidden"; // Disable Scrolling
	window.onresize = function(){setSize();}
	var titleObj = document.getElementById("theTitle");
	var sideScaleObj = document.getElementById("theSideScale");
	var scaleObj = document.getElementById("theBotScale");

    // Build Up Selectors
    
    // Build hours supported for the model for the day
    AddModelPeriods(scDefaultModel);
    
    // Build parameters, based on default model selected
    AddModelParameters(scDefaultModel);

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
    var gWmsLayer;
	var gAirfieldLayer; // for airfields 

	var gfOpacityLevel = 0.5;
	var gfOpacityDelta = 0.1;

    BuildSoundingControl(scDefaultModel,"",scDefaultParameterTime);

	// set zoom control position
	map.zoomControl.setPosition(scZoomLocation);
    
    // add scale
    L.control.scale().addTo(map);

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
    
    UpdateOverlay();

	map.on('click', onMapClick); // left single click
	map.on('contextmenu', onMapRightClick); // right single click

	// default to expanded
	gMapControl.expand();
	
	setSize();
	
// end of main body
// ---------------------------------------------------------------------------------------
function doModelDayChange()
{
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
			var sDay = "+"+sResult[1];
		}
			

		var sParameterTimeElement  = document.getElementById("sTimeSelect");
		var sParameterTimeText = sParameterTimeElement.options[sParameterTimeElement.selectedIndex].value;
		
		BuildSoundingControl(sRegion, sDay, sParameterTimeText);
		
		UpdateOverlay();
		
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
    if ( gWmsLayer != undefined )
    {
        map.removeLayer(gWmsLayer);
    }
    if ( gSoundingOverlay != undefined) // has existed previously
    {
        map.removeLayer(gSoundingOverlay);
    }
	
	if ( gAirfieldLayer != undefined) // has existed previously
	{
		map.removeLayer(gAirfieldLayer);
	}
    // rebuild everything
    

    gWmsLayer = L.tileLayer(sWMSSource, {
        attribution: scMRSAPAttribution,
		center: aCentre,
		zoom: icDefaultZoom,
        maxZoom: 18,
        id: 'osm-bright',
		layers: [sWMSLayerName],
    }).addTo(map);
   
	// Get the Marker Layer for the default model
	gSoundingLayer = GetSoundingMarkers(L,sModel,sDay, sTime);
	
	// Set the gliding club markers
	gAirfieldLayer = GetAirfieldMarkers(L,sModel,sTime);
	
	// set up the sounding layer
	gSoundingOverlay = {
		"Sounding/SkewT": gSoundingLayer,
		"Gliding Sites": gAirfieldLayer
	};		
        
    // Add any controllable layers like maps and soundings ...
	gMapControl = L.control.layers(gSoundingOverlay).addTo(map);   

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
	
	UpdateOverlay();	
}
    
// ---------------------------------------------------------------------------------------
function doSwitchParamList()
{
    alert("doSwitchParamList");
    
    // change the parameter list shown to short or long
}
// ---------------------------------------------------------------------------------------
function doParameterChange(sModel)
{
    console.log("---doParameterChange");
    UpdateOverlay();
}    
// ---------------------------------------------------------------------------------------
function UpdateOverlay()
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
	
	BuildSoundingControl(sRegion, sDay, sParameterTimeText);
	
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
    
    UpdateOverlay();
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
function AddModelPeriods(sModel) // hours selector
{
    console.log("---AddModelPeriods for: "+sModel);
    var i = 0;
    
    oaList = JSON.parse(jcFullSupportedModels);
    
    // get the selector to fill up
    var time = document.getElementById("sTimeSelect");
    
    for (i = 0; i< oaList.models.length; i++ )
    {
        if ( (oaList.models[i].enabled == true) && (oaList.models[i].name == sModel) ){
            console.log("Model Name: "+oaList.models[i].name);
            console.log("Total hour elements found: "+oaList.models[i].hours+ " | Elements:"+oaList.models[i].hours.length);
            // now add the hours            
            for (j = 0; j< oaList.models[i].hours.length; j++ ) {
                time.options[j] = new Option(oaList.models[i].hours[j], oaList.models[i].hours[j]);
                if (time.options[j].value == scDefaultParameterTime){ // select or highlight the first day in the list 
                    time.options[j].selected = true;
                }
            }
        }
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
function AddModelParameters(sModel)
{
    console.log("---AddModelParaemters()");
    var i = 0;
    
    oaList = JSON.parse(jcFullSupportedModels);
    console.log("Total models found: "+oaList.models.length);
    
    oaParameters = JSON.parse(jcFullSupportedParameters);
    console.log("Total parameters found: "+oaParameters.parameters.length);

    // Get the selector
    var selector = document.getElementById("sParamSelect");

    var iPtr = 0;
    for (i = 0; i< oaList.models.length; i++ )
    {
        console.log("Model Name: "+oaList.models[i].name+ " Enabled = "+oaList.models[i].enabled);

        if (oaList.models[i].enabled == true){

            // now get parameter Textual Name and meaning
            var parameter_names = "";
            
            for (j = 0; j< oaParameters.parameters.length; j++ )
            {
                console.log("Adding: "+oaParameters.parameters[j].name+"|"+oaParameters.parameters[j].longname);
                selector.options[j] = new Option(oaParameters.parameters[j].longname, oaParameters.parameters[j].name);            
                if (selector.options[j].value == scDefaultParameter){ // select or highlight the default
                    selector.options[j].selected = true;
                }
				if (oaParameters.parameters[j].primary == true){ // make option blue
					selector.options[j].style.color = "blue";
				}
            }
            break; // no need to continue onto other models
        }
    }
    console.log("---Model parameters added.");    
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
        iconUrl: 'sndmkr.png',
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
        iconUrl: 'gliding-club-inv.png',
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
