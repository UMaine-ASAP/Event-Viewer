/*
This file will contain the classes used in RV.js aside from ResultsBuilder.
This is mostly for keeping things relatively neat and organized and avoiding having one
giant script file that is cluttered and unreadable.
*/

<<<<<<< HEAD
function createScaleForDates () {
	//ref to the root object
	var rootInstance = this;
	//maps the range from one range of numbers to another
	rootInstance.map_range = function (value, low1, high1, low2, high2) {
    	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}
	//the range of magnitude
	rootInstance.magnitudeRange = []
	//creates the range for opacities
	rootInstance.CreateOpacityRangeForDates = function (dataset) {
=======
/*
This file will contain the classes used in RV.js aside from ResultsBuilder.
This is mostly for keeping things relatively neat and organized and avoiding having one
giant script file that is cluttered and unreadable.
*/

function createScaleForDates () {
	var rdfd = this

	rdfd.map_range = function (value, low1, high1, low2, high2) {
    	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}

	rdfd.magnitudeRange = []

	rdfd.CreateOpacityRangeForDates = function (dataset) {
>>>>>>> e3e3456b3d4c09b54d58091038795ded7f0a44b5
		$.each(dataset, function(index, val) {
			 $.each(val, function(index, arrayToConvert) {
			 	if (arrayToConvert[2].toString().length>16 && arrayToConvert[2].toString().indexOf('.')<6 || arrayToConvert[2].toString().indexOf('E')!=-1) {
			 		arrayToConvert[2] = Math.round(arrayToConvert[2]*10000)/10000
			 	}
<<<<<<< HEAD
				if (typeof rootInstance.magnitudeRange[0] === 'undefined' || rootInstance.magnitudeRange[0]>arrayToConvert[2]) {
					if (arrayToConvert[2]>=-100) {
						rootInstance.magnitudeRange[0] = arrayToConvert[2]
					}
				}
				if (typeof rootInstance.magnitudeRange[1] === 'undefined' || rootInstance.magnitudeRange[1]<arrayToConvert[2]) {
					rootInstance.magnitudeRange[1] = arrayToConvert[2]
=======
				if (typeof rdfd.magnitudeRange[0] === 'undefined' || rdfd.magnitudeRange[0]>arrayToConvert[2]) {
					if (arrayToConvert[2]>=-100) {
						rdfd.magnitudeRange[0] = arrayToConvert[2]
					}
				}
				if (typeof rdfd.magnitudeRange[1] === 'undefined' || rdfd.magnitudeRange[1]<arrayToConvert[2]) {
					rdfd.magnitudeRange[1] = arrayToConvert[2]
>>>>>>> e3e3456b3d4c09b54d58091038795ded7f0a44b5
				}
			 })
		})
	}
<<<<<<< HEAD
=======

>>>>>>> e3e3456b3d4c09b54d58091038795ded7f0a44b5
}

/**************************************************** Swapping **********************************************/
//array that holds the dimensions to be swapped
var toSwap = []

//sets up the functionality for titles to be selected for swapping
function swapability(){
	$('.pTitle').click(function(event) {
		//applies titleselected tot titles
		$(this).addClass('titleSelected')
		$('.sTitle').addClass('possiSwap')
		$('.btitle').addClass('possiSwap')
		//pushes 1 to Swap since this is the first dimension regardless of what it is
		toSwap.push(1)
		//calls a swapcheck
		swapCheck(toSwap)
	})
	$('.sTitle').click(function(event) {
		$(this).addClass('titleSelected')
		$('.pTitle').addClass('possiSwap')
		$('.btitle').addClass('possiSwap')
		toSwap.push(2)
		swapCheck(toSwap)
	})
	$('.bLabel').click(function(event) {
		$(this).parent('.btitle').addClass('titleSelected')
		$('.sTitle').addClass('possiSwap')
		$('.pTitle').addClass('possiSwap')
		toSwap.push(3)
		swapCheck(toSwap)
	})
}

//following function deselects the titles if you click anywhere that isn't the titles
$(document).mouseup(function (e)
{
	//refs to the titles
    var dim1 = $(".pTitle");
    var dim2 = $(".sTitle");
    var dim3 = $(".btitle");

    if (dim1.is(e.target)==false // if the target of the click isn't the dim1...
        && dim1.has(e.target).length === 0 // ... nor a descendant of the dim1
        &&dim2.is(e.target)==false
        && dim2.has(e.target).length === 0
        &&dim3.is(e.target)==false
        && dim3.has(e.target).length === 0) 
    {
    	//remove the selected class and therefore deselect it
        dim1.removeClass('titleSelected')
        dim1.removeClass('possiSwap')
        dim2.removeClass('titleSelected')
        dim2.removeClass('possiSwap')
        dim3.removeClass('titleSelected')
        dim3.removeClass('possiSwap')
        //reset toSwap since you have no selected titles anymore
        toSwap=[]
    }
})

function swapCheck (swapArray) {//takes toSwap
	//checks for more than 1 item in the array, two selected elements
	//otherwise it does nothing
	if(swapArray.length>1){
		//checks if you've selected two of the same dimension
		if (swapArray[0] != swapArray[1]) {
			//the build order is the new order of the dimensions
			var buildOrder = []
			//following pushes the order to the buildorder array
			for (var i = 1; i < 4; i++) {
				if(swapArray[0]==i){
					buildOrder.push(swapArray[1])
				} else if(swapArray[1]==i){
					buildOrder.push(swapArray[0])
				} else {
					buildOrder.push(i)
				}
			}
			//reset the toSwap array after the selection is done
			toSwap=[]
			//instantiates a new swapper class
			var s = new swapper(buildOrder)
		} else {
			//if you have selected two of the same element it deselects all
			$(".pTitle").removeClass('titleSelected')
	        $(".sTitle").removeClass('titleSelected')
	        $(".btitle").removeClass('titleSelected')
	        toSwap=[]
		}
	}
}

function reduceObjectToComponents (obj) {
	console.log(obj)
	var r = this
	//instance variables
	r.keys = []
	r.wholeObjects = []
	//cloned obj
	r.root  = $.extend(true, {}, obj)

	r.dig = function (node) {
		//the node can be any part of the tree at any time
		//checks to make sure it is an object
	    if(typeof node === 'object'){
	    	//checks if the object has keys, makes sure that it's node.start value is undefined
	    	//this is because the object we are searching for has a .start value
	        if(typeof node === 'object' && node instanceof Array == false){
	        	//for each key in the node object, which is possibly (and most likely) another object
	            for(key in node){
	            	//push the key to the keys list
	                r.keys.push(key);
	                //begin another dig from within the dig passing the child node
	                r.dig(node[key]);
	                //pop the last object from the keys array
	                r.keys.pop();
	            }
	        } else {//else it should be the datum array object
	        	//call storeWhole method
	            r.storeWhole(node, r.keys)
	        }
	        //this checks for the end of the recursive voodoo when you pop the last key
	        if(r.keys.length==0){
	        	return r.wholeObjects
	        }
	    }
	}
	//takes a datum object and the path
	r.storeWhole = function (dataObj, path) {

	    var wholeObject = {}
	    //dim1, 2 and 3 represent the path to the object in the tree
	    wholeObject.dimension1 = path[0];
	    wholeObject.dimension2 = path[1];
	    wholeObject.dimension3 = path[2];
	    //adds the dataobj
	    wholeObject.datum = dataObj;

	    //push the object to wholeobjects
	    r.wholeObjects.push(wholeObject)
	}
	//start the dig
	r.dig(obj)
}

//class
function swapper (bldOrder) {

	var sw = this
	//temp instantiates a new reduceObjectToComponents and feeds it a clone of the current dataobject
	var temp = new reduceObjectToComponents(r.returnClonedDataObject())

	//components are are wholeobjects from temp
	var components = temp.wholeObjects
	//an array for the sorted components
	var sortedComponents = []
	//following sorts the components since they do no have the complete array of datum objects when they leave
	//reduceObjectToComponents
	for (var i = 0; i < components.length; i++) {
		//nothing is added initially
		var added = false
		//gives each component a datum array since they can all potentially have more than one
		//datum object, and probably will
		components[i].datumArray = [components[i].datum];
		//deletes the datum now that we have what we want
		delete components[i].datum
		for (var m = 0; m < sortedComponents.length; m++) {
			//if the selected objects paths are the same then their data belongs in the same band
			if(components[i].dimension1==sortedComponents[m].dimension1 &&
				components[i].dimension2==sortedComponents[m].dimension2 &&
				components[i].dimension3==sortedComponents[m].dimension3){
				//something has been added
				added=true
				//pushes the datum to the matching, already sorted, object's datum array
				sortedComponents[m].datumArray.push(components[i].datumArray[0])
			}
		}
		//if something was not added it must be unsorted object
		if(added==false){
			//so add it to the sorted array
			sortedComponents.push(components[i])
		}
	}
	/*
		the following nest function rebuilds the object from the "sorted whole objects"
		into a hierarchical structure like we had originally
	*/

	//rebuilt is the reconstructed object from the following d3.nest function
	var rebuilt = d3.nest()
						.key(function (d) {
							var accessor = 'dimension'+bldOrder[0]
							return d[accessor]
						})
						.key(function (d) {
							var accessor = 'dimension'+bldOrder[1]
							return d[accessor]
						})
						.key(function (d) {
							var accessor = 'dimension'+bldOrder[2]
							return d[accessor]
						})
						.map(sortedComponents)

	//the d3 nest function does not get rid of the whole object at the end
	//we need to whole object replaced with it's datum array to keep with a consistent object model

	$.each(rebuilt, function(k1, v1) {
		 //builds a path
		 var path = []
		 path.push(k1) //push the start of the path
		 $.each(v1, function(k2, v2) {
		 	 path.push(k2) //push the next level
		 	 $.each(v2, function(k3, v3) {
		 	 	 path.push(k3)//push the final level

		 	 	 //sets the object final level to the datum array keeping the object model

		 	 	 rebuilt[path[0]][path[1]][path[2]] = rebuilt[path[0]][path[1]][path[2]][0].datumArray[0]
		 	 	 
		 	 	 //the following pops are so we can traverse the tree successfully, pop off the end to each one
		 	 	 //so we move on to the next
		 	 	 path.pop()
		 	 })
		 	 path.pop()
		 })
		 path.pop()
	})

	//empty the rvcontainer because we'll be adding new panels
	//$('#results_container').children(':not(tb_container)').remove()
	$('.panelRV').remove()
	//instantiate a new ResultsBuilder
	r = new ResultsBuilder([rebuilt])
	//build
	r.build()
}


/*************************************************************** Dragging ************************************************/

/*
	the dragging functions use jqueryui and "buffers" to fill the page with invisible boxes
	that you can drag panels and stacks into. The boxes are in between every panel and stack
	they become visible when you have over them with a dragged object
*/

function universalReorganizer (ds,db) {
	if (ds!=null) {
		var dsIndex = ds.data('stackIndex')
		var immune = ds.parent('.panelRV').data('panelIndex')
		var prevIndex = ds.prev().data()['stackIndex'], postIndex
		if (typeof prevIndex === 'undefined') {
			postIndex = ds.next().data()['stackIndex']

			for (var i = 0; i < $('.panelRV').length; i++) {
				var activePanel = $('.panelRV').eq(i)
				if (activePanel.data('panelIndex')!=immune) {
					var placeBefore = activePanel.children('.stack').eq(postIndex)
					placeBefore.before(activePanel.children('.stack').eq(dsIndex))
				}
			}
			
		} else {
			for (var i = 0; i < $('.panelRV').length; i++) {
				var activePanel = $('.panelRV').eq(i)
				if (activePanel.data('panelIndex')!=immune) {
					var placeAfter = activePanel.children('.stack').eq(prevIndex)
					placeAfter.after(activePanel.children('.stack').eq(dsIndex))
				}
			}
		}
	}

	if (db!=null) {
		var dbIndex = db.data('bandIndex')
		var immune = [db.parent('.stack').data('stackIndex'),db.parent('.stack').parent('.panelRV').data('panelIndex') ]
		var prevIndex = db.prev().data()['bandIndex'], postIndex

		if (typeof prevIndex === 'undefined') {
			postIndex = db.next().data()['bandIndex']

			for (var i = 0; i < $('.stack').length; i++) {
				var activeStack = $('.stack').eq(i)
				if (activeStack.data('stackIndex')!=immune[0]) {
					var placeBefore = activeStack.children('.band').eq(postIndex)
					placeBefore.before(activeStack.children('.band').eq(dbIndex))
				} else if (activeStack.parent('.panelRV').data('panelIndex') != immune[1]) {
					var placeBefore = activeStack.children('.band').eq(postIndex)
					placeBefore.before(activeStack.children('.band').eq(dbIndex))
				}
			}
			
		} else {
			for (var i = 0; i < $('.stack').length; i++) {
				var activeStack = $('.stack').eq(i)
				if (activeStack.data('stackIndex')!=immune[0]) {
					var placeAfter = activeStack.children('.band').eq(prevIndex)
					placeAfter.after(activeStack.children('.band').eq(dbIndex))
				} else if (activeStack.parent('.panelRV').data('panelIndex') != immune[1]) {
					var placeAfter = activeStack.children('.band').eq(prevIndex)
					placeAfter.after(activeStack.children('.band').eq(dbIndex))
				}
			}
		}
	}
}

function panelIndexer () {
	var panelsOnPage = $('.panelRV').length
	var panelIndex = 0
	$('.panelRV').removeData()
	for (var i = 0; i < panelsOnPage; i++) {
		$('.panelRV').eq(i).data('panelIndex', panelIndex)
		panelIndex++
	}
}

function stackIndexer () {
	var panelsOnPage = $('.panelRV').length
	var panelIndex = 0
	$('.stack').removeData()
	for (var i = 0; i < panelsOnPage; i++) {
		var stackIndex = 0
		var currentPanel = $('.panelRV').eq(i)
		var stacksInPanel = currentPanel.children('.stack').length
		for (var u = 0; u < stacksInPanel; u++) {
			var currentStack = currentPanel.children('.stack').eq(u)
			currentStack.data('stackIndex', stackIndex)
			stackIndex++
		}
	}
}

function bandIndexer () {
	var panelsOnPage = $('.panelRV').length
	var panelIndex = 0
	$('.band').removeData()
	for (var i = 0; i < panelsOnPage; i++) {
		var stackIndex = 0
		var currentPanel = $('.panelRV').eq(i)
		panelIndex++
		var stacksInPanel = currentPanel.children('.stack').length
		for (var u = 0; u < stacksInPanel; u++) {
			var currentStack = currentPanel.children('.stack').eq(u)
			stackIndex++
			var bandsInStack = currentStack.children('.band').length
			var bandIndex = 0
			for (var y = 0; y < bandsInStack; y++) {
				var currentBand = currentStack.children('.band').eq(y)
				currentBand.data('bandIndex', bandIndex)
				currentBand.data('uniqueID', panelIndex+' '+stackIndex+' '+bandIndex)
				bandIndex++
			}
		}
	}
}

//populates the page with Buffers
function BufferPopulater () {
	$.each($('.panelRV'), function(index, val) {
		//appends a buffer before this panel
		 $(this).before('<div class="pBuffer">')
		 //if this is the last panel on the page
		 if(index+1==$('.panelRV').length){
		 	//append one after it
		 	$(this).after('<div class="pBuffer">')
		 }
		 var that = $(this)
		 $.each(that.children('.stack'), function(index, val) {
		 	//append buffer before a stack
			 $(this).before('<div class="sBuffer" style="height:'+$(this).height()+'px;">')
			 if(index+1==that.children('.stack').length){
			 	//append buffer after the stack if it's the last stack in that panel
			 	$(this).after('<div class="sBuffer" style="height:'+$(this).height()+'px;">')
		 	}
		 	var those = $(this)
		 	$.each(those.children('.band'), function(index, val) {
		 		 $(this).before('<div class="bBuffer">')
		 		 if (index+1==those.children('.band').length) {
		 		 	$(this).after('<div class="bBuffer">')
		 		 }
		 	})
		})
	})
}

//removes buffers from the page after a drag has been completed
function BufferDepopulater () {
	/*
		when you drag a panel or stack into a buffer to switch them the dragged element
		becomes contained within that buffer, and see we must look for a buffer with children
		then replace the buffer with the dragged element before repopulating the page with 
		new buffers
	*/
	var draggedPanel = null
	var draggedStack = null
	var draggedBand = null
	$.each($('.pBuffer'), function(index, val) {
		 if ($(this).children('.panelRV').length>0) {//if it has a panel inside it
		 	$(this).replaceWith(function() {//replace with child
		 		draggedPanel = $(this).children('.panelRV').eq(0)
		 		return $(this).children('.panelRV').eq(0)
		 	})
		 } else {//else just remove because it's empty
		 	$(this).remove()
		 }
	})
	$.each($('.sBuffer'), function(index, val) {
		 if ($(this).children('.stack').length>0) {
		 	$(this).replaceWith(function() {
		 		draggedStack = $(this).children('.stack').eq(0)
		 		return $(this).children('.stack').eq(0)
		 	})
		 } else {
		 	$(this).remove()
		 }
	})
	$.each($('.bBuffer'), function(index, val) {
		 if ($(this).children('.band').length>0) {
		 	$(this).replaceWith(function() {
		 		draggedBand = $(this).children('.band').eq(0)
		 		return $(this).children('.band').eq(0)
		 	})
		 } else {
		 	$(this).remove()
		 }
	})
	
	if (draggedStack!=null) {
		universalReorganizer(draggedStack)
		stackIndexer()
	} else if (draggedBand!=null) {
		universalReorganizer(null, draggedBand)
		bandIndexer()
	} else if(draggedPanel!=null){
		panelIndexer()
	} else if(draggedBand==null && draggedStack==null && draggedPanel==null){
		bandIndexer()
		stackIndexer()
		panelIndexer()
	}

	//repopulate the newly rearranged page with new buffers
	BufferPopulater()
}

function keepPanelsSeparate () {
	$('br').remove()
	$('.panelRV').eq(0).css('margin-top', '40px');
	$.each($('.panelRV'), function(index, val) {
		 $(this).after('<br />')
	})
}
var animatingBands = [];
function bandDragHandleOnHover () {
	$('.btitle').hover(function() {
		var band = $(this).parent('.band')
		if ($(band).children('.btitle').children('.bGrip').hasClass('hide')) {

			var margeryLeft = $(band).children('.drawData').css('margin-left')
			if (typeof margeryLeft !=='undefined') {
				margeryLeft = margeryLeft.substring(0,margeryLeft.length-2)
				margeryLeft = parseFloat(margeryLeft)-26
				$(band).children('.drawData').animate( {marginLeft:margeryLeft+'px'} )
				$(band).children('.btitle').animate( {'width':$(band).children('.btitle').width()+26}, {
					done:function () {
						$(band).children('.btitle').children('.bGrip').removeClass('hide')
					}
				})
			}
			
		} else {
			$(band).children('.drawData').stop(true, true)
			$(band).children('.btitle').stop(true, true)
		}
		}, function() {
			var band = $(this).parent('.band')
			if ($(band).children('.btitle').children('.bGrip').hasClass('hide')==false) {
				var margeryLeft = $(band).children('.drawData').css('margin-left')
				if (typeof margeryLeft !=='undefined') {
					margeryLeft = margeryLeft.substring(0,margeryLeft.length-2)
					margeryLeft = parseFloat(margeryLeft)+26
					$(band).children('.drawData').animate( {marginLeft:margeryLeft+'px'} )
					$(band).children('.btitle').animate( {'width':$(band).children('.btitle').width()-26}, {
						done:function () {
							$(band).children('.btitle').children('.bGrip').addClass('hide')
						}
					})
				}
			} else {
				$(band).children('.drawData').stop(true, true)
				$(band).children('.btitle').stop(true, true)
			}
	})
}

//function to be called when you need to start or reset dragging functionality
function enableDrag() {
	//buffer depopulater also calls bufferpopulater so we call this to ensure no more than one stack of buffers
	BufferDepopulater()

	keepPanelsSeparate()

	//nothing has been dropped
	var dropped = false
	var dBuffer = null

	/*************** Panels Drag n Drop ****************/
	//refer to jquery ui for API on draggables and droppables
	$('.pGrip').draggable({
		revert: 'invalid',
		helper: function () {
			//the div attached to the mouse when dragging
			return '<div class="dragPanel" style="z-index:1100;"><div class="dpHeader">'
		},
		start:function (e, ui) {
			dropped=false;
			dBuffer=null;
			$.each($('.pBuffer'), function(index, val) {
				 $(this).text('Drop Here').addClass('pDropContainer').css({
				 	'width': $('.panelRV').eq(index).width() == null ? $('.panelRV').eq(index-1).width() : $('.panelRV').eq(index).width(),
				 })
			})
			$('.panelRV').eq(0).css('margin-top', '0px')
			$('.panelRV').addClass('pVolunteer')
			$('.pBuffer').eq(0).css('margin-top', '20px');
		},
		stop:function (e, ui) {
			$('.pBuffer').text('').removeClass('pDropContainer')
			$('.panelRV').removeClass('pVolunteer')
			if(dropped==true){
				//$(this) in this context is the pGrip
				//we append it's parents parent to the dbuffer
				dBuffer.append($(this).parent('.pHeader').parent('.panelRV'))
				//enable drag againt because these functions need to be reset after change
				enableDrag()
			} else {
				keepPanelsSeparate()
			}
			
		}
	})

	$('.pBuffer').droppable({
		accept:'.pGrip',
		hoverClass:'above',
		tolerance:'pointer',
		drop:function (e, ui) {
			dropped = true;
			//set reference to the buffer that has been dropped into
			dBuffer = $(this)
		}
	})
	/*********** stacks drop n drop ***************/

	$('.sGrip').draggable({
		revert: 'invalid',
		helper: function () {
			return '<div class="dragStack" style="z-index:1100;"><div class="dsHeader">'
		},
		start:function (e, ui) {
			dropped=false;
			dBuffer=null;
			var panelParent = $(this).parent('.sHeader').parent('.stack').parent('.panelRV')
			$.each(panelParent.children('.sBuffer'), function(index, val) {
				 //$(this).text('\nD\nR\nO\nP\n')
				 $(this).addClass('sDropContainer').css('height',
				 $(panelParent.children('.stack')).eq(index).height() == null ? $(panelParent.children('.stack')).eq(index-1).height() : $(panelParent.children('.stack')).eq(index).height()
				 )
			})
			$(panelParent.children('.stack')).addClass('sVolunteer')
		},
		stop:function (e, ui) {
			//text('').
			$('.sBuffer').removeClass('sDropContainer')
			$('.sBuffer').css('height', '0px')
			$('.stack').removeClass('sVolunteer')
			if(dropped==true){
				dBuffer.append($(this).parent('.sHeader').parent('.stack'))
				enableDrag()
			}
			
		}
	})

	$('.sBuffer').droppable({
		accept:'.sGrip',
		hoverClass:'above',
		tolerance:'pointer',
		drop:function (e, ui) {
			dropped = true;
			dBuffer = $(this)
		}
	})

	/*********** bands drop n drop ***************/

	$('.bGrip').draggable({
		revert: 'invalid',
		helper: function () {
			return '<div class="dragBand" style="z-index:1100;"><div class="dbtitle">'
		},
		start:function (e, ui) {
			dropped=false;
			dBuffer=null;
			var stackParent = $(this).parent('.btitle').parent('.band').parent('.stack')
			$.each(stackParent.children('.bBuffer'), function(index, val) {
				console.log("Back in business! Now, to execute an exit strategy.")
				 $(this).addClass('bDropContainer')
				 $(this).css('width',
				 	stackParent.children('.band').eq(index).width() == null ? stackParent.children('.band').eq(index-1).width() : stackParent.children('.band').eq(index).width()
				 	)
			})
			$(stackParent.children('.band')).addClass('bVolunteer')
			$(stackParent.children('.bBuffer')).eq(0).addClass('bVolunteer-first')
		},
		stop:function (e, ui) {
			
			$('.bBuffer').removeClass('bDropContainer')
			$('.bBuffer').css('width', '0px')
			$('.band').removeClass('bVolunteer')
			if (dropped==true) {
				dBuffer.append($(this).parent('.btitle').parent('.band'))
				enableDrag()
			}
			
		}
	})

	$('.bBuffer').droppable({
		accept:'.bGrip',
		hoverClass:'above',
		tolerance:'pointer',
		drop:function (e, ui) {
			dropped = true;
			dBuffer = $(this)
		}
	})

	bandDragHandleOnHover()

}

/************************************************** Tool Bar Stuff ***************************************************/

function prepareToolBar () {
<<<<<<< HEAD
	//removes previous toolbars
	$('#toolbar_container').remove();
	$('#toolbarBG').remove();
	
	$('#results_container').prepend('<div id="toolbar_container">');
	$('#results_container').prepend('<div id="toolbarBG">');
	var tb = $('#toolbar_container');
	var tbg = $('#toolbarBG');
=======
	$('#toolbar_container').remove()
	$('#toolbarBG').remove()
	$('#results_container').prepend('<div id="toolbar_container">')
	$('#results_container').prepend('<div id="toolbarBG">')
	var tb = $('#toolbar_container')
	var tbg = $('#toolbarBG')
>>>>>>> e3e3456b3d4c09b54d58091038795ded7f0a44b5
	//tb.append('<button id="toolbar_button">Tool Bar<span><img style="margin-left:5px;" src="images/ddArrow1.png"></span></button>')
	//tb.append('<ul id="tool-list">')
	//var list = $('#tool-list')
	tb.append('<span><button class="tbButton toolBarButton" id="backto">Back To Builder</button></span>')
	tb.append('<span><button class="tbButton toolBarButton" id="TBtoggle">Toggle Time Bar</button></span>')

	$('#toolbar_button').click(function(event) {
		var img = $(this).children('span').children('img')
		img.attr('src') == 'images/ddArrow1.png' ? img.attr('src', 'images/ddArrow2.png') : img.attr('src', 'images/ddArrow1.png');
		if( tb.hasClass('collapsed') ){
			tb.addClass('relaxed') 
			tb.removeClass('collapsed')
			tbg.addClass('relaxed') 
			tbg.removeClass('collapsed')
			tbg.css('height', tb.height()+'px')
		} else {
			tb.addClass('collapsed') 
			tb.removeClass('relaxed')
			tbg.addClass('collapsed') 
			tbg.removeClass('relaxed')
			tbg.css('height', '50px')
		}
	})

	$('#TBtoggle').click(function (event) {
	if ($('#floating').hasClass('hide')) {
	  $('#floating').removeClass('hide')
	  $('#floatingBG').removeClass('hide')
	  $('#timebarBG').removeClass('hide')
	  $('#resetdiv #tbReset').removeClass('hide')
	} else {
	  $('#floating').addClass('hide')
	  $('#floatingBG').addClass('hide')
	  $('#timebarBG').addClass('hide')
	  $('#resetdiv #tbReset').addClass('hide')
	}
	})

	$('#backto').click(function(event) {
		$("#query_container").animate({width: 'toggle'})
		$("#results_container").animate({width: 'toggle',left: '100%'})
		$('#continue').text('Query')
		$('#continue').removeClass('hide')
	})

}

/************************************************** Datum Hover Tool tip ***************************************************/

function initDatumToolTip () {

	$('.datum').mousemove(function(event) {
		var dataz = $(this).prop('__data__'), cross='', offset=10
		var s = new Date(dataz[0]), e = new Date(dataz[1])
		s = s.toString().substring(4,16)
		e = e.toString().substring(4,16)
		if (parseInt( e.substring(7,e.length) ) > parseInt( s.substring(7,s.length) )){
			cross='crossover'
		}

		if ($(window).width()-event.pageX <200) {
			offset = -130
		}
		if (!$('.tip').length) {
			$('body').append('<div class="tip" style="z-index:1000;'+
								'top:'+(event.pageY+10)+'px;left:'+(event.pageX+offset)+'px;position:absolute;">'+
								'<table id="tiptable">'+
								'<tr ><td>Start</td><td> '+s+'</td></tr>'+
								'<tr ><td>End</td><td class="'+cross+'"> '+e+'</td></tr>'+
								'<tr ><td>Magni</td><td> '+dataz[2]+'</td></tr></table>'
								)
		} else {
			$('.tip').css({
				top: event.pageY+10,
				left: event.pageX+offset
			})
		}
	})
	$('.datum').mouseout(function(event) {
		$('.tip').remove()
	})
}

/************************************************** Resizing for bands and stacks for optimal use of screen real estate ***************************************************/


var SizeToScreen = function () {
<<<<<<< HEAD
	//for each panel
    $.each($('.panelRV'), function(index, val) {
    	//ref to current panel
		var p = $(this)
		//get all band widths for the entire panel
		var titleWidths = []
		$.each(p.children('.stack').children('.band'), function(index, val) {
			 //add widths
			 titleWidths.push( $(val).children('.btitle').width() )
		})
		//final, largest, title width
		var finalTitleWidth = r.returnLargestItemInArray(titleWidths)
		//the smallest a stack should ever be
		var baseStackWidth = finalTitleWidth+40+210
		var screenWidth = $(window).width()
		//if the panel has more than one stack
		if (p.children('.stack').length>1) {
			//determines the number of columns, rounds down
			var colNum = Math.floor(screenWidth/baseStackWidth)
			//if it wants to create more columns then there are stacks
			if (colNum>p.children('.stack').length) {
				//just make the number of columsn be the number of stacks
				colNum=p.children('.stack').length
			}
			//the amount of extra space when considering using the base stack width
			var leftovers = screenWidth - (baseStackWidth * colNum)
			//width of the band's title, can be retrieved in a few ways, also by simply calling $('.btitle').width(), in proper hierarchy of course.
			var BTWidth = p.children('.stack').children('.band').width() - 210
			//new band width = the width of the title for the stack (which are all the same by now), + 210, the min band data area width + 
			// the leftovers divided by the number of columns (so extra space is evenly distributed) - 20, because the stacks need a little breathing room
			var newBandWidth = BTWidth + 210 + (Math.floor(leftovers/colNum)-20)
			//assign new widths
			p.children('.stack').children('.band').css('width', newBandWidth)
			//assign new width to the draw data area, - title width and 10 because it's 10 pixels too wide otherwise
			p.children('.stack').children('.band').children('.drawData').attr('width', newBandWidth-BTWidth-10)
			var timebar = p.children('.stack').children('.timebar')
			//give the stack time bar the same width as the band (+20 because it needed it) - the margin left, which is the band title width
			timebar.css('width', (newBandWidth +20) - parseInt(timebar.css('margin-left').substring(0,4) ))
		} else {
			//if there is only one stack in the panel we just make use of all the left over space and make it as wide as possible
=======
    $.each($('.panelRV'), function(index, val) {
		var p = $(this)
		var titleWidths = []
		$.each(p.children('.stack').children('.band'), function(index, val) {
			 titleWidths.push( $(val).children('.btitle').width() )
		})
		//final title width
		var finalTitleWidth = r.returnLargestItemInArray(titleWidths)
		var baseStackWidth = finalTitleWidth+40+210
		var screenWidth = $(window).width()
		if (p.children('.stack').length>1) {
			var colNum = Math.floor(screenWidth/baseStackWidth)
			if (colNum>p.children('.stack').length) {
				colNum=p.children('.stack').length
			}
			var leftovers = screenWidth - (baseStackWidth * colNum)
			var BTWidth = p.children('.stack').children('.band').width() - 210
			var newBandWidth = BTWidth + 210 + (Math.floor(leftovers/colNum) - 20)
			p.children('.stack').children('.band').css('width', newBandWidth)
			p.children('.stack').children('.band').children('.drawData').attr('width', newBandWidth-BTWidth-10)
			var timebar = p.children('.stack').children('.timebar')
			timebar.css('width', (newBandWidth +20) - parseInt(timebar.css('margin-left').substring(0,4) ))
		} else {
>>>>>>> e3e3456b3d4c09b54d58091038795ded7f0a44b5
			var BTWidth = p.children('.stack').children('.band').width() - 210
			var newBandWidth = screenWidth - 85
			p.children('.stack').children('.band').css('width', newBandWidth)
			p.children('.stack').children('.band').children('.drawData').attr('width', newBandWidth-BTWidth-10)
			var timebar = p.children('.stack').children('.timebar')
			timebar.css('width', (newBandWidth +20) - parseInt(timebar.css('margin-left').substring(0,4) ))
		}
	})
}

/************************************************** For Any Window Resizing Events ***************************************************/

var winWidth = $(window).width()
<<<<<<< HEAD
//first margin left, used for universal time bar related stuff
var ML1 = (winWidth/2)-550;
//also used for time bar stuff, seen below
var ML2 = ML1;
//called on window resize
=======
var ML1 = (winWidth/2)-550
var ML2 = ML1-120
>>>>>>> e3e3456b3d4c09b54d58091038795ded7f0a44b5
$(window).resize(function(event) {
  if ($('.datum').length) {
  	//for positioning the time bar
    winWidth = $(window).width()
<<<<<<< HEAD
    ML1 = (winWidth/2)-550;
    ML2 = ML1;
=======
    ML1 = (winWidth/2)-550
    ML2 = ML1-120
>>>>>>> e3e3456b3d4c09b54d58091038795ded7f0a44b5
    $('#floatingBG').css('margin-left', ML1)
    $('#resetdiv').css('margin-left', ML1)
    $('#floating').css('margin-left', ML2)
    //for resizing stacks and bands
    /* Note: Mini-rebuild method may be useful for this type of feature */
    $('.panelRV').remove()
    r.build()
  }
})

/************************************************** Color System ***************************************************/

<<<<<<< HEAD
//COMING SOON TO A THEATRE NEAR YOU

/************************************************** Layer Manager ***************************************************/

//COMING SOON TO A THEATRE NEAR YOU
=======
//COMING SOON TO A MOVIE THEATRE NEAR YOU

/************************************************** Layer Manager ***************************************************/

//COMING SOON TO A MOVIE THEATRE NEAR YOU
>>>>>>> e3e3456b3d4c09b54d58091038795ded7f0a44b5



