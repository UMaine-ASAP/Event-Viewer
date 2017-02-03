

//will be used as an instantiated class
function ResultsBuilder(QueryObject){
	/*
	The root object will now always be referred to as "rb" now
	this is to avoid errors in jquery functions and similar situations
	where "this" may refer to an html element, or perhaps another object;
	also just for clarity.
	*/
	var rb = this;

	//function to check for undefined values at any part of the results building process
	//Note: Untested, might not work. Added because I saw something similar in Billy's Code and seems
	//like a worthwhile feature.
	rb.checkUndefined = function (valueToCheck,typeOfError) {
	if(valueToCheck==="undefined"){
			throw new Error("Error:"+typeOfError+" please requery");
		}
	}

	//as the name implies, returns largest num in an array
	rb.returnLargestItemInArray = function (array) {
		var record = array[0];
		for (var i = 0; i < array.length; i++) {
			if(array[i] > record){
				record=array[i];
			}
		}
		return record;
	}

	rb.sizing =  function () {
	        var amountOfStacks = $(".stack").length;//get the amount of stacks on the page
	        for (var i = 0; i < amountOfStacks; i++) {//loop through stacks
	            var stack = $(".stack").eq(i);//set a current stack reference
	            var stackLength = stack.children('.band').length;//how many bands in stack
	            var timeOffset = 0;//init at 0 for later
	            var widths = [];//init blank for later
	            for (var n = 0; n < stackLength; n++) {//loop through bands
	                var band = stack.children('.band').eq(n);//set reference to the band
	                var bandTitleWidth = band.children('.btitle').width();//width of the title
	                widths.push(bandTitleWidth);//add to an array
	            }
	            var finalBandTitleWidth = rb.returnLargestItemInArray(widths);//gets largest band width
	            // 210 because we multiply the datums values by 2 for visibility, 10 for the padding on the title.
	            var bandWidth = finalBandTitleWidth + 210;
	            timeOffset = finalBandTitleWidth + 15;//margin left for the timebar
	            for (var n = 0; n < stackLength; n++) {
	            	var band = stack.children('.band').eq(n);
	            	//below: sets width for child, adds 10 for padding, css padding doesn't work
	            	band.children('.btitle').attr('style', 'width:'+(finalBandTitleWidth+10)+'px;');
	            	band.attr('style', 'width:'+bandWidth+'px; height:22px;');//sets width & height for bands

	            }
	            //offset for stack timebar and it's height
	            var time = stack.children('.timebar');
	            time.attr('height', '25');
	            time.attr('style', 'margin-left:'+timeOffset+'px;');
	        }
	        //in RV_Classes.js, line 780 as of present.
	        SizeToScreen();
	    }
	//returns datum bar width for given values
	var datumWidth = function (d, xScale) {
		var retVal = null;
		if ( parseInt( d[1].substring(0,4) ) > parseInt( d[0].substring(0,4) )) {
			var greaterYear = ( parseInt( d[1].substring(0,4) ) - parseInt( d[0].substring(0,4) ) ) + 2008;

			retVal = xScale( new Date(greaterYear+"-"+d[1].substring(5,d[1].length) ) ) -  xScale( new Date("2008-"+d[0].substring(5,d[0].length) ) );
		} else {
			retVal = xScale( new Date("2008-"+d[1].substring(5,d[1].length) ) ) -  xScale( new Date("2008-"+d[0].substring(5,d[0].length) ) );
		}
		return retVal > 0 ? retVal : 1;
	}
	//returns datum bar opacity for given values
	var datumOpacity = function (val, theScale) {
		var retVal = theScale.map_range(val,theScale.magnitudeRange[0],theScale.magnitudeRange[1],.1,1);
		return retVal > 0 ? retVal : .1 ;
	}

	//following method uses jquery to simulate d3 functionality because it was easier.
	rb.applyData = function (dataset) {
		//make a new createScaleForDates
		var scale = new createScaleForDates();
		//use create opacity rangefordates
		scale.CreateOpacityRangeForDates(dataset);
		//create a scale
		var xScale = d3.time.scale()
							.domain(dates)
							.rangeRound([0, $('.band').width()-$('.panelRV').children('.stack').children('.band').children('.btitle').width()]);
		//draw data is the svg band
		//we enact the data set on it with .data
		 var sel = d3.selectAll('.drawData')
		 	.data(dataset);

		 //makes the datum bars in the bands
		 sel.each(function (d,i) {
		 	d3.select(this).selectAll("rect")
		 		.data(d)
		 		.enter()
		 		.append("rect")
		 			.attr("x", function (d) {
		 				return xScale( new Date("2008-"+d[0].substring(5,d[0].length)) ) ;
		 			})
		 			.attr("width", function (d) {
		 				return datumWidth(d, xScale);
		 			})
		 			.attr("height", 22)
		 			.attr('style', function (d) {
		 				return 'fill-opacity:'+datumOpacity(d[2],scale)+';';
		 			})
		 			.attr("class", "datum")
		 })

	}

	var returnTicksForWidth = function (width, widthOfTick, padding, maxAmount) {
		//amount of ticks with padding you are able to fit
		var ableToFit = width/(widthOfTick+padding);
		if(ableToFit>maxAmount){
			return 1;
		} else {
			return Math.round( maxAmount/ableToFit );
		}
	}
	//function for applying axises to each stack
	rb.applyAxis = function (givenDates) {
		//remove existing axises
		if($('.axis').length){
			$('.axis').remove();
		}
		//make a scale
		var xScale = d3.time.scale()
							.domain(givenDates)
							.rangeRound([0, $('.band').width()-$('.panelRV').children('.stack').children('.band').children('.btitle').width()]);
		//making formats
		var yearformat = d3.time.format.multi([
						  ["%I %p", function(d) {return d.getHours(); }],
						  ["%b %d", function(d) { return d.getDate() != 1; }],
						  ["%b", function(d) { return true; }]
						]);

		var weekformat = d3.time.format.multi([
						  ["%I %p", function(d) { return d.getHours(); }],
						  ["%b %d", function(d) { return true; }],
						]);

		var dayformat = d3.time.format.multi([
						  ["%I %p", function(d) { return d.getHours(); }],
						  ["%b %d", function(d) { return true}],
						]);

		var hourformat = d3.time.format.multi([
						  ["%H"+":"+"%M", function(d) { return true}],
						  ["%b %d", function(d) { return d.getDate(); }],
						]);
		//the amount of time selected for get time
		var timeDiff = givenDates[1].getTime() - givenDates[0].getTime();

		//months range
		if(timeDiff >14500000000){
		d3.selectAll('.timebar')
					.append('g')
					.attr('class','axis')
					.call(d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(d3.time.months, returnTicksForWidth($('.timebar').width(), 12, 24, 12) )
							.tickFormat(yearformat));
					
		//weeks around 
		 } else if ( timeDiff<14500000000 && timeDiff >6400000000) { 
		 	d3.selectAll('.timebar')
					.append('g')
					.attr('class','axis')
					.call(d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(d3.time.weeks, returnTicksForWidth($('.timebar').width(), 23, 24, 20) )
							.tickFormat(weekformat))
		//weeks narrowed
		 }else if ( timeDiff<6400000000 && timeDiff >2600000000) { 
		 	d3.selectAll('.timebar')
					.append('g')
					.attr('class','axis')
					.call(d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(d3.time.weeks, returnTicksForWidth($('.timebar').width(), 23, 24, 10) )
							.tickFormat(weekformat))
		//days
		 } else if ( timeDiff<2600000000 && timeDiff >1500000000) { 
		 	d3.selectAll('.timebar')
					.append('g')
					.attr('class','axis')
					.call(d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(d3.time.days, returnTicksForWidth($('.timebar').width(), 23, 24, 30) )
							.tickFormat(dayformat))
		//days more narrowed	
		 } else if ( timeDiff<1500000000 && timeDiff >600000000) { 
		 	d3.selectAll('.timebar')
					.append('g')
					.attr('class','axis')
					.call(d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(d3.time.days, returnTicksForWidth($('.timebar').width(), 23, 24, 20) )
							.tickFormat(dayformat))
		//hours
		 } else if (timeDiff <600000000 ) {
			d3.selectAll('.timebar')
					.append('g')
					.attr('class','axis')
					.call(d3.svg.axis()
							.scale(xScale)
							.orient("bottom")
							.ticks(d3.time.hours, returnTicksForWidth($('.timebar').width(), 22, 20, 120) )
							.tickFormat(hourformat));
			extendTicks();
		 } 

		//translate the axis because it was cutting off the Jan label
		$('.axis').attr('transform', 'translate(6,0)')
	}
	//for extending ticks when they get squished together, not currently working with the setup sept 4 2014
	var extendTicks = function () {
		$.each($('.timebar .tick'), function(index, val) {
			 if ($(this).children('text').text().length==6 ) {
			 	$(this).children('line').css('stroke', 'rgb(170,0,0)');
			 	$(this).children('text').attr('y','18').css('stroke', 'rgb(170,0,0)');

			 }
		})
	}

	rb.build = function () {//Here's where the magic happens
		//html templates as JS strings
		var panelTemp = '<div class="panelRV">\n'+
		                    '<div class="pHeader">\n'+
		                       '<div class="pTitle"></div>\n'+
		                        '<div class="pGrip">\n'+
		                            '<img src="images/grip.png" />\n'+
		                        '</div>\n'+
		                    '</div>\n'+
		                '</div>';

	    var stackTemp = '<div class="stack">\n'+
		                    '<div class="sHeader">\n'+
		                        '<div class="sTitle"></div>\n'+
		                        '<div class="sGrip">\n'+
		                            '<img src="images/grip.png">\n'+
		                        '</div>\n'+
		                    '</div>\n'+
		                    '<svg class="timebar"></svg>\n'+
		                '</div>';

	    var bandTemp = '<div class="band">\n'+
		                    '<div class="btitle"></div>\n'+
		                    '<svg class="drawData" height="22"></svg>\n'+
		                '</div>';

		dataObject = {};
		$.each(QueryObject,function(key,val) {
			dataObject = $.extend(true, dataObject, val)
		})
	    var datums = []//used to collect data values for appending to bands in applyData method
    	var panelIndex = 0//to track the panel
    	$('br').remove()
    	$.each(dataObject, function(key, val) {//for panels in window
    		//Switch to this div for integration
    		//TODO: Possibly add the insert point as a parameter to the build function
    		$('#results_container').append(panelTemp)//append template to body
            var panel = $('.panelRV').eq(panelIndex)//make variable reference to the panel you're working on
            panel.children('.pHeader').children('.pTitle').text(rb.keyToLabel(key))//set title
            var stackIndex = 0
            $.each(val, function(key, val) {//for stacks in panel
            	panel.append(stackTemp)//append stack template to panel
                var stack = panel.children('.stack').eq(stackIndex)//make ref to current stack
                var timebar = stack.children('.timebar')//make ref to the stack's timebar
                stack.children('.sHeader').children('.sTitle').text(rb.keyToLabel(key))//set title
                var bandIndex = 0
                var bugTestVal = val
                $.each(val, function(key, val) {//for bands in stack
                	timebar.before(bandTemp)//append band template before timebar
                    var band = stack.children('.band').eq(bandIndex)//set ref to current band
                    band.children('.btitle').html('<span class="bLabel">'+rb.keyToLabel(key)+'</span>'+'<span class="bGrip hide"><img src="images/grip.png"></span>')//set title
                    datums.push(val)//add value for the band into datum array
                    bandIndex++
                })
                stackIndex++
            })
            panelIndex++
    	})
		//everything would be called
		rb.sizing()
		rb.applyData(datums)
		rb.applyAxis(dates)
		enableDrag()
		$('.TBpad').remove()
		$('#results_container').append('<div class="TBpad"style="height:100px;width:100%;">')
		swapability()
		prepareToolBar()
		initDatumToolTip()
	}
	//Alex wrote this for the labeling
	rb.keyToLabel = function(key) {
		var lblArray = key.split('.')
			lblArray = $.map(lblArray,function(el,i) {
				el = el.replace('[','');
				el = el.replace(']','');

				if(el == "Coastal" || el == 'Ocean' || el == "Magnitude" || el == "Depth" || el == "TimeFilter") {
					return "remove";
				} else if(el == "Buoy") {
					el = el + " " + lblArray[i+1];
					lblArray[i+1] = "remove";
					return el;
				}
				return el;
			})

			lblArray = jQuery.grep(lblArray, function(value) {
				return value != "remove";
			});

			return lblArray.join(': ')
	}

	rb.returnClonedDataObject = function () {
		retObject = {};
		$.each(QueryObject,function(key,val) {
			retObject = $.extend(true, retObject, val)
		})
		return retObject
	}
}
var r = new ResultsBuilder()
