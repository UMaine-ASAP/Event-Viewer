
//base dates for when page loads, one year, viewed as an arbitrary year to the user
var dates = [new Date(2007,12,1), new Date(2008,11,31)];

//declaring various spacing/orientation variables
var margin = {top: 10, right: 10, bottom: 100, left: 40},
               margin2 = {top: 430, right: 10, bottom: 20, left: 40},
               width = 960 - margin.left - margin.right,
               height = 500 - margin.top - margin.bottom,
               height2 = 500 - margin2.top - margin2.bottom;

//declaring scales for the axis and brushing
var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]);

//setting up the axis
var xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(d3.time.format("%B"));

//setting up the brush
var brush = d3.svg.brush()
                   .x(x2)
                   .on("brushend", brushed)// event type, function called
                   .on("brushstart", displaySelection)
                   .on("brush", updateSelection)

//appending the time bar container, floating div, and svg(tbar), which contains the uni time bar
d3.select('#results_container').append('div')
                                .attr("id","tb_container")
                              	.append("div")
                                	.attr("id", "floating")
                                  .attr("style","position:fixed; bottom:0;left:0; width:1000px; height:80px; z-index: 2; margin-left:"+ML2+"px;")
                                	.append("svg")
                                   .attr("width", 1000)
                                   .attr("height", 85)
                                   .attr("id","tbar")

//adding floating BG
d3.select("#results_container #tb_container")
	.append("div")
	.attr("id", "floatingBG")
	.attr("style","position:fixed; bottom:0;left:0; width:1100px; height:80px; z-index: 1; margin-left:"+ML1+"px; background-color:#D4D4D4; opacity:1;")

//time bar and clip path aka selection bar
d3.select("#tbar")
  .append("defs")
  .html('<linearGradient id="lgrad" x1="0%" y1="50%" x2="100%" y2="50%" >' +
  '<stop offset="0%" style="stop-color:rgb(171,36,48);stop-opacity:1" />'+
  '<stop offset="25%" style="stop-color:rgb(128,27,35);stop-opacity:1" />'+
  '<stop offset="50%" style="stop-color:rgb(191,40,53);stop-opacity:1" />'+
  '<stop offset="75%" style="stop-color:rgb(128,27,35);stop-opacity:1" />'+
  '<stop offset="100%" style="stop-color:rgb(171,36,48);stop-opacity:1" />'+
  '</linearGradient>')
  .append("clipPath")
     .attr("id", "clip")

//context is where the axises, background and selection tools are
var context = d3.select("#tbar").append("g")
   .attr("class", "context")
   .attr("transform", "translate(" + 50 + "," + 0 + ")")

//reset dive is where the reset button is
d3.select('#tb_container')
  .append('div')
    .attr('id','resetdiv')
    .attr("style","position:fixed; bottom:0;left:0; width:1400px; height:80px; z-index: 1; margin-left:"+ML1+"px;")
  .append('button')
    .attr('class', 'tbButton')
    .attr('id', 'tbReset')
    .attr('style', 'width:45px; margin-left:1030px; margin-top:20px; z-index:5;')
    .html('Reset')

//this functions will init the time bar, we essentially have this because the example we took from had something similar
//and we wanted to maintain the same structure.
function initUniTimebar() {

//set the domain
 x2.domain(dates);

//the axis
 context.append("g")
     .attr("class", "xaxis")
     .attr("transform", "translate(0," + height2 + ")")
     .call(xAxis2);
//styling axis text
  d3.select('.xaxis')
    .selectAll('text').attr('style','text-anchor:middle; font-size:15px;')
//making the brush group and styling elements within
  context.append("g")
     .attr("class", "xbrush")
     .call(brush)
   .selectAll("rect")
     .attr("y", 30)
     .attr("height", 20)
  d3.select('.extent')
    .attr('style', 'fill:rgb(255,255,255);fill-opacity:1.0;pointer-events: all;')
    .attr('height',18)
  d3.select('.e rect')
    .attr('style','visibility:visibile; fill:#e74c3c;')
    .attr('width', 10)
  d3.select('.w rect')
    .attr('style','visibility:visibile; fill:#e74c3c;')
    .attr('width', 10)
//the three lines inside the uni bar drag handles
  for (var i = 0; i < 3; i++) {
    d3.select('.e').append('rect')
      .attr('x', (i*2+2) -3)
      .attr('y', 33)
      .attr('style', 'fill:#fff;')
      .attr('width', 1)
      .attr('height', 15)

    d3.select('.w').append('rect')
      .attr('x', (i*2+2) -3)
      .attr('y', 33)
      .attr('style', 'fill:#fff;')
      .attr('width', 1)
      .attr('height', 15)
  }
  //make the background visible
  d3.select('.background')
    .attr('style', 'visibility:visibile;')
    .attr('height', 18)

}
//call function above
initUniTimebar()

//brushed is called on brush end
function brushed() {
  //gives x a new domain depending on if the brush is empty
	x.domain(brush.empty() ? x2.domain() : brush.extent());
  //updated the dates to the selection
 	dates = brush.extent();
  //store scroll position
  var scrollpos = $(window).scrollTop()
  //remove and rebuild
  $('.panelRV').remove()
  r.build()
  //return back to prev scroll position
  $(window).scrollTop(scrollpos)
  //fadeout date box
  dateBoxManager('fadeout')
}
//displaying the box that shows the dates above the selection area on the universal time bar
function displaySelection () {
  //get x position of the selection
  var setX = d3.select('.extent').attr('x')
  //append a new group to the xbrush group
  d3.select('.xbrush')
    .append('g')
    .attr('class', 'displaySelection')
      .append('rect')
      .attr('height', 20)
      .attr('width',140)
      .attr('y', 4)
      .attr('x', setX)
      .attr('style','fill:#fff;stroke:#808080; visibility:hidden;')
  d3.select('.displaySelection')
    .append('text')
    .attr('x', setX)
    .attr('y', 7)
    .attr('fill','#e74c3c')
    .attr('transform', 'translate(12,12)')
    .attr('style', 'font-size:15px; visibility:hidden;')
}
//update the display selection box
function updateSelection () {
  var setX = d3.select('.extent').attr('x')
  var setW = d3.select('.extent').attr('width') /2
  var setFinal = parseFloat(setX) + (parseFloat(setW)/2)
  var datestrings = [brush.extent()[0].toString(), brush.extent()[1].toString()]
  var dateForUse = datestrings[0].toString().substring(4,10) + " to " + datestrings[1].substring(4,10)
  d3.select('.displaySelection rect')
    .attr('x', setFinal)
    .attr('style','fill:#fff;stroke:#808080; visibility:visibile;')
  d3.select('.displaySelection text')
    .attr('x', setFinal)
    .attr('style', 'font-size:15px; visibility:visibile;')
    .html(dateForUse)
}

var fading = false
var removedEarly = false
var storedMode = d3.currentMode
function dateBoxManager (request) {
  var amount = $('.displaySelection').length
  if (request=='remove') {
    if (amount && !fading) {
      $('.displaySelection').remove()
    } else if (amount && fading) {
      removedEarly = true
      fading=false
      $('.displaySelection').remove()
    }
  } else if(request=='fadeout'){
    if (amount && !fading) {
      fading=true
      $('.displaySelection').fadeOut('slow', function() {
        if (!removedEarly) {
          dateBoxManager('remove')
          fading=false
        } else {
          removedEarly = false
        }
      })
    }
  } else if(request=='add'){
    if (!amount) {
      displaySelection()
      updateSelection()
    } else if(amount && fading){
      dateBoxManager('remove')
      displaySelection()
      updateSelection()
    } else if(amount && !fading){

    }
  }
}

$(window).mousemove(function(event) {
  //act on changes
  if (storedMode=='move' && d3.currentMode!='move') {
    storedMode = d3.currentMode
    dateBoxManager('fadeout')
  } else if (storedMode=='resize' && d3.currentMode!='resize') {
    storedMode = d3.currentMode
    dateBoxManager('fadeout')
  }
  //update
  if (storedMode!=d3.currentMode) {
    storedMode = d3.currentMode
  }
  //act on update
  if (storedMode=='move') {
    dateBoxManager('add')
  } else if (storedMode=='resize') {
    dateBoxManager('add')
  }
})

$(function () {
    $('.extent').mouseover(function(event) {
    //add
    dateBoxManager('add')
  })
  $('.extent').mouseout(function(event) {
    //fadeout
    dateBoxManager('fadeout')
  })
})
//function for reseting the uni time bar
$(function () {
  $('#resetdiv #tbReset').click(function(event) {
    dates = [new Date(2007,12,1), new Date(2008,11,31)]
    $('.e').attr({
      transform: 'translate(0,0)',
      style: 'display:none;'
    })
    $('.w').attr({
      transform: 'translate(0,0)',
      style: 'display:none;'
    })
    $('.extent').attr({
      x: '0',
      width: '0'
    });
    brush.clear()
    $('.panelRV').remove()
    r.build()
  })
})

