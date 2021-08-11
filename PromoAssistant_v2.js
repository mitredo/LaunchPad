/* ------------------------------PromoAssistant-v2.html    ----------------------------
	08/03/21 - change Telesales to Inside Sales as per Lisa
*/
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

$(document).ready(function(){
	//hide checkbox for filter
	//ctx.load(web);	
	$('input[name=channel]').css({
			"visibility": "hidden"
	});
	for(var i = 0; i<6; i++){
    	promoArray[i]= new Array();
    	phoneArray[i]= new Array();
      	for(var j = 0; j<8; j++){
         	promoArray[i][j] = new Array();
        }
      	for(var j = 0; j<5; j++){
         	phoneArray[i][j] = new Array();
        }

    }
	//getPromotions(); - this is now triggered by the top web part, after SMB has been collected
	
	/*$(function () {
            ExecuteOrDelayUntilScriptLoaded(testSMB, "sp.js");
    });*/
	$('.tab1').multitabs();
	
	var $filterCheckboxes = $('input[name="channel"]');
	channelCount = $filterCheckboxes.length;
	selectedFilters = {};	
	$("#Channel_Option_0").click();  // click on Retail as default channel
	
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
	 		case "Telesales":
	 			i = 1;
	 			break;
	 		case "Indirect":
	 			i=2;
	 			break;
	 		case "Care":
	 			i = 3;
	 			break;
	 	}
	 	switch (activeTopTab) {
	 		case "Tablets/Connected Devices":
	 			$("#jqGridTablet").clearGridData();	
				$("#jqGridTablet").jqGrid('setGridParam', {data:promoArray[i][2]});
				$("#jqGridTablet").trigger("reloadGrid");	
				break; 			
	 		case "Accessories":
	 			$("#jqGridAccessory").clearGridData();	
				$("#jqGridAccessory").jqGrid('setGridParam', {data:promoArray[i][3]});
				$("#jqGridAccessory").trigger("reloadGrid");	
				break;	 	
	 		case "Entertainment":
	 			$("#jqGridEntertainment").clearGridData();	
				$("#jqGridEntertainment").jqGrid('setGridParam', {data:promoArray[i][4]});
				$("#jqGridEntertainment").trigger("reloadGrid");	
				break;
	 		case "Other":
	 			$("#jqGridOther").clearGridData();	
				$("#jqGridOther").jqGrid('setGridParam', {data:promoArray[i][5]});
				$("#jqGridOther").trigger("reloadGrid");	
				break;
	 		case "Home":
	 			$("#jqGridHome").clearGridData();	
				$("#jqGridHome").jqGrid('setGridParam', {data:promoArray[i][6]});
				$("#jqGridHome").trigger("reloadGrid");	
				break;
	 		case "Loyalty":
	 			$("#jqGridLoyalty").clearGridData();	
				$("#jqGridLoyalty").jqGrid('setGridParam', {data:promoArray[i][7]});
				$("#jqGridLoyalty").trigger("reloadGrid");	
				break;
				
				
	 	}
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
	 		case "Telesales":
	 			i = 1;
	 			break;
	 		case "Indirect":
	 			i=2;
	 			break;
	 		case "Care":
	 			i = 3;
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

function getPromotions()
{
	// 03/10/2020 - add &$ to select  - this will aleviate issues with too many "multiple person" columns
	var today = new Date();
	var last7Days = new Date();
	var last4Days = new Date();
	var last30Days = new Date();
	today = today.format("yyyy-MM-ddT00:00:00Z");
	last7Days = addDays(today, -7);  // changed from -7
	last7Days = last7Days.format("yyyy-MM-ddT00:00:00Z");
	last4Days = addDays(today, -4);  // changed from -7
	last4Days = last4Days.format("yyyy-MM-ddT00:00:00Z");
	last30Days = addDays(today, -30);  // changed from -7
	last30Days = last30Days.format("yyyy-MM-ddT00:00:00Z");
	
	var retailArray = ['Retail'];
	var telesalesArray = ['Telesales'];
	var indirectArray = ['Indirect Agents','Prepaid Only Agents','Indirect National Retail'];
	//var webArray = ['VZW.com/Consumer', 'My Verizon', 'My Verizon Mobile'];
	//var comArray = ['VZ.com','My Verizon Mobile App','My Fios App'];
	//var careArray = ['Wireless Care','Fios Care'];
	//var otherArray =  ['Telesales','Dfill','Verizon Up','Door To Door','VZ.com','Verizon Mobile App','My Fios App','B2B','N/A'];
	//var homeArray = ['Fios Care','My Fios App','Strategic Sales'];
	var digitalArray = ['VZ.com','Verizon Mobile App','Verizon Up','DFill'];
	var careArray = ['Wireless Care','B2B','Dfill','.com Chatbot'];
	var homeArray = ["Fios Care","Strategic Sales"];
    	
    var url = "https://esites.vzbi.com/sites/HQ_GTM";
	var listname = "GTM Dynamic Brief";
	// remove sort by priority Priority_x0020_Level,
	// use launch date modified instead of null launch date, it does not work  - Launch_x0020_Date_x0020_Modified  .  OLD logic:  Launch_x0020_Date eq datetime'1900-01-01T00:00:00'
	var query = "?$filter=(Launch_x0020_Date ge DateTime'" + last7Days + "' or Promo_x0020_End_x0020_Date_x00201 ge DateTime'" + last4Days + "' or (Promotional_x0020_Timeframe_x003 ge DateTime'" + today + "' )) and (isB2B ne '' and (isB2B eq 'GTM')) and (Priority_x0020_Level eq '1' or Priority_x0020_Level eq '2' or Priority_x0020_Level eq '3' or Priority_x0020_Level eq '4') and Launch_x0020_Type eq 'Promotion' and GTM_x0020_Status eq 'Assigned' and Should_x0020_this_x0020_be_x0020 eq 'No'&$select=ID,isB2B,Project_x0020_Name,Launch_x0020_Date,Launch_x0020_Type,Priority_x0020_Level,GTM_x0020_Status,Promotional_x0020_Timeframe_x003,Should_x0020_this_x0020_be_x0020,Date_x0028_s_x0029_,Training_x0020_Links,Customer_x0020_Eligibility,Channel_x0020_Availability,What_x0020_are_x0020_the_x0020_T,Promotion_x0020_Type,Promotion_x0020_OEM,Parent_x0020_Launch_x0020_Date_x,Parent_x0020_Project_x0020_ID0Id,Customer_x0020_Primary_x0020_Use,Alternate_x0020_Title_x0020__x00&$orderby=Launch_x0020_Date,Project_x0020_Name&$top=800";		
    $.ajax({
    	async: false,
        url: url + "/_api/web/lists/getbytitle('" + listname + "')/items" + query,
        //CAMLViewFields: viewFields,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            //complete(data); // Returns JSON collection of the results
	        var stringData = JSON.stringify(data);
	        var jsonObject = JSON.parse(stringData);
	        var results = jsonObject.d.results;
	        var item;
	        //var today = new Date().format("yyyy/MM/dd");
	        today = moment(new Date()).format('YYYY-MM-DD');

	        for(i = 0; i < results.length;i++) {
	        	item = results[i];
				var launchDate = new Date(results[i].Launch_x0020_Date);
				var promoEndDate = new Date(results[i].Promotional_x0020_Timeframe_x003);
				launchDate = moment(launchDate);
				promoEndDate = moment(promoEndDate);
				var launchTime = moment(launchDate).format('YYYY-MM-DD');
				var endTime = moment(promoEndDate).format('YYYY-MM-DD');
				//var launchdatediff = new Date (launchDate - today);
				//var launchdays = parseInt(launchdatediff/1000/60/60/24,0);
				//var launchdays = launchDate.diff(today, 'days');
				//var launchdays = moment.duration(launchDate.diff(today)).asDays();
				//var launchdays = dateDiff(today, launchDate);
				//				if (launchdays > 0)
				if (launchTime > today || endTime < today)
					continue;
				var status = results[i].GTM_x0020_Status; 
				var dates = item.Date_x0028_s_x0029_;
				dates = dates.replace(/\//g, '.');

				var parentid = results[i].Parent_x0020_Project_x0020_ID0Id;
				var index = 0;
				if (parentid != null)
				{
					index = parentid.toString().indexOf(";");
					if (index >= 0)
						parentid = parentid.substring(0, index);
				}
				else
					parentid = 0;
				var launchtype = results[i].Launch_x0020_Type;
				var channels = results[i].Channel_x0020_Availability.results;
				//r channel = channels.split(',');
				var eligibilities = [];
				if (results[i].Customer_x0020_Eligibility != null)
					eligibilities = results[i].Customer_x0020_Eligibility.results;
				
				var promotiontype = results[i].Promotion_x0020_Type;
				var oems = "";
				var aal="",byod="",digital="",loyalty="",newacct="",port="",prepaid="",upgrade="",postpaid="",planrequired="";
				if (results[i].Promotion_x0020_OEM != null)
					oems = results[i].Promotion_x0020_OEM.results;
				var ost = item.Training_x0020_Links;
				if (ost == null)
					ost = "";
				var href = ost.anchor();
				var startpos = href.lastIndexOf("<a href=");
				var endpos = href.lastIndexOf(".html");
				var project;
				var title = item.Project_x0020_Name;
				if (item.Alternate_x0020_Title_x0020__x00 != null)
					title = item.Alternate_x0020_Title_x0020__x00;
				if (endpos > 0)
				{
					href = '<span style="display:none">' + title + '</span>' + href.substring(startpos,endpos) + ".html";
					project =   href + '">' + title + "</a>";
				}
				else
					project = '<span>' + title + '</span>';
				var home = item.Customer_x0020_Primary_x0020_Use;
				if (home == "Home" )
					home = "Home";
				else if (home == "Both (equal)")
					home = "Both";
				else
					home = "Mobile";
				loyalty = "";
				for (var k=0; k<eligibilities.length; k++)
				{
					var eligibility = eligibilities[k];
					switch(eligibility) { 
						case "Add A Line": 
							aal = "Yes";
							break;
						case "BYOD":
							byod = "Yes";
							break;						
						case "Digital Exclusive":
							digital = "Yes";
							break;
						case "Plan Required":
							planrequired = "Yes";
							break;
						case "New Account":
							newacct = "Yes";
							break;
						case "Port Ins":
							port = "Yes";
							break;
						case "Prepaid":
							prepaid = "Yes";
							break;
						case "Upgrades":
							upgrade = "Yes";
							break;
						case "Postpaid":
							postpaid = "Yes";
							break;
						case "Loyalty":
							loyalty = "Yes"
							break;	
					}  
				}
				// no longer need to carry ost	
				ost = "";
				var element = {	
					id: item.Id,
			        project: project,
			        dates: dates,
			        //priority: item.Priority_x0020_Level,
					//eligible: item.Customer_x0020_Eligibility,
			        channel: item.Channel_x0020_Availability.results,
			        //ost: ost,
			        aal: aal,
			        byod: byod,
			        dig: digital,
			        newa: newacct,
			        port: port,
			        pre: prepaid,
			        post: postpaid,
			        upg: upgrade,
			        launchdate: launchDate,
			        enddate: promoEndDate,
			        promo: promotiontype,
			        oem:oems,
			        plan: planrequired,			        
			        home:home,
			        loyalty:loyalty
				};	
				var alreadyPushedIndirect = false;
				var alreadyPushedCare = false;
				unboxdArray.push(element);
				for (var j in channels) {
					if ($.inArray(channels[j],retailArray) != -1)
					{
						// call function to push all elements to corresponding array
						pushElements(0,element,promotiontype,oems);
					}
					if ($.inArray(channels[j],telesalesArray) != -1)
					{
						pushElements(1,element,promotiontype,oems);
					}

					if ($.inArray(channels[j],indirectArray) != -1)
					{
						if (!alreadyPushedIndirect)
						{
							pushElements(2,element,promotiontype,oems);
							alreadyPushedIndirect = true;
						}
					}

					if ($.inArray(channels[j],careArray) != -1)
					{
						if (!alreadyPushedCare) 
						{
							pushElements(3,element,promotiontype,oems);
							alreadyPushedCare = true;
						}
					}

				}
		   } 
	    },
        error: function (err) {
            //failure(data);
            alert ("SPGetListItems failed with error" + JSON.stringify(err));
        }
    });
    
    //displayjGrid(concatSource1);
}

/* ================Get SMB promotion =================== */
function getSMBPromotions()
{

	var sessionArray = sessionStorage.getItem("SMBArray");
	var SMBArray = JSON.parse(sessionArray);
	
    if (SMBArray == null)
    	return;
    	
    for(i = 0; i < SMBArray.length;i++) {
    	item = SMBArray[i];
		item.oem = "Business";
		var today = moment(new Date()).format('YYYY-MM-DD');

		var launchDate = new Date(item.launchdate);
		var promoEndDate = new Date(item.enddate);
		launchDate = moment(launchDate);
		promoEndDate = moment(promoEndDate);
		var launchTime = moment(launchDate).format('YYYY-MM-DD');
		var endTime = moment(promoEndDate).format('YYYY-MM-DD');
		if (launchTime > today || endTime < today)
			continue;
		unboxdArray.push(item);					
		pushElements(0,item,item.promotiontype,item.oem);
	}	    
	setColModel();
	displayjGrid(promoArray[0][0],"Channel");
	displayjGrid(promoArray[0][2],"Tablet");
	displayjGrid(promoArray[0][3],"Accessory");
	displayjGrid(promoArray[0][4],"Entertainment");
	displayjGrid(promoArray[0][5],"Other");	
	displayjGrid(promoArray[0][6],"Home");
	displayjGrid(promoArray[0][7],"Loyalty");
	displayjGrid(phoneArray[0][0],"Promo0");
	displayjGrid(phoneArray[0][1],"Promo1");
	displayjGrid(phoneArray[0][2],"Promo2");
	displayjGrid(phoneArray[0][3],"Promo3");
	displayjGrid(phoneArray[0][4],"Promo4");
	$("input[title='Unboxd']").attr('disabled', false);
    
}


function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function cbChange(obj) {
    var cbs = document.getElementsByClassName("cb");
    for (var i = 0; i < cbs.length; i++) {
        cbs[i].checked = false;
        //cbs[i].parentNode.style.opacity='0.5';
        cbs[i].parentNode.parentNode.style.background="#FFF";
    }
    obj.checked = true;
    //obj.parentNode.style.opacity='1';
    obj.parentNode.parentNode.style.background="#0288D1";

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
	//$("input#filterInput").focus();
}


function setColModel()
{

	colModel.push({label: 'Promotion',name:'project',width: 150, align: 'left', sortable:true});
	colModel.push({label: 'Dates',name:'dates',width: 80, formatter:formatdate, align: 'center', sortable:true});
	//colModel.push({label: 'Priority', name: 'priority', width: 60, align: 'center', sortable:true, classes:'inmarket' });
	colModel.push({label: 'AAL', name: 'aal', width: 40, formatter: formateligibility,align: 'center', sortable:true });
	colModel.push({label: 'BYOD', name: 'byod', width: 45, formatter: formateligibility,align: 'center', sortable:true });
	colModel.push({label: 'New', name: 'newacct', width: 45, formatter: formateligibility, align: 'center', sortable:true });
	colModel.push({label: 'Port', name: 'port', width: 45, formatter: formateligibility, align: 'center', sortable:true });
	colModel.push({label: 'Prepaid', name: 'pre', width: 55, formatter: formateligibility, align: 'center', sortable:true });
	//colModel.push({label: 'Postpaid', name: 'postpaid', width: 60, formatter: formateligibility, align: 'center', sortable:true });
	colModel.push({label: 'Upgrade', name: 'upg', width: 58, formatter: formateligibility, align: 'center', sortable:true });
	colModel.push({label: 'Digital Exclusive', name: 'dig', width: 70, formatter: formateligibility, align: 'center', sortable:true });
	//colModel.push({label: 'Loyalty', name: 'loyalty', width: 58, formatter: formateligibility, align: 'center', sortable:true });
	colModel.push({label: 'Plan Required', name: 'plan', width: 70, formatter: formateligibility, align: 'center', sortable:true });
	
	//colModel.push({label: 'Key Points', name: 'keypoints', width: 300,  align: 'center', sortable:false });
	colModel.push({label: 'OST', name: 'ost', width: 0, align: 'center', hidden:true,sortable:false, class:'underscore' });
	colModel.push({label: 'Launch Date', name: 'launch', width: 0, align: 'center', hidden:true, sortable:false });
	colModel.push({label: 'End Date', name: 'end', width: 0, align: 'center', hidden:true, sortable:false });

}

function formateligibility(cellValue, options, rowObject) {

	var cellHtml = "";
	if (cellValue == "Yes")
		cellHtml = '<span style="font-size: 100%;">&#x2714;</span>';
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
	
	var backgroundcolor = '#FFF';
	var color = '#000';
	//	if (launchdays == 0)
	if (launchDate.format('YYYY-MM-DD') == formatToday)
		backgroundcolor =  '#00ac3e'; // green
	else  if (enddays == 1 || enddays == 2)
		backgroundcolor = '#FFFF00';   // yellow
	else if (enddays == 0)
	{
		backgroundcolor = '#d52b1e';   // red
		color = '#FFF';
	}

	//rowObject.launchdate._d
	//rowObject.enddate._d
	
	var cellHtml = "<div style='width:100%;height:101%;background-color:" + backgroundcolor + "; color:" + color + "'>" + cellValue + "</div>";
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
		width: '728',
        height: 'auto',
        rowNum: 100,
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

function pushElements(i,element,promotiontype,oems)
{

	//if (element.home == "Mobile" || element.home== "Both")
	// write to the All bucket regardless
		promoArray[i][0].push(element);
					
	if (element.home == "Home" || element.home == "Both")
		promoArray[i][6].push(element);

	
	// reset launch date and end date for SMB
	if (oems == 'Business')
	{
		var launchDate = new Date(element.launchdate);
		var promoEndDate = new Date(element.enddate);
		launchDate = moment(launchDate);
		promoEndDate = moment(promoEndDate);
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
		//var dayOfWeek = curDate.getDay();
		//if(!((dayOfWeek == 6) || (dayOfWeek == 0))) == dont need to exclude weekend
		count++;
		//curDate.setDate(curDate.getDate() + 1);
		curDate.add(1, 'days');
	}
	return count;
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
		$("#jqGridLoyalty").jqGrid('setGridParam', {data:promoArray[i][6]});
		$("#jqGridLoyalty").trigger("reloadGrid");	
}
function dynamicFilterData(selectedFilters)
{

	var tables = $('table[id^="jqGrid"]')
	// remove all "marked" text
	for (i=0; i<tables.length;i++)
	{
	 	table = tables[i];
		{
			table.innerHTML = table.innerHTML.replace(/<\/?mark[^>]*>/g,"");
		}
		var tableId = tables[i].id;
		var $table = $("#" + tables[i].id );
	    $table.find('tr').each(function (row) {
			$(this).show();  
			if (matchTextBoxSearch($(this)))
			{
				//$(this).show();
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