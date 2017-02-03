//Based function based class for hierarchy explorer
function QInterface(useDev) {
	this.eventExplorer = new Explorer("event",useDev);
	this.locExplorer   = new Explorer("location",useDev);
	this.timeExplorer  = new Explorer("time",useDev);

	this.lut = {"event":this.eventExplorer, "location":this.locExplorer, "time":this.timeExplorer}
	
}

QInterface.prototype.init = function() {
	console.log("Building Query Interface")
	//eventExplorer = new Explorer("event").init();
	//locExplorer = new Explorer("location").init();
	//timeExplorer = new Explorer("time").init();
	this.eventExplorer.init();
	this.locExplorer.init();
	this.timeExplorer.init();
}



QInterface.prototype.setBinItems = function (type) {
	$("#root_"+type+" ul.filter_bin").empty();

	var uniqueLevels = this.lut[type].levels;

	//var uniqueLevels = $("#root_"+type).find('li.slug>span.filter_label').map( function(){
	//	return this.textContent
	//}).get();
	//var uniqueLevels = this.lut[type].levels;
	 
	var selected = $("#root_"+type).find("li.slug.selected")
	
	var selectedLevels = uniqueLevels.map(function(item, index, array) {
		var retArr = [];
		var testLevel = function(levelitem,levelindex) {
			var levs = this.selected.map(function(x,itm){
				return $(itm).parents(".level").find(".level_cat li.slug span.levnum").get();
			})

			for(var i=0; i < this.selected.length; i++) {
				if(levelitem == this.selected[i].getElementsByClassName("filter_label")[0].textContent) {
					retArr.push(levelitem);
				}
			}
		}
		arguments.selected = this.selected;
		item.forEach(testLevel,arguments);

		return retArr;
	},{"selected":selected});


	var filterList = (selectedLevels.some(function(i){return i.length > 0}))?selectedLevels:uniqueLevels;
	
	//Render Children Bin Items
	var matchingChilds = this.lut[type].children
	if(filterList != uniqueLevels){
		matchingChilds = this.lut[type].children.filter(function(item){
			var filterLevels = this;

			var okayArr = [];
			for(var i = 0; i < item.length; i++) {
				okayArr[i] = (filterLevels[i].length == 0)? true:(filterLevels[i].indexOf(item[i]) > -1);
			}
			return okayArr.every(function(i){return i});
		},filterList);
	}

	matchingChilds.forEach( function (list,index) {
		var filter_item = $($("#filter_container_tpl").contents().text());
		var filterStr = list.map(function(item) { return '['+item+']'}).join(' : ');
		if(type == 'time') filterStr = "[TimeFilter] : "+filterStr;
		//var filterStr = ($(this).parentsUntil(".root").parent()[0].id=="root_time")?("[TimeFilter]."+labelStr):labelStr;

		filter_item.find(".ev_filter_title").prepend(filterStr);
		filter_item.find(".ev_filter_data").append(filterStr);
		filter_item.toggleClass('concrete');
		$("#root_"+this.type+" ul.filter_bin").append(filter_item);
	}, this.lut[type]);

	//Render Abstract Bin Items
	/*
	uniqueLevels.forEach( function (item,index) {
		var filter_item = $($("#filter_container_tpl").contents().text());
		var filterStr = "[All] : [" +item+ "]";

		filter_item.find(".ev_filter_title").prepend(filterStr);
		filter_item.find(".ev_filter_data").append(filterStr);
		filter_item.toggleClass('abstract');
		$("#root_"+this.type+" ul.filter_bin").append(filter_item);
	}, this.lut[type]);
*/
}