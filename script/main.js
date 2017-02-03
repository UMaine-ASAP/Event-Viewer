function appendItem(list,itemName,parent){
  switch(list){
    case 'e':
      if( parent=="none" ) {parent="#sev";}
      $(parent).append('<li id="s'+list+itemName+'" class="ev"><div class="item">'+itemName+'</div></li>');
      if (parent=="#sev") {parent="#bev"};
      $(parent).append('<li id="b'+list+itemName+'" class="ev hide"><div class="item">'+itemName+'</div></li>');
      break;
    case 'l':
      if( parent=="none" ) {parent="#sloc";}
      $(parent).append('<li id="s'+list+itemName+'" class="loc"><div class="item">'+itemName+'</div></li>');
      if (parent=="#sloc") {parent="#bloc"};
      $(parent).append('<li id="b'+list+itemName+'" class="loc hide"><div class="item">'+itemName+'</div></li>');
      break;
    case 't':
      if( parent=="none" ) {parent="#stime";}
      $(parent).append('<li id="s'+list+itemName+'" class="time"><div class="item">'+itemName+'</div></li>');
      if (parent=="#stime") {parent="#btime"};
      $(parent).append('<li id="b'+list+itemName+'" class="time hide"><div class="item">'+itemName+'</div></li>');
      break;
  }
}

function sortItem(item){
  this.done=false;
  while(!this.done){
    appendItem(item[0],item[1],item[3]);
    if(item[2]!=null){
      var temp = item[2];
      temp[3] = "#"+item[0]+item[1];
      item=temp;

    } else {
      this.done=true;
    }
  }
}

function continueButton (argument) {
  window.location.href='pages/RV.html';
}

for (var i = 0; i < 30; i++) {
  sortItem(['e',"ev"+i,null,"none"]);
  sortItem(['l',"loc"+i,null,"none"]);
  sortItem(['t',"time"+i,null,"none"]);
}

function dimensionMover(dimension){ 
  //class that will hide and show elements between two scroll overloads
  //dimension is the common name of both of the scrollviews and the draggable objects within
  //both should follow the naming conventions #s{dimension} for the source #b{dimension} for the bin

  if(typeof dimension === 'string' != true){
    console.log("error, dimensionMover requires a string");
    return;
  }
  var that = this;//for referencing the parent function in sub functions
  that.dropped = false;
  that.sourceRef = "#s"+dimension+" li"; //#s{dimension} li to select all li elements in the scroll source
  that.binRef = "#b"+dimension+" li";
  that.bin = "#b"+dimension;//bin
  that.objectRef = "";//tracks object's id for dragging and dropping
  that.hasDelete = "";//tracks the id of objects with the xButton
  that.dClass = "."+dimension;

  /************************************************************************************************
  Below: Handles the dragging and dropping
  ************************************************************************************************/

  $(that.sourceRef).draggable({//http://api.jqueryui.com/draggable/
    addClasses: false,
    revert: "invalid",
    containment: ".fluid-container",
    helper: function() {
        return $(this).clone(true); // true to keep data and events
    },
    appendTo:"#outsider",
    start: function(event, ui) {
        that.dropped = false;
        $(this).addClass("hide");
        that.objectRef = linkID("#"+$(this).attr("id"));
    },
    stop: function(event, ui) {
        if (that.dropped==true) {
            $(that.binRef+that.objectRef).removeClass("hide");   
            that.objectRef = "";
        } else {
            $(this).removeClass("hide");
            that.objectRef = "";
        }
    }
  });

  $(that.bin).droppable({//http://api.jqueryui.com/droppable/
    accept: that.dClass,
    drop: function(event, ui) {
        that.dropped = true;
    }
  });

  /************************************************************************************************
  Below: Handles the delete button and selected list elements
  ************************************************************************************************/

  $(that.binRef+that.dClass).mouseover(function () {//http://api.jquery.com/mouseover/
    $(this).addClass("deleteable");
  });


  $(that.binRef+that.dClass).click(function () {
    console.log(that.hasDelete);
    console.log("#"+$(this).attr("id"));
    console.log(that.hasDelete!="#"+$(this).attr("id"));
    if($(that.binRef+that.dClass).has("#xButton").length ==  true && $(this).attr("id")==that.hasDelete) {
      if($(that.hasDelete).hasClass("clickDeleteable")==true){
              $(that.hasDelete).removeClass("clickdeleteable");
              console.log("Adding single");
            }
      xButton.remove();
      that.hasDelete="";
      } else { 
        if($("#xButton").length == true) {
          if($(that.hasDelete).hasClass("clickdeleteable")==true){
            $(that.hasDelete).removeClass("clickdeleteable");
            console.log("Removing");
          } else if($(this).hasClass("clickdeleteable")!=true){
            $(this).addClass("clickdeleteable");
            console.log("Adding");
          }
          that.hasDelete = "#"+$(this).attr("id");
          xButton.remove();
          $(this).append('<button id="xButton"></button>');

         } else {

          if($(this).hasClass("clickdeleteable")!=true){
            $(this).addClass("clickdeleteable");
          }
          that.hasDelete = "#"+$(this).attr("id");
          $(this).append('<button id="xButton" ></button>');
         }
      }
  });


  document.getElementById("xButton").onclick=function(){console.log("BUTTON")};

  $(that.binRef+that.dClass).mouseout(function () {//http://api.jquery.com/mouseout/
    $(this).removeClass("deleteable");
  });

  $("#xButton").mouseover(function () {
    console.log($(that.binRef+that.dClass).attr("class"));
  });
}

  /************************************************************************************************
  Above: End dimensionMover function Below: linkID
  ************************************************************************************************/

linkID = function(id) {
  /* each of the items for the two overflow scroll lists have a unique id attribute
  * much of the id's will look similar such as #seev12 and #beev12, these two are meant to
  * represent the same item in with the same label but have s and b to indicate that they
  * are at the source and bin respectively.
  * The use of this function is to "link" the id's as this function will return the oppposite
  * id for the other scroll list.
  * Example: id=#seev12 linkID(id){ return "#beev12"}
  */
  if(typeof id === 'string' != true){
    console.log("error, linkID requires a string");
    return;
  } else if(id.substring(0,1)!="#"){
    console.log("error, linkID argument should always start with \"#\"");
    return;
  }
  this.storage = id.substring(2,id.length);
  //Below: a ternary operator, returns based on id, s or b
  this.retValue = id.substring(1,2)=="s" ? "#b"+this.storage : "#s"+this.storage ;
  return this.retValue;
};


var ev = new dimensionMover("ev");
var loc = new dimensionMover("loc");
var time = new dimensionMover("time");


