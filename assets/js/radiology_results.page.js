var popipPosition;
var selectedDignosis = {};

function buildOPDdiagnosisPage(table_data) {
    var frame = document.getElementById('inputFrame' + tstCurrentPage);
    frame.style = 'width: 96%; height: 90%;';

    var container = document.createElement('div');
    container.setAttribute('id', 'main-container');
    frame.appendChild(container);

    var container_row = document.createElement('div');
    container_row.setAttribute('id', 'content_for_radiology');
    container.appendChild(container_row);

    var header_one_row = document.createElement('h1');
    header_one_row.setAttribute('style', 'padding-left: 2%');
    header_one_row.innerHTML= "Radiology Results";
    container.appendChild(header_one_row);

    var table = document.createElement('table');
    table.setAttribute('id', 'patient');
    container.appendChild(table);


    var tr = document.createElement('tr');
    tr.setAttribute('id','');
    table.appendChild(tr);

    var th = document.createElement('th');
    th.innerHTML = "Accession Number";
    tr.appendChild(th);

    var th = document.createElement('th');
     th.innerHTML = "Order Type";
    tr.appendChild(th);

    var th = document.createElement('th');
    th.innerHTML = "Details";
    tr.appendChild(th);


    // for(var key in array_obj)
    // {
    //     var obj = array_obj[key];
    //     patient_data.radiology_orders.push(
    //     { 
    //         "main_value_text": obj.value_text,
    //         "obs_id": obj.obs_id,
    //         "sub_value_text": obj.children[0].value_text,
    //     });
    // }


    console.log(table_data);
    for(var key in table_data)
    {

        if(table_data[key].children.length > 0)
        {
            var tr = document.createElement('tr');
            tr.setAttribute('id','table_elements');
            table.appendChild(tr);

            var td = document.createElement('td');
            td.innerHTML = table_data[key].children[0].accession_number;
            tr.appendChild(td);
            

            var td = document.createElement('td');
            
            td.innerHTML = table_data[key].value_text +", "+ table_data[key].children[0].value_text;
            tr.appendChild(td);

            var td = document.createElement('td');
            tr.appendChild(td);

            var button = document.createElement('button');
            button.setAttribute('class','btn btn-primary tb-btn');
            button.setAttribute('data-toggle','modal');
            button.setAttribute('data-target','#detail_modal');
            button.innerHTML = "View";
            td.appendChild(button);
        }
     

    }
  

    var backButton = __$('backButton');
    backButton.style.display = 'none';

    var cancelButton = __$('cancelButton');
    cancelButton.style.display = 'none';

    var nextButton = document.getElementById('nextButton');
    nextButton.setAttribute("onmousedown", "cancelEntry();");
}

function showDiagnosisKeyboard(e) {
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

    popipPosition = e;
    document.getElementById('selected-side').innerHTML = e.innerHTML.toLowerCase();
}

function addControls() {
    var container = document.getElementById('diagnosis-container');

    var helpText = document.createElement('div');
    helpText.innerHTML = "<span id='sideeffectTag'>Select&nbsp;<span id='selected-side'></span>&nbsp;diagnosis</span>";
    helpText.setAttribute('class', 'helpTextClass');
    helpText.style = "width: 97%;";
    container.appendChild(helpText);


    var search = document.createElement('div');
    search.setAttribute('class', 'inputFrameClass');
    var searchCSS = "width: 94.5%; height: 300px;";
    search.style = searchCSS;
    container.appendChild(search);

    var input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("id", "key-input");
    input.setAttribute("class", "touchscreenTextInput");
    input.setAttribute("onmouseup", "checkForChanges();");
    input.setAttribute("onkeyup", "checkForChanges();");
    search.appendChild(input);

    var search_results = document.createElement('div');
    search_results.setAttribute("id", "search-results");
    search_results.style = "height: 260px; overflow: auto;";
    search.appendChild(search_results);

    var keyboard = document.createElement('div');
    keyboard.setAttribute('class', 'keyboard');
    keyboard.style = "bottom: 120px;";
    container.appendChild(keyboard);

    addKeys(keyboard);
}

function addKeys(e) {
    var qwerty = [];
    qwerty.push(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
    qwerty.push(["a", "s", "d", "f", "g", "h", "j", "k", "l", "Space"]);
    qwerty.push(["Shift", "z", "x", "c", "v", "b", "n", "m", "Del.", "Clear"]);


    for (var i = 0; i < qwerty.length; i++) {
        var row = document.createElement("div");
        row.setAttribute("class", "buttonLine");

        for (var j = 0; j < qwerty[i].length; j++) {
            var button = document.createElement("button");
            button.setAttribute("class", "keyboardButton");
            button.innerHTML = "<span>" + qwerty[i][j] + "</span>";
            button.setAttribute("onmousedown", "setEnteredKey(this);");
            button.setAttribute("key", qwerty[i][j]);
            row.appendChild(button);
        }
        e.appendChild(row);
    }

    var keyInput = document.createElement("input");
    keyInput.setAttribute("id", "key-input");
    keyInput.setAttribute("type", "hidden");

    e.appendChild(keyInput);
}

function setEnteredKey(key) {
    var inputBox = document.getElementById("key-input");

    try {

        if (key.innerHTML.match(/Del/i)) {
            inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
        } else if (key.getAttribute('key').match(/Clear/i)) {
            inputBox.value = null;
        } else if (key.getAttribute('key').match(/Shift/i)) {
        } else if (key.getAttribute('key').match(/Space/i)) {
            inputBox.value += " ";
        } else {
            inputBox.value += key.getAttribute('key');
        }

    } catch (x) {
    }

    getDiagnosis(inputBox.value);
}

function addNavButtons(e) {
    var nextB = document.createElement('button');
    nextB.innerHTML = '<span>Done</span>';
    nextB.setAttribute('class', 'button green navButton nav-diagnosis-btns');
    nextB.setAttribute('onmousedown', 'selectDignosis();');
    nextB.setAttribute('id', 'next-button');
    e.appendChild(nextB);

    var cancelB = document.createElement('button');
    cancelB.innerHTML = '<span>Back</span>';
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
    var url = apiProtocol + '://' + apiURL + ':' + apiPort + '/api/v1/concept_set';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var objs = JSON.parse(this.responseText);
            renderResults(objs);
        }
    };
    xhttp.open("GET", (url + "?id=7409&name=" + search_str), true);
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

    for (var i = 0; i < diagnosis.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = diagnosis[i].name;
        li.setAttribute("tstvalue", diagnosis[i].name);
        li.setAttribute("class", "results-list");
        li.setAttribute("concept_id", diagnosis[i].concept_id);
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
    for (var i = 0; i < list.length; i++) {
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
    for (var i = 0; i < list.length; i++) {
        if (list[i].getAttribute('tstvalue').toUpperCase() == inputBox.value.toUpperCase()) {
            updateSelection(list[i]);
        }
    }

}

var side;
var selected;

function selectDignosis() {
    var inputBox = document.getElementById("key-input");
    var list = document.getElementsByClassName('results-list');

    for (var i = 0; i < list.length; i++) {
        if (list[i].getAttribute('style').match(/lightblue/i)) {
            selected = list[i];
        }
    }

    if (selected != undefined) {
        if (popipPosition.id.match(/-left/i)) {
            side = "left"
        } else {
            side = "right"
        }

        var selected_diagnosis = selected.getAttribute("tstvalue");
        if (malaria_activated) {
            if (selected_diagnosis.match(/malaria/i)) {
                if (!malariaTestResult) {
                    showMalariaConfirmationPopup("No malaria test result was found")
                } else {
                    if (malariaTestResult.match(/negative/i)) {
                        showMalariaConfirmationPopup(malariaTestResult + " detected");
                        return
                    }
                    if (malariaTestResult.match(/positive/i)) {
                        addSelectedDignosis(selected, side);
                    }
                }
            } else {
                addSelectedDignosis(selected, side);
            }
        } else {
            addSelectedDignosis(selected, side);
        }

        cancelDiagnosis();
    }
}

function addSelectedDignosis(selected, side) {
    if (isHashEmpty(selectedDignosis)) {
        selectedDignosis[side] = {};
        selectedDignosis[side][selected.getAttribute('concept_id')] = null;
    }

    try {
        selectedDignosis[side][selected.getAttribute('concept_id')] = selected.getAttribute('tstvalue');
    } catch (z) {
        selectedDignosis[side] = {};
        selectedDignosis[side][selected.getAttribute('concept_id')] = null;
        selectedDignosis[side][selected.getAttribute('concept_id')] = selected.getAttribute('tstvalue');
    }

    var container = document.getElementById('main-container-data-' + side);
    container.innerHTML = null;

    var ul = document.createElement('ul');
    ul.setAttribute("style", "list-style-type: none;")
    container.appendChild(ul);

    var level2 = selectedDignosis[side];
    for (var concept_id in level2) {
        var li = document.createElement('li');
        addTable(level2[concept_id], side, li);
        ul.appendChild(li);
    }
}

function isHashEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function addTable(diagnosis, side, li) {
    var table = document.createElement('table');
    table.setAttribute('class', 'diagnosis-tables');
    var tr = document.createElement('tr');
    table.appendChild(tr);

    var td = document.createElement('td');
    td.innerHTML = diagnosis;
    td.style = "font-weight: bold; font-size: 17px;";
    tr.appendChild(td);

    var td = document.createElement('td');
    var img = document.createElement('img');
    img.setAttribute('src', '/assets/images/delete.png');
    img.setAttribute('class', 'remove-diagnosis');
    td.setAttribute('onmousedown', 'removeDig(this);')
    td.appendChild(img);
    td.style = "width: 61px;";
    td.setAttribute('diagnosis', diagnosis);
    td.setAttribute('side', side);
    tr.appendChild(td);

    li.appendChild(table);
}

function removeDig(e) {
    var side = e.getAttribute('side');
    var temp = selectedDignosis[side];
    var diagnosis = e.getAttribute('diagnosis');
    selectedDignosis[side] = {};

    for (var concept_id in temp) {
        if (temp[concept_id] == diagnosis)
            continue;

        selectedDignosis[side][concept_id] = temp[concept_id];
    }

    var container = document.getElementById('main-container-data-' + side);
    container.innerHTML = null;

    var ul = document.createElement('ul');
    ul.setAttribute("style", "list-style-type: none;")
    container.appendChild(ul);

    var level2 = selectedDignosis[side];
    for (var concept_id in level2) {
        var li = document.createElement('li');
        addTable(level2[concept_id], side, li);
        ul.appendChild(li);
    }
}

function submitDignosis() {
    if (isHashEmpty(selectedDignosis)) {
        showMessage("Please select one / more diagnosis by click;<br/><b>Primary</b> or <b>Secondary</b>");
        return;
    }

    var primary_obs = {};
    var secondary_obs = {};

    var temp = selectedDignosis['left'];
    for (concept_id in temp) {
        primary_obs[concept_id] = temp[concept_id];
    }

    var temp = selectedDignosis['right'];
    for (concept_id in temp) {
        secondary_obs[concept_id] = temp[concept_id];
    }

    if (isHashEmpty(secondary_obs) && isHashEmpty(primary_obs)) {
        showMessage("Please select one / more diagnosis by click;<br/><b>Primary</b> or <b>Secondary</b>");
        return;
    }

    var currentTime = moment().format(' HH:mm:ss');
    var encounter_datetime = moment(sessionStorage.sessionDate).format('YYYY-MM-DD');
    encounter_datetime += currentTime;

    var encounter = {
        encounter_type_name: 'OUTPATIENT DIAGNOSIS',
        encounter_type_id: 8,
        patient_id: sessionStorage.patientID,
        encounter_datetime: encounter_datetime
    }

    submitParameters(encounter, "/encounters", "postDignosisObs");
}

function postDignosisObs(encounter) {

    var primary_obs = {};
    var secondary_obs = {};

    var temp = selectedDignosis['left'];
    for (concept_id in temp) {
        primary_obs[concept_id] = temp[concept_id];
    }

    var temp = selectedDignosis['right'];
    for (concept_id in temp) {
        secondary_obs[concept_id] = temp[concept_id];
    }
    observations = []

    for (concept_id in primary_obs) {
        observations.push({
            concept_id: 6542,
            value_coded: concept_id
        });
    }

    for (concept_id in secondary_obs) {
        observations.push({
            concept_id: 6543,
            value_coded: concept_id
        });
    }

    var obs = {
        encounter_id: encounter["encounter_id"],
        observations: observations
    };

    submitParameters(obs, "/observations", "nextPage")
}

function nextPage(obs) {
    nextEncounter(sessionStorage.patientID, sessionStorage.programID);
}
