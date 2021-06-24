var presentingComplaintsHash = {};

function clearSelection(type_of_complaint) {
  presentingComplaintsHash[type_of_complaint] = [];
  buildPresentaingComplaints(type_of_complaint);
}

function build_search_field()
{

  var helpText0 = document.getElementById('helpText0');
  
  var search_content = document.createElement('div');
  search_content.setAttribute('id','search_content');
  helpText0.appendChild(search_content);

  var search_text = document.createElement('span');
  search_text.setAttribute('id','search_text');
  search_text.innerHTML='Search:';
  search_content.appendChild(search_text);

  var search_input = document.createElement('input');
  search_input.setAttribute('id','search_filed');
  search_input.setAttribute('style','height:40px;width:400px;');
  search_input.setAttribute('onkeyup','getPresentingComplaints("Presenting complaint")');
  search_content.appendChild(search_input);
  lookForTag();
}
function buildPresentaingComplaints(type_of_complaint) {
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.style = 'height: 90%; overflow: auto;';
  frame.innerHTML = null;

  getPresentingComplaints(type_of_complaint);
  var clearButton = document.getElementById('clearButton');
  clearButton.setAttribute('onmousedown',"clearSelection('" + type_of_complaint + "');");
}

function presentingComplaints(concept_sets, type_of_complaint) {
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.innerHTML = null;
  var main_container = document.createElement('div');
  main_container.setAttribute('id','complaints-container');


  

  frame.appendChild(main_container);
  var search_value = document.getElementById('search_filed').value;
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

      if(concept_names[x].toLowerCase().match(search_value.toLowerCase())) 
      {
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

function getPresentingComplaints(type_of_complaint) {
  var complaint_concept_set = {};
  complaint_concept_set['Specific presenting complaint'] = 8677;
  complaint_concept_set['Presenting complaint'] = 8578;

  var concept_set = complaint_concept_set[type_of_complaint];
  var url = apiProtocol+'://'+apiURL+':'+apiPort+'/api/v1/concept_set';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var objs = JSON.parse(this.responseText);
      presentingComplaints(objs, type_of_complaint);
    }
  };
  xhttp.open("GET", (url + "?id=" + concept_set + "&name="), true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function prepareToSave() {
  if(isHashEmpty(presentingComplaintsHash)) {
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
  
  var observations = [];
  var keys = []
  
  for(key in presentingComplaintsHash) {
    var concept_id = key == 'Presenting complaint' ? 8578 : 8677;
    var temp = presentingComplaintsHash[key];
    for(var i = 0 ; i < temp.length ; i++){
      observations.push({concept_id: concept_id, value_coded: temp[i]})
    }
  }
  
  var obs = {
    encounter_id: encounter["encounter_id"],
    observations: observations
  }; 

  submitParameters(obs, "/observations", "nextPage")  
}

function nextPage(obs){
  nextEncounter(sessionStorage.patientID, sessionStorage.programID);
}

