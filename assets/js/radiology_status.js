
var radiology_property_url = apiProtocol + "://" + apiURL + ":" + apiPort;
radiology_property_url += "/api/v1/global_properties?property=activate.radiology.orders";

var xhttp1 = new XMLHttpRequest();
xhttp1.onreadystatechange = function () {
    if (this.readyState == 4 && (this.status == 201 || this.status == 200 || this.status == 404)) {
        try {
            var activate_radiology_property = JSON.parse(this.responseText);
            if (activate_radiology_property["activate.radiology.orders"] == "true") {
                radiology_activated = true;
                sessionStorage.setItem("radiology_status", radiology_activated);
            }
            else
            {
                radiology_activated = false;
                sessionStorage.setItem("radiology_status", radiology_activated);
            }
        } catch (e) {

        }

    
    }
};
xhttp1.open("GET", radiology_property_url, true);
xhttp1.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
xhttp1.setRequestHeader('Content-type', "application/json");
xhttp1.send();
