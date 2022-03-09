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

  function addToCSV(table) {
    function getFormatedPeriod() {
      var start_date = url.searchParams.get("start_date");
      var end_date = url.searchParams.get("end_date");
      var start_date_formated = moment(start_date).format('DD/MMM/YYYY');
      var end_date_formated = moment(end_date).format('DD/MMM/YYYY');
      var period = start_date_formated +"  -  "+ end_date_formated
      return period;
    }
    var last_row_index = table.row(':last').index()
    var last_row = table.row(':last')
    var last_row_node = last_row.node()
    last_row_node.setAttribute('id', 'last_node')
    //insert row
    table.row.add( [ 'fio', '', '','', '', '', '', '','','' ] )
      .node().id = 'myid';
    table.draw(false)
    var row = table.row('#myid');
    var inserted_row_index = row.index()
    var newData = [
      "BHT-Core Version :"+sessionStorage.coreVersion,
      "    OPD Version :"+sessionStorage.OPDVersion,
      "    API Version :"+sessionStorage.apiVersion,
      "    Report Period :"+getFormatedPeriod(),
      "    Site :"+sessionStorage.currentLocation,
      "",
      "",
      "",
      "",
      "",
    ];
  
    //swap rows
    table.row(inserted_row_index).data(last_row.data())
    table.row(last_row_index).data(newData)
    last_row_node.setAttribute('style','display:none')
  }