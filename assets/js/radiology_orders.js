var presentingComplaintsNameHash = {};

function clearSelection() {
  presentingComplaintsNameHash = [];
  buildRadiologyOrders();
}

function buildRadiologyOrders() {
  document.getElementById('buttons').setAttribute('style','width: 100% !important');
  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.style = 'height: 90%; overflow: auto; display: flex';
  frame.innerHTML = null;

  getRadiologyOrders();
  var clearButton = document.getElementById('clearButton');
  clearButton.setAttribute('onmousedown',"clearSelection();");

  if (sessionStorage.radiology_is_set == 'true') {
    var cancelButton = document.getElementById('cancelButton');
    cancelButton.setAttribute('onmousedown','closeOrdersPopupModal()');
  }
}

function RadiologyOrders(concept_sets, type_of_complaint) {

  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.innerHTML = null;

  var side_bar_container = document.createElement('div');
  side_bar_container.setAttribute('id','side-bar-pre-grouped');


  frame.appendChild(side_bar_container);

  var main_container = document.createElement('div');
  main_container.setAttribute('id','complaints-container');

  frame.appendChild(main_container);
 
  var row;
  var list;

  concept_names = []
  for(var t = 0 ; t < concept_sets.length; t++) {
  var row_count = 1;
    
      var column = document.createElement('div');
      column.setAttribute('class','complaints-container-column');
      side_bar_container.appendChild(column);
  
      var box;
      box = document.createElement('div');
      box.setAttribute('class','complaints-container-box');
      box.setAttribute('id',concept_sets[t].group);
      box.innerHTML = concept_sets[t].group;
      box.setAttribute('selected', 'false');
      box.setAttribute('onmousedown','groupClicked(this);');
      if (t == 0)
      box.setAttribute('style','background-color: #aaaaf4 !important');
      column.appendChild(box);
    
      list = document.createElement('div');
      list.setAttribute('id','list-'+concept_sets[t].group);
      if(t == 0)
      list.setAttribute('class','complaints-list-show');
      else
      list.setAttribute('class','complaints-list-hide');
      main_container.appendChild(list);
    
    for(var i = 0 ; i < concept_sets[t].complaints.length; i++) {
      if(row_count == 1){
                row = document.createElement('div');
                row.setAttribute('class','complaints-container-row');
                list.appendChild(row);
              }
      
              cell = document.createElement('div');
              cell.setAttribute('class','complaints-container-cell');
              cell.innerHTML = concept_sets[t].complaints[i].name;
              cell.setAttribute('selected', 'false');
              cell.setAttribute('concept_id', concept_sets[t].complaints[i].concept_id);
              cell.setAttribute('group_concept_id', concept_sets[t].concept_id);
              cell.setAttribute('group_name', concept_sets[t].group);
              cell.setAttribute('complaint-type', type_of_complaint);
              cell.setAttribute('name',concept_sets[t].concept_id+";"+concept_sets[t].complaints[i].name+";"+concept_sets[t].group);
              cell.setAttribute('onmousedown','orderClicked(this);');
              row.appendChild(cell);

              row_count++;
              if(row_count == 4)
                row_count = 1;
  }  
  }

}



function orderClicked(e) {
  var type_of_complaint = e.getAttribute('complaint-type');
  
  var groupID = e.parentElement.parentElement.getAttribute('id').split('list-');
  var groupSelected = document.getElementById(groupID[1]);
  var childNodes = e.parentElement.parentElement.childNodes;
  
  if(e.getAttribute('selected') == 'false'){
    if(e.innerHTML.toUpperCase() == 'NONE'){
      deSelectAll(type_of_complaint);
    }else{
      deSelectNone(type_of_complaint)
    }
    e.setAttribute('selected', 'true');
    e.style = 'background-color: lightblue;';

    addToNameHash(e.getAttribute('name'));
    for (var i =0; i < childNodes.length; i++ ) {
      for (var j=0; j < childNodes[i].childNodes.length; j++) {
        if ( childNodes[i].childNodes[j].getAttribute('selected') == 'true') {
          groupSelected.setAttribute('selected', 'true');
          groupSelected.style = 'background-color: #aaaaf4 !important;';
        }
      }
    }   
  }else{
    e.setAttribute('selected', 'false');
    e.style = 'background-color: "";';
    removeFromNameHash(e.getAttribute('name'));
    var find_selected = 0;
    for (var i =0; i < childNodes.length; i++ ) {
      for (var j=0; j < childNodes[i].childNodes.length; j++) {
          if (childNodes[i].childNodes[j].getAttribute('selected') == 'true') 
          find_selected +=1;   
      }
    }
    if (find_selected == '0') {
        groupSelected.setAttribute('selected', 'false');
        groupSelected.style = 'background-color: #aaaaf4 !important;';
    }
  }
}

function groupClicked(e){
  var group_name = e.getAttribute('id');
  var container_list = document.getElementById('list-'+group_name);
  var currentVisabList = document.getElementsByClassName('complaints-list-show');
  var groupList = document.getElementsByClassName('complaints-container-box');

  for(var i=0; i<groupList.length; i++) {
    if(groupList[i].getAttribute('selected') == 'false')
    groupList[i].setAttribute('style','background-color: none !important');
  }
  e.setAttribute('style','background-color: #aaaaf4 !important');

  currentVisabList[0].setAttribute('class','complaints-list-hide');
  container_list.setAttribute('class','complaints-list-show');
}

function deSelectAll(key) {
  var list = document.getElementsByClassName('complaints-container-cell');
  for(var i = 0 ; i < list.length ; i++){
    list[i].style = 'background-color: "";';
  }
  presentingComplaintsNameHash = [];
}

function deSelectNone(key) {
  var list = document.getElementsByClassName('complaints-container-cell');
  for(var i = 0 ; i < list.length ; i++){
    if(list[i].innerHTML.toUpperCase() == 'NONE' && list[i].getAttribute('selected') == 'true') {
      list[i].style = 'background-color: "";';
      removeFromNameHash(list[i].getAttribute('name'));
    }
  }
}

function addToNameHash(e) {
  if(isHashEmpty(presentingComplaintsNameHash))
  presentingComplaintsNameHash = [];

  try {
    presentingComplaintsNameHash.push(e);
  }catch(e) {
    presentingComplaintsNameHash.push(e);
  }
}

function removeFromNameHash(e) {
  var temp = presentingComplaintsNameHash;
  presentingComplaintsNameHash= [];

  for(var i = 0 ; i < temp.length ; i++){
    if(temp[i] != e){
      presentingComplaintsNameHash.push(temp[i])
    }
  } 
}


function getRadiologyOrders() {
  
  var concept_set = 8426;
  var url = apiProtocol+'://'+apiURL+':'+apiPort+'/api/v1/list_radiology_orders';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var objs = JSON.parse(this.responseText);
     RadiologyOrders(objs, 'Radiology orders');
    }
  };
  xhttp.open("GET", (url + "?id=" + concept_set + "&name="), true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function save_encounter() {
  if(isHashEmpty(presentingComplaintsNameHash)) {
    showMessage('No selection made. Please selection one or more orders');
    return;
  }

  var currentTime = moment().format(' HH:mm:ss');
  var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD'); 
  encounter_datetime += currentTime;
                        	
  var encounter = {
    encounter_type_id:  121,
    patient_id: sessionStorage.patientID,
    encounter_datetime: encounter_datetime
  }

  submitParameters(encounter, "/encounters", "postRadiologyOrders");
}


var last_accession_number;
function get_accession_number()
{
    var accession_number_url = apiProtocol + "://" + apiURL + ":" + apiPort;
    accession_number_url += "/api/v1/sequences/next_accession_number";

    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var new_accn_number = JSON.parse(this.responseText)["accession_number"];
            last_accession_number = new_accn_number;
            
        }
    };
    xhttp1.open("GET", accession_number_url, false);
    xhttp1.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp1.setRequestHeader('Content-type', "application/json");
    xhttp1.send();
}
function postRadiologyOrders(encounter) { 
  
    get_accession_number();
    var tests_ordered_concept_id = 8426;

  var observations = [];
  var keys = [];

    for(var i = 0 ; i < presentingComplaintsNameHash.length ; i++){
        var data = presentingComplaintsNameHash[i].split(";");
        
      observations.push({
          concept_id: tests_ordered_concept_id, 
          value_text:data[2],
          child: {
            concept_id: data[0],
            accession_number: last_accession_number,
            value_text: data[1]
        }
        })
    }

  var obs = {
    encounter_id: encounter["encounter_id"],
    observations: observations
  }; 
  
  submitParameters(obs, "/observations", "submitRadiologyParameters")
                   
}
function submitRadiologyParameters(array_obj) 
{
     var patient_name = sessionStorage.getItem("family_name")+" "+sessionStorage.getItem("given_name");
     var accession_number = array_obj[0].children[0].accession_number;
     var date_created = array_obj[0].date_created;

     var patient_data = {  
        patient_details:
         {
             "patient_name": patient_name ,
             "patientAge": sessionStorage.getItem("patientAge"),
             "patientDOB": sessionStorage.getItem("patientDOB"),
             "patientGender": sessionStorage.getItem("patientGender"),
             "national_id": sessionStorage.getItem("national_id"),
             "person_id": array_obj[0].person_id,
             "encounter_id": array_obj[0].encounter_id,
             "date_created": date_created,
             "accession_number": accession_number,
         },
         physician_details:
         {
             "username": sessionStorage.getItem("username"),
             "userID": sessionStorage.getItem("userID"),
             "userRoles": sessionStorage.getItem("userRoles"),
         },
        radiology_orders: []
     };
 
     var radiology_orders_string = "";
     for(var key in array_obj)
     {
         var obj = array_obj[key];
         patient_data.radiology_orders.push(
         { 
             "main_value_text": obj.value_text,
             "obs_id": obj.obs_id,
             "sub_value_text": obj.children[0].value_text,
         });

         if(radiology_orders_string == "")
             radiology_orders_string = obj.children[0].value_text;
         else
             radiology_orders_string = radiology_orders_string +","+ obj.children[0].value_text;

     }

     sessionStorage.setItem("radiology_orders", radiology_orders_string); 
     sessionStorage.setItem("radiology_accession_number", accession_number); 
     sessionStorage.setItem("date_created", date_created); 
     print_barcode();

     jQuery(".loader").show();
     submitParameters(patient_data, "/radiology/radiology_orders", "print_barcode")
}


function print_barcode()
{
     var radiology_barcode_url = "/views/print/radiology_barcode.html";
     window.location =radiology_barcode_url;
}

function closeOrdersPopupModal() {
  sessionStorage.setItem('radiology_is_set', 'false');
  sessionStorage.setItem('lab_is_set', 'false');
  let page_cover = window.parent.document.getElementById("page-cover");
  page_cover.style = "display: none;";

  let submit_cover = window.parent.document.getElementById("page-cover");
  submit_cover.style = "display: none;";

  var parent = window.parent.document.getElementById('mateme');
  parent.setAttribute('class','');
  
  //var main_container = window.parent.document.getElementsByTagName('body')[0].lastElementChild;
  var main_container = window.parent.document.getElementById('ordersModal');
  main_container.setAttribute('class','modal fade');
  main_container.setAttribute('style','display: none');
  window.parent.document.getElementsByTagName('body')[0].removeChild(main_container);

  var someIframe = window.parent.document.getElementById('labIframe');
  someIframe.parentNode.removeChild(someIframe);
}