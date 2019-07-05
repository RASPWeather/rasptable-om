// taken from: view-source:http://rasp.mrsap.org/viewer/RASPtableGM.js
// use this to resize if the browser changes


function setSize()
{
	var titleBox;
	var zoomBox;
	var scaleBox;
	var sideScaleBox;

	if(document.body.clientWidth !== undefined) {	// IE in various versions
		imgHt  = document.body.clientHeight;
		imgWid = document.body.clientWidth;
	}
	else if(document.documentElement && document.documentElement.clientWidth !== undefined) {
		imgHt  = document.documentElement.clientHeight;
		imgWid = document.documentElement.clientWidth;
	}
	else if(window.innerWidth !== undefined){
		imgHt  = window.innerHeight;
		imgWid = window.innerWidth;
	}
	else {	// FF etc
		imgHt  = document.body.scrollHeight;
		imgWid = document.body.scrollWidth;
	}

	imgWid -= document.getElementById("selectors").offsetWidth; // Subtract width of Selectors

	// Determin whether image is Portrait or Landscape
	if( imgHt > imgWid){
		Format = "Portrait";
	}
	else {
		Format = "Landscape";
	}

	topHeight = imgWid * (1 - 0.82) / 2.0 ;		// Value from NCL header.ncl But much too big (so / 2.0)
	if(Format == "Landscape") {
		botHeight = 0  // Turn off Bottom Scale
		sideWidth = Math.ceil(imgHt * 0.09);   // Value from NCL labelbar.ncl
	}
	else {
		botHeight = imgWid * 0.06;	// Value from NCL labelbar.ncl
		sideWidth = 0; // Turn Off Side Scale
	}

	/* 
	 * See http://www.w3schools.com/Css/pr_class_position.asp
	 * for interaction of position = absolute, fixed, relative, static & inherit
	 */
	titleBox = document.getElementById("theTitle");
	titleBox.style.left     = 0  + "px" ;
	titleBox.style.top      = 0  + "px";
	titleBox.style.height   = topHeight + "px";
	titleBox.style.width    = imgWid + "px";
	titleBox.style.overflow = "hidden" ;
	titleBox.style.position = "relative" ;
	titleBox.style.padding  = 0;

	titleObj.style.left     = 0  + "px" ;
	titleObj.style.top      = 0 + "px";
	titleObj.style.height   = topHeight + "px";
	titleObj.style.position = "relative" ;

	zoomBox = document.getElementById("map");
	zoomBox.style.left     = 0  + "px" ;
	zoomBox.style.top      = 0  + "px";
	// There's some (as yet unindentified) padding, which must be allowed for => 12
	// OLD zoomBox.style.height   = (imgHt - topHeight - botHeight ) + "px";
	// OLD zoomBox.style.width    = (imgWid - sideWidth ) + "px";
	zoomBox.style.height   = (imgHt - topHeight - botHeight - 20) + "px";
	zoomBox.style.width    = (imgWid - sideWidth - 18) + "px";
	zoomBox.style.overflow = "hidden" ;
	zoomBox.style.position = "relative" ;
	zoomBox.style.padding  = 0;

	// side scale
	sideScaleBox = document.getElementById("theSideScale");
	sideScaleBox.style.left     = 0  + "px" ;
	sideScaleBox.style.top      = 0  + "px";
	sideScaleBox.style.width    = sideWidth + "px";
	sideScaleBox.style.width    = sideWidth + "px";
	sideScaleBox.style.overflow = "hidden" ;
	sideScaleBox.style.position = "relative" ;
	sideScaleBox.style.padding  = 0;

	sideScaleObj.style.left     = 0  + "px";
	sideScaleObj.style.top      = 0 + "px";
	sideScaleObj.style.width    = sideWidth  + "px";
	sideScaleObj.style.height   = zoomBox.style.height
	sideScaleObj.style.position = "relative" ;

	// Bottom scale
	scaleBox = document.getElementById("theBotScale");
	scaleBox.style.left     = 0  + "px" ;
	scaleBox.style.top      = 0  + "px";
	scaleBox.style.height   = botHeight + "px";
	scaleBox.style.overflow = "hidden" ;
	scaleBox.style.position = "relative" ;

	scaleObj.style.left     = 0  + "px";
	scaleObj.style.top      = 0 + "px";
	scaleObj.style.height   = botHeight  + "px";
	scaleObj.style.position = "relative" ;
	scaleObj.style.width    = zoomBox.style.width;

	/* Now do the Selectors */

	tblHt = document.getElementById("selectors").offsetHeight;

	// alert("TableHt = " + tblHt + "ImgHt = " + imgHt);
			
	if( tblHt > imgHt ){
		document.getElementById("sParamSelect").size = 1;	// Number of visible Parameters
		document.getElementById("sTimeSelect").size  = 1;	// Number of visible Times
		document.getElementById("sModelDaySelect").size   = 1;	// Number of visible Days
	}

	else { 							// The big Tables will fit
		document.getElementById("sParamSelect").size = 13;
		document.getElementById("sTimeSelect").size  = 8;
		document.getElementById("sModelDaySelect").size   = 8;
	}
	//doChange(null);
}
