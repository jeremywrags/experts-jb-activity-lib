// Trigger Email
function triggerEmail() {
   var emailAddress = $('#email').val();
   statusMessage("Sending Email...", "");
   $("#spinner").show();
   $("#status-container").show();
   var postData = {
     'subscriberKey': emailAddress,
     'emailAddress': emailAddress
   };
   $.post('/triggerEmail/', postData)
     .done(function(data) {
       if (data.status == "success") {
         statusMessage("Send ID: " + data.requestId, "");
       } else {
         statusMessage(data.message, "slds-alert_error");
       }
       $("#spinner").hide();
     })
     .fail(function(jqXHR, textStatus, errorThrown) {
       statusMessage(textStatus + ': ' + errorThrown, "slds-alert_error");
       $("#spinner").hide();
     })
 };
 
 // Populate alerts
 function statusMessage(message, alertType) {
   $('#status').append('<div class="slds-m-top_small slds-notify slds-notify_alert ' + alertType + '" role="alert"><h2>' + message + '</h2></div>');
 }

 // Event handlers
 $('#submit').on("click", function(){
  triggerEmail();
 })
   
 
 function readURL(input) {   
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#blah').attr('src', e.target.result).width(150).height(150);
      $('#blah').css("display", "")
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$(document).ready(function() {
  $(document).on("click", "#waffleMenuButton", function(){
    $("#AppLauncher").toggleClass("slds-fade-in-open");
    $("#AppLauncher").next().toggleClass("slds-backdrop_open");
    $("#AppLauncherSection").toggleClass("slds-is-open")
  });
  $(document).on("click", "#AppLauncherModalCloseButton", function(){
    $("#AppLauncher").toggleClass("slds-fade-in-open");
    $("#AppLauncher").next().toggleClass("slds-backdrop_open");
    $("#AppLauncherSection").toggleClass("slds-is-open")
  });

  $(document).on("mouseenter", ".dduMenuWrapper", function(evt){
    evt.stopPropagation();
    $(this).toggleClass("slds-is-open");
    return false;
  });
  $(document).on("mouseleave", ".dduMenuWrapper", function(evt){
      evt.stopPropagation();
      $(this).toggleClass("slds-is-open");
      return false;
  });  



  $(document).on("click", ".deleteIcon", function(){
    let appID = $(this).attr("id").split("_")[1];
    let jsData = { 
      "id" : appID    
    }
    
    $.ajax({
      url: "/app/delete",
      type: "POST",
      data: jsData,
      dataType:'json',
      success: function (response) {
          console.log(response);
          if(response.status){
            location.reload();
          }
      },
      error: function(error){
          console.log("Something went wrong", error);
      }
    });

  });

  $(document).on("click", ".editIcon", function(){
    let appID = $(this).attr("id").split("_")[1];
    let appName =  $("#appName_" + appID).val();
    let appDescription =  $("#appDescription_" + appID).val();
    let oldAppName = $("#appName_label_" + appID).text();
    let endPointUrl = $("#endpointURL_" + appID).text();

    $("#appName_label_" + appID).toggleClass("slds-hidden");
    $("#appName_input_wrapper_" + appID).toggleClass("slds-hidden");
    $("#appDesc_label_" + appID).toggleClass("slds-hidden");
    $("#appDesc_input_wrapper_" + appID).toggleClass("slds-hidden");
    if($("#appIcon_" + appID).find("use").attr("href").includes("edit"))
      $("#appIcon_" + appID).find("use").attr("href", "/assets/icons/utility-sprite/svg/symbols.svg#save");
    else{
      //Change the Icon and submit the change back to the server
      $("#appIcon_" + appID).find("use").attr("href", "/assets/icons/utility-sprite/svg/symbols.svg#edit");      
      
      let jsData = { 
        "id" : appID, 
        "name" : appName, 
        "description" : appDescription       
      }
      
      $.ajax({
        url: "/app/update",
        type: "POST",
        data: jsData,
        dataType:'json',
        success: function (response) {
            console.log(response);
            if(response.status){
              $("#appName_label_" + appID).text(appName);
              $("#appDescription_label_" + appID).text(appDescription);
              $("#endpointURL_" + appID).text(endPointUrl.replace(oldAppName, appName))
            }
        },
        error: function(error){
            console.log("Something went wrong", error);
        }
      });
    }
      
    
  })
});



