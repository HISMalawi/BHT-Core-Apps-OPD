var presentingComplaintsHash = {};

function clearSelection(type_of_complaint) {
  presentingComplaintsHash[type_of_complaint] = [];
  buildPresentaingComplaints(type_of_complaint);
}


function buildPresentaingComplaints(type_of_complaint) {
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.style = 'height: 90%; overflow: auto;';
  frame.innerHTML = null;

  getPresentingComplaints(type_of_complaint);
  var clearButton = document.getElementById('clearButton');
  clearButton.setAttribute('onmousedown',"clearSelection('" + type_of_complaint + "');");
}

/*
function presentingComplaints(concept_sets, type_of_complaint) {
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  var main_container = document.createElement('div');
  main_container.setAttribute('id','complaints-container');
  frame.appendChild(main_container);
  var row_count = 1;
  var row;

  concept_names = []
  for(var i = 0 ; i < concept_sets.length; i++) {
    if(concept_sets[i].name.toLowerCase() == 'other')
      continue;

    if(concept_sets[i].name.toLowerCase() == 'none')
      continue;

    if(sessionStorage.patientGender == 'M') {
      if(concept_sets[i].name.toLowerCase().match(/pregna/i)) 
        continue;
    
      if(concept_sets[i].name.toLowerCase().match(/pv bleeding/i)) 
        continue;
    
    }

    concept_names.push(concept_sets[i].name);
  }
  
  concept_names = concept_names.sort();
  concept_names.push('Other');
  concept_names.push('None');
  
  for(var x = 0 ; x < concept_names.length; x++){
    for(var i = 0 ; i < concept_sets.length; i++) {
      if(concept_names[x].toLowerCase() != concept_sets[i].name.toLowerCase())
        continue;

      if(row_count == 1){
        row = document.createElement('div');
        row.setAttribute('class','complaints-container-row');
        main_container.appendChild(row);
      }

      cell = document.createElement('div');
      cell.setAttribute('class','complaints-container-cell');
      cell.innerHTML = concept_sets[i].name;
      cell.setAttribute('selected', 'false');
      cell.setAttribute('concept_id', concept_sets[i].concept_id);
      cell.setAttribute('complaint-type', type_of_complaint);
      cell.setAttribute('onmousedown','complaintClicked(this);');
      row.appendChild(cell);
    
      row_count++;
      if(row_count == 6)
        row_count = 1;

    }
  }

  autoHighLight(type_of_complaint);
}

function autoHighLight(type_of_complaint) {
  var list = document.getElementsByClassName('complaints-container-cell');
  var temp = presentingComplaintsHash[type_of_complaint];

  if(temp == undefined)
    return;

  for(var i = 0 ; i < list.length ; i++){
    for(var x = 0 ; x < temp.length ; x++){
      if(list[i].getAttribute('concept_id') == temp[x]){
        list[i].setAttribute('selected', 'true');
        list[i].style = 'background-color: lightblue;';
      }
    }
  }
}

function complaintClicked(e) {
  var type_of_complaint = e.getAttribute('complaint-type');

  if(e.getAttribute('selected') == 'false'){
    if(e.innerHTML.toUpperCase() == 'NONE'){
      deSelectAll(type_of_complaint);
    }else{
      deSelectNone(type_of_complaint)
    }
    e.setAttribute('selected', 'true');
    e.style = 'background-color: lightblue;';
    addToHash(type_of_complaint, e.getAttribute('concept_id'));    
  }else{
    e.setAttribute('selected', 'false');
    e.style = 'background-color: "";';
    removeFromHash(type_of_complaint, e.getAttribute('concept_id'));
  }

}


function deSelectAll(key) {
  var list = document.getElementsByClassName('complaints-container-cell');
  for(var i = 0 ; i < list.length ; i++){
    list[i].style = 'background-color: "";';
  }
  presentingComplaintsHash[key] = [];
}

function deSelectNone(key) {
  var list = document.getElementsByClassName('complaints-container-cell');
  for(var i = 0 ; i < list.length ; i++){
    if(list[i].innerHTML.toUpperCase() == 'NONE' && list[i].getAttribute('selected') == 'true') {
      list[i].style = 'background-color: "";';
      removeFromHash(key, list[i].getAttribute('concept_id'));
    }
  }
}

function addToHash(key, concept_id) {
  if(isHashEmpty(presentingComplaintsHash))
    presentingComplaintsHash[key] = [];

  try {
    if(presentingComplaintsHash[key].indexOf(concept_id) < 0)
      presentingComplaintsHash[key].push(concept_id);

  }catch(e) {
    presentingComplaintsHash[key] = [];
    if(presentingComplaintsHash[key].indexOf(concept_id) < 0)
      presentingComplaintsHash[key].push(concept_id);

  }

}

function removeFromHash(key, concept_id) {
  var temp = presentingComplaintsHash[key];
  presentingComplaintsHash[key] = [];

  for(var i = 0 ; i < temp.length ; i++){
    if(temp[i] != concept_id)
      presentingComplaintsHash[key].push(temp[i])
  
  }

}
*/

function getPresentingComplaints(type_of_complaint) {
  var complaint_concept_set = {};
  complaint_concept_set['Specific presenting complaint'] = 8677;
  complaint_concept_set['Presenting complaint'] = 8578;
  complaint_concept_set['Presenting complaint group'] = 10319;

  var concept_set = complaint_concept_set[type_of_complaint];
  var url = apiProtocol+'://'+apiURL+':'+apiPort+'/api/v1/concept_set';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var objs = JSON.parse(this.responseText);
      if(type_of_complaint == 'Presenting complaint group'){
        presentingComplaintsHighLevel(objs);
        //presentingComplaints(objs, type_of_complaint);
      }else{
        presentingComplaints(objs, type_of_complaint);
      }
    }
  };
  xhttp.open("GET", (url + `?id=${concept_set}&name=`), true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function prepareToSave() {
  /*if(isHashEmpty(presentingComplaintsHash)) {
    showMessage('No selection made. Please selection one or more complaints');
    return;
  }

  var observations = [];
  var keys = []
  
  for(key in presentingComplaintsHash) {
    var concept_id = key == 'Presenting complaint' ? 8578 : 8677;
    var temp = presentingComplaintsHash[key];
    for(var i = 0 ; i < temp.length ; i++){
      observations.push({concept_id: concept_id, value_coded: temp[i]})
    }
  }*/
 
  for(const main_concept_id in presentingComplaintsHash) {
    const concepts = presentingComplaintsHash[main_concept_id];
    for(const concept_id of concepts){
      observations.push({
        concept_id: 8578,
        value_coded: main_concept_id,
        child: {
          concept_id: main_concept_id, value_coded: concept_id
        }
      });
    }
  }
  
  if(observations.length < 1) {
    showMessage('No selection made. Please selection one or more complaints');
    return;
  }

  var currentTime = moment().format(' HH:mm:ss');
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 
  encounter_datetime += currentTime;
                        	
  var encounter = {
    encounter_type_name: 'PRESENTING COMPLAINTS',
    encounter_type_id:  122,
    patient_id: sessionStorage.patientID,
    encounter_datetime: encounter_datetime
  }

  submitParameters(encounter, "/encounters", "saveObs");
}

function saveObs(encounter) { 
  
  var obs = {
    encounter_id: encounter["encounter_id"],
    observations: observations
  }; 

  submitParameters(obs, "/observations", "nextPage")  
}

function nextPage(obs){
  nextEncounter(sessionStorage.patientID, sessionStorage.programID);
}

function presentingComplaintsHighLevel(obj){
  let container = document.getElementById(`inputFrame${tstCurrentPage}`);
  container.innerHTML = `<div class="presenting-complaints-table">
    <div class="presenting-complaints-table-row">
      <div class="presenting-complaints-table-cell" id="presenting-complaints-table-cell-left">
        <div id="presenting-complaints-table-cell-left-data">&nbsp;</div>
      </div>
      <div class="presenting-complaints-table-cell" id="presenting-complaints-table-cell-right">
      </div>
    </div>
  </div>`;
 
  let complaintsHL = document.getElementById("presenting-complaints-table-cell-left-data");
  let complaints_container = `<div id="complaints-container">`;
  let complaints_sorted = [];
  let other_complaint;
  
  for(const complaint of obj){
    if(complaint.name.match(/other/i)){
      other_complaint = complaint.name;
      continue;
    }

    complaints_sorted.push(complaint.name);
  }
  complaints_sorted = complaints_sorted.sort();
  complaints_sorted.push(other_complaint);

  for(const complaint_name of complaints_sorted){
    for(const complaint of obj){
      if(complaint_name != complaint.name)
        continue;
        
      complaints_container += `<div class="complaints-container-row">
        <div id= "main-${complaint.concept_id}" onmousedown="showSet(${complaint.concept_id});" 
          class="complaints-container-cell main-complaints">
          <table style="width: 100%;">
            <tr>
              <td style="width: 85%; text-align: left; padding-left: 10px;">${complaint.name}</td>
              <td style="text-align: center; border-style: solid; border-width: 0px 0px 0px 3px;">&#8250;</td>
            </tr>
          </table>
        </div>
      </div>`;
      fetchSets(complaint.concept_id);
    }
  }
  complaintsHL.innerHTML = complaints_container += "</div>";

}

var concept_sets = {}
function fetchSets(concept_set){
  var url = apiProtocol+'://'+apiURL+':'+apiPort+'/api/v1/concept_set';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var objs = JSON.parse(this.responseText);
      concept_sets[concept_set] = objs;
    }
  };
  xhttp.open("GET", (url + `?id=${concept_set}&name=`), true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function showSet(concept_id){
  const sets = concept_sets[concept_id];
  let container = __$('presenting-complaints-table-cell-right');

  let html = `<div style="width: 95%; height: 70vh;">
  <div class="complaints-container">
    <div class="complaints-container-row">`;
  let cell_count = 0;
  let odd = "none-selected";

  for(set of sets){
    if(cell_count == 3){
      html += `</div><div class="complaints-container-row">`;
      cell_count = 0;
    }
   
    if(presentingComplaintsHash[concept_id] == undefined){
      odd = "none-selected";
    }else{
      odd = presentingComplaintsHash[concept_id].indexOf(set.concept_id) >= 0 ? "selected" : "none-selected";
    }


    html += `<div onmousedown="selectedComplaint(this);" 
     concept_id="${set.concept_id}" main_concept_id="${concept_id}"
     class="complaints-container-cell complaints ${odd}">${set.name}</div>`;
    cell_count++;
  }
  html += "</div></div></div>";
  container.innerHTML = html;
}

function selectedComplaint(el){
  let odd = el.getAttribute("class").split(" ")[2];
  el.setAttribute("class", "complaints-container-cell complaints " + (odd == "none-selected" ? "selected" : "none-selected"));
  let main_concept_id = parseInt(el.getAttribute("main_concept_id"));
  let concept_id = parseInt(el.getAttribute("concept_id"));
  let mainBTN = document.getElementById(`main-${main_concept_id}`);

  if(presentingComplaintsHash[main_concept_id] == undefined)
    presentingComplaintsHash[main_concept_id] = [];

  if(presentingComplaintsHash[main_concept_id].indexOf(concept_id) < 0 && odd == "none-selected"){
    presentingComplaintsHash[main_concept_id].push(concept_id);
  }else{
    let selected_concepts = presentingComplaintsHash[main_concept_id];
    presentingComplaintsHash[main_concept_id] = [];
    for(const i of selected_concepts){
      if(i == concept_id)
        continue;

      presentingComplaintsHash[main_concept_id].push(i);
    }
  }

  if(presentingComplaintsHash[main_concept_id].length > 0){
    mainBTN.style = "background-color: lightblue;";
  }else{
    mainBTN.style = "background-color: '';";
  }
}


var observations = [];