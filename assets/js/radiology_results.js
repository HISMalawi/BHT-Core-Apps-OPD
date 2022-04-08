var orders_table;

function activateDataTable() {
    orders_table = jQuery('#radiology-orders').DataTable({
        fixedHeader: true,
        searching: false,
        scrollY: 500,
        order: [[0, 'DESC']],
        columnDefs: [
            {"className": "accession-numbers-col", "targets": 0},
            {"className": "tests-col", "targets": 1},
            {"className": "specimen-col", "targets": 2},
            {"className": "date-col", type: 'date',"targets": 3},
            {"className": "results-col", "targets": 4},
          ], 
        paging: false,
        scroller: {
            loadingIndicator: true
        }
    });
}

function changeCancelBTN() {
  var c = document.getElementById('cancelButton');
  var cancelAttributes = c.getAttribute('onmousedown');
  c.setAttribute('onmousedown', 'changeCancelBG();' + cancelAttributes);
}

function changeCancelBG() {
  var e = document.getElementById('messageBar');
  e.style = 'background-color: tomato; border-color: tomato;';
}

function buildRadiologyOrderDisplay() {
    changeCancelBTN();
    var clearBTN = document.getElementById('clearButton');
    clearButton.style = 'display: none;';

    var f = document.getElementById('inputFrame' + tstCurrentPage);
    f.style = 'width: 96%; height: 88%;';

    var table = document.createElement('table');
    table.setAttribute('id', 'radiology-orders');
    f.appendChild(table);

    var thead = document.createElement('thead');
    table.appendChild(thead);

    var tr = document.createElement('tr');
    thead.appendChild(tr);

    var heads = ['Accession#','Body Part', 'Order Type', 'Ordered', 'Result'];
    for (var i = 0; i < heads.length; i++) {
        var th = document.createElement('th');
        th.innerHTML = heads[i];
        tr.appendChild(th);

        /*if (i == 1)
            th.setAttribute("class", "tracking-number-columns");

        if (i == 2)
            th.setAttribute("class", "status-columns");

        if (i == 0)
            th.setAttribute("class", "test-columns");

        if (i == 4)
            th.setAttribute("class", "results-columns");

        if (i == 3)
            th.setAttribute("class", "date-columns");

        if (i == 5)
            th.setAttribute("class", "date-columns");*/

    }
    activateDataTable();


    addCreateOrderBTN();
    fetchOrders();
    getPACSLink();
}

function addCreateOrderBTN() {
    var root = document.getElementById('buttons');
    var order = document.createElement('button');
    order.setAttribute('onmousedown', 'pressOrder();');
    order.setAttribute('id', 'pressOrder');
    order.innerHTML = '<span>Order</span>';
    order.setAttribute('class', 'button blue navButton');
    root.appendChild(order);

}

function pressOrder() {
      window.location.href = "radiology_orders.html"
}

function fetchOrders() {
    let url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1";
    url += "/radiology/radiology_orders?patient_id=" + sessionStorage.patientID;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var obj = JSON.parse(this.responseText);
            updateOrderTable(obj);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function updateOrderTable(orders) {
    orders_table.clear().draw();

    for (const orderNumber in orders) {
        let accession_number = orders[orderNumber].children[0].accession_number;
        let orderType = orders[orderNumber].children[0].value_text;
        let date_ordered = moment(orders[orderNumber].obs_datetime).format('DD/MMM/YYYY');
        let body_part = orders[orderNumber].value_text;

        orders_table.row.add([
            accession_number, 
            body_part,
            orderType,
            date_ordered, 
            `<a href='${pacsUrl}'>
                <button class='button blue navButton'>
                    <span>View</span>
                </button>
            </a>`
        ]).draw();
    }
}

let pacsUrl = ''
function getPACSLink() {
    jQuery.getJSON('/apps/OPD/application.json')
    .done((configurations) => {
        configurations.thirdpartyApps.forEach((application) => {
            if (application.applicationName == 'pacs') {
                pacsUrl = application.url
            }
        })
    })
    .fail((error) => {
        console.error(error)
        showMessage('There was an error bootstrapping the application.')
    })
}

