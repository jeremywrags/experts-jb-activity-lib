module.exports = function configJSON(req) {
    return {
      workflowApiVersion: '1.1',
      metaData: {
        // the location of our icon file
        //icon: `images/icon.png`,
        icon: `/icon/${req.params.activityName}`,
        category: 'custom',
        configOnDrop: true
      },
      // For Custom Activity this must say, "REST"
      type: 'REST',
      lang: {
        'en-US': {
          name: `${req.params.activityName}`,
          description: `Make a request to the ${req.params.activityName} Rest API`
        }
      },
      arguments: {
        execute: {
          inArguments: [
            {
              contactIdentifier: "{{Contact.Key}}"
            },
            {
              jsonBody: ""
            },
            {
              endpointURL: ""
            }
          ],
          outArguments: []        
          ,
          // Fill in the host with the host that this is running on.
          // It must run under HTTPS
          url: `https://${req.headers.host}/jbActivity/restActivity/${req.params.activityName}/execute`,          
          // The amount of time we want Journey Builder to wait before cancel the request. Default is 60000, Minimal is 1000
          timeout: 10000,
          // how many retrys if the request failed with 5xx error or network error. default is 0
          retryCount: 3,
          // wait in ms between retry.
          retryDelay: 1000,
          // The number of concurrent requests Journey Builder will send all together
          concurrentRequests: 5
        }
      },
      configurationArguments: {
        publish: {
          url: `https://${req.headers.host}/jbActivity/restActivity/${req.params.activityName}/publish`
        },
        validate: {
          url: `https://${req.headers.host}/jbActivity/restActivity/${req.params.activityName}/validate`
        },
        stop: {
          url: `https://${req.headers.host}/jbActivity/restActivity/${req.params.activityName}/stop`
        }
      },
      userInterfaces: {
        configurationSupportsReadOnlyMode : true,
        configInspector: {
          size: 'scm-lg',
          emptyIframe: true
        }
      },
      schema: {
        arguments: {
          execute: {
            inArguments: [{
              contactIdentifier: {
                dataType: 'Text',
                isNullable: false,
                direction: "in"
              },
              jsonBody: {
                dataType: 'Text',
                isNullable: false,
                direction: "in"
              },
              endpointURL: {
                dataType: 'Text',
                isNullable: false,
                direction: "in"
              }
            }],
            outArguments: [{
              status: {
                dataType: 'TEXT',
                direction: 'out',
                access: 'visible'
              },
              statusCode: {
                dataType: 'INTEGER',
                direction: 'out',
                access: 'visible'
              }
            }]
          }
        }
      }
    };
  };
  