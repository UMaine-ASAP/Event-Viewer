//Based function based class for hierarchy explorer
function Explorer(type) {
	//this.url = "http://eventviewer.asap.um.maine.edu:8080/evolapservice/rest/evmeta";
	this.url = "http://eventviewer.asap.um.maine.edu:8080/evolapserviceDev/rest/evmeta";
	this.type = type;
	this.labels = [];
	this.levels = [];
	this.children = [];
	this.metadata = {};
}

Explorer.prototype.init = function() {
	console.log("Building "+this.type+" explorer");
	var context ={};

	$.ajax(this.url,{
		type: "GET",
		context: this,
		success: function(source) {
			console.log("Getting Metadata");
			console.log(source);
			this.metadata = source[this.getMetaIndex(this.type)];
			context = this;

			$.each([this.metadata], function(index,item) {
				console.log(index,item);
				context.add_levels(0,item,context);
				if(context.children[context.children.length-1].length==0) {
					context.children.pop();
				}
			})

			context.render(context.levels,context.children)

			//here I could write my own render function if needed

			//####
			//Add Sortable
			$(".binscroll").droppable({
				accept: ".drag-item",
				//activate: function(event,ui){alert("bang")},
				tolerance: "pointer",
				drop: function(event,ui){
					var dropoff = ui.helper.clone();
					$(dropoff).removeAttr('style');
					if($(dropoff).hasClass("concrete"))
						$(dropoff).attr("class","ev_filter concrete sort-item");
					else if($(dropoff).hasClass("abstract"))
						$(dropoff).attr("class","ev_filter abstract sort-item");
					
					$(dropoff).find(".ev_filter_title span").click(function(){
						$(this).parents("li.ev_filter").remove();
					});

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
						delay:200,
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
			

			$(".ev_filter").draggable({
				appendTo:"body",
				cursor: "move", cursorAt: { top: 18, left: 125 },
				delay:200,
				helper: function() {
					
					//var filterStr = filterStr.split(' : ').splice(-4).join('.');
					//var labelStr = filterStr.split('.').splice(-4).join('.');
					var filterStr = $(this).find(".ev_filter_data").text().split(' : ').join('.');
					var labelStr = $(this).find(".ev_filter_title").text();

					var $ret = $($("#filter_container_tpl").contents().text().trim())
					$ret.find(".ev_filter_title").prepend(labelStr);
					$ret.find(".ev_filter_data").append(filterStr);
					if($(this).hasClass("concrete"))
						$ret.addClass("concrete");
					else if($(this).hasClass("abstract"))
						$ret.addClass("abstract");

					console.log($ret);
					//return $(this).clone(true);

					return $ret;
				},
				start: function(event,ui){
					console.log("accordion drag start")
					$(this).addClass("drag-item");
				},
				stop: function(event,ui){
					console.log("accordion drag stop")
				},
				revert: "invalid"
			})

			$("li.level>ul.level_list>li.slug").draggable({
				appendTo:"body",
				cursor: "move", cursorAt: { top: 18, left: 125 },
				delay:200,
				helper: function() {
					//var year_re = /\[[0-9]{4}\]/i;
					//var filterStr = filterStr.split(' : ').splice(-4).join('.');
					//var labelStr = filterStr.split('.').splice(-4).join('.');
					var labelStr = "["+$(this).find(".filter_label").text()+"]";
					var filterStr = ($(this).parentsUntil(".root").parent()[0].id=="root_time")?("[TimeFilter]."+labelStr):labelStr;

					var $ret = $($("#filter_container_tpl").contents().text().trim())
					$ret.find(".ev_filter_title").prepend(labelStr);
					$ret.find(".ev_filter_data").append(filterStr);
					if($(this).hasClass("concrete"))
						$ret.addClass("concrete");
					else if($(this).hasClass("abstract"))
						$ret.addClass("abstract");
					else
						$ret.addClass("basic")

					console.log($ret);
					//return $(this).clone(true);

					return $ret;
				},
				start: function(event,ui){
					console.log("top drag start")
					$(this).addClass("drag-item");
				},
				stop: function(event,ui){
					console.log("top drag stop")
				},
				revert: "invalid"
			})
			//####
			console.log(context.levels);
		}
	});
}


//fills levels with empty arrays and then fills them
Explorer.prototype.add_levels = function(index, item, context) {
	var levels = context.levels;
	var children = context.children;
	var labels = context.labels;

	if(!$.isArray(levels[index])) {
		levels[index] = [];
	}

	if(!$.isArray(labels[index])) {
		labels[index] = [];
	}

	if(!$.isArray(children[0])) children[0] = [];

	$.each(item, function(label,subobj) {
		labels[index] = subobj.label;
		//If label is not already in list for current level
		if(levels[index].indexOf(subobj.name) == -1) {
			levels[index].push(subobj.name);
		}
		children[children.length-1].push(subobj.name)


		if(subobj.list.length > 0) {
		//if(Object.keys(subobj).length > 0) {
		//Current label has children
			//index++
			context.add_levels(++index,subobj.list,context);
			--index;

			children[children.length-1].pop()
			
		} else {
		//Current label is a leaf node
			children.push(children[children.length-1].slice(0,-1));
		}
	})
}

Explorer.prototype.render = function(levels,children) {
	//Render hierarchy menu
	levels.forEach( function (list, index) {
		var setBins = this.setBinItems;
		/*var container = $($("#level_container_tpl").contents().text());         //
		var cat_item = $($("#level_slug_tpl").contents().text());
		cat_item.empty().append("<span class='levnum'>"+this.labels[index]+"</span>");    //levnum refers to name of cat, like "domain"
		cat_item.append("<i class='icon down fa fa-caret-square-o-down'/>");              //[v] dropdown thing
		cat_item.children(".icon").on("click",this.hideAction);

		container.find(".level_cat").append(cat_item);				//level cat refers to category container: [domain]

		list.forEach( function (item,index) {
			var list_item = $($("#level_slug_tpl").contents().text());
			
			list_item.find('.filter_label').text(item);                             //filter_label is the text in the label container, like "ocean"
			list_item.find('.filter_count').text(this.getFilterCount(item));        //filter_count is the number at the end of the label container: (1)
			list_item.data("type",this.type);                                       //type refers to Event/Location/Time
			list_item.on('click',this.selectAction);                                //most likely activates dropdown capability on click

			container.find(".level_list").append(list_item);                        //level_list is the whole label container
		}, this);
		//up to here just creating top level filters (filling the top level container)

		//puts the container into the page
		$("#root_"+this.type+" ul.filter_list").append(container);                  //filter_list refers to the whole container for the level (cat + label)
*/



		// new version of my additions
		//var container = $($("#ruth_container").contents().text());
		//var cat_item = $($("#ruth_slug_tpl").contents().text());
		//cat_item.empty().append("<span class='levnum'>"+this.labels[index]+"</span>");    //levnum refers to name of cat, like "domain"

		//container.find(".listitems").append(cat_item);				//level cat referred to category container: [domain]

		list.forEach( function (item,index) {
			var list_item = $($("#ruth_slug_tpl").contents().text());
			
			list_item.find('.filter_label').text(item);                             //filter_label is the text in the label container, like "ocean"
			list_item.find('.filter_count').text(this.thisobj.getFilterCount(item));        //filter_count is the number at the end of the label container: (1)
			list_item.data("type",this.thisobj.type);                                       //type refers to Event/Location/Time
			list_item.on('click',this.thisobj.selectAction);                                //?

			//container.find(".listitems").append(list_item);   
			$(".dropdown_"+this.thisobj.type+"_"+this.this_list_index).append(list_item);                     //puts everything into the dropdowns
		}, {thisobj: this, this_list_index:index});

		$("."+this.type+"_"+index).append("<option>" + this.labels[index] + "</option>");              //dropdown titles

	}, this);

		

	//Fill bin with appropriate filters.
	qController.setBinItems(this.type);

}

//Explorer.prototype.setBinItems = function() {}

Explorer.prototype.selectAction = function(event) {
	var eItem = $(event.delegateTarget);
	eItem.toggleClass("selected");

	//Call Refresh
	qController.setBinItems(eItem.data("type"));
	//Reset Drag
	$(".ev_filter").draggable({
		appendTo:"body",
		cursor: "move", cursorAt: { top: 18, left: 125 },
		delay:200,
		helper: function() {
			
			//var filterStr = filterStr.split(' : ').splice(-4).join('.');
			//var labelStr = filterStr.split('.').splice(-4).join('.');
			var filterStr = $(this).find(".ev_filter_data").text().split(' : ').join('.');
			var labelStr = $(this).find(".ev_filter_title").text();

			var $ret = $($("#filter_container_tpl").contents().text().trim())
			$ret.find(".ev_filter_title").prepend(labelStr);
			$ret.find(".ev_filter_data").append(filterStr);
			if($(this).hasClass("concrete"))
				$ret.addClass("concrete");
			else if($(this).hasClass("abstract"))
				$ret.addClass("abstract");

			console.log($ret);
			//return $(this).clone(true);

			return $ret;
		},
		start: function(event,ui){
			console.log("accordion drag start")
			$(this).addClass("drag-item");
		},
		stop: function(event,ui){
			console.log("accordion drag stop")
		},
		revert: "invalid"
	})
} 

Explorer.prototype.hideAction = function(event) {
	var sectionTarget = $(event.delegateTarget).parents(".level")
	var eIcon = sectionTarget.find("i");
	var fList = sectionTarget.find("ul.level_list>li.slug");

	if(eIcon.hasClass('down')) {
		eIcon.removeClass('down');
		eIcon.addClass('up');

		var list_item = $($("#level_slug_tpl").contents().text());
		if(fList.filter(".selected").length == 0){
			list_item.find('.filter_label').append("<em>Click to Reveal Options</em>");
			list_item.find('.filter_count').text(fList.filter(":not(.selected)").length);
			list_item.on('click',Explorer.prototype.hideAction);
			list_item.css("display","none");
			list_item.addClass("selected remove")

			eIcon.parents(".level").children("ul.level_list").prepend(list_item)
		}
		fList.not(".selected").slideUp();
		list_item.slideDown();
	} else {
		var fList = eIcon.parents(".level").find("ul.level_list>li.slug");
		fList.filter(".remove").slideUp({
			complete: function() {
				this.remove();
			}
		})

		eIcon.removeClass('up');
		eIcon.addClass('down');
		fList.slideDown();
	}


} 

Explorer.prototype.getFilterCount = function(thisFilter) {
	return 	"("+
			this.children.filter(function(child) {
				return child.indexOf(thisFilter) != -1;
			}).length+
			")";
}

Explorer.prototype.getMetaIndex = function(type) {
	var lut = {"location":0,"event":1,"time":2};
	return lut[type];
}