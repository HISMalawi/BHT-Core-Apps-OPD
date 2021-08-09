
function prescriptionPage(){
	const clearButton = document.getElementById("clearButton");
	clearButton.setAttribute("onmousedown", "keyPressed(this);");
	clearButton.innerHTML = "<span>Clear</span>";

	const nextButton = document.getElementById('nextButton');
	nextButton.setAttribute("style","display:none;");


	const main_container = document.getElementById(`inputFrame${tstCurrentPage}`);
	addInputBox(main_container);
	const ctrls = document.getElementById(`ctrls`);
	addSelectBox(ctrls);

	addKeyboard(main_container);
}

function addInputBox(e){
	let html = `<div id="ctrls">
		<input type="text" id="search-string" class="keyboardInput" />
	</div>`;
	e.innerHTML = html;
}

function addSelectBox(e){
	let html = `<div id="selection-box-options" class="scrollable" referstotouchscreeninputid="0">&nbsp;</div>`;
	e.innerHTML += html;
}

function addKeyboard(e){
	let html = `<div id="keyboard-container">&nbsp;</div>`;
	e.innerHTML += html;
	addQWERTY(document.getElementById('keyboard-container'), 'a-z');
}

function addQWERTY(e, upDown){
	let row1 = ['q','w','e','r','t','y','u','i','o','p','Delete'];
	let row2 = ['a','s','d','f','g','h','j','k','l',"'",'0-9'];
	let row3 = ['z','x','c','v','b','n','m',',','.',`${upDown}`,'Space'];
	let keys = [row1,row2,row3];
	e.innerHTML = '<div class="qwerty-table">';
	e.style = "height:250px;"
	const ctrls = document.getElementById('ctrls');
	ctrls.style = "height:300px;"

	for(const key of keys){
		e.innerHTML += `<div class="qwerty-row">`
		for(const k of key){
			(k == 'Delete' || k == '0-9' || k == 'Space') ? extra_css = 'align-right' : extra_css = '';
			let inputK = (upDown == 'a-z' ? k.toUpperCase() : k.toLowerCase());
			inputK.match(/Delete/i) || inputK.match(/Space/i) || inputK.match(/a-z/i) ? inputK = k : inputK;
			let key = (upDown == 'a-z' ? "A-Z" : 'a-z');

			e.innerHTML += `<div class="qwerty-cell">
				<button id="${inputK}" key="${key}" class="button blue navButton ${extra_css}" 
					onmousedown="keyPressed(this)"><span>${inputK}</span></button>
			</div>`;
		}
		e.innerHTML += '</div>';
	}
	e.innerHTML += '</div>';
}

function keyPressed(e) {
	const inputBox = document.getElementById("search-string");
	try{
		if(e.innerHTML.match(/Delete/i)){
			inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
		}else if(e.innerHTML.match(/Space/i)){
		inputBox.value += " ";
		}else if(e.innerHTML.match(/0-9/i)){
			buildKeyPad();
		}else if(e.innerHTML.match(/A-Z/i)){
			addQWERTY(document.getElementById('keyboard-container'), e.getAttribute('key'));
		}else if(e.innerHTML.match(/Clear/i)){
			inputBox.value = "";
		}else{
			inputBox.value += e.id;
		}

		fetchMeds(inputBox.value);
	}catch(x) { }

}

function buildKeyPad(){
	const e = document.getElementById('keyboard-container');
	const ctrls = document.getElementById('ctrls');
	e.innerHTML = "";
	e.style = "height: 335px;width: 37.5%;";
	ctrls.style = "height: 250px;";

	const row1 = ['1','2','3','Delete'];
	const row2 = ['4','5','6','A-Z'];
	const row3 = ['7','8','9'];
	const row4 = ['.','0','Space'];
	let keys = [row1,row2,row3, row4];

	e.innerHTML = '<div class="numbers-table">';

	for(const key of keys){
		e.innerHTML += `<div class="numbers-row">`
		for(const k of key){
			e.innerHTML += `<div class="numbers-cell">
				<button id="${k}" key="${k}" class="button keypad-btns blue navButton ${extra_css}" 
					onmousedown="keyPressed(this)"><span>${k}</span></button>
			</div>`;
		}
		e.innerHTML += '</div>';
	}
	e.innerHTML += '</div>';
}
/*

*/

function fetchMeds(search_string){
	let drug_url = apiProtocol + "://" + apiURL + ":" + apiPort;
	drug_url += "/api/v1/drugs?name=" + encodeURIComponent(search_string);

	let xhttp1 = new XMLHttpRequest();
	xhttp1.onreadystatechange = function () {
			if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
					let results = JSON.parse(this.responseText);
					let drugs = [];
					for(drug of results){
						drugs.push({
							drug_id: drug.drug_id,
							units: drug.units,
							name: drug.name
						});
					}
					addRows(drugs); 
			}
	};
	xhttp1.open("GET", drug_url, false);
	xhttp1.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
	xhttp1.setRequestHeader('Content-type', "application/json");
	xhttp1.send();
}

function addRows(drugs){
	let container = document.getElementById('selection-box-options');
	container.innerHTML = `<ul id="tt_currentUnorderedListOptions">`;
	let oddEven = 'odd';
	for(drug of drugs){
		oddEven = (oddEven == 'odd' ? 'even' : 'odd');
		container.innerHTML += `<li id="${drug.drug_id}" class="${oddEven}" tag="${oddEven}" 
			onclick="null; updateTextBox(this);" style="">${drug.name}</li>`; 
	}
	container += '</ul>';
}

var selected_drugs = {};
var selected_drugs_order_of_entry = [];
var selected_drugs_order_of_entry_counter = 0;
var data_table;

function updateTextBox(e){
	let list = document.getElementById('selection-box-options').getElementsByTagName('li');
	/*for(li of list){
		li.style = "";
		if(li.innerHTML == e.innerHTML){
			li.style = "background-color: lightblue;";
		}
	}

	let textBox = document.getElementById('search-string');
	textBox.value = e.innerHTML;*/
	if(selected_drugs_order_of_entry.indexOf(e.innerHTML) < 0){
		selected_drugs[e.id] = {
			name: e.innerHTML,
			freq: null, days: null, dose: null, 
			count: selected_drugs_order_of_entry_counter
		};
		selected_drugs_order_of_entry.push(e.innerHTML);
		selected_drugs_order_of_entry_counter++;
	}

	buildFreqDoseDaysPage();
}
/*
<ul id="tt_currentUnorderedListOptions"><li id="0" tstvalue="F" class="even" tag="even" onmousedown="" onclick="null; updateTouchscreenInputForSelect(this); ">Female</li>
<li id="1" tstvalue="M" class="odd" tag="odd" onmousedown="" onclick="null; updateTouchscreenInputForSelect(this); " style="background-color: lightblue;">Male</li>
</ul>

*/







function buildFreqDoseDaysPage(){
	const main_container = document.getElementById(`inputFrame${tstCurrentPage}`);
	main_container.innerHTML = "";
	try {
		data_table.destroy();
	}catch(i){}

	addSelectedDrugsList(main_container);
}

function addSelectedDrugsList(e){
	let html = `<div class="selected-drugs-container">
	<table id="selected-drugs-table">
		<thead>
			<tr>
				<th>&nbsp;</th>
				<th>Item</th>
				<th>Frequency</th>
				<th>Dose</th>
				<th>Days</th>
				<th>&nbsp;</th>
			</tr>
		</thead><tbody>`;
	
	let names = [];
	let count = (selected_drugs_order_of_entry.length - 1);

	for(const name of selected_drugs_order_of_entry){
		for(const drug_id in selected_drugs){
			if(count == selected_drugs[drug_id].count){
				names.push(selected_drugs[drug_id].name);
				count--;
			}
		}
	}

	for(const drug_name of names){
		for(const drug_id in selected_drugs){
			if(selected_drugs[drug_id].name != drug_name)
				continue;

			html += `<tr>
				<td>${selected_drugs[drug_id].count}</td>
				<td>${selected_drugs[drug_id].name}</td>
				<td>${selected_drugs[drug_id].freq == null ? '' : selected_drugs[drug_id].freq}</td>
				<td>${selected_drugs[drug_id].dose == null ? '' : selected_drugs[drug_id].dose}</td>
				<td>${selected_drugs[drug_id].days == null ? '' : selected_drugs[drug_id].days}</td>
				<td><img src="/assets/images/delete.png" class="delete-img" onclick="removeItem(${drug_id});" /></td>
			</tr>`;
		}
	}
	e.innerHTML = (html += "</tbody></table");
	initTable();
	addCtrls();
}

function initTable(){
	data_table = jQuery('#selected-drugs-table').DataTable({
		fixedHeader: true,
		searching: false,
		paging: false,
		scrollY: 230,
		Processing: true,
		ServerSide: true,
		info:     false,
		order: [[0, 'desc']],
		scroller: {
				loadingIndicator: true
		},
		columnDefs: [
      {"className": "dt-counter", "targets": 0},
      {"className": "dt-item", "targets": 1},
      {"className": "dt-frequency", "targets": 2},
      {"className": "dt-dose", "targets": 3},
      {"className": "dt-days", "targets": 4},
      {"className": "dt-ctrls", "targets": 5}
    ],
		"fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			nRow.setAttribute("onclick", "selectRow(this);");
		}
	});

}

function selectRow(e){
	let rows = document.getElementById('selected-drugs-table').getElementsByTagName('tbody')[0].children;
	for(const r of rows){
		let class_name = r.getAttribute("class").replace("selected-row").trimEnd();
		r.setAttribute("class", class_name);
	}

	const custom_class = e.getAttribute("class");
	e.setAttribute("class", `${custom_class} selected-row`);
}




function addCtrls(){
	const main_container = document.getElementById(`inputFrame${tstCurrentPage}`);
	let ctrlContainer = `<div class="control-container">
		<div class="control-container-row">
			<div class="control-container-cell" id="frequency-container">&nbsp;</div>
			<div class="control-container-cell" id="dose-container">&nbsp;</div>
			<div class="control-container-cell" id="days-container">&nbsp;</div>
		</div>
	</div>`;
	main_container.innerHTML += ctrlContainer

	let ctrls = ["dose-container","days-container"];
	for(const name of ctrls){
		addKeyPads(document.getElementById(name));
	}

	addFrequencies();
	selectFirstRow();
	addNewItemBTN();
}

function addKeyPads(e){
	const row1 = ['1','2','3'];
	const row2 = ['4','5','6'];
	const row3 = ['7','8','9'];
	const row4 = ['.','0','Delete'];
	let keys = [row1,row2,row3, row4];

	e.innerHTML = `<div style="width: 100%;font-weight: bold;text-align: center;
	margin-bottom: 15px;">${e.id.replace("-container","").toUpperCase()}
	</div><div class="numbers-table">`;

	for(const key of keys){
		e.innerHTML += `<div class="numbers-row">`
		for(const k of key){
			e.innerHTML += `<div class="numbers-cell">
				<button id="${k}" key="${k}" class="button keypad-btns small-btns blue navButton" 
					onmousedown="pressedKey(this, '${e.id}')"><span>${k}</span></button>
			</div>`;
		}
		e.innerHTML += '</div>';
	}
	e.innerHTML += '</div>';
}

function pressedKey(e, id){
	const targetedRow = document.getElementsByClassName('selected-row')[0];
	let inputBox;

	if(id == "dose-container" ){
		inputBox = targetedRow.children[3];
	}else{
		inputBox = targetedRow.children[4];
	}

	try{
		if(e.innerHTML.match(/Delete/i)){
			inputBox.innerHTML = inputBox.innerHTML.substring(0, inputBox.innerHTML.length - 1);
		}else{
			inputBox.innerHTML += e.id;
		}
	}catch(x) { }
	setSelect();
}

function addFrequencies(){
	const frequencies = [
		["OD", "Once a day(OD)"], 
		["BD", "Twice a day(BD)"], 
		["TDS", "Three a day(TDS)"],
		["QID", "Four times a day(QID)"], 
		["5X/D", "Five times a day(5X/D)"], 
		["Q4hrs", "Six times a day(Q4hrs)"],
		["QWK", "Once a week(QWK)"], 
		["QOD", "Every other day(QOD)"],
		["QHS", "Once a day at night(QHS)"], 
		["Qnoon", "Once a day at noon(Qnoon)"], 
		["QAM", "In the morning(QAM)"], 
		["QPM", "In the evening(QPM)"]
	];

	const container = document.getElementById('frequency-container');
	let html = `<div style='overflow: auto;height: 250px;
	margin-top: -15px;'><ul id='tt_currentUnorderedListOptions'>`;

	for(const fre of frequencies){
		html += `<li onclick="selectFreq(this);" value="${fre[0]}">${fre[1]}</li>`;
	}
	container.innerHTML += (html += "</ul></div>");
}

function selectFreq(freq){
	const targetedRow = document.getElementsByClassName('selected-row')[0];
	targetedRow.children[2].innerHTML = freq.getAttribute('value');
	setSelect();
}

function selectFirstRow(){
	const table = document.getElementById('selected-drugs-table');
	const row = table.getElementsByTagName("tbody")[0].children[0];
	selectRow(row);
}

function addNewItemBTN(){
	const btn = document.getElementById("clearButton");
	btn.innerHTML = "<span>Add</span>";
	btn.setAttribute("onmousedown","prescriptionPage();");

	const nextButton = document.getElementById('nextButton');
	nextButton.setAttribute("style","display:inline;");
	nextButton.setAttribute("onmousedown","prescribeMeds();");
}

function removeItem(drug_id){
	const drug_name = selected_drugs[drug_id].name;
	const drug_names = selected_drugs_order_of_entry;
	selected_drugs_order_of_entry = [];

	for(const n of drug_names){
		if(drug_name == n)
			continue;

		selected_drugs_order_of_entry.push(n);
	}

	const drugsHash = selected_drugs;
	selected_drugs = {};
	let count = 0;

	for(const name of selected_drugs_order_of_entry.reverse()){
		for(const id in drugsHash){
			if(name != drugsHash[id].name)
				continue;

			if(parseInt(id) == parseInt(drug_id))
				continue;

			selected_drugs[id] = {
				name: drugsHash[id].name,
				freq: drugsHash[id].freq, 
				days: drugsHash[id].days, 
				dose: drugsHash[id].dose, 
				count: count
			};
			count++;
		}
	}

	selected_drugs_order_of_entry_counter = 0;
	data_table.clear();
	buildFreqDoseDaysPage();
}

function setSelect(){
	const row = document.getElementsByClassName('selected-row')[0];
	const drug_name = row.children[1].innerHTML;

	for(const drug_id in selected_drugs){
		if(selected_drugs[drug_id].name == drug_name){
			let freq = row.children[2].innerHTML;
			let dose = row.children[3].innerHTML;
			let days = row.children[4].innerHTML;
			selected_drugs[drug_id].freq = freq;
			selected_drugs[drug_id].dose = dose;
			selected_drugs[drug_id].days = days;
			console.log(selected_drugs[drug_id]);
		}
	}
}

function prescribeMeds(){
	let incomplete_prescription = false;
	for(drug_id in selected_drugs){
		let freq = selected_drugs[drug_id].freq;
		let dose = selected_drugs[drug_id].dose;
		let days = selected_drugs[drug_id].days;
		incomplete_prescription = (freq == null || dose == null || days == null);
	}

	if(incomplete_prescription){
		showMessage("Incomplete prescription");
		return;
	}


}