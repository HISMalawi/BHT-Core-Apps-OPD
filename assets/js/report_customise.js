function addReportTitle(report_title) {
  var titleTag = document.getElementById('title');
  var current_facility_name = sessionStorage.currentLocation;
  var start_date = url.searchParams.get("start_date");
  var end_date = url.searchParams.get("end_date");
  var start_date_formated = moment(start_date).format('DD/MMM/YYYY');
  var end_date_formated = moment(end_date).format('DD/MMM/YYYY');
  var period = start_date_formated +"  To  "+ end_date_formated
  var tilteText = current_facility_name + "\n "+report_title+" \n"+ period;
  titleTag.innerHTML = tilteText;
}


function addFooterContent() {
  document.getElementById("footer-content").innerHTML = `Date Created:  ${moment().format('YYYY-MM-DD:h:m:s')} 
                  BHT-Core Version : ${sessionStorage.coreVersion} 
                  OPD Version : ${sessionStorage.OPDVersion} 
                  API Version ${sessionStorage.apiVersion}
                  Vbox ID: ${sessionStorage.vboxID}`;
  document.getElementById("footer-content").setAttribute("style","display:none");
     
}
function copyToast() {
  var button = document.getElementsByClassName('buttons-copy');
  button = button[0]
  button.setAttribute("onclick","toast();");
}

function toast() {
  var toast = document.getElementById('datatables_buttons_info')
  var button = document.getElementsByClassName('buttons-copy');
  button = button[0]
  
  button.appendChild(toast)
  console.log({button})
}