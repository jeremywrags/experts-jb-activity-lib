define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    let activity = null;


    $(window).ready(onRender);

    connection.on("initActivity", initialize);
    


    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger("ready");
        document.getElementById('done').addEventListener('click', onDoneButtonClick);
        document.getElementById('cancel').addEventListener('click', onCancelButtonClick);
    }

    function initialize(payload) {
        // set the activity object from this payload. We'll refer to this object as we
        // modify it before saving.
        activity = payload;

        const hasInArguments = Boolean(
            activity.arguments &&
            activity.arguments.execute &&
            activity.arguments.execute.inArguments &&
            activity.arguments.execute.inArguments.length > 0
        );

        const inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];

        console.log('-------- triggered:onInitActivity({obj}) --------');
        console.log('activitysss:\n ', JSON.stringify(activity, null, 4));
        console.log('Has In Arguments: ', hasInArguments);
        console.log('inArguments', inArguments);
        console.log('-------------------------------------------------');

        // check if this activity has an incoming argument.
        // this would be set on the server side when the activity executes
        // (take a look at execute() in ./discountCode/app.js to see where that happens)
        const eventTypeArgument = inArguments.find((arg) => arg.eventType);

        console.log('eventType Argument', eventTypeArgument);

        // if a discountCode back argument was set, show the message in the view.
        //if (eventTypeArgument) {
        //     get(eventTypeArgument.eventType);
        //  }

        // if the discountCode back argument doesn't exist the user can pick
        // a discountCode message from the drop down list. the discountCode back arg
        // will be set once the journey executes the activity

    }

    function onDoneButtonClick() {
        // we set must metaData.isConfigured in order to tell JB that
        // this activity is ready for activation
        activity.metaData.isConfigured = true;
    
        // get the option that the user selected and save it to
        //const eventType = document.getElementById('eventType').value;
        const jsonBody = document.getElementById('jsonBody').value;
        const endpointURL = document.getElementById('endpointURL').value;
        var e = document.getElementById("httpVerb");
        var httpVerb = e.options[e.selectedIndex].text;
        
        //const option = select.options[select.selectedIndex];
    
        activity.arguments.execute.inArguments = [{
            endpointURL: endpointURL,
            jsonBody: jsonBody,
            httpVerb: httpVerb            
        }];
    
        // you can set the name that appears below the activity with the name property
        //activity.name = `Rest API`;       

    
        console.log('------------ triggering:updateActivity({obj}) ----------------');
        console.log('Sending message back to updateActivity');
        console.log('saving\n', JSON.stringify(activity, null, 4));
        console.log('--------------------------------------------------------------');
    
        connection.trigger('updateActivity', activity);
    }

    function onCancelButtonClick() {
        // tell Journey Builder that this activity has no changes.
        // we wont be prompted to save changes when the inspector closes
        connection.trigger('setActivityDirtyState', false);
    
        // now request that Journey Builder closes the inspector/drawer
        connection.trigger('requestInspectorClose');
    }

});