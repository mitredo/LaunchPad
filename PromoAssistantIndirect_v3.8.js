var calendarEvents = [];
var curSource = new Array();
//var channelArray = ["Retail","Telesales","Indirect","Care"];
var promoArray = [[],[]];
var phoneArray = [[],[]];
var colModel = [];
var selectedChannel = "";
var activeTopTab = "", activeSubTab;
var selectedFilters;
var response;
var textFile = null;
var unboxdArray = [];

$(document).ready(function () {
	// SP uses element, vdaily pushes item
	for(var i = 0; i<8; i++){   // 8 represents 9 indices
    	promoArray[i]= new Array();
    	phoneArray[i]= new Array();
      	for(var j = 0; j<9; j++){  // this is for sub headers
         	promoArray[i][j] = new Array();
        }
      	for(var j = 0; j<5; j++){
         	phoneArray[i][j] = new Array();
        }
    }
	var today = moment(new Date()).format("YYYY-MM-DD");
    // Add everything but costco 
    for(i = 0; i < promosArray.length;i++) {
		item = promosArray[i];
		var launchDate = new Date(item.launchdate);
		var promoEndDate = new Date(item.enddate);
		var channels = item.channel;
		var promotiontype = item.promo;
		var oems = item.oem;
		var nationalRetailers = item.nationalretailers;
		launchDate = moment.utc(launchDate);
		promoEndDate = moment.utc(promoEndDate);
		var launchTime = moment(launchDate).format("YYYY-MM-DD");
		var endTime = moment(promoEndDate).format("YYYY-MM-DD");
		if (launchTime > today || endTime < today)
			continue;		
		var alreadyPushedIndirect = false;
		var alreadyPushedCare = false;
		for (var j in channels) {
			if (channels[j] == 'Indirect Agents')
				pushElements(0,item,promotiontype,oems);
			if (channels[j] == 'Prepaid Only Agents')
				pushElements(1,item,promotiontype,oems);
			if (channels[j] == 'Indirect National Retail')
			{
				for (var k=0; k<nationalRetailers.length; k++)
				{
					if (nationalRetailers[k]=='All Retailers')
					{
						pushElements(2,item,promotiontype,oems);
						pushElements(3,item,promotiontype,oems);
					  //pushElements(4,item,promotiontype,oems);
						pushElements(5,item,promotiontype,oems);
						pushElements(6,item,promotiontype,oems);
						break;
					}
					if (nationalRetailers[k]=='Apple')
						pushElements(2,item,promotiontype,oems);
					if (nationalRetailers[k]=='Best Buy')
						pushElements(3,item,promotiontype,oems);
					//if (nationalRetailers[k]=='Costco')
					//	pushElements(4,item,promotiontype,oems);
					if (nationalRetailers[k]=='Military')
						pushElements(5,item,promotiontype,oems);
					if (nationalRetailers[k]=='Walmart')
						pushElements(6,item,promotiontype,oems);
						
				}
			}
		}
	}
	// Now we do costco
	    for(i = 0; i < costcoArray.length;i++) {
		item = costcoArray[i];
		var launchDate = new Date(item.launchdate);
		var promoEndDate = new Date(item.enddate);
		var channels = item.channel;
		var promotiontype = item.promo;
		var oems = item.oem;
		var nationalRetailers = item.nationalretailers;
		launchDate = moment.utc(launchDate);
		promoEndDate = moment.utc(promoEndDate);
		var launchTime = moment(launchDate).format("YYYY-MM-DD");
		var endTime = moment(promoEndDate).format("YYYY-MM-DD");
		if (launchTime > today || endTime < today)
			continue;		
		var alreadyPushedIndirect = false;
		var alreadyPushedCare = false;
		for (var j in channels) {
			if(channels[j] == 'Retail'){
				if(promotiontype != 'Accessory Promo'){
					pushElements(4, item, promotiontype, oems);
				}
			}
		}
	}
	setColModel();
	displayjGrid(promoArray[0][0],"Channel");
	displayjGrid(promoArray[0][2],"Tablet");
	displayjGrid(promoArray[0][3],"Loyalty");
	displayjGrid(promoArray[0][4],"Entertainment");
	displayjGrid(promoArray[0][5],"Prepaid");
	displayjGrid(promoArray[0][6],"Priceplan");
	displayjGrid(promoArray[0][8], "Accessories");
	displayjGrid(promoArray[0][7],"Other");
	displayjGrid(phoneArray[0][0],"Promo0");
	displayjGrid(phoneArray[0][1],"Promo1");
	displayjGrid(phoneArray[0][2],"Promo2");
	displayjGrid(phoneArray[0][3],"Promo3");
	displayjGrid(phoneArray[0][4],"Promo4");
	$('input[name=channel]').css({
			"visibility": "hidden"
	});
	$('.tab1').multitabs();
	
	var $filterCheckboxes = $('input[name="channel"]');
	channelCount = $filterCheckboxes.length;
	selectedFilters = {};	
	$("#Channel_Option_0").click();  // click on Agents as default channel
	
	$("#export_unboxd").click(function() {	
		exportToUnboxd();
	});
	
	$(".top_level").on("click", function() {
	 	for (var i=0; i<$(this).children().length; i++)
	 	{
	 		if ($(this).children()[i].className.indexOf("tab__header--active") > -1)
	 		{
	 			activeTopTab = $(this).children()[i].innerText;
	 			break;
	 		}
	 	}
	 	var i = 0;
	 	switch (selectedChannel) {
	 		case "PrepaidAgents":
	 			i = 1;
	 			break;
	 		case "AppleRetail":
	 			i=2;
	 			break;
	 		case "BestBuy":
	 			i = 3;
	 			break;
	 		case "Costco":
	 			i = 4;
	 			break;
	 		case "Military":
	 			i = 5;
	 			break;
	 		case "Walmart":
	 			i = 6;
	 			break;
	 			
	 	}
	 	switch (activeTopTab) {
	 		case "Phones":
	 			$("#jqGridTablet").clearGridData();	
				$("#jqGridTablet").jqGrid('setGridParam', {data:promoArray[i][1]});
				$("#jqGridTablet").trigger("reloadGrid");	
				break; 	
	 		case "Tablets/Connected Devices":
	 			$("#jqGridTablet").clearGridData();	
				$("#jqGridTablet").jqGrid('setGridParam', {data:promoArray[i][2]});
				$("#jqGridTablet").trigger("reloadGrid");	
				break; 			
	 		case "Loyalty":
	 			$("#jqGridLoyalty").clearGridData();	
				$("#jqGridLoyalty").jqGrid('setGridParam', {data:promoArray[i][3]});
				$("#jqGridLoyalty").trigger("reloadGrid");	
				break;
	 		case "Entertainment":
	 			$("#jqGridEntertainment").clearGridData();	
				$("#jqGridEntertainment").jqGrid('setGridParam', {data:promoArray[i][4]});
				$("#jqGridEntertainment").trigger("reloadGrid");	
				break;
	 		case "Prepaid":
	 			$("#jqGridPrepaid").clearGridData();	
				$("#jqGridPrepaid").jqGrid('setGridParam', {data:promoArray[i][5]});
				$("#jqGridPrepaid").trigger("reloadGrid");	
				break;
	 		case "Priceplan":
	 			$("#jqGridPriceplan").clearGridData();	
				$("#jqGridPriceplan").jqGrid('setGridParam', {data:promoArray[i][6]});
				$("#jqGridPriceplan").trigger("reloadGrid");	
				break;
				
			case "Accessories":
				$("#jqGridAccessories").clearGridData();
				$("#jqGridAccessories").jqGrid('setGridParam', {data:promoArray[i][8]});
				$("#jqGridAccessories").trigger("reloadGrid");
				break;
				
	 		case "Other":
	 			$("#jqGridOther").clearGridData();	
				$("#jqGridOther").jqGrid('setGridParam', {data:promoArray[i][7]});
				$("#jqGridOther").trigger("reloadGrid");	
				break;
				
				
	 	}
		dynamicFilterData(selectedFilters);
	 	//$("input#filterInput").focus();
	});	
	$(".sub_level").on("click", function() {
	 	for (var i=0; i<$(this).children().length; i++)
	 	{
	 		if ($(this).children()[i].className.indexOf("tab__header--active") > -1)
	 		{
	 			activeSubTab = $(this).children()[i].innerText;
	 			break;
	 		}
	 	}
	 	var i = 0;
	 	switch (selectedChannel) {
	 		case "PrepaidAgents":
	 			i = 1;
	 			break;
	 		case "AppleRetail":
	 			i=2;
	 			break;
	 		case "BestBuy":
	 			i = 3;
	 			break;
	 		case "Costco":
	 			i = 4;
	 			break;
	 		case "Military":
	 			i = 5;
	 			break;
	 		case "Walmart":
	 			i = 6;
	 			break;
 			
	 	}
	 	
	 	switch (activeSubTab) {
	 		case "All":
	 			$("#jqGridPromo0").clearGridData();	
				$("#jqGridPromo0").jqGrid('setGridParam', {data:phoneArray[i][0]});
				$("#jqGridPromo0").trigger("reloadGrid");	
				break; 			
	 		case "Apple":
	 			$("#jqGridPromo1").clearGridData();	
				$("#jqGridPromo1").jqGrid('setGridParam', {data:phoneArray[i][1]});
				$("#jqGridPromo1").trigger("reloadGrid");	
				break;	 	
	 		case "Samsung":
	 			$("#jqGridPromo2").clearGridData();	
				$("#jqGridPromo2").jqGrid('setGridParam', {data:phoneArray[i][2]});
				$("#jqGridPromo2").trigger("reloadGrid");	
				break;
	 		case "Google":
	 			$("#jqGridPromo3").clearGridData();	
				$("#jqGridPromo3").jqGrid('setGridParam', {data:phoneArray[i][3]});
				$("#jqGridPromo3").trigger("reloadGrid");	
				break;
	 		case "Other":
	 			$("#jqGridPromo4").clearGridData();	
				$("#jqGridPromo4").jqGrid('setGridParam', {data:phoneArray[i][4]});
				$("#jqGridPromo4").trigger("reloadGrid");	
				break;		
	 	}
		dynamicFilterData(selectedFilters);
	 	//$("input#filterInput").focus();
	});	
	// change target of OST 
	$(document).on('click', 'a',function(){
		if ($(this)[0].innerHTML.indexOf('<img') == -1)	// this is not a simple href
		   $(this).attr("target","_blank");
	}); 
	var tables = $('table[id^="jqGrid"]');
	var input = $("input#filterInput");
	
	$('#aspnetForm').keydown(function(e){
    if (e.keyCode === 13) { // If Enter key pressed
        dynamicFilterData(selectedFilters);
        //$('#searchimage').click();
    	}
	});
	
	$("#searchimage").click(function() 	{
		dynamicFilterData(selectedFilters);
	});
	
	input.keyup(function() // On key presses
	{	
		if (input.val().length == 0 || input.val().length > 2)
		{
			/*for (i=0; i<tables.length;i++)
			{
				table = tables[i];
				{
					table.innerHTML = table.innerHTML.replace(/<\/?mark[^>]*>/g,"");
				}
				table.find('tr').each(function (row) {
					$(this).show();  
				});
			}*/
			dynamicFilterData(selectedFilters);
		}	
	});
	
	input.bind("mouseup", function(e){
	  var $input = $(this),
	      oldValue = $input.val();
	
	  if (oldValue == "") return;
	
	  // When this event is fired after clicking on the clear button
	  // the value is not cleared yet. We have to wait for it.
	  setTimeout(function(){
	    var newValue = $input.val();
	
	    if (newValue == ""){
	    	// gotcha
			/*for (i=0; i<tables.length;i++)
			{
				table = tables[i];
				{
					table.innerHTML = table.innerHTML.replace(/<\/?mark[^>]*>/g,"");
				}
				table.find('tr').each(function (row) {
					$(this).show();  
				});
			}*/
			dynamicFilterData(selectedFilters);
	    }
	  }, 1);
	});	
});
function cbChange(obj) {
    var cbs = document.getElementsByClassName("cb");
    for (var i = 0; i < cbs.length; i++) {
        cbs[i].checked = false;
        //cbs[i].parentNode.style.opacity='0.5';
        cbs[i].parentNode.parentNode.style.background="#FFF";
        cbs[i].parentNode.parentNode.style.borderBottom= "0px";

    }
    obj.checked = true;
    //obj.parentNode.style.opacity='1';
    // 06/01/22 - change blue background to border
    //obj.parentNode.parentNode.style.background="#0288D1";
    obj.parentNode.parentNode.style.borderBottom= "5px solid #ee0000";

    selectedChannel = obj.value;
    if (promoArray.length == 0)
    	return;
    if (selectedChannel == "Agents")
    {
	$('#tab__header-9').hide();    
    	reloadGrids(0);
	}
	else if (selectedChannel == "PrepaidAgents")
    {
	  	$('#tab__header-9').hide();  
		reloadGrids(1);	
	}
	else if (selectedChannel == "AppleRetail")
    {
	    	$('#tab__header-9').hide();
		reloadGrids(2);
	}
	else if (selectedChannel == "BestBuy")
    {
	    	$('#tab__header-9').hide();
		reloadGrids(3);	
	}
	else if (selectedChannel == "Costco")
    {
	    	$('#tab__header-9').hide();
		reloadGrids(4);	
	}
	else if (selectedChannel == "Military")
    {
	    	$('#tab__header-9').hide();
		reloadGrids(5);	
	}
	else if (selectedChannel == "Walmart")
    {
	    	$('#tab__header-9').hide();
		reloadGrids(6);	
	}
	
	//$("input#filterInput").focus();
}


function setColModel()
{

	colModel.push({label: 'Promotion/OST Link',name:'project',formatter:formatname, width: 130, align: 'left', sortable:true});
	colModel.push({label: 'Start',name:'dates',width: 44, formatter:formatdate, align: 'center', sortable:true});
	colModel.push({label: 'Key Points', name: 'keypoints',formatter:formatkeypoints, width: 515,align: 'left', sortable:false });
	colModel.push({label: 'Eligibility', name: 'eligible', formatter:formateligibility, width: 82,align: 'left', sortable:false });
}

function formatname(cellValue, options, rowObject) {

	var cellHtml = "<div style='white-space:pre-wrap;text-align:left;width:130px'>" + cellValue + "</div>";
    return cellHtml;

}

function formatkeypoints(cellValue, options, rowObject) {

	var cellHtml = "<div style='white-space:pre;'>" + cellValue + "</div>";
    return cellHtml;

}

function formateligibility(cellValue, options, rowObject) {

	var cellHtml = "<div style='white-space:pre-wrap;text-align:center'>" + cellValue + "</div>";
    return cellHtml;

}

function formatdate(cellValue, options, rowObject) {
	var cellHtml = "";
	var today = moment(new Date());
	var formatToday = today.format('YYYY-MM-DD');
	var launchDate = moment(new Date (rowObject.launchdate._d));
	//var launchdays = launchDate.diff(today, 'days'); //moment.duration(launchDate.diff(today)).asDays();
	var launchdays = dateDiff( today,launchDate);
	var endDate = moment(new Date (rowObject.enddate._d));
	//var enddays = endDate.diff(today, 'days'); //moment.duration(endDate.diff(today)).asDays();
	var enddays = dateDiff(today,endDate);
	
	var backgroundcolor = '';
	var color = '#000';
	//	if (launchdays == 0)
	if (launchDate.format('YYYY-MM-DD') == formatToday)
	{
		backgroundcolor =  '#000000'; // green 00ac3e changed to black 6/3/22
		color = '#FFF';
	}
	/* do not care for ending soon or ending today for indirect
		
	else  if (enddays == 1 || enddays == 2)
		backgroundcolor = '#ffbc3d';   // yellow
	else if (enddays == 0)
	{
		backgroundcolor = '#ee0000';   // red
		color = '#FFF';
	}*/

	//rowObject.launchdate._d
	//rowObject.enddate._d
	
	var cellHtml = "<div style='width:100%;background-color:" + backgroundcolor + "; color:" + color + "'>" + cellValue + "</div>";
    return cellHtml;
}

function displayjGrid(events,gridID)
{
	$("#jqGrid" + gridID).jqGrid({
		regional : 'en',
        datatype: "local",
        data: events,
        colModel: colModel,
		loadonce: true,
		width: '810',
        height: 'auto',
        rowNum: 500,
        //maxHeight: 1000,
        pager: "#jqGridPager",
		viewrecords: true,
		shrinkToFit: false,
		altRows : true,
		allowSorting : true,
		allowMultiSorting : true,
		//Sorting more than one column while initializing the grid itself. If direction is not specified, by default it takes as ascending.
		sortSettings: { sortedColumns: [{ field: "dates", direction: "ascending" }, { field: "project" }] }			
    	})		
}
function reloadGrids(i) 
{
		$("#jqGridChannel").clearGridData();
		$("#jqGridChannel").jqGrid('setGridParam', {data:promoArray[i][0]});
		$("#jqGridChannel").trigger("reloadGrid");
		$("#jqGridPromo0").clearGridData();	
		$("#jqGridPromo1").clearGridData();
		$("#jqGridPromo2").clearGridData();
		$("#jqGridPromo3").clearGridData();
		$("#jqGridPromo4").clearGridData();
		$("#jqGridPromo0").jqGrid('setGridParam', {data:phoneArray[i][0]});
		$("#jqGridPromo0").trigger("reloadGrid");	
		$("#jqGridPromo1").jqGrid('setGridParam', {data:phoneArray[i][1]});
		$("#jqGridPromo1").trigger("reloadGrid");	
		$("#jqGridPromo2").jqGrid('setGridParam', {data:phoneArray[i][2]});
		$("#jqGridPromo2").trigger("reloadGrid");	
		$("#jqGridPromo3").jqGrid('setGridParam', {data:phoneArray[i][3]});
		$("#jqGridPromo3").trigger("reloadGrid");	
		$("#jqGridPromo4").jqGrid('setGridParam', {data:phoneArray[i][4]});
		$("#jqGridPromo4").trigger("reloadGrid");	
		$("#jqGridTablet").clearGridData();
		$("#jqGridTablet").jqGrid('setGridParam', {data:promoArray[i][2]});
		$("#jqGridTablet").trigger("reloadGrid");
		$("#jqGridLoyalty").clearGridData();	
		$("#jqGridLoyalty").jqGrid('setGridParam', {data:promoArray[i][3]});
		$("#jqGridLoyalty").trigger("reloadGrid");
		$("#jqGridEntertainment").clearGridData();	
		$("#jqGridEntertainment").jqGrid('setGridParam', {data:promoArray[i][4]});
		$("#jqGridEntertainment").trigger("reloadGrid");		
		$("#jqGridPrepaid").clearGridData();	
		$("#jqGridPrepaid").jqGrid('setGridParam', {data:promoArray[i][5]});
		$("#jqGridPrepaid").trigger("reloadGrid");
		$("#jqGridPriceplan").clearGridData();
		$("#jqGridPriceplan").jqGrid('setGridParam', {data:promoArray[i][6]});
		$("#jqGridPriceplan").trigger("reloadGrid");
		$("#jqGridAccessories").clearGridData();
		$("#jqGridAccessories").jqGrid('setGridParam',{data:promoArray[i][8]});
		$("#jqGridAccessories").trigger("reloadGrid");
		$("#jqGridOther").clearGridData();
		$("#jqGridOther").jqGrid('setGridParam', {data:promoArray[i][7]});
		$("#jqGridOther").trigger("reloadGrid");
		dynamicFilterData(selectedFilters);

}
function dynamicFilterData(selectedFilters)
{

	var input = $("input#filterInput");
	var tables = $('table[id^="jqGrid"]');
	var colTotal=4;
	// remove all "marked" text
	for (t=0; t<tables.length;t++)
	{
	 	table = tables[t];
		{
			table.innerHTML = table.innerHTML.replace(/<\/?mark[^>]*>/g,"");
		}
		var tableId = tables[t].id;
		var $table = $("#" + tables[t].id );
		var tr = table.getElementsByTagName("tr");
		var regex = new RegExp(input.val().toLowerCase(), 'gi');
		if (input.val().toLowerCase() != '' && input.val().toLowerCase() != 'search...')
		{		
			filter = input.val().toLowerCase();
	        // Loop through all table rows, and hide those who don't match the        search query
			for (i = 1; i < tr.length; i++) 
			{
	            tr[i].style.display = "none";
	            for(var j=0; j<colTotal; j++)
			    {
			        td = tr[i].getElementsByTagName("td")[j];      
			        if (td) 
			        {
			            if (td.innerHTML.toLowerCase().indexOf(filter) > -1)                               
			            {
			                tr[i].style.display = "";
			                var response = td.innerHTML.replace(regex, function(str) {
					            return "<mark>" + str + "</mark>"
					        })
					        td.innerHTML = response;
			         	}
			     	}
			  	}
			}			
		}
		else
		{
			for (i = 1; i < tr.length; i++) 
			{
	            tr[i].style.display = "";
			}
		}
	}
}

function matchTextBoxSearch(row)
{
	//var list = $("table.ms-listviewtable");
	// Table row of the items in my list.
	//var listItems = $("table.ms-listviewtable tr:not(.ms-viewheadertr)");
	// Our filter input.
	var input = $("input#filterInput");
	if (input.val().toLowerCase() != '' && input.val().toLowerCase() != 'search...')
	{
	    //listItems.each(function() // for each items in our list
	    {
			var text = row.text().toLowerCase(); // get all the text values of that list item
			if (text.indexOf(input.val().toLowerCase()) != -1) // does it match the text of our filter?
			{ 
			    var regex = new RegExp(input.val().toLowerCase(), 'gi');
		        var response = row[0].innerHTML.replace(regex, function(str) {
		            return "<mark>" + str + "</mark>"
		        })
		        row[0].innerHTML = response;		    
			    return true;
			}
			else
			{
			     return false; // nope! hide it!
			}
		}
	}
	else
		return true;
}
function pushElements(i,element,promotiontype,oems)
{

	var launchDate = new Date(element.launchdate);
	var promoEndDate = new Date(element.enddate);
	launchDate = moment.utc(launchDate);
	promoEndDate = moment.utc(promoEndDate);
	element.launchdate = launchDate;
	element.enddate = promoEndDate;
	
					
	if (element.loyalty == "Yes")
	{
		promoArray[i][3].push(element);	
		return;
	}
	
	// write to the All bucket except for Loyalty 
	promoArray[i][0].push(element);
					
	
	switch(promotiontype) { 
		case "Phone Promo": 
			promoArray[i][1].push(element);
			phoneArray[i][0].push(element);	
			for (var k=0; k<oems.length; k++)
			{
				var oem = oems[k];
				switch(oem) {
				case "Apple":
					phoneArray[i][1].push(element);
					break;
				case "Samsung":
					phoneArray[i][2].push(element);
					break;
				case "Google":
					phoneArray[i][3].push(element);
					break;
				case "Other":
					phoneArray[i][4].push(element);
					break;
				}
			}
			break;
		case "Tablets/Connected Device Promo": 
		case "Tablet/Connected Promo":
			promoArray[i][2].push(element);
			break;
		case "Entertainment Promo": 
			promoArray[i][4].push(element);
			break;
		case "Priceplan Promo": 
			promoArray[i][6].push(element);
			break;
		case "Prepaid Promo": 
			promoArray[i][5].push(element);
			break;
		case "Accessory Promo":
			promoArray[i][8].push(element);
			break;
		case "Other Promo": 
			promoArray[i][7].push(element);
			break;
	}
}

function dateDiff (startDate, endDate)
{ 

	var count = 0;
	var curDate = startDate;
	while (curDate < endDate) {
		//var dayOfWeek = curDate.getDay();
		//if(!((dayOfWeek == 6) || (dayOfWeek == 0))) == dont need to exclude weekend
		count++;
		//curDate.setDate(curDate.getDate() + 1);
		curDate.add(1, 'days');
	}
	return count;
}
