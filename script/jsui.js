/*jQuery time*/
$(document).ready(function(){
	//Build a table
	/*
	var source = {id:"root",list:[
			{"locations":{"Gulf of Maine":{"Coastal":{"Western Maine Shelf":{"Buoy":{"B":{"Depth":{"1-NaN":{},"1-20":{}}}}},"Massachusetts Bay":{"Buoy":{"A":{"Depth":{"1-50":{},"1-20":{}}}}}}}}},{"themes":{"Ocean":{"Sigma-Tdensity":{"Threshold":{"Mixed125":{"Magnitude":{}}},"FirstDiff":{"Positive":{"Magnitude":{}},"Negative":{"Magnitude":{}}}}}}},{"times":{"2000":{},"2001":{},"2002":{},"2003":{},"2004":{},"2005":{},"2006":{},"2007":{},"2008":{},"2009":{},"2010":{}}}
	]};
	*/

	var url = "http://eventviewer.asap.um.maine.edu:8080/evolapservice/rest/evmeta";
	//var url = "http://141.114.58.184:8080/evolapservice/rest/evmeta"
	//var url = window.location.pathname

	$.ajax(url,{
		type: "GET",
		success: function(result_data) {
			source = (this.url==window.location.pathname)?source:result_data;
			console.log("Getting Metadata");
			console.log(source);

			//Recursively convert JSON to menu object
			//$.each(source,function(i,value){
			//$.each(source.list,function(i,value){
				//source.list[i] = r_map(value)[0];
			//	source[i] = r_map(value)[0];
			//});

			var theme_list,location_list,time_list;
	
			//$.each(source.list,function(i,sub) {
			//$.each(source,function(i,sub) {
			//	if(sub.dname.indexOf("hemes") > -1) theme_list = sub.list
			//	else if (sub.dname.indexOf("ocation") > -1) location_list = sub.list
			//	else if (sub.dname.indexOf("Periods") > -1 || sub.dname.indexOf("times") > -1) time_list = sub.list
			//	else console.log("Some error parsing default query options JSON.")
			//})
	
			location_list = source[0];
			theme_list = source[1];
			time_list = source[2];
			
			buildList($("div#theme_select.accordion li.root-item>ul").get(0),[theme_list]);
			buildList($("div#location_select.accordion li.root-item>ul").get(0),[location_list]);
			buildList($("div#time_select.accordion li.root-item>ul").get(0),[time_list]);

			$(".accordion h3").click(function(evt){
				accordionClick(this);
			})

			$(".accordion a, .accordion h3").click(function(){
				liData = $(event.target).parentsUntil("li.root-item","li").get().reverse();
				queryObj = buildObjR(0,liData);

				//console.log("clicked");
				//console.log(JSON.stringify(queryObj));
				//console.log(buildPathR(liData,"olap"))
			});
			
			//Add Sortable
			$(".binscroll").droppable({
				accept: ".drag-item",
				//activate: function(event,ui){alert("bang")},
				tolerance: "pointer",
				drop: function(event,ui){
					var dropoff = ui.helper.clone();
					$(dropoff).removeAttr('style');
					$(dropoff).attr("class","ev_filter sort-item");
					$(dropoff).find(".ev_filter_title span").click(function(){
						$(this).parents("li.ev_filter").remove();
					})

					$(this).append(dropoff);
					console.log("Dropped: "+$(dropoff).find(".ev_filter_title").text())

					
					$(".sort-item").draggable({
						appendTo:"body", containment:"window", scroll:false,
						connectToSortable: ".binscroll",
						cursor: "move", //cursorAt: { top: 18, left: 125 },
						helper: "clone",
						zIndex: 100,
						start: function(event,ui){
							console.log("sort drag start")
							$(this).hide();
						},
						stop: function(){
							console.log("sort drag stop")
							$(this).remove();
						},
						revert: "invalid"
					})
				}
			});

			
			$(".binscroll").sortable({
				//appendTo: "body",
				//containment: "window",
				//scroll: false,
				//helper: "clone"
				receive: function() {

					$(".sort-item").find(".ev_filter_title span").click(function(){
						$(this).parents("li.ev_filter").remove();
					})

					$(".sort-item").draggable({
						appendTo:"body", containment:"window", scroll:false,
						connectToSortable: ".binscroll",
						cursor: "move",// cursorAt: { top: 18, left: 125 },
						helper: "clone",
						zIndex: 100,
						start: function(event,ui){
							console.log("sort drag start")
							$(this).hide();
						},
						stop: function(){
							console.log("sort drag stop")
							$(this).remove();
						},
						revert: "invalid"
					})
				}
			});
			

			$(".accordion a, .accordion h3").draggable({
				appendTo:"body",
				cursor: "move", cursorAt: { top: 18, left: 125 },
				delay:200,
				helper: function() {
					var filterStr = buildPathR($(this).parentsUntil("li.root-item","li"),"olap");
					var labelStr = filterStr.split('.').splice(-4).join('.');

					var $ret = $($("#filter_container_tpl").contents().text().trim())
					$ret.find(".ev_filter_title").prepend(labelStr);
					$ret.find(".ev_filter_data").append(filterStr);
					//console.log($ret);

					return $ret;
				},
				start: function(event,ui){
					console.log("accordion drag start")
				},
				stop: function(event,ui){
					console.log("accordion drag stop")
				},
				revert: "invalid"
			})
		},
		error: function(error_data,err,err_text) {
			alert(err);
			//$("#query_container").animate({width: 'toggle'});
		}
	});

	//Function r_map: input=arbitrarily-deeply nested js object
	//Re-map the OLAP structure to nested arrays with recursing list of {name,props} objects.
	//The arrays work more naturally with the current View framework.
	var itemNo = 0
	var r_map = function(m) {
		return $.map(m,function(value,key) { 
			return {"id":"item"+itemNo++,icon:"","dname":key,"list":r_map(value)};
		});
	}
	
	var listDepth = function(item){
		return $(item).parents("ul").length-1;
	}
	
	var setGradientByDepth = function(item){
		item = $(item);

		//Get Gradient
		var style = item.css("background-color");		
		var oldA = style.match(/rgb\((([0-9]+), ([0-9]+), ([0-9]+))\)/g);
		var newA = [];
		$.each(oldA,function(i,oA){
			var d = listDepth(item);
			var cObj = oA.match(/rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)/)
			var r = parseInt(cObj[1])+(d*15);
			var g = parseInt(cObj[2])+(d*15);
			var b = parseInt(cObj[3])+(d*10);
			var nA = "rgb("+r+", "+g+", "+b+")";
			newA[i] = nA
			style = style.replace(oldA[i],newA[i]);
		});
		
		$(item).css("background",style);
	}
	
	var buildList = function(buildPoint,sourceData) {
		$.each(sourceData,function(listIndex,listItem){
			if(listItem.list.length > 0){
				var newItem = document.createElement('li');
				var newHead = document.createElement('h3');
				newHead.className = "drag-item";
				var newSpan = document.createElement('span')
				newSpan.className = listItem.icon
				var newText = document.createTextNode(listItem.name);
				var newList	= document.createElement('ul');

				newHead.appendChild(newSpan);
				newHead.appendChild(newText);
				newItem.appendChild(newHead);
				newItem.appendChild(newList);

				//newItem.append($("<h3 class='drag-item'/>").append($("<span/>").attr("class",listItem.icon),document.createTextNode(listItem.dname)));
				//newItem.append($("<ul/>"));
				//$(newItem).contents("h3").click(depth);
				buildPoint.appendChild(newItem);
				setGradientByDepth(newItem.getElementsByTagName('h3'));
				
				buildList(buildPoint.children[listIndex].getElementsByTagName("ul")[0],listItem.list);
				
			} else {
				var newItem = document.createElement('li');
				var newLink = document.createElement('a');
				newLink.className = "drag-item";
				newLink.setAttribute("href","#");
				newLink.appendChild(document.createTextNode(listItem.name));
				var newList = document.createElement('ul');

				newItem.appendChild(newLink);
				newItem.appendChild(newList);

				//var newItem = $("<li/>");
				//newItem.append($("<a class='drag-item'/>").attr("href","#").text(listItem.dname));
				//newItem.append($("<ul/>"));
				//$(newItem).contents("a").click(depth);
				buildPoint.appendChild(newItem);
			}
			//alert(listItem.name);
		})
	}
	
	//Handle opening/closing of menus
	var accordionClick = function(item){
		//Tree Manager
		if(!$(item).parent("li").hasClass("root-item")){
			//Manage opening and closing
			if($(item).parent("li").next().is(":visible") || $(item).parent("li").prev().is(":visible") || ($(item).parent("li").siblings().length==0) && !$(item).parent("li").children("ul").is(":visible")) {
				// IF opening THEN hide siblings
				$(item).parent("li").siblings("li").slideUp('fast');
				// AND open the current sublist
				$(item).next("ul").slideDown('fast',function(item){
					//Auto open when only one child
					if($(this).children().length == 1) {
						accordionClick($(this).children().first().children("h3"))
					}
				})
			} else {
				// IF closing THEN re-show siblings
				$(item).parent("li").siblings("li").slideDown('fast');
				// AND show all nested items
				$(item).parent("li").find("li").slideDown('fast');
				// AND hide the current and all nested sublists
				$(item).parent("li").find("ul").slideUp('fast');
			}
		}else{
		// Reset the Table to original state
			//If root THEN show all show all nested items
			$(item).parent("li").find("ul li").slideDown('fast');
			// AND hide the all nested sublists
			$(item).parent("li").find("ul ul").slideUp('fast');
			// AND show current ul
			$(item).next("ul").slideDown('fast');


		}
	}

	var query_submit = function(type) {

		var themeArray,locArray,timeArray;
		var url = "http://eventviewer.asap.um.maine.edu:8080/evolapservice/rest/evquery";
		//var url = "http://141.114.58.184:8080/evolapservice/rest/evquery"
		//var url = window.location.pathname

		if(type == "real") {
			themeArray = $("#bev").children().map(function(){return $(this).find(".ev_filter_data").text()}).get();
			locArray = $("#bloc").children().map(function(){return $(this).find(".ev_filter_data").text()}).get();
			timeArray = $("#btime").children().map(function(){return $(this).find(".ev_filter_data").text()}).get();
		}

		if (type=='fake' || themeArray.length == 0) {
			timeArray = ["[TimeFilter].[2001]","[TimeFilter].[2002]","[TimeFilter].[2003]"];
			locArray = ["[Gulf of Maine].[Coastal].[Western Maine Shelf].[Buoy].[B].[Depth].[1-20]"];
			themeArray = ["[Ocean].[Sigma-Tdensity].[Threshold].[Mixed125]"];
		}
		
		var query_obj = [timeArray,locArray,themeArray];

		console.log("Query");
		console.log(query_obj);
		console.log(JSON.stringify(query_obj))
		
		if($("#query_container").is(":visible")){
			$("#results_container").children(":not(#tb_container)").remove();
			$.ajax(url,{
				xhr: function() {
			        var xhr = new window.XMLHttpRequest();
			        xhr.upload.addEventListener("progress", function(evt) {
			        	console.log("asdf")
			            if (evt.lengthComputable) {
			                var percentComplete = evt.loaded / evt.total;
			                console.log(percentComplete)
			            } else {console.log("I return! A second chance to carve out your skull!")}
			       }, false);

			       xhr.addEventListener("progress", function(evt) {
			       	console.log("asdf")
			           if (evt.lengthComputable) {
			               var percentComplete = evt.loaded / evt.total;
			               console.log(percentComplete)
			           } else {console.log("My life for the... Death God...")}
			       }, false);
			       console.log(xhr)
			       return xhr;
			    },
				type: "GET",
				beforeSend:function (argument) {
					$('#continue').addClass('hide')
					$('#tb_container').addClass('hide')
					$('body').prepend('<div id="load"><div>L</div><div>O</div><div>A</div><div>D</div><div>I</div><div>N</div><div>G</div></div>')/*
						<div id="credits">
							<a href="http://codepen.io/suffick/pen/vlfyA">by suffick on codepen</a>
						</div>')*/

				},
				data: {filter: JSON.stringify(query_obj)},
				success: function(result_data) {
					$('#load').remove()
					$('#tb_container').removeClass('hide')
					//$('#credits').remove()
					console.log("results")
					console.log(result_data);			

					result_data = (this.url != window.location.pathname)?result_data:sample
					console.log(result_data)
					r = new ResultsBuilder(result_data)
					r.build()
				},
				error: function(error_data,err,err_text) {
					alert(err);
					//$("#query_container").animate({width: 'toggle'});
				}
			
				
			})
	
			
			$("#query_container").animate({width: 'toggle'})
			$("#results_container").animate({width: 'toggle', left: '0%'})
			//$("#continue").detach().appendTo('#tb_container')
			//$("#continue").slideDown();
	
			//var r = new ResultsBuilder(sample);
			//r.build()
		} else {
			$("#query_container").animate({width: 'toggle'})
			$("#results_container").animate({width: 'toggle',left: '100%'})
			//$("#continue").detach().appendTo('#qbutton')
			//$("#results_container").children().remove();
		}
		$("#continue").text(($("#continue").text() == "Query")?"Back":"Query");
	}
	
	$("#continue").click(function(){
		query_submit("real");
	});

	var buildLabel = function(data) {
		$.each(data,function(i,string) {
			var lblArray = string.split('.')
			lblArray = $.map(lblArray,function(el,i) {
				el = el.replace('[','');
				el = el.replace(']','');

				if(el == "Coastal" || el == 'Ocean' || el == "Magnitude" || el == "Depth") {
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

			data[i] = lblArray.join(': ')
		})

		return data;
	}

	var buildObjR = function(index,data){
		var returnObj = new Object;

		if(data[index]!=null){
			returnObj[($(data[index]).children("h3").text())?$(data[index]).children("h3").text():$(data[index]).children("a").text()]=buildObjR(index+1,data);
		} 

		return returnObj;
	};

	var buildPathR = function(data,type){	
		var s_enc = "";
		var e_enc = "";
		var sep   = ":";

		if (type == "olap") {
			s_enc = "[";
			e_enc = "]";
			sep   = "." 
		}	
		
		var lbl = $(data).parents("li.root-item").children("h3").text();
		data = $(data).get().reverse();

		var returnStr = $.map(data,function(e,i) {
			var str = ($(e).children("h3").text()?$(e).children("h3").text():$(e).children("a").text());
			var pre = "";
			if(lbl=="Times") pre = s_enc+"TimeFilter"+e_enc+sep;
			var t = pre+s_enc+str+e_enc;
			return t;
		});

		return returnStr.join(sep);
	};



	

});