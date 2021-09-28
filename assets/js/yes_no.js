var root_path = "";
function addYesNo() {
    var query = window.location.search.substring(1);
    var searchParams = new URLSearchParams(query);
    var property = searchParams.get('value');
    
    var title = property.split(/[\._]+/).join(' ').toUpperCase();
    if (property !== "dde_enabled") {
      var attr = property.split('_').join('.');
    }else {
      var attr = property;
    }
    
    var tar = document.getElementById("inputFrame" + tstCurrentPage);
    buildYesNoUI(attr,title, tar);
  }

  function submitRP(url) {
    var property = null;
    var property_value = null;
  
    for(var p in yesNo_Hash){
      property = p
      var properties = yesNo_Hash[p];
      for(var pr in properties){
        property_value = properties[pr];
      }
    }
  
      var radiology_property = {
      path: root_path+"apps/OPD/application.json", 
      property_value: (property_value.toUpperCase() == 'NO' ? 'false' : 'true')
    };
    
    submitParameters(radiology_property, url, "gpSet");
  }  
  
  function gpSet(e){ document.location = '/' }
 
  get_application_root_path();
  function get_application_root_path() {
    var applicationName = sessionStorage.applicationFolder;
    let setUrl = '/apps/' + applicationName + '/application.json';
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var results = JSON.parse(this.responseText);
          try {
            root_path = results.application_root_path;
  
          } catch (error) {
            showMessage("application root path is missing in application.json configuration file");
     
          }
        } else if (this.status == 404) {
          showMessage("application.json missing from application configuration");
        }
  
      } else {
  
      }
    };
    try {
      req.open('GET', setUrl, true);
      req.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));
      req.send(null);
    } catch (e) { }
  
  }