var useDev = true;
var qController = new QInterface(useDev);

$(document).ready(function() {

  var diceTest = function(rolls) {
    var dice = [1,2,3,4,5,6];
    var array = [];

    for (var roll = 0; roll < rolls; roll++) {
      var newarray = [];
      
      if(array.length == 0) {
        newarray = dice.map(function(die) {
          return [die];
        });
      } else {
        while (array.length > 0) {
          var removed = array.pop();
              
          dice.forEach(function(item,index,list) {
            var seed = removed.slice();
            seed.push(item);
            this.push(seed);
          },newarray);
        }

    };
    array = newarray.slice();
  }

  var values = [];
  array.forEach(function(roll) {
    var sum = roll.reduce(function(a, b) {
      return a + b;
    });
    this[sum] = (this[sum])?++this[sum]:1
  },values);

  var sum = values.reduce(function(a, b) {
    return a + b;
  });

  result = values.map(function(item,i,arr) {
    return [item,Math.round(item/sum*1000)/1000];
  })

  console.log("value");
  result.forEach(function(item,index) {
    //console.log("["+index+"] "+item[0]+" ("+item[1]+")");
    console.log(index+", "+item[0]);
  })
}

  qController.init();

  initTimePanel();

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

    var activeTabId = e.currentTarget.attributes.getNamedItem("href").value;
    var activeTabType = activeTabId.split('_')[0].substring(1,activeTabId.split('_')[0].length-1);
    var activeTab = $(activeTabId);

    //Build Filter Browsers
    if(activeTab.children(".filter_level_container").children().length == 0) {
    //if(true) {

      var model = qController.lut[activeTabType];

      model.levels.forEach(function(level_list,level_index) {
        var container = $($("#filter_browser_pane_tpl").contents().text());
        
        container.find(".panel-heading>h5.panel-title").text(this.labels[level_index]);
        level_list.forEach(function(level_list_item,level_list_index) {
          var item = $($("#filter_browser_slug_tpl").contents().text());
          item.find("span.slug-name").text(level_list_item);
          item.find("span.slug-badge").text(this.getFilterCount(level_list_item));
          container.find(".panel-body>ul").append(item);
        },this);
        activeTab.children(".filter_level_container").append(container);
      },model);
      
    }



    console.log($(e.currentTarget.href)) // newly activated tab
    console.log(e.relatedTarget) // previous active tab
  })


	
});

var initTimePanel = function() {
  $( "#from" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    
    $( "#to" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });

    $("#slider").slider({
        min: 0,
        max: 100,
        step: 1,
        range: true,
        values: [10, 90],
        slide: function(event, ui) {
            for (var i = 0; i < ui.values.length; ++i) {
                $("input.sliderValue[data-index=" + i + "]").val(ui.values[i]);
            }
        }
    });

    $("input.sliderValue").change(function() {
        var $this = $(this);
        $("#slider").slider("values", $this.data("index"), $this.val());
    });
}