    var promoArray=[[],[]];var phoneArray=[[],[]];
	var retailArray = ["Retail"];
	var telesalesArray = ["Telesales"];
	var smbArray = ["SMB"];
	var indirectArray = ["Indirect Agents","Prepaid Only Agents","Indirect National Retail"];
	var digitalArray = ["VZ.com","Verizon Mobile App","Verizon Up","DFill"];
	var careArray = ["Wireless Care","B2B","Dfill",".com Chatbot"];
	var homeArray = ["Fios Care","Strategic Sales"];
	var colModel = [];
	var selectedChannel = "";
	var activeTopTab = "", activeSubTab;
	var selectedFilters;
	
    
    $(document).ready(function () {
	for(var i = 0; i<6; i++){
    	promoArray[i]= new Array();
    	phoneArray[i]= new Array();
      	for(var j = 0; j<9; j++){
         	promoArray[i][j] = new Array();
        }
      	for(var j = 0; j<5; j++){
         	phoneArray[i][j] = new Array();
        }

    }
	var today = moment(new Date()).format("YYYY-MM-DD");
    for(i = 0; i < promosArray.length;i++) {
    	item = promosArray[i];
		var launchDate = new Date(item.launchdate);
		var promoEndDate = new Date(item.enddate);
		var channels = item.channel;
		var promotiontype = item.promo;
		var oems = item.oem;
		launchDate = moment.utc(launchDate);
		promoEndDate = moment.utc(promoEndDate);
		var launchTime = moment(launchDate).format("YYYY-MM-DD");
		var endTime = moment(promoEndDate).format("YYYY-MM-DD");
		if (launchTime > today || endTime < today)
			continue;
		var alreadyPushedIndirect = false;
		var alreadyPushedCare = false;

		for (var j in channels) {
			if ($.inArray(channels[j],retailArray) != -1)
			{
				pushElements(0,item,promotiontype,oems);
			}
			if ($.inArray(channels[j],telesalesArray) != -1)
			{
				pushElements(1,item,promotiontype,oems);
			}

			if ($.inArray(channels[j],indirectArray) != -1)
			{
				if (!alreadyPushedIndirect)
				{
					pushElements(2,item,promotiontype,oems);
					alreadyPushedIndirect = true;
				}
			}

			if ($.inArray(channels[j],careArray) != -1)
			{
				if (!alreadyPushedCare) 
				{
					pushElements(3,item,promotiontype,oems);
					alreadyPushedCare = true;
				}
			}
			if ($.inArray(channels[j],smbArray) != -1)
			{
				pushElements(4,item,promotiontype,oems);
			}
		}

	}
	
	setColModel();
	displayjGrid(promoArray[0][0],"Channel");
	displayjGrid(promoArray[0][2],"Tablet");
	displayjGrid(promoArray[0][3],"Accessory");
	displayjGrid(promoArray[0][4],"Entertainment");
	displayjGrid(promoArray[0][5],"Other");	
	displayjGrid(promoArray[0][6],"Home");
	displayjGrid(promoArray[0][8],"5GHome");
	displayjGrid(promoArray[0][7],"Loyalty");
	displayjGrid(phoneArray[0][0],"Promo0");
	displayjGrid(phoneArray[0][1],"Promo1");
	displayjGrid(phoneArray[0][2],"Promo2");
	displayjGrid(phoneArray[0][3],"Promo3");
	displayjGrid(phoneArray[0][4],"Promo4");

	$("input[name=channel]").css({
			"visibility": "hidden"
	});
	$(".tab1").multitabs();
	var $filterCheckboxes = $("input[name=channel]");
	channelCount = $filterCheckboxes.length;
	selectedFilters = {};	
	$("#Channel_Option_0").click();
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
	 		case "Telesales":
	 			i = 1;
	 			break;
	 		case "Indirect":
	 			i=2;
	 			break;
	 		case "Care":
	 			i = 3;
	 			break;
	 		case "SMB":
	 			i = 4;
	 			break;
				
	 	}
	 	switch (activeTopTab) {
	 		case "Tablets/Connected Devices":
	 			$("#jqGridTablet").clearGridData();	
				$("#jqGridTablet").jqGrid("setGridParam", {data:promoArray[i][2]});
				$("#jqGridTablet").trigger("reloadGrid");	
				break; 			
	 		case "Accessories":
	 			$("#jqGridAccessory").clearGridData();	
				$("#jqGridAccessory").jqGrid("setGridParam", {data:promoArray[i][3]});
				$("#jqGridAccessory").trigger("reloadGrid");	
				break;	 	
	 		case "Entertainment":
	 			$("#jqGridEntertainment").clearGridData();	
				$("#jqGridEntertainment").jqGrid("setGridParam", {data:promoArray[i][4]});
				$("#jqGridEntertainment").trigger("reloadGrid");	
				break;
	 		case "Other":
	 			$("#jqGridOther").clearGridData();	
				$("#jqGridOther").jqGrid("setGridParam", {data:promoArray[i][5]});
				$("#jqGridOther").trigger("reloadGrid");	
				break;
	 		case "Fios/Home Internet":
	 			$("#jqGridHome").clearGridData();	
				$("#jqGridHome").jqGrid("setGridParam", {data:promoArray[i][6]});
				$("#jqGridHome").trigger("reloadGrid");	
				break;
	 		case "Loyalty":
	 			$("#jqGridLoyalty").clearGridData();	
				$("#jqGridLoyalty").jqGrid('setGridParam', {data:promoArray[i][7]});
				$("#jqGridLoyalty").trigger("reloadGrid");	
				break;
	 		case "5G Home":
	 			$("#jqGrid5GHome").clearGridData();	
				$("#jqGrid5GHome").jqGrid('setGridParam', {data:promoArray[i][8]});
				$("#jqGrid5GHome").trigger("reloadGrid");	
				break;
				
				
	 	}

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
	 		case "Telesales":
	 			i = 1;
	 			break;
	 		case "Indirect":
	 			i=2;
	 			break;
	 		case "Care":
	 			i = 3;
	 			break;
	 		case "SMB":
	 			i = 4;
	 			break;
				
	 	}
	 	
	 	switch (activeSubTab) {
	 		case "All":
	 			$("#jqGridPromo0").clearGridData();	
				$("#jqGridPromo0").jqGrid("setGridParam", {data:phoneArray[i][0]});
				$("#jqGridPromo0").trigger("reloadGrid");	
				break; 			
	 		case "Apple":
	 			$("#jqGridPromo1").clearGridData();	
				$("#jqGridPromo1").jqGrid("setGridParam", {data:phoneArray[i][1]});
				$("#jqGridPromo1").trigger("reloadGrid");	
				break;	 	
	 		case "Samsung":
	 			$("#jqGridPromo2").clearGridData();	
				$("#jqGridPromo2").jqGrid("setGridParam", {data:phoneArray[i][2]});
				$("#jqGridPromo2").trigger("reloadGrid");	
				break;
	 		case "Google":
	 			$("#jqGridPromo3").clearGridData();	
				$("#jqGridPromo3").jqGrid("setGridParam", {data:phoneArray[i][3]});
				$("#jqGridPromo3").trigger("reloadGrid");	
				break;
	 		case "Other":
	 			$("#jqGridPromo4").clearGridData();	
				$("#jqGridPromo4").jqGrid("setGridParam", {data:phoneArray[i][4]});
				$("#jqGridPromo4").trigger("reloadGrid");	
				break;		
	 	}

	});	
	$(document).on("click", "a",function(){
		if ($(this)[0].innerHTML.indexOf("<img") == -1)	
		   $(this).attr("target","_blank");
	}); 
	var tables = $("table[id^=jqGrid]");
	var input = $("input#filterInput");
	
	$("#aspnetForm").keydown(function(e){
    if (e.keyCode === 13) { 
        dynamicFilterData(selectedFilters);
    	}
	});
	$("#searchimage").click(function() 	{
		dynamicFilterData(selectedFilters);
	});
	
	input.keyup(function() 
	{	
		if (input.val().length == 0 || input.val().length > 2)
		{
			dynamicFilterData(selectedFilters);
		}	
	});
	input.bind("mouseup", function(e){
	  var $input = $(this),
	      oldValue = $input.val();
	
	  if (oldValue == "") return;

	  setTimeout(function(){
	    var newValue = $input.val();
	
	    if (newValue == ""){

			dynamicFilterData(selectedFilters);
	    }
	  }, 1);
	});	
});
function cbChange(obj) {
    var cbs = document.getElementsByClassName("cb");
    for (var i = 0; i < cbs.length; i++) {
        cbs[i].checked = false;
        cbs[i].parentNode.parentNode.style.background="#FFF";
        cbs[i].parentNode.parentNode.style.borderBottom= "0px";		
    }
    obj.checked = true;
    //obj.parentNode.parentNode.style.background="#0288D1";
    obj.parentNode.parentNode.style.borderBottom= "5px solid #ee0000";


    selectedChannel = obj.value;
    if (promoArray.length == 0)
    	return;
    if (selectedChannel == "Retail")
    {
    	reloadGrids(0);
	}
	else if (selectedChannel == "Telesales")
    {
		reloadGrids(1);	
	}
	else if (selectedChannel == "Indirect")
    {
		reloadGrids(2);
	}
	else if (selectedChannel == "Care")
    {
		reloadGrids(3);	
	}
	else if (selectedChannel == "SMB")
    {
		reloadGrids(4);	
	}

}


function setColModel()
{

	colModel.push({label: "Promotion/OST Link<br>(Verizon log-in required)",name:"project",width: 185, align: "left", sortable:true});
	colModel.push({label: "Dates",name:"dates",width: 80, formatter:formatdate, align: "center", sortable:true});

	colModel.push({label: "AAL", name: "aal", width: 40, formatter: formateligibility,align: "center", sortable:true });
	colModel.push({label: "BYOD", name: "byod", width: 45, formatter: formateligibility,align: "center", sortable:true });
	colModel.push({label: "New", name: "newa", width: 45, formatter: formateligibility, align: "center", sortable:true });
	colModel.push({label: "Port", name: "port", width: 45, formatter: formateligibility, align: "center", sortable:true });
	colModel.push({label: "Prepaid", name: "pre", width: 55, formatter: formateligibility, align: "center", sortable:true });

	colModel.push({label: "Upgrade", name: "upg", width: 58, formatter: formateligibility, align: "center", sortable:true });
	colModel.push({label: "Digital Exclusive", name: "dig", width: 70, formatter: formateligibility, align: "center", sortable:true });

	colModel.push({label: "Plan Required", name: "plan", width: 70, formatter: formateligibility, align: "center", sortable:true });

	colModel.push({label: "OST", name: "ost", width: 0, align: "center", hidden:true,sortable:false, class:"underscore" });
	colModel.push({label: "Launch Date", name: "launchdate", width: 0, align: "center", hidden:true, sortable:false });
	colModel.push({label: "End Date", name: "enddate", width: 0, align: "center", hidden:true, sortable:false });

}

function formateligibility(cellValue, options, rowObject) {

	var cellHtml = "";
	if (cellValue == "Yes")
		cellHtml = "<span style=\"font-size: 100%;\">&#x2714;</span>";
    return cellHtml;
}

function formatdate(cellValue, options, rowObject) {

	var cellHtml = "";
	var today = moment.utc(new Date());
	var formatToday = today.format("YYYY-MM-DD");
	var launchDate = moment.utc(new Date (rowObject.launchdate._d));
	var launchdays = dateDiff( today,launchDate);
	var endDate = moment.utc(new Date (rowObject.enddate._d));
	var enddays = dateDiff(today,endDate);
	
	var backgroundcolor = "#FFF";
	var color = "#000";
	if (launchDate.format("YYYY-MM-DD") == formatToday)
	{
		backgroundcolor =  "#000000"; // change from 00ac3e to 000000 on 6/3/22
		color = "#FFF";
	}
	else  if (enddays == 1 || enddays == 2)
		backgroundcolor = "#FFFF00";  
	else if (enddays == 0)
	{
		backgroundcolor = "#d52b1e"; 
		color = "#FFF";
	}

	var cellHtml = "<div style='width:100%;height:101%;background-color:" + backgroundcolor + "; color:" + color + "'>" + cellValue + "</div>";
    return cellHtml;
}

function displayjGrid(events,gridID)
{
	$("#jqGrid" + gridID).jqGrid({
		regional : "en",
        datatype: "local",
        data: events,
        colModel: colModel,
		loadonce: true,
		width: "auto",
        height: "auto",
        rowNum: 500,
        pager: "#jqGridPager",
		viewrecords: true,
		shrinkToFit: false,
		altRows : true	
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
		$("#jqGridAccessory").clearGridData();
		$("#jqGridAccessory").jqGrid('setGridParam', {data:promoArray[i][3]});
		$("#jqGridAccessory").trigger("reloadGrid");
		$("#jqGridEnterntainment").clearGridData();
		$("#jqGridEnterntainment").jqGrid('setGridParam', {data:promoArray[i][4]});
		$("#jqGridEnterntainment").trigger("reloadGrid");
		$("#jqGridOther").clearGridData();
		$("#jqGridOther").jqGrid('setGridParam', {data:promoArray[i][5]});
		$("#jqGridOther").trigger("reloadGrid");
		$("#jqGridHome").clearGridData();	
		$("#jqGridHome").jqGrid('setGridParam', {data:promoArray[i][6]});
		$("#jqGridHome").trigger("reloadGrid");	
		$("#jqGridLoyalty").clearGridData();	
		$("#jqGridLoyalty").jqGrid('setGridParam', {data:promoArray[i][7]});
		$("#jqGridLoyalty").trigger("reloadGrid");
		$("#jqGrid5GHome").clearGridData();	
		$("#jqGrid5GHome").jqGrid('setGridParam', {data:promoArray[i][8]});
		$("#jqGrid5GHome").trigger("reloadGrid");	
		if (i!=4)  // not SMB tab
		{
			$("#tab__header-4").css({"display": "inline"});
			$("#tab__header-5").css({"display": "inline"});
			$("#tab__header-6").css({"display": "inline"});
			$("#tab__header-7").css({"display": "inline"});
			$("#tab__header-8").css({"display": "inline"});
			$("#tab__header-apple").css({"visibility": "visible"});
			$("#tab__header-samsung").css({"visibility": "visible"});
			$("#tab__header-google").css({"visibility": "visible"});
			$("#tab__header-other").css({"visibility": "visible"});
		}	
		else
		{
			//$("#tab__header-4").css({"display": "none"});11/17/21 show accessories for B2B
			$("#tab__header-5").css({"display": "none"});
			$("#tab__header-6").css({"display": "none"});
			$("#tab__header-7").css({"display": "none"});
			$("#tab__header-8").css({"display": "none"});
			$("#tab__header-apple").css({"visibility": "hidden"});
			$("#tab__header-samsung").css({"visibility": "hidden"});
			$("#tab__header-google").css({"visibility": "hidden"});
			$("#tab__header-other").css({"visibility": "hidden"});
			if (activeTopTab == "Phones")
			{
				activeSubTab = "All";
				$("#tab__header_all").click();
			}
		}		
}
function dynamicFilterData(selectedFilters)
{

	var tables = $("table[id^=jqGrid]")
	for (i=0; i<tables.length;i++)
	{
	 	table = tables[i];
		{
			table.innerHTML = table.innerHTML.replace(/<\/?mark[^>]*>/g,"");
		}
		var tableId = tables[i].id;
		var $table = $("#" + tables[i].id );
	    $table.find("tr").each(function (row) {
			$(this).show();  
			if (matchTextBoxSearch($(this)))
			{
				var a=1;
			}
			else
			{
				$(this).hide();
			}
		});
	}
}

function matchTextBoxSearch(row)
{
	var input = $("input#filterInput");
	if (input.val().toLowerCase() != "" && input.val().toLowerCase() != "search...")
	{
	    {
			var text = row.text().toLowerCase();
			if (text.indexOf(input.val().toLowerCase()) != -1)
			{ 
			    var regex = new RegExp(input.val().toLowerCase(), "gi");
		        var response = row[0].innerHTML.replace(regex, function(str) {
		            return "<mark>" + str + "</mark>"
		        })
		        row[0].innerHTML = response;		    
			    return true;
			}
			else
			{
			     return false;
			}
		}
	}
	else
		return true;
}
function pushElements(i,element,promotiontype,oems)
{
	if (element.home == "Mobile" || element.home== "Both")
		promoArray[i][0].push(element);
					
	if (element.home == "Home" || element.home == "Both")
		promoArray[i][6].push(element);

	if (element.is5G )
		promoArray[i][8].push(element);

	//if (oems == 'Business') - do not need this for WIX
	{
		var launchDate = new Date(element.launchdate);
		var promoEndDate = new Date(element.enddate);
		launchDate = moment.utc(launchDate);
		promoEndDate = moment.utc(promoEndDate);
		element.launchdate = launchDate;
		element.enddate = promoEndDate;
	}
	if (element.loyalty == "Yes")
	{
		promoArray[i][7].push(element);	
		return;
	}	
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
		case "Accessory Promo": 
			promoArray[i][3].push(element);
			break;
		case "Entertainment Promo": 
			promoArray[i][4].push(element);
			break;
		case "Other Promo": 
			promoArray[i][5].push(element);
			break;
	}
}
function dateDiff (startDate, endDate)
{ 

	var count = 0;
	var curDate = startDate;
	while (curDate < endDate) {
		count++;
		curDate.add(1, "days");
	}
	return count;
}	
