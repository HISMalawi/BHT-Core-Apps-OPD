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