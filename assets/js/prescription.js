var ticks = 0;

var prevLen = 0;

var clicksChecker;

var selectedSets = {};

var selectedDrugs = {};

var drug_sets = {} //<%= @drug_sets.to_json.html_safe %>

var imgvoid = "/assets/images/delete.png"
var apiProtocol = sessionStorage.apiProtocol;

var apiURL = sessionStorage.apiURL;

var apiPort = sessionStorage.apiPort;

var patientID = sessionStorage.patientID;

var programID = sessionStorage.programID;

var authToken = sessionStorage.authorization;

var tt_cancel_destination = "/views/patient_dashboard.html?patient_id=" + patientID;

var drugs = [];

var strengths = [];

var units = [];

var drug_ids = [];	
var concept_ids = [];	

var tstTimerHandle = null;

var tstTimerFunctionCall = "";

getDrugs();
  
listAllDrugs();

$(document).ready(function(){

  setTimeout(function(){
   
      loadAllDrugs();
    
  }, 500);
  
  
});


function getDrugs(){

  var apiPath = apiProtocol + "://" + apiURL + ":" + apiPort;
  apiPath += "/api/v1/OPD_drugslist?page_size=50";

  GET({

    url: apiPath,

    async: true,

    headers: {

      'Authorization': authToken

    }

  }, 
  {}, 
  function (data) {
    for(var i = 0; i < data.length; i++){
  
      
      drugs.push(data[i].name);
    
      units.push(data[i].units);
  
      drug_ids.push(data[i].drug_id);

      concept_ids.push(data[i].concept_id);
  
    }
  
  },
  function (error) {
  
    console.log(error);
  
  });
  
}

function submitTreatmentEncounter() 
{

  if(!checkParams())
    return;
  else
  if (Object.keys(selectedDrugs).length <= 0 )
  {
    confirmAction("Please select one / more drugs or none drugs");
    return;
  }
  
  var currentTime = moment().format(' HH:mm:ss');
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD');
  encounter_datetime += currentTime;

  var encounter = {
      encounter_type_id: 25,
      patient_id: patientID,
      encounter_datetime: encounter_datetime
  };

  submitParameters(encounter, "/encounters", "postDrugOrders");
}

function postDrugOrders(encounter) {

  if (!encounter.encounter_id) {
      encounter_id = encounter[0].encounter_id;
  } else {
      encounter_id = encounter.encounter_id;
  }

  var drug_orders_params = {encounter_id: encounter_id, drug_orders: []}
  var start_date = new Date(sessionStorage.sessionDate);
  var start_date_formated = getFormattedDate(start_date);


  var get_start_date = start_date.getDate();
  

      for (selected_drug in selectedDrugs)
      {
            
          var dosage = parseInt(__$("row_dosage_" + selected_drug).innerHTML);

          var frequency = __$("row_frequency_" + selected_drug).innerHTML;
          var duration = parseInt(__$("row_duration_" + selected_drug).innerHTML);
          var equivalent_daily_dose = parseFloat(dosage) * dosesPerDay(frequency);
          var auto_expire_date = start_date.setDate(get_start_date + duration);
          var auto_expire_date_formated = getFormattedDate(new Date(auto_expire_date));

          var drug_id = selected_drug.match(/\d+/)[0];
          drug_name = __$("row_"+selected_drug).getAttribute("d-name"); 
          units = __$("row_" + selected_drug).getAttribute("units");
          var instructions = drug_name + ": " + dosage + " " + frequency + " for " + duration + " days";

          drug_order = {
              drug_inventory_id: drug_id,
              dose: dosage,
              equivalent_daily_dose: equivalent_daily_dose,
              frequency: frequency,
              start_date: start_date_formated,
              auto_expire_date: auto_expire_date_formated,
              instructions: instructions,
              units: units
          };

          drug_orders_params.drug_orders.push(drug_order);
      }


  submitParameters(drug_orders_params, "/drug_orders", "printVisitSummary");
}


function printVisitSummary() {
  window.location = "/views/print/visit.html";

}


function getFormattedDate(set_date) {

  var month = (set_date.getMonth() + 1);

  if (month < 10)

    month = "0" + month;
  
  var day = (set_date.getDate());
  
  if (day < 10)
          
    day = "0" + day;

  var year = (set_date.getFullYear());

  return year + "-" + month + "-" + day;

}

function dosesPerDay(frequency){

  var frequency = frequency.toUpperCase();

  if (frequency == "ONCE A DAY (OD)"){

    return 1;

  }else if (frequency == "TWICE A DAY (BD)"){
  
    return 2;
  
  }else if (frequency == "THREE A DAY (TDS)"){
  
    return 3;
  
  }else if (frequency == "FOUR TIMES A DAY (QID)"){
  
    return 4;
  
  }else if(frequency == "FIVE TIMES A DAY (5X/D)"){
  
    return 5;
  
  }else if (frequency == "SIX TIMES A DAY (Q4HRS)"){
  
    return 6;
   
  }else if (frequency == "IN THE MORNING (QAM)"){
  
    return 1;
  
  }else if (frequency == "ONCE A DAY AT NOON (QNOON)"){
  
    return 1;
  
  }else if (frequency == "IN THE EVENING (QPM)"){
  
    return 1;
  
  }else if (frequency == "ONCE A DAY AT NIGHT (QHS)"){
  
    return 1;
  
  }else if (frequency.upcase == "EVERY OTHER DAY (QOD)"){
  
    return 0.5;
  
  }else if(frequency == "ONCE A WEEK (QWK)"){
  
    return parseFloat(1 / 7);
  
  }else if (frequency == "ONCE A MONTH"){
  
    return parseInt(1 / 28);
  
  }else if (frequency == "TWICE A MONTH"){
  
    return parseInt(1 / 14);
  
  } 
  
}


function nextPage(obs){

  var iframe = document.getElementById('print-iframe');

  var container = document.getElementById('container');

  var url = "/programs/"+programID+"/patients/" + patientID + "/labels/visits?date=?"+sessionStorage.sessionDate;
  
  url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1" + url;
  
  iframe.src = url;
  
  iframe.style.display = "block";

  container.style.display = "none";
  //document.location = url;
  
  setTimeout('next();', 2000);
  
}

function next() {

  nextEncounter(patientID, programID);

}
            
function checkClicks(){

  if(ticks > 10){
        
    __$("searchbox").style.display = "none";
    
    __$("search").value = "";
    
    prevLen = 0;
    
    ticks = 0;
    
  }
  
  ticks++;
  
  if(__$("search").value.trim().length != prevLen){
       
    __$('searchbox').style.display = 'flex';
    
    ticks = 0;
    
  }
  
  prevLen = __$("search").value.length;
  
  clicksChecker = setTimeout("checkClicks()", 1000);

}

function resize(){
    
  // __$('container').style.height = (window.innerHeight - 25) + 'px';
  
  // if(__$("selections")){
    
  //   if(__$("keying")){
    
  //     __$("selections").style.height = (__$('container').offsetHeight - __$("keying").offsetHeight - __$("cummulative").offsetHeight - 35) + "px";
        
  //   } else {
    
  //     __$("selections").style.height = (__$('container').offsetHeight - __$("cummulative").offsetHeight - 55) + "px";
    
  //   }
    
  // }
  
  scroll(__$("scroll_me"));

}
      
function __$(id){
    
  return document.getElementById(id);

}

/*
 * We create a custom keyboard for the interface to fit on the available space
 */
function showFixedKeyboard(ctrl, global_control) {

  var full_keyboard = "full";

  var div = document.createElement("div");
  div.id = "divMenu";
  div.style.backgroundColor = "#EEEEEE";
  div.style.top = "0px";
  div.style.left = "0px";
  div.style.margin = "5px";

  var row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  var row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  var row3 = [ "", "Z", "X", "C", "V", "B", "N", "M" ,"", "del"];
  var row5 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  var tbl = document.createElement("table");
  tbl.bgColor = "#fff";
  tbl.cellSpacing = 2;
  tbl.cellPadding = 10;
  tbl.id = "tblKeyboard";
  tbl.width = "100%";

  var tr5 = document.createElement("tr");

  for (var i = 0; i < row5.length; i++) {
      var td5 = document.createElement("td");
      td5.innerHTML = row5[i];
      td5.align = "center";
      td5.vAlign = "middle";
      td5.style.cursor = "pointer";
      td5.style.fontSize = "1.5em";
      td5.bgColor = "#EEEEEE"
      td5.width = "30px";
      td5.className = "btn";

      td5.onclick = function () {
          if (!this.innerHTML.match(/^$/)) {
              $(global_control).value += this.innerHTML.toProperCase();
              $(global_control).value = $(global_control).value.toProperCase();
              searchDrug();
          }
      }

      tr5.appendChild(td5);
  }

  if (full_keyboard) {
      tbl.appendChild(tr5);
  }

  var tr1 = document.createElement("tr");

  for (var i = 0; i < row1.length; i++) {
      var td1 = document.createElement("td");
      td1.innerHTML = row1[i];
      td1.align = "center";
      td1.vAlign = "middle";
      td1.style.cursor = "pointer";
      td1.style.fontSize = "1.5em";
      td1.bgColor = "#EEEEEE"
      td1.width = "30px";
      td1.className = "btn";

      td1.onclick = function () {
          if (!this.innerHTML.match(/^$/)) {
              $(global_control).value += this.innerHTML.toProperCase();
              $(global_control).value = $(global_control).value.toProperCase();
              searchDrug();
          }
      }

      tr1.appendChild(td1);
  }

  tbl.appendChild(tr1);

  var tr2 = document.createElement("tr");

  for (var i = 0; i < row2.length; i++) {
      var td2 = document.createElement("td");
      td2.innerHTML = row2[i];
      td2.align = "center";
      td2.vAlign = "middle";
      td2.style.cursor = "pointer";
      td2.style.fontSize = "1.5em";
      td2.bgColor = "#EEEEEE"
      td2.width = "30px";

      if (!row2[i].trim().match(/^$/)) {
          td2.className = "btn";
      }

      td2.onclick = function () {
          if (!this.innerHTML.match(/^$/)) {
              $(global_control).value += this.innerHTML.toProperCase();
              $(global_control).value = $(global_control).value.toProperCase();
              searchDrug();
          }
      }

      tr2.appendChild(td2);
  }

  tbl.appendChild(tr2);

  var tr3 = document.createElement("tr");

  for (var i = 0; i < row3.length; i++) {
      var td3 = document.createElement("td");
      td3.innerHTML = row3[i];
      td3.align = "center";
      td3.vAlign = "middle";
      td3.style.cursor = "pointer";
      td3.style.fontSize = "1.5em";
      td3.bgColor = "#EEEEEE"
      td3.width = "30px";

      if (!row3[i].trim().match(/^$/)) {
          td3.className = "btn";
      }

      if (row3[i] == "del") {
          td3.colSpan = 2;

          td3.onclick = function () {
              $(global_control).value = $(global_control).value.substring(0, $(global_control).value.length - 1);
              searchDrug();
          }

      } else if (row3[i].trim() == "stat<br />dose") {
          td3.style.fontSize = "0.9em";
          td3.style.padding = "0px";
          td3.style.fontWeight = "bold";

          td3.onclick = function () {
              if ($("optionOD"))
                  $("optionOD").click();
              if ($("group1_1-10"))
                  $("group1_1-10").click();
              if ($("group2_1"))
                  $("group2_1").click();
          }
      } else {

          td3.onclick = function () {
              if (!this.innerHTML.match(/^$/)) {
                  $(global_control).value += this.innerHTML.toProperCase();
                  $(global_control).value = $(global_control).value.toProperCase();
                  searchDrug();
              }
          }

      }

      tr3.appendChild(td3);
  }

  tbl.appendChild(tr3);

  div.appendChild(tbl);
  ctrl.appendChild(div);

}

function showNumber(id, global_control, showDefault){
    
  var row1 = ["1","2","3"];
    
  var row2 = ["4","5","6"];
  
  var row3 = ["7","8","9"];
  
  if(global_control == 'dosage')
    var row4 = ["del","0","."];
  else
    var row4 = ["del","0","OK"];

  var tbl = document.createElement("table");

  tbl.className = "keyBoardTable";

  tbl.cellSpacing = 0;

  tbl.cellPadding = 3;

  tbl.id = "tblKeyboard";

  tbl.style.margin = "auto";

  var tr1 = document.createElement("tr");

  var td = document.createElement("td");

  td.rowSpan = "4";

  td.style.minWidth = "0px";

  td.style.textAlign = "center";

  td.style.verticalAlign = "top";

  tr1.appendChild(td);

  if(typeof(showDefault) != "undefined"){

    if(showDefault == true){

      td.innerHTML = "<span style='font-size: 1.1em; font-style: italic;'>Default</span>";

      var defaultButton = document.createElement("button");

      defaultButton.id = "defaultButton" + id;

      defaultButton.className = "button_blue keyboard_button";

      defaultButton.onclick = function(){

        var value = this.innerHTML.replace(/\<span\>/i, "").replace(/\<\/span\>/i, "");

        if(value != "Default"){

          __$(global_control).value = value;

        } else {

          __$(global_control).value = 0; 

        }

      }
  
      td.appendChild(defaultButton);
  
    }
  
  } 
  
  for(var i = 0; i < row1.length; i++){
  
    var td1 = document.createElement("td");
  
    td1.align = "center";
  
    td1.vAlign = "middle";
  
    td1.style.cursor = "pointer";
  
    td1.bgColor = "#ffffff";
  
    td1.width = "30px";

    tr1.appendChild(td1);

    var btn = document.createElement("button");

    btn.className = "button_blue keyboard_button";

    btn.innerHTML = "<span>" + row1[i] + "</span>";

    btn.onclick = function(){

      if(!this.innerHTML.match(/^__$/)){

        __$(global_control).value += this.innerHTML.match(/<span>(.+)<\/span>/)[1];

      }
  
    }

    td1.appendChild(btn);

  }

  tbl.appendChild(tr1);

  var tr2 = document.createElement("tr");

  for(var i = 0; i < row2.length; i++){

    var td2 = document.createElement("td");

    td2.align = "center";

    td2.vAlign = "middle";

    td2.style.cursor = "pointer";

    td2.bgColor = "#ffffff";

    td2.width = "30px";

    tr2.appendChild(td2);

    var btn = document.createElement("button");

    btn.className = "button_blue keyboard_button";

    btn.innerHTML = "<span>" + row2[i] + "</span>";

    btn.onclick = function(){

      if(!this.innerHTML.match(/^$/)){

        __$(global_control).value += this.innerHTML.match(/<span>(.+)<\/span>/)[1];

      }
  
    }

    td2.appendChild(btn);

  }

  tbl.appendChild(tr2);

  var tr3 = document.createElement("tr");

  for(var i = 0; i < row3.length; i++){

    var td3 = document.createElement("td");

    td3.align = "center";

    td3.vAlign = "middle";

    td3.style.cursor = "pointer";

    td3.bgColor = "#ffffff";

    td3.width = "30px";

    tr3.appendChild(td3);

    var btn = document.createElement("button");

    btn.className = "button_blue keyboard_button";

    btn.innerHTML = "<span>" + row3[i] + "</span>";

    btn.onclick = function(){

      if(!this.innerHTML.match(/^__$/)){

        __$(global_control).value += this.innerHTML.match(/<span>(.+)<\/span>/)[1];

      }
  
    }

    td3.appendChild(btn);

  }

  tbl.appendChild(tr3);

  var tr4 = document.createElement("tr");

  for(var i = 0; i < row4.length; i++){

    var td4 = document.createElement("td");

    td4.align = "center";

    td4.vAlign = "middle";

    td4.style.cursor = "pointer";

    td4.bgColor = "#ffffff";

    td4.width = "30px";

    tr4.appendChild(td4);

    var btn = document.createElement("button");

    btn.innerHTML = "<span>" + row4[i] + "</span>";

    if (i == 1 || i == 0 || global_control == 'dosage'){

      btn.className = "button_blue keyboard_button";

    }
    else if (i == 2){

      btn.className = "button_green keyboard_button";

    }

    btn.onclick = function(){

      if(this.innerHTML.match(/<span>(.+)<\/span>/)[1] == "del"){

        __$(global_control).value = __$(global_control).value.substring(0,__$(global_control).value.length - 1);

      }
      else
      if(this.innerHTML.match(/OK/))
        checkParams();
      else 
      if(!this.innerHTML.match(/^$/)){
  
        __$(global_control).value += this.innerHTML.match(/<span>(.+)<\/span>/)[1];
  
      }
    
    }

    td4.appendChild(btn);

  }

  tbl.appendChild(tr4);

  __$(id).appendChild(tbl);

}

function loadAllDrugs(){

  clearTimeout(clicksChecker);
  
  __$("switcher").innerHTML = "";
  
  var table = document.createElement("div");
  
  table.className = "table";
  
  table.style.width = "100%";
  
  table.style.height = "100%";
  
  __$("switcher").appendChild(table);
  
  var cells = [
    {
      id: "selections",
        
      styles: {
            
        border: "1px solid #ccc",
        
        overflow: "auto",
                
        marginBottom: "2px",
        
        height: "200px",
        
        backgroundColor: "#fff" // "#c8e1d3"
        
      }
    
    },
    {
      id: "keying",
      
      styles: {
      
        border: "1px solid #999",
      
        overflow: "auto",
      
      
        textAlign: "center",
      
        height: "180px",
      
        paddingBottom: "2px"
      
      }
    
    }
  
  ];
  
  for(var i = 0; i < cells.length; i++){
  
    var row = document.createElement("div");
  
    row.className = "row";
  
    table.appendChild(row);
  
    var cell = document.createElement("div");
  
    cell.className = "cell";
  
    row.appendChild(cell);
  
    for(var attr in cells[i]){
  
      if(typeof(cells[i][attr]) == "object" && attr == "styles"){
  
        for(var el in cells[i][attr]){
  
          cell.style[el] = cells[i][attr][el];

        }

      } else {
  
        cell.setAttribute(attr, cells[i][attr]);

      }

    }
  
  }
  
  showFixedKeyboard(__$("keying"), "search");

  listAllDrugs();
  
  clicksChecker = checkClicks();

}

function loadFrequenciesAndDuration(id){
  
  clearTimeout(clicksChecker);
  
  __$("switcher").innerHTML = "";
  
  __$("searchbox").value = "";
  
  __$("searchbox").style.display = "none";
  
  var table = document.createElement("div");
  
  table.className = "table";
  
  table.style.width = "100%";
  
  table.style.height = "100%";
  
  
  table.style.border = "1px solid #ccc";
  
  __$("switcher").appendChild(table);
  
  var row = document.createElement("div");
  
  row.className = "row";
  
  table.appendChild(row);
  
  var cell = document.createElement("div");
  
  cell.className = "cell";
  
  row.appendChild(cell);
  
  var container = document.createElement("div");
  
  container.id = "selections";
  
  container.style.width = "100%";
  
  cell.appendChild(container);
  
  resize();
  
  var tbl = document.createElement("div");
  
  tbl.className = "table";
  
  tbl.style.width = "100%";
  
  container.appendChild(tbl);
  
  var tr = document.createElement("div");
  
  tr.className = "row";
  
  tbl.appendChild(tr);
  
  var cell1 = document.createElement("div");
  
  cell1.className = "cell";
  
  cell1.style.width = "40%";
  
  cell1.style.border = "1px solid #ccc";
  
  cell1.style.height = "100%";
  
  
  cell1.style.textAlign = "center";
  
  cell1.style.backgroundColor = "#fff";
  
  tr.appendChild(cell1);
  
  var cell2 = document.createElement("div");
  
  cell2.className = "cell";
  
  cell2.style.width = "30%";
  
  cell2.style.border = "1px solid #ccc";
  
  cell2.style.height = "100%";
  
  
  cell2.style.textAlign = "center";
  
  cell2.style.backgroundColor = "#fff";
  
  cell2.id = "dosageControl";
  
  cell2.style.paddingBottom = "10px";
  
  tr.appendChild(cell2);

  var cell3 = document.createElement("div");
  
  cell3.className = "cell";
  
  cell3.style.width = "30%";
  
  cell3.style.border = "1px solid #ccc";
  
  cell3.style.height = "100%";
  
  
  cell3.style.textAlign = "center";
  
  cell3.style.backgroundColor = "#fff";
  
  cell3.id = "durationControl";
  
  cell3.style.paddingBottom = "10px";
  
  tr.appendChild(cell3);
  
  var freqHead = document.createElement("div");
  
  freqHead.style.paddingTop = "10px";
  
  freqHead.style.paddingBottom = "10px";
  
  freqHead.style.fontSize = "36px";
  
  freqHead.innerHTML = "Frequency";
  
  freqHead.style.width = "100%";
  
  freqHead.style.textAlign = "center";
  
  cell1.appendChild(freqHead);
  
  var dosageHead = document.createElement("div");
  
  dosageHead.style.paddingTop = "10px";
  
  dosageHead.style.paddingBottom = "10px";
  
  dosageHead.style.fontSize = "36px";
  
  dosageHead.innerHTML = "Dosage";
  
  dosageHead.style.width = "100%";
  
  dosageHead.style.textAlign = "center";
  
  cell2.appendChild(dosageHead);

  var durHead = document.createElement("div");

  durHead.style.paddingTop = "10px";
  
  durHead.style.paddingBottom = "10px";
  
  durHead.style.fontSize = "36px";
  
  durHead.innerHTML = "Duration (days)";
  
  durHead.style.width = "100%";
  
  durHead.style.textAlign = "center";
  
  cell3.appendChild(durHead);
  
  var ul = document.createElement("ul");
  
  ul.className = "listing";
  
  ul.style.overflow = "auto";
  
  ul.style.height = "370px";
  
  ul.style.width = "100%"
  
  ul.id = "ul";
  
  ul.style.fontSize = "0.8em";
  
  cell1.appendChild(ul);
  
  var frequencies = ["Once a day (OD)", "Twice a day (BD)", "Three a day (TDS)",
  
    "Four times a day (QID)", "Five times a day (5X/D)", "Six times a day (Q4HRS)",
  
    "In the morning (QAM)", "Once a week (QWK)", "Once a month", "Twice a month"]; //"TBD", "NOCTE",
  
  for(var i = 0; i < frequencies.length; i++){
  
    var li = document.createElement("li");
  
    li.innerHTML = frequencies[i];
  
    li.style.backgroundColor = (i % 2 == 0 ? "#f8f7ec" : "#fff");
  
    li.setAttribute("frequency", frequencies[i]);
  
    li.setAttribute("tag", id);
  
    li.style.textAlign = "left";
  
    li.id = "li_" + i;
  
    li.onclick = function(){

      if(this.getAttribute("frequency") != null && this.getAttribute("tag") != null){
    
        if(__$("row_frequency_" + this.getAttribute("tag"))){
    
          __$("row_frequency_" + this.getAttribute("tag")).innerHTML = this.getAttribute("frequency");
    
        }
    
      }

      for(var j = 0; j < __$("ul").children.length; j++){
                
        __$("ul").children[j].className -= "selected";
            
      }
      
      this.className = "selected";
        
    }
    
    ul.appendChild(li);
    
  }
  var input2 = document.createElement("input");
    
  input2.setAttribute("type", "text");
    
  input2.id = "dosage";
  
  input2.className = "input";
  
  input2.style.width = "64%";
  
  input2.style.textAlign = "center";
  
  input2.style.fontSize = "32px";
  
  cell2.appendChild(input2);
  showNumber("dosageControl", "dosage");


  var input = document.createElement("input");
    
  input.setAttribute("type", "text");
    
  input.id = "duration";
  
  input.className = "input";
  
  input.style.width = "64%";
  
  input.style.textAlign = "center";
  
  input.style.fontSize = "32px";
  
  cell3.appendChild(input);
  
  showNumber("durationControl", "duration");

}


function checkParams(){

  var cells = __$("cummulative").getElementsByClassName("cell");
  for(var i = 0; i < cells.length; i++)
  {
    if (i>0 && cells[i].innerHTML == "") 
    {
      if(cells[i].id.match(/duration/))
      {
        confirmAction("Enter Duration for drug: " );
        return false;
      }
      else
      if(cells[i].id.match(/dosage/))
      {
        confirmAction("Enter Dosage for drug: " );
        return false;
      }
      else
      if(cells[i].id.match(/frequency/) )
      {
        confirmAction("Enter Frequency for drug: " );
        return false;
      }
      else
      if(cells[i].id.match(/quantity/) )
      {
        confirmAction("Enter Quantity for drug: " );
        return false;
      }
    }
  }

  document.getElementById('search').value = '';
  loadAllDrugs();
  return true;
}

function setAmounts() {
    
    var duration = null
    if (__$("duration")){
        duration = __$("duration").value;
        var cell3s = document.getElementsByClassName("durations");
      
        for(var i = (cell3s.length - 1); i >= 0; i--)
        {
          
          if(cell3s[i].innerHTML.length < 1 )
          {
            if(duration != '')
              cell3s[i].innerHTML = (duration != null ? (duration > 1 ? duration + " days" : duration + " day") : duration);
            else
              cell3s[i].innerHTML = duration;
            break;
          }
          else 
          if(cell3s[i].innerHTML.length > 1 )
          {
            if(duration != '')
              cell3s[i].innerHTML = (duration != null ? (duration > 1 ? duration + " days" : duration + " day") : duration);
            else
              cell3s[i].innerHTML = duration;
            break;
          }
          
        }
    }

 

    var dosage = null
    if (__$("dosage")){
        dosage = __$("dosage").value;
        
        var cell3s = document.getElementsByClassName("dosages");
        for(var i = (cell3s.length - 1); i >= 0; i--)
        {
          if(cell3s[i].innerHTML.length < 1 )
          {
            cell3s[i].innerHTML = dosage;
            break;
          }
          else 
          if(cell3s[i].innerHTML.length >= 1 )
          {
            cell3s[i].innerHTML = dosage;
            break;
          }
      }
      
    }


}

function listAllDrugs(){
    
  if(__$("selections")){
        
    __$("selections").innerHTML = "";
    
    var ul = document.createElement("ul");
        
    ul.className = "listing";
    
    __$("selections").appendChild(ul);
    
    var formulations = [];
    
    for(var i = 0; i < drugs.length; i++){
      
      formulations.push({
                
        drug: drugs[i] ,
                
        dose: strengths[i],
                
        unit: units[i],
                
        drug_id: drug_ids[i],

        concept_id: concept_ids[i]
            
      });
        
    }
    
    for(var l = 0; l < formulations.length; l++){
            
      var li = document.createElement("li");
            
      li.id = "all_" + formulations[l].drug_id;
      li.concept_id = formulations[l].concept_id;
            
      li.innerHTML = formulations[l].drug;
            
      li.style.backgroundColor = (l % 2 == 0 ? "#f8f7ec" : "#fff");
            
      li.setAttribute("dose", formulations[l].dose);
            
      li.setAttribute("unit", formulations[l].unit);
            
      li.setAttribute("drug", formulations[l].drug);
      
      if(selectedDrugs[li.id]){
       
        li.className = "selected";
            
      }
      
      li.onclick = function(){
          
        if(this.getAttribute("class") != null && this.getAttribute("class").match(/selected/)){
        
          removeDrug(this.id);
        
        } else {
        
          this.className = "selected";
        
          
          
          selectedDrugs[this.id] = true;
          
            addDrug(this.id);
            loadFrequenciesAndDuration(this.id);
          
          
        }
        
      }
      
      ul.appendChild(li);
      
    }
    
  }

}


function confirmAction(message) {

  if (!tstMessageBar) {

    var tstMessageBar = document.createElement("div");
        
    tstMessageBar.id = "messageBar";
    
    tstMessageBar.className = "messageBar";

    tstMessageBar.innerHTML = message + "<br/>" +
        "<button onmousedown=\"__$('container')" +
        ".removeChild(document.getElementById('messageBar'));\"><span>OK</span></button>";

    tstMessageBar.style.display = "block";
        
    __$('container').appendChild(tstMessageBar);
    
  }
  
  return false;

}

function addDrug(id)
{
  var drug = __$(id).getAttribute("drug");
  var frequency = __$(id).getAttribute("frequency");
  var dosage = __$(id).getAttribute("dosage");
  var duration = __$(id).getAttribute("duration");
  var dose = __$(id).getAttribute("dose");
  var units = __$(id).getAttribute("unit");
  
  var row = document.createElement("div");
  row.className = "row";
  row.id = "row_" + id;
  row.setAttribute("dose", dose);
  row.setAttribute("units", units);
  row.setAttribute("d-name", drug);

  __$("drugs").appendChild(row);
  scroll(__$("scroll_me"));
 
  

  var cell1 = document.createElement("div");
  cell1.className = "cell borderRightBottom";
  cell1.innerHTML = drug;
  cell1.style.padding = "5px";
  cell1.style.width = "45%";
  cell1.style.verticalAlign = "middle";

  row.appendChild(cell1);

  var cell2 = document.createElement("div");
  cell2.className = "cell borderRightBottom";
  cell2.innerHTML = frequency;
  cell2.style.padding = "5px";
  cell2.style.width = "24%";
  cell2.style.textAlign = "center";
  cell2.style.verticalAlign = "middle";
  cell2.id = "row_frequency_" + id;

  row.appendChild(cell2);

  var cell3 = document.createElement("div");
  cell3.className = "cell borderRightBottom dosages";
  cell3.innerHTML = dosage;
  cell3.style.padding = "5px";
  cell3.style.width = "10%";
  cell3.style.textAlign = "center";
  cell3.style.verticalAlign = "middle";
  cell3.id = "row_dosage_" + id;

  row.appendChild(cell3);

  var cell4 = document.createElement("div");
  cell4.className = "cell borderRightBottom durations";
  cell4.innerHTML = (duration != null ? (duration > 1 ? duration + " days" : duration + " day") : duration);
  cell4.style.padding = "1px";
  cell4.style.width = "10%";
  cell4.style.textAlign = "center";
  cell4.style.verticalAlign = "middle";
  cell4.id = "row_duration_" + id;


  row.appendChild(cell4);

  var cell5 = document.createElement("div");
  cell5.className = "cell borderBottom";
  cell5.style.padding = "1px";
  cell5.style.width = "60px";
  cell5.style.textAlign = "center";
  cell5.style.verticalAlign = "middle";

  row.appendChild(cell5);

  var img = document.createElement("img");
  img.setAttribute("tag", id);
  img.setAttribute("src", imgvoid);
  img.setAttribute("height", "40px");
  img.style.cursor = "pointer";

  img.onclick = function(){

      removeDrug(this.getAttribute("tag"));   
  }

  cell5.appendChild(img);
}

function removeDrug(id){
    
  if(__$("row_" + id)){
        
    try {
      __$("drugs").removeChild(__$("row_" + id));
    } catch (error) {
      __$("nonDrugs").removeChild(__$("row_" + id));
    }
            
    scroll(__$("scroll_me"))
    
  }
  
  if(selectedDrugs[id])
        
    delete selectedDrugs[id];
    
  if(selectedSets[id])
        
    delete selectedSets[id];
    
  if(__$(id)){
        
    __$(id).className -= "selected";
    
  }

}

// Supporting function to allow a humanized Concept Name display
String.prototype.toProperCase = function(){
  
  return this.toLowerCase().replace(/^(.)|\s(.)/g,
  
  function($1) {
    
    return $1.toUpperCase();
        
  });

}

// Stub for searching the drugs
function searchDrug(){

  var search_str = document.getElementById('search').value;

  url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/OPD_drugslist?page_size=50&name=" + search_str

  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        
    xmlhttp=new XMLHttpRequest();
    
  }else{// code for IE6, IE5
        
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    
  }
  
  xmlhttp.onreadystatechange=function() {
        
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            
      var results = xmlhttp.responseText;
            
      if(results) {
                
        var searchedDrugs = JSON.parse(results);
                
        drugs = [];
                
        strengths = [];
                
        units = [];
                
        drug_ids = [];

        concept_ids = [];
                
        for(drug_id in searchedDrugs) {
                    
          drugs.push(searchedDrugs[drug_id].name);
                    
          strengths.push(searchedDrugs[drug_id].dose_strength);
                    
          units.push(searchedDrugs[drug_id].unit);
                    
          drug_ids.push(searchedDrugs[drug_id].drug_id);

          concept_ids.push(searchedDrugs[drug_id].concept_id);
                
        }
                
        listAllDrugs();
            
      }
  
    }
    
  }
  
  xmlhttp.open("GET",url, true);
    
  xmlhttp.setRequestHeader('Authorization',sessionStorage.authorization);
  
  xmlhttp.send();

}

function clearAll() {
    
  for(selected_drug in selectedDrugs) {
        
    removeDrug(selected_drug);
    
  }
  
  for(selected_set in selectedSets) {
        
    removeDrug(selected_set);
    
  }
  
  document.getElementById('search').value = '';
  loadAllDrugs();

}

function scroll(div){

  div.scrollTop = div.scrollHeight - div.clientHeight;

}

function showMessage(aMessage, withCancel, timed) {
  if(typeof(tstMessageBar) == "undefined"){
      document.getElementById("container").innerHTML += "<div id='messageBar' class='messageBar'></div>";
      
  }
  
  tstMessageBar = document.getElementById('messageBar');
  
  //var messageBar = tstMessageBar;
  messageBar.innerHTML = aMessage +
  "<br />" + (typeof(withCancel) != "undefined" ? (withCancel == true ?
      "<button onmousedown='tstMessageBar.style.display = \"none\"; " +
      "clearTimeout(tstTimerHandle);'><span>Cancel</span></button>" : "") : "") +
  "<button style='width: 200px;' class='button_blue' onmousedown='tstMessageBar.style.display = \"none\"; " +
  "clearTimeout(tstTimerHandle); eval(tstTimerFunctionCall);'><span>OK</span></button>";
  if (aMessage.length > 0) {
    
    messageBar.style.display = 'block';
  
  }

}

function hideMessage(){

  tstMessageBar.style.display = 'none'

}
