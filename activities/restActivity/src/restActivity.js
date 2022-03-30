define(["postmonger"], function (Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    let activity = null;
    let contactKey = ""

    $(window).ready(onRender);

    connection.on("initActivity", initialize);
    
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger("ready");
        document.getElementById('done').addEventListener('click', onDoneButtonClick);
        document.getElementById('cancel').addEventListener('click', onCancelButtonClick);
        setupExampleTestHarness();
    }

    //This function is called when Journey Builder Opens your activity and displays the UI. The payload
    //that is passed is basically a representation of your config.json + any data that JB has added

    function initialize(payload) {
        
        // set the activity object from this payload. We'll refer to this object as we
        // modify it before saving.
        activity = payload;

        //set activity Name in the hidden HTML variable
        document.getElementById("activityKey").value = activity.key;

        const hasInArguments = Boolean(
            activity.arguments &&
            activity.arguments.execute &&
            activity.arguments.execute.inArguments &&
            activity.arguments.execute.inArguments.length > 0
        );

        const hasOutArguments = Boolean(
            activity.arguments &&
            activity.arguments.execute &&
            activity.arguments.execute.outArguments &&
            activity.arguments.execute.outArguments.length > 0
        );

        
        const inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];
        const outArguments = hasOutArguments ? activity.arguments.execute.outArguments : [];

        //Set the initial values in the UI. These values are pulled from the inArguments section 
        //of the config.json file and represent the initial state of your activity. As you make changes
        //jb will keep an updated copy of the activity and send an updated version of the config.json 
        //back and forth

        if(hasInArguments){
            document.getElementById("endpointURL").value = inArguments[0].endpointURL;
            document.getElementById("endpointURL").value = inArguments[0].jsonBody;
            contactKey = inArguments[0].contactIdentifier
        }

        if(hasOutArguments){
            
        }

        console.log('-------- triggered:onInitActivity({obj}) --------');
        console.log('activity:\n ', JSON.stringify(activity, null, 4));
        console.log('Has In Arguments: ', hasInArguments);
        console.log('Has Out Arguments: ', hasOutArguments);
        console.log('inArguments', inArguments);
        console.log('outArguments', outArguments);
        console.log('schema', activity.schema);
        console.log('-------------------------------------------------');

        // check if this activity has an incoming argument.
        // this would be set on the server side when the activity executes
        // (take a look at execute() in ./discountCode/app.js to see where that happens)

        const endpointArgument = inArguments.find((arg) => arg.endpointURL);
        console.log('Endpoint Argument', endpointArgument.endpointURL);
        if (endpointArgument) {
            updateEndpointURL(endpointArgument.endpointURL);
        }

        const jsonBodyArgument = inArguments.find((arg) => arg.jsonBody);
        console.log('jsonBody Argument', jsonBodyArgument.jsonBody);
        if (jsonBodyArgument) {
            updateJsonBody(jsonBodyArgument.jsonBody);            
        }

    }

    function updateEndpointURL(endpointURL){
        document.getElementById("endpointURL").value = endpointURL;

    }
    function updateJsonBody(jsonBody){        
        document.getElementById("jsonBody").innerHTML = jsonBody;

        let newSchema = JSON.parse(jsonBody).JourneyBuilderSchema
        for(var key in newSchema){
            activity.schema.arguments.execute.outArguments[0][key] = { "dataType": "TEXT", "direction": "out","access": "visible"}
            
            var ul = document.getElementById("dbProperties");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode("{{" + activity.key + ".Interactions." + key + "}}"));
            ul.appendChild(li);                        
        }       
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
    
        //Empty the out schema so that when changes are made the removed items do not remain part of the Activity
        activity.schema.arguments.execute.outArguments[0] = {};
        let newSchema = JSON.parse(jsonBody).JourneyBuilderSchema

        for(var key in newSchema){
            activity.schema.arguments.execute.outArguments[0][key] = { "dataType": "TEXT", "direction": "out","access": "visible"}            
        }  

        // you can set the name that appears below the activity with the name property
        activity.name = activity.metaData.activityName + " (" + activity.key + ")"       

    
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

    // this function is for example purposes only. it sets ups a Postmonger
// session that emulates how Journey Builder works. You can call jb.ready()
// from the console to kick off the initActivity event with a mock activity object
function setupExampleTestHarness() {

    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!isLocalhost) {
        // don't load the test harness functions when running in Journey Builder
        return;
    }

    const jbSession = new Postmonger.Session();
    const jb = {};
    window.jb = jb;

    jbSession.on('setActivityDirtyState', function(value) {
        console.log('[echo] setActivityDirtyState -> ', value);
    });

    jbSession.on('requestInspectorClose', function() {
        console.log('[echo] requestInspectorClose');
    });

    jbSession.on('updateActivity', function(activity) {
        console.log('[echo] updateActivity -> ', JSON.stringify(activity, null, 4));
    });

    jbSession.on('ready', function() {
        console.log('[echo] ready');
        console.log('\tuse jb.ready() from the console to initialize your activity')
    });

    // fire the ready signal with an example activity
    jb.ready = function() {
        jbSession.trigger('initActivity', {
            name: '',
            key: 'EXAMPLE-1',
            metaData: {},
            configurationArguments: {},
            arguments: {
                executionMode: "{{Context.ExecutionMode}}",
                definitionId: "{{Context.DefinitionId}}",
                activityId: "{{Activity.Id}}",
                contactKey: "{{Context.ContactKey}}",
                execute: {
                    inArguments: [
                        {
                            discount: 10
                        }
                    ],
                    outArguments: []
                },
                startActivityKey: "{{Context.StartActivityKey}}",
                definitionInstanceId: "{{Context.DefinitionInstanceId}}",
                requestObjectId: "{{Context.RequestObjectId}}"
            }
        });
    };
}

});