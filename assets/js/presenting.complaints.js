var presentingComplaintsHash = {};
var presentingComplaintsNameHash = {};
var _concept_set;
sessionStorage.setItem('radiology_order_done','false');
sessionStorage.setItem('lab_order_done','false');
sessionStorage.setItem('radiology_is_set', 'false');


function clearSelection(type_of_complaint) {
  presentingComplaintsHash[type_of_complaint] = [];
  presentingComplaintsNameHash = [];
  buildPresentaingComplaints(type_of_complaint);
  messageBar.style.display = "none";
}

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function build_search_field() {
    var helpText0 = document.getElementById('helpText0');
    var search_content = document.createElement('div');
    search_content.setAttribute('id','search_content');
    //helpText0.appendChild(search_content);
  
    insertAfter(search_content, helpText0);
  
    var search_text = document.createElement('span');
    search_text.setAttribute('id','search_text');
    search_text.innerHTML='Search:';
    search_content.appendChild(search_text);
  
    var search_input = document.createElement('input');
    search_input.setAttribute('id','search_field');
    search_input.setAttribute('style','height:40px;width:400px;');
    //search_input.setAttribute('onkeyup','getPresentingComplaints("Presenting complaint")');
    search_input.setAttribute('onkeyup','search_results()');
    search_content.appendChild(search_input);
    lookForTag(); 
}


function  search_results() {
  var x = document.getElementById("search_field").value;

  var groups_ls_parent = document.getElementById('side-bar-pre-grouped');

  if (x != '')
  for (n=0; n < groups_ls_parent.children.length; n++) {
    groups_ls_parent.children[n].setAttribute('style','display: none');
  } 

  if (x == '')
  for (n=0; n < groups_ls_parent.children.length; n++) {
    groups_ls_parent.children[n].setAttribute('style','display: show');


    for (var d=0; d < _concept_set.length; d++) {
      var _id = _concept_set[d].group;
      var _bv = document.getElementById(_id);
      _bv.parentElement.setAttribute('style','display: show');
      groupClicked(_bv);
      _found_g_name_id = _bv.getAttribute('id');
      setVissiableForGroup(_found_g_name_id); 
    }

    //console.log(groups_ls_parent.children[n].children[0]);

    //var __selected = groups_ls_parent.children[n].children[0].getAttribute('selected');

    //groupClicked(groups_ls_parent.children[0].children[0]);

    // if (__selected == 'true') {
    //   //groupClicked(groups_ls_parent.children[n].children[0]);
    // } else {
      
    // }
    //complaints-container-column
  }

  for (var t=0; t < _concept_set.length; t++) {
    var srch_str = '_'+_concept_set[t].group.toLowerCase();
     var condition_for_group_name = srch_str.indexOf(x);
    
    for (var y=0; y<_concept_set[t].complaints.length;y++) {
      var _srch_str = '_'+_concept_set[t].complaints[y].name.toLowerCase();
      var condition_for_complaint = 0;

      var complaint_id = _concept_set[t].complaints[y].concept_id;
      var _name =  document.getElementById(complaint_id).getAttribute('name');
      var elementsByName = document.getElementsByName(_name);
      
      if (x != '') {

        document.getElementById(complaint_id).setAttribute('style','display: none');
        if (elementsByName.length > 1) {

          for (var m=0; m<elementsByName.length; m++) {
            elementsByName[m].setAttribute('style','display: none');
          }
        }
      }
      
      if (x == '') {
        document.getElementById(complaint_id).setAttribute('style','display: show');

        var selected = document.getElementById(complaint_id).getAttribute('selected');
        if (selected == 'true') {
          document.getElementById(complaint_id).setAttribute('style','display: show; background-color: lightblue;');
        }

        if (elementsByName.length > 1) {

          for (var m=0; m<elementsByName.length; m++) {
            elementsByName[m].setAttribute('style','display: show');

            var _selected = elementsByName[m].getAttribute('selected');

            if (_selected == 'true') {
              elementsByName[m].setAttribute('style','display: show; background-color: lightblue;');
            }
          }
        }
      }


      condition_for_complaint = _srch_str.indexOf(x);

      if (condition_for_complaint > 0) {

        document.getElementById(complaint_id).setAttribute('style','display: show');

        var selected = document.getElementById(complaint_id).getAttribute('selected');

        if (selected == 'true') {
          document.getElementById(complaint_id).setAttribute('style','display: show; background-color: lightblue;');
        }


        if (elementsByName.length > 1) {

          for (var m=0; m<elementsByName.length; m++) {
            elementsByName[m].setAttribute('style','display: show');

            var _selected = elementsByName[m].getAttribute('selected');

            if (_selected == 'true') {
              elementsByName[m].setAttribute('style','display: show; background-color: lightblue;');
            }
          }
        }

        var id = _concept_set[t].group;
        var bv = document.getElementById(id);
  
        bv.parentElement.setAttribute('style','display: show');
        groupClicked(bv);
      }
    }

     if (condition_for_group_name > 0) {

      var id = _concept_set[t].group;
      var bv = document.getElementById(id);

      bv.parentElement.setAttribute('style','display: show');
      groupClicked(bv);
      _found_g_name_id = bv.getAttribute('id');
      //setVissiableForGroup(bv.getAttribute('id'))
     }
  }
  setVissiableForGroup(_found_g_name_id);
}

var _found_g_name_id = null;

function setVissiableForGroup(group) {

  var _group = document.getElementById('list-'+group);

  for (g=0; g<_group.children.length; g++) {

    for (var _g=0; _g<_group.children[g].children.length; _g++) {
      _group.children[g].children[_g].setAttribute('style','display: show');

      var _selected = _group.children[g].children[_g].getAttribute('selected');

      if (_selected == 'true') {
        _group.children[g].children[_g].setAttribute('style','display: show; background-color: lightblue;');
      }
    }
  }

}

function buildPresentaingComplaints(type_of_complaint) {


 
    document.getElementById('buttons').setAttribute('style','width: 100% !important');
    var frame = document.getElementById('inputFrame' + tstCurrentPage);
    frame.style = 'height: 90%; display: flex';
    frame.innerHTML = null;
    getPresentingComplaints(type_of_complaint);
    var clearButton = document.getElementById('clearButton');
    clearButton.setAttribute('onmousedown',"clearSelection('" + type_of_complaint + "');");

   
  
}

function buildOrderButton() {
  const navButton = document.getElementById('buttons');
  const orderButton = document.createElement('button');

  orderButton.setAttribute('id','orderButton');
  orderButton.setAttribute('class','blue button navButton');
  orderButton.setAttribute('selected','false');
  if(sessionStorage.radiology_status == 'true'){
    orderButton.innerHTML = '<span>Orders</span>';
    orderButton.setAttribute('onmousedown','ordersPopupModal()');
  } else {
    orderButton.innerHTML = '<span>Lab Order</span>';
    orderButton.setAttribute('onmousedown','redirection(\"lab\")');
  }
  navButton.appendChild(orderButton);
}

function presentingComplaints(concept_sets, type_of_complaint) {

  var frame = document.getElementById('inputFrame' + tstCurrentPage);
  frame.innerHTML = null;

  var subMainConatiner = document.createElement('div');
  subMainConatiner.setAttribute('id','selected_complaints_main_container');
  

  var div1 = document.createElement('div');
  div1.setAttribute('style','display: flex;');
 

  var div2 = document.createElement('div');
  div2.setAttribute('id','ts');
 
  div2.setAttribute('style','width:100%');
  var side_bar_container = document.createElement('div');
  side_bar_container.setAttribute('id','side-bar-pre-grouped');

  var main_container = document.createElement('div');
  main_container.setAttribute('id','complaints-container');

  div2.appendChild(subMainConatiner);
  div1.appendChild(side_bar_container);
  div1.appendChild(main_container);
  div2.appendChild(div1);

 

  frame.appendChild(div2);


  

  // for (var i=0; i<5; i++) {
  //   var column = document.createElement('div');
  //   column.setAttribute('class','complaints-container-column');
  //   side_bar_container.appendChild(column);

  //   var box;
  //   box = document.createElement('div');
  //   box.setAttribute('class','complaints-container-box');
  //   box.innerHTML = "dog fight";
  //   //cell.setAttribute('selected', 'false');
  //   //cell.setAttribute('concept_id', concept_sets[i].concept_id);
  //   //cell.setAttribute('complaint-type', type_of_complaint);
  //   //cell.setAttribute('onmousedown','complaintClicked(this);');
  //   column.appendChild(box);
  // }

  

  //frame.appendChild(side_bar_container);



  // var subMainConatiner = document.createElement('div');
  // subMainConatiner.setAttribute('id','selected_complaints_main_container');
  // main_container.appendChild(subMainConatiner);


  

  //frame.appendChild(main_container);
  //var search_value = document.getElementById('search_filed').value;
 
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
              cell.innerHTML = "<span class=\'namespacing\'>"+concept_sets[t].complaints[i].name+"</span>";
              cell.setAttribute('selected', 'false');
              cell.setAttribute('concept_id', concept_sets[t].complaints[i].concept_id);
              cell.setAttribute('id', concept_sets[t].complaints[i].concept_id);
              cell.setAttribute('group_concept_id', concept_sets[t].concept_id);
              cell.setAttribute('group_name', concept_sets[t].group);
              cell.setAttribute('complaint-type', type_of_complaint);
              cell.setAttribute('name', concept_sets[t].complaints[i].name);
              cell.setAttribute('onmousedown','complaintClicked(this);');
              row.appendChild(cell);

              row_count++;
              if(row_count == 4)
                row_count = 1;
  } 
  }
  // var sideBarPreGrouped = document.getElementById('side-bar-pre-grouped');
  //   var other = document.getElementById('Other');
  //   sideBarPreGrouped.appendChild(other);

  if (sessionStorage.saveState == "true") {
     sessionStorage.saveState = "false";
     sessionStorage.MiniWorkFlow = "false"
    
     var saveState = document.getElementById('ts');
     saveState.innerHTML = localStorage.getItem('page_html');
     
     localStorage.page_html = "";
     presentingComplaintsNameHash = JSON.parse(sessionStorage.presentingComplaintsNameHash);
     presentingComplaintsHash = JSON.parse(sessionStorage.presentingComplaintsHash);
  }
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


var row_c;
var row_c_item_count = 1;

function selectedComplaints(e) {

  var e = e.cloneNode(true)
  var container = document.getElementById('selected_complaints_main_container');
  //var subConatiner = document.createElement('div');

  if(row_c_item_count == 1) {
    row_c = document.createElement('div');
    row_c.setAttribute('class','complaints-container-row1');
  }
 
  //row_c.appendChild(subConatiner);
  //subConatiner.setAttribute('class','temp_comp');

 
  row_c.append(e);


  container.append(row_c);

  row_c_item_count++;
  if (row_c_item_count == 8)
       row_c_item_count = 1;
}

function complaintClicked(e) {
  var type_of_complaint = e.getAttribute('complaint-type');
  //var groupID = e.parentElement.parentElement.getAttribute('id').split('list-')[1];
  var group_name = e.getAttribute('group_name');
  var groupSelected = document.getElementById(group_name);
  var childNodes = e.parentElement.parentElement.childNodes;

  //console.log(groupID);

  
  if(e.getAttribute('selected') == 'false'){
    if(e.innerHTML.toUpperCase() == 'NONE'){
      deSelectAll(type_of_complaint);
    }else{
      deSelectNone(type_of_complaint)
    }
    e.setAttribute('selected', 'true');
    e.style = 'background-color: lightblue;';
    addToHash(type_of_complaint, e.getAttribute('concept_id'));
    selectedComplaints(e);
    document.getElementById('selected_complaints_main_container').setAttribute('class','selected_complaints_main_container_class');
    e.style = 'background-color: #ccc;';
    e.setAttribute('onmousedown','');
    addToNameHash(e.getAttribute('group_concept_id')+';'+e.getAttribute('name')+';'+e.getAttribute('group_name'));
    for (var i =0; i < childNodes.length; i++ ) {
      for (var j=0; j < childNodes[i].childNodes.length; j++) {
        if ( childNodes[i].childNodes[j].getAttribute('selected') == 'true') {
          groupSelected.setAttribute('selected', 'true');
          groupSelected.style = 'background-color: #aaaaf4 !important;';
        }
      }
    }   
  }else{
    var selected_e_id = e.getAttribute('id');
    e.remove();

    e = document.getElementById(selected_e_id);

    group_name = e.getAttribute('group_name');




    



    e.setAttribute('onmousedown','complaintClicked(this);');
    e.setAttribute('selected', 'false');



    function check_g(group_name) {

      var _group = document.getElementById('list-'+group_name);

      var cal_t = 0;
      var count = 0;
      var ls_total = 0;
    
      for (g=0; g<_group.children.length; g++) {
        for (var _g=0; _g<_group.children[g].children.length; _g++) {
          var _selected = _group.children[g].children[_g].getAttribute('selected');
          ls_total++;
          if (_selected == 'true') {
            //_group.children[g].children[_g].setAttribute('style','display: show; background-color: lightblue;');
           cal_t += totalCount('true');
          } else if(_selected == 'false') {
           cal_t += totalCount('false');
            //document.getElementById(group_name).setAttribute('style',' background-color: ;');
          }
        }

        //console.log(cal_t);

      }

      
      console.log("count: ",count);
      console.log("ls_T",ls_total);

      if (count == ls_total) {
        document.getElementById(group_name).setAttribute('style',' background-color: ;');
      }  else if (groupSelected.getAttribute('selected') == 'true') {
        groupSelected.style = 'background-color: #aaaaf4 !important;';
      }

      function totalCount(cond) {

        //console.log(cond);
        console.log(count);
        if (cond == 'true') {
          count = count - 1;
        } else if ( cond == 'false') {
          count = count + 1;
        }

        //console.log(count);
        //return count;
      }
    }



    check_g(group_name);

    e.style = 'background-color: "";';
    removeFromHash(type_of_complaint, e.getAttribute('concept_id'));
    removeFromNameHash(e.getAttribute('group_concept_id')+';'+e.getAttribute('name')+';'+e.getAttribute('group_name'));

    

    //
    //group_container.appendChild(e);
    // var parent = e.parentElement;
    // console.log(parent); 


    if (presentingComplaintsNameHash.length == 0)
    document.getElementById('selected_complaints_main_container').setAttribute('class','');

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

function addToNameHash(e) {
  if(isHashEmpty(presentingComplaintsNameHash))
  presentingComplaintsNameHash = [];

  try {
    presentingComplaintsNameHash.push(e);
  }catch(e) {
    //presentingComplaintsNameHash = [];
    presentingComplaintsNameHash.push(e);
  }
}

function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele != value; 
  });
}

function removeFromNameHash(e) {
  presentingComplaintsNameHash = arrayRemove(presentingComplaintsNameHash, e);
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
  complaint_concept_set['Presenting complaint'] = 10319;

  var concept_set = complaint_concept_set[type_of_complaint];
  var url = apiProtocol+'://'+apiURL+':'+apiPort+'/api/v1/presenting_complaints';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var objs = JSON.parse(this.responseText);
     presentingComplaints(objs, type_of_complaint);
     _concept_set = objs;
    }
  };
  xhttp.open("GET", (url + "?id=" + concept_set + "&name="), true);
  xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
  xhttp.setRequestHeader('Content-type', "application/json");
  xhttp.send();
}

function prepareToSave() {
  console.log(presentingComplaintsNameHash);
  if(isHashEmpty(presentingComplaintsHash)) {
    showMessage('No selection made. Please select one or more complaints');
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

//modified function for when orders/Lab oders button is selected
function prepareToSaveForOrders() {
  
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

  showValidate();
}

function showValidate() {
  var message = "Complaints Selected";
  var msg = "Are you sure you want to proced?";
  var td_string = "";
  var trial = "<td class=\"td-st\" >Trial</td>";
  for (var i = 0; i < presentingComplaintsNameHash.length; i++) {
    td_string+="<div class=\"td-st\">"+presentingComplaintsNameHash[i]+"</div>";
  }

  //document.getElementById('messageBar').style.width = "700px";
  //console.log(document.getElementById('messageBar'));
  messageBar.innerHTML = "";
  messageBar.innerHTML += "<p>" + message +
     
      "<div class='table-st'>"+td_string+"</div>"+
      "</p><div style='display: block;'>" +
      "<p style=\" \">" + msg +
      "</p>"+
      "<button class='button' style='float: none;' onclick='this.offsetParent.style.display=\"none\";  prepareToSave();' onmousedown='this.offsetParent.style.display=\"none\"; prepareToSave();'" +
      "><span>Yes</span></button><button class='button' " +
      "style='float: none; right: 3px;' onmousedown='this.offsetParent.style.display=\"none\"; '>" +
      "<span>No</span></button>";
  messageBar.style.display = "block";
}

function saveObs(encounter) { 
  var observations = [];

    var concept_id =  8578;
    for(var i = 0 ; i < presentingComplaintsNameHash.length ; i++)
    {
      var data = presentingComplaintsNameHash[i].split(";");
      observations.push({
        concept_id: concept_id, 
        value_text:data[2],
        child: {
          concept_id: data[0],
          value_text: data[1]
      }
      })
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

function ordersPopupModal() {
  let submit_cover = document.getElementById("page-cover");
  submit_cover.style = "display: block;";

  var parent = document.getElementById('content');
  var main_container = document.createElement('div');
  parent.setAttribute('class','modal-open');
  main_container.setAttribute('id','ordersModal');
  main_container.setAttribute('class','modal fade in');
  main_container.setAttribute('data-backdrop','static');
  main_container.setAttribute('data-keyboard','false');
  main_container.setAttribute('role','dialog');
  main_container.setAttribute('style','display: block');

  var modal_dialog = document.createElement('div');
  modal_dialog.setAttribute('style','width: 75%');
  modal_dialog.setAttribute('class','modal-dialog');
  modal_dialog.setAttribute('name','div2');
  main_container.appendChild(modal_dialog);

  var modal_content = document.createElement('div');
  modal_content.setAttribute('class','modal-content');
  modal_content.setAttribute('style','margin-left:0px; height: 85vh !important; background-color: white');
  modal_dialog.appendChild(modal_content);

  var modal_header = document.createElement('div');
  modal_header.setAttribute('class','modal-header');
  var h4 = document.createElement('h4');
  h4.setAttribute('class','modal-title');
  h4.innerHTML = "Select Order";
  modal_header.appendChild(h4);
  //modal_header.innerHTML = "<h4 class="/modal-title/">Select Task</h4>";
  modal_content.appendChild(modal_header);

  var task_body = document.createElement('div');
  task_body.setAttribute('class','modal-body');
  task_body.setAttribute('id','task-body');
  modal_content.appendChild(task_body);

  var container = document.createElement('div');
  container.setAttribute('class','container');
  container.setAttribute('id','tasks-container');
  container.setAttribute('style','width: 100% !important');

  task_body.append(container);

  var table = document.createElement('div');
  var table_row = document.createElement('div');

  table.setAttribute('style','display: table; width: 100%; border-spacing: 5px');
  table_row.setAttribute('style','display: table-row; font-size: 32px');
  table_row.setAttribute('id','radiology');
  table_row.setAttribute('ticked','false');
  table_row.setAttribute('onmousedown','tick(this)');

  var table_row1 = document.createElement('div');
  table_row1.setAttribute('style','display: table-row; font-size: 32px');
  table_row1.setAttribute('ticked','false');
  table_row1.setAttribute('id','lab');
  table_row1.setAttribute('onmousedown','tick(this)');
  

  var table_cell1 = document.createElement('div');
  table_cell1.setAttribute('style','display: table-cell; vertical-align: middle; padding: 5px; width: 52px');
  var img = document.createElement('img');
  img.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
  table_cell1.appendChild(img);
  table_row.appendChild(table_cell1);

  var table_cell2 = document.createElement('div')
  table_cell2.setAttribute('style','display: table-cell; vertical-align: middle; padding: 5px; width: 100%; border-bottom: 1px solid rgb(204, 204, 204)');
  table_cell2.innerHTML = "Radiology Orders";
  table_row.appendChild(table_cell2);

  var table_cell3 = document.createElement('div');
  table_cell3.setAttribute('style','display: table-cell; vertical-align: middle; padding: 5px; width: 52px');
  var img1 = document.createElement('img');
  img1.setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
  table_cell3.appendChild(img1);
  table_row1.appendChild(table_cell3);

  var table_cell4 = document.createElement('div')
  table_cell4.setAttribute('style','display: table-cell; vertical-align: middle; padding: 5px; width: 100%; border-bottom: 1px solid rgb(204, 204, 204)');
  table_cell4.innerHTML = "Lab Orders";
  table_row1.appendChild(table_cell4);

  table.appendChild(table_row);
  table.appendChild(table_row1);
  task_body.appendChild(table);

  var bottom = document.createElement('div');
  bottom.setAttribute('class','buttonsDiv');
  bottom.setAttribute('style','width: 100%; top: 100%; border-radius: 0px 0px 4px 4px; position: sticky');
  modal_content.appendChild(bottom);

  var button = document.createElement('button');
  button.setAttribute('class','red button navButton');
  button.innerHTML = "<span>Cancel</span>";
  button.setAttribute('data-dismiss','modal');
  button.setAttribute('style','position: absolute; bottom: 2%; margin-left: 1.4%');
  button.setAttribute('onmousedown','closeOrdersPopupModal()');

  var nextButton = document.createElement('button');
  nextButton.setAttribute('class','green button navButton');
  nextButton.innerHTML = "<span>Next</span>";
  nextButton.setAttribute('style','position: absolute; bottom: 2%; right: 2%');
  nextButton.setAttribute('onmousedown','setOrdersMiniWorkFlow()');
  bottom.appendChild(nextButton);
  bottom.appendChild(button);
  parent.appendChild(main_container);
}

var apiURL = sessionStorage.getItem("apiURL");
var apiPort = sessionStorage.getItem("apiPort");
var apiProtocol = sessionStorage.getItem("apiProtocol");

function tick(e) {
  var selected = e.getAttribute('ticked');
  if(selected != 'true') {
    e.childNodes[0].childNodes[0].setAttribute('src','/public/touchscreentoolkit/lib/images/ticked.jpg');
    e.childNodes[1].setAttribute('style','display: table-cell; vertical-align: middle; padding: 5px; width: 100%; border-bottom: 1px solid rgb(204, 204, 204); background-color: lightblue');
    e.setAttribute('ticked','true');
    return;
  }
  else{
    e.childNodes[0].childNodes[0].setAttribute('src','/public/touchscreentoolkit/lib/images/unticked.jpg');
    e.childNodes[1].setAttribute('style','display: table-cell; vertical-align: middle; padding: 5px; width: 100%; border-bottom: 1px solid rgb(204, 204, 204); background-color: inherit');
    e.setAttribute('ticked','false');
    return;
  }
}

function redirection(location) {
  setPageState();

  let paths = {
    'radiology' : './radiology/view_radiology_results.html',
    'lab' : '/views/patient/labs.html'
  }

  if (location == 'radiology') {
    setLocation(paths.radiology);
  }

  if (location == 'lab') {
    setLocation(paths.lab);
  }

  function setLocation(path) {
    window.location.href = path;
  }
}

function checkOdersSelected() {
  let radiology = document.getElementById('radiology').getAttribute('ticked');
  let lab = document.getElementById('lab').getAttribute('ticked');

  return {
    'radiology' : radiology,
    'lab': lab
  }
}

function setOrdersMiniWorkFlow() {
  let _selected = checkOdersSelected();

  if( _selected.radiology == 'false' && _selected.lab == 'false') {
    messageBar.setAttribute('style','display: block; z-index: 10001;');
    showMessage('No selection made. Please select one or more');
    return;
  }

  if( _selected.radiology == 'true' && _selected.lab == 'false') {
    redirection('radiology');
  }

  if( _selected.radiology == 'false' && _selected.lab == 'true') {
    redirection('lab');
  }

  if ( _selected.radiology == 'true' && _selected.lab == 'true') {
    setMiniWorkFlowAction();
  }
}

function setMiniWorkFlowAction() {
  redirection('radiology');
  sessionStorage.setItem('MiniWorkFlow','true');
}

function setPageState() {
  let page = document.getElementById('ts');
  localStorage.setItem("page_html", page.outerHTML);
  sessionStorage.setItem("saveState", "true");

  let selectedHash = JSON.stringify(presentingComplaintsNameHash);
  let encounterHash = JSON.stringify(presentingComplaintsHash);

  sessionStorage.setItem('presentingComplaintsNameHash',selectedHash);
  sessionStorage.setItem('presentingComplaintsHash',encounterHash);
}

function closeOrdersPopupModal() {
  var page_cover = document.getElementById("page-cover");
  page_cover.style = "display: none;";

  var main_container = document.getElementById('ordersModal');
  main_container.setAttribute('style','display: none');
  main_container.remove();
}