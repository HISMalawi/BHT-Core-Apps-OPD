var popipPosition;
var selectedDignosis = {};


function showDiagnosisKeyboard() {
  var diagnosisBox = document.createElement('div');
  diagnosisBox.setAttribute('id', 'diagnosis-box');

  var diagnosisCover = document.createElement('div');
  diagnosisCover.setAttribute('id', 'diagnosis-cover');

  var container = document.createElement('div');
  container.setAttribute('id', 'diagnosis-container');
  diagnosisBox.appendChild(container);

  var diagnosisNavBar = document.createElement('div');
  diagnosisNavBar.setAttribute('id', 'diagnosis-nav-bar');
  diagnosisBox.appendChild(diagnosisNavBar);

  var windowBody = document.getElementsByTagName('body')[0];
  try {
      var div1 = document.getElementById('diagnosis-box');
      var div2 = document.getElementById('diagnosis-cover');
      windowBody.removeChild(div1);
      windowBody.removeChild(div2);
  } catch (e) {
  }

  windowBody.appendChild(diagnosisBox);
  windowBody.appendChild(diagnosisCover);
  diagnosisCover.style = 'display: inline;';
  diagnosisBox.style = 'display: inline;';

  addNavButtons(diagnosisNavBar);
  addControls();

}

function addControls() {
  var container = document.getElementById('diagnosis-container');

  var helpText = document.createElement('div');
  helpText.innerHTML = "<span id='sideeffectTag'>Select&nbsp;medication</span>";
  helpText.setAttribute('class','helpTextClass');
  helpText.style = "width: 97%;";
  container.appendChild(helpText);


  var search = document.createElement('div');
  search.setAttribute('class','inputFrameClass');
  var searchCSS = "width: 94.5%; height: 300px;";
  search.style = searchCSS;
  container.appendChild(search);

  var input = document.createElement('input');
  input.setAttribute("type","text");
  input.setAttribute("id","key-input");
  input.setAttribute("class","touchscreenTextInput");
  input.setAttribute("onmouseup","checkForChanges();");
  input.setAttribute("onkeyup","checkForChanges();");
  search.appendChild(input);

  var search_results = document.createElement('div');
  search_results.setAttribute("id","search-results");
  search_results.style = "height: 260px; overflow: auto;";
  search.appendChild(search_results);

  var keyboard = document.createElement('div');
  keyboard.setAttribute('class','keyboard');
  keyboard.style = "bottom: 120px;";
  container.appendChild(keyboard);

  addKeys(keyboard);
}

function addKeys(e) {
  var qwerty = [];
  qwerty.push(["q","w","e","r","t","y","u","i","o","p"]);
  qwerty.push(["a","s","d","f","g","h","j","k","l","Space"]);
  qwerty.push(["Shift","z","x","c","v","b","n","m","Del.","Clear"]);



  for(var i = 0 ; i < qwerty.length; i++){
    var row = document.createElement("div");
    row.setAttribute("class","buttonLine");

    for(var j = 0 ; j < qwerty[i].length; j++){
      var button = document.createElement("button");
      button.setAttribute("class","keyboardButton");
      button.innerHTML = "<span>" + qwerty[i][j] + "</span>";
      button.setAttribute("onmousedown","setEnteredKey(this);");
      button.setAttribute("key", qwerty[i][j]);
      row.appendChild(button);
    }
    e.appendChild(row);
  }

  var keyInput = document.createElement("input");
  keyInput.setAttribute("id","key-input");
  keyInput.setAttribute("type","hidden");

  e.appendChild(keyInput);
}

function setEnteredKey(key) {
  var inputBox = document.getElementById("key-input");

  try{

    if(key.innerHTML.match(/Del/i)){
      inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
    }else if(key.getAttribute('key').match(/Clear/i)){
      inputBox.value = null;
    }else if(key.getAttribute('key').match(/Shift/i)){
    }else if(key.getAttribute('key').match(/Space/i)){
      inputBox.value += " ";
    }else{
      inputBox.value += key.getAttribute('key');
    }

  }catch(x) { }

  getDiagnosis(inputBox.value);
}

function addNavButtons(e) {
  var nextB = document.createElement('button');
  nextB.innerHTML = '<span>Next</span>';
  nextB.setAttribute('class', 'button green navButton nav-diagnosis-btns');
  nextB.setAttribute('onmousedown', 'selectDignosis();');
  //nextB.setAttribute('onmousedown', 'selectAmount();');
  nextB.setAttribute('id', 'next-button');
  e.appendChild(nextB);

  var cancelB = document.createElement('button');
  cancelB.innerHTML = '<span>Cancel</span>';
  cancelB.style = 'float: left; left: 5px;';
  cancelB.setAttribute('class', 'button red navButton nav-diagnosis-btns');
  cancelB.setAttribute('onmousedown', 'cancelDiagnosis();');
  e.appendChild(cancelB);
}

function cancelDiagnosis() {
  var windowBody = document.getElementsByTagName('body')[0];
  try {
      var div1 = document.getElementById('diagnosis-box');
      var div2 = document.getElementById('diagnosis-cover');
      windowBody.removeChild(div1);
      windowBody.removeChild(div2);
  } catch (e) {
  }
}

function getDiagnosis(search_str) {
  var url = apiProtocol+'://'+apiURL+':'+apiPort+'/api/v1/drugs';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var objs = JSON.parse(this.responseText);
      renderResults(objs);
    }
  };
  xhttp.open("GET", (url + "?name=" + search_str), true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function renderResults(diagnosis) {
  var resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = null;

  var ul = document.createElement("ul");
  ul.setAttribute("id", "results-ul");
  ul.style = "padding-left: 1px;";

  for(var i = 0 ; i < diagnosis.length ; i++) {
    var li = document.createElement("li");
    li.innerHTML = diagnosis[i].name;
    li.setAttribute("tstvalue", diagnosis[i].name);
    li.setAttribute("class", "results-list");
    li.setAttribute("concept_id", diagnosis[i].drug_id);
    li.setAttribute("onmousedown", "null; updateSelection(this);");
    ul.appendChild(li);
  }

  resultsContainer.appendChild(ul);
  autoSelect();
}

function updateSelection(e) {
  var inputBox = document.getElementById("key-input");
  inputBox.value = e.getAttribute('tstvalue');
  
  var list = document.getElementsByClassName('results-list');
  for(var i = 0 ; i < list.length ; i++){
    list[i].style = 'background-color: "";';
  }

  e.style = "background-color: lightblue;";
}

function checkForChanges() {
  var inputBox = document.getElementById("key-input");
  getDiagnosis(inputBox.value);
}

function autoSelect() {
  var inputBox = document.getElementById("key-input");
  
  var list = document.getElementsByClassName('results-list');
  for(var i = 0 ; i < list.length ; i++){
    if(list[i].getAttribute('tstvalue').toUpperCase() == inputBox.value.toUpperCase()) {
      updateSelection(list[i]);
    }
  }

}

function selectDignosis() {
  var inputBox = document.getElementById("key-input");
  var list = document.getElementsByClassName('results-list');
  var selected;

  for(var i = 0 ; i < list.length ; i++){
    if(list[i].getAttribute('style').match(/lightblue/i)) {
      selected = list[i]; 
    }
  }

  if(selected != undefined){
    addSelectedDignosis(selected);
    //cancelDiagnosis();
    selectAmount();
  }
}

var selected_medication;

function addSelectedDignosis(selected){
  selected_medication = selected.getAttribute('concept_id');

  if(isHashEmpty(selectedDignosis)) {
    selectedDignosis['Selected medication'] = {};
    selectedDignosis['Selected medication'][selected.getAttribute('concept_id')] = {medication: null, quantity: null};
  }

  try {
    selectedDignosis['Selected medication'][selected.getAttribute('concept_id')].medication = selected.getAttribute('tstvalue');
  }catch(z) {
    selectedDignosis['Selected medication'][selected.getAttribute('concept_id')] = {medication: null, quantity: null};
    selectedDignosis['Selected medication'][selected.getAttribute('concept_id')].medication = selected.getAttribute('tstvalue');
  }
}

function isHashEmpty(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
    }
  return true;
}

function addTable(diagnosis, li) {
  var side = 'Selected medication';
  var table = document.createElement('table');
  table.setAttribute('class','diagnosis-tables');
  var tr = document.createElement('tr');
  table.appendChild(tr);

  var td = document.createElement('td');
  td.innerHTML = diagnosis.medication;
  td.style = "font-weight: bold; font-size: 17px;";
  tr.appendChild(td);


  var td = document.createElement('td');
  td.innerHTML = diagnosis.quantity;
  td.style = "font-weight: bold; font-size: 17px;";
  tr.appendChild(td);


  var td = document.createElement('td');
  var img = document.createElement('img');
  img.setAttribute('src','/assets/images/delete.png');
  img.setAttribute('class','remove-diagnosis');
  td.setAttribute('onmousedown','removeDig(this);')
  td.appendChild(img);
  td.style = "width: 61px;";
  td.setAttribute('diagnosis', diagnosis);
  td.setAttribute('side', side);
  tr.appendChild(td);

  li.appendChild(table);
}

function removeDig(e) {
  var side = 'Selected medication';
  var temp = selectedDignosis[side];
  var diagnosis = e.getAttribute('diagnosis');
  
  selectedDignosis[side] = {};

  for(var concept_id in temp){
    if(temp[concept_id].medication == diagnosis)
      continue;

    selectedDignosis[side][concept_id].medication = temp[concept_id];
    selectedDignosis[side][concept_id].quantity = temp[concept_id].quantity;
  }

  var container = document.getElementById('inputFrame' + tstCurrentPage);
  container.innerHTML = null;

  var ul = document.createElement('ul');
  ul.setAttribute("style","list-style-type: none;")
  container.appendChild(ul);

  var level2 = selectedDignosis[side];
  for(var concept_id in level2){
    var li = document.createElement('li');
    addTable(level2[concept_id], li);
    ul.appendChild(li);
  }
}

function submitDignosis() {
  if(isHashEmpty(selectedDignosis)) {
    showMessage("Please select one / more medication by click;<br/><b>Add medication</b>");
    return;
  }

  var primary_obs = {};
  var secondary_obs = {};

  var temp = selectedDignosis['Selected medication'];
  for(concept_id in temp) {
    primary_obs[concept_id] = temp[concept_id];
  }

  if(isHashEmpty(primary_obs)) {
    showMessage("Please select one / more medication by click;<br/><b>Add medication</b>");
    return;
  }

  var currentTime = moment().format(' HH:mm:ss');
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 
  encounter_datetime += currentTime;
                        	
  var encounter = {
    encounter_type_name: 'DRUGS GIVEN',
    encounter_type_id:  143,
    patient_id: sessionStorage.patientID,
    encounter_datetime: encounter_datetime
  }

  submitParameters(encounter, "/encounters", "postDignosisObs");
}

function postDignosisObs(encounter) {

  var primary_obs = {};
  var secondary_obs = {};

  var temp = selectedDignosis['Selected medication'];
  for(concept_id in temp) {
    primary_obs[concept_id] = temp[concept_id];
  }

  observations = []
  
  for(concept_id in primary_obs) {
    observations.push({
      concept_id: 9236,
      value_drug: concept_id,
      value_text: primary_obs[concept_id].medication,
      value_numeric:  primary_obs[concept_id].quantity
    });
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


/* .............................................................................. */

function selectAmount() {
  var container = document.getElementById('diagnosis-container');
  container.innerHTML = null;

  var helpText = document.createElement('div');
  helpText.innerHTML = "<span id='sideeffectTag'>Quantity</span>";
  helpText.setAttribute('class','helpTextClass');
  helpText.style = "width: 97%;";
  container.appendChild(helpText);


  var search = document.createElement('div');
  search.setAttribute('class','inputFrameClass');
  var searchCSS = "width: 94.5%; height: 250px;";
  search.style = searchCSS;
  container.appendChild(search);

  var input = document.createElement('input');
  input.setAttribute("type","text");
  input.setAttribute("id","key-input");
  input.setAttribute("class","touchscreenTextInput");
  //input.setAttribute("onmouseup","checkForChanges();");
  //input.setAttribute("onkeyup","checkForChanges();");
  search.appendChild(input);

  var search_results = document.createElement('div');
  search_results.setAttribute("id","search-results");
  search_results.style = "height: 260px; overflow: auto;";
  search.appendChild(search_results);

  var keyboard = document.createElement('div');
  keyboard.setAttribute('class','keyboard');
  keyboard.style = "bottom: 120px;";
  container.appendChild(keyboard);

  var finishButton = document.getElementById('next-button');
  finishButton.innerHTML = "<span>Finish</span>";
  finishButton.setAttribute('onmousedown', 'addQuantity();');


  removeBackButton();
  addBackButton();
  addKeyPad(keyboard); 
}

function addBackButton() {
  var root = document.getElementById('diagnosis-nav-bar');
  var nextB = document.createElement('button');
  nextB.innerHTML = '<span>Back</span>';
  nextB.setAttribute('class', 'button blue navButton nav-diagnosis-btns');
  //nextB.setAttribute('onmousedown', 'selectDignosis();');
  nextB.setAttribute('onmousedown', 'displayMedicationController();');
  nextB.setAttribute('id', 'back-button');
  root.appendChild(nextB); 
}

function displayMedicationController() {
  var container = document.getElementById('diagnosis-container');
  container.innerHTML = null;
  removeBackButton();

  var finishButton = document.getElementById('next-button');
  finishButton.innerHTML = "<span>Next</span>";
  finishButton.setAttribute('onmousedown', 'selectAmount();');

  addControls();
}

function removeBackButton() {
  var backButton = document.getElementById('back-button');
  if(backButton == undefined)
    return;

  var root = document.getElementById('diagnosis-nav-bar');
  root.removeChild(backButton);  
}

function addKeyPad(keypadContainer) {

  var keypress = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["Del.", "0", "."]
  ];

  //var table = document.createElement("div");
  //table.setAttribute("class","keyboard");

  for(var i = 0 ; i < keypress.length ; i++){
    var row = document.createElement("span")
    row.setAttribute("class","buttonLine");
    keypadContainer.appendChild(row);

    for(var x = 0 ; x < keypress[i].length ; x++){
      var cell = document.createElement("button")
      cell.setAttribute("class","keyboardButton");
      row.appendChild(cell);

      cell.setAttribute("onmousedown","keyPressedX(this);");
      cell.innerHTML = "<span>" + keypress[i][x] + "</span>";


    }
  }

  targetInput = document.getElementById('key-input');
}

var targetInput;

function keyPressedX(e) {
  var inputBox = targetInput;
  var value_string = e.innerHTML.replace('<span>','');
  value_string = value_string.replace('</span>','');

  try{

    if(value_string.match(/Del/i)){
      inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
    }else if(e.innerHTML.match(/Caps/i)){
    }else if(e.innerHTML.match(/Hide/i)){
      var vl = document.getElementById('virtual-keyboard');
      var w = document.getElementsByTagName('body')[0];
      w.removeChild(vl);
    }else{
      inputBox.value += value_string;
    }
 
    try {
      $('input[type="search"]').val(inputBox.value).keyup();
    }catch(z) {}
  }catch(x) { }

}

function addQuantity() {
  var qty = document.getElementById('key-input').value;
  if(isEmpty(qty))
    return;
    
  qty = parseFloat(qty);
  if(!isNumeric(qty))
    return;
        
  selectedDignosis['Selected medication'][selected_medication].quantity = qty;
  cancelDiagnosis();

  var container = document.getElementById('inputFrame' + tstCurrentPage);
  container.innerHTML = null;

  var ul = document.createElement('ul');
  ul.setAttribute("style","list-style-type: none;")
  container.appendChild(ul);

  var level2 = selectedDignosis['Selected medication'];
  for(var concept_id in level2){
    var li = document.createElement('li');
    addTable(level2[concept_id], li);
    ul.appendChild(li);
  }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isEmpty(str){
  try {
    return (str.replace(/\s+/g, '').length < 1);
  }catch(e){
    return true;
  }
}


