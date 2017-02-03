
var useDev = true;
var qController = new QInterface(useDev);

$(document).ready(function(){
	qController.init();

	var query_submit = function(type) {

		var themeArray,locArray,timeArray;
		var url = "http://eventviewer.asap.um.maine.edu:8080/evolapservice/rest/evquery";
		if(useDev) url = "http://eventviewer.asap.um.maine.edu:8080/evolapserviceDev/rest/evquery";
		//var url = "http://141.114.58.184:8080/evolapservice/rest/evquery"
		//var url = window.location.pathname

		if(type == "real") {
			themeArray = $("#bev").children().map(function(){return $(this).find(".ev_filter_data").text()}).get();
			locArray = $("#bloc").children().map(function(){return $(this).find(".ev_filter_data").text()}).get();
			timeArray = $("#btime").children().map(function(){return $(this).find(".ev_filter_data").text()}).get();
		}

		if (type=='fake' || (themeArray.length == 0 && timeArray.length == 0 && locArray.length == 0)) {
			//timeArray = ["[TimeFilter].[2001]","[TimeFilter].[2002]","[TimeFilter].[2003]"];
			//locArray = ["[Gulf of Maine].[Coastal].[Western Maine Shelf].[Buoy].[B].[Depth].[1-20]"];
			//themeArray = ["[Ocean].[Sigma-Tdensity].[Threshold].[Mixed125]"];
			timeArray = ["[TimeFilter].[2001]","[TimeFilter].[2002]","[TimeFilter].[2003]"];
			locArray = ["[Gulf of Maine].[Coastal].[Western Maine Shelf].[B].[1-20]"];
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
})
