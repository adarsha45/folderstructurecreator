({
    doInit: function (component, event, helper) {
        if(component.get("v.pageReference") !== null){
            let pageReferenceParams = component.get("v.pageReference").state;
            
            let recordTypeId = pageReferenceParams.recordTypeId;
            recordTypeId ? component.set('v.recordTypeId', recordTypeId) : "";
            
            // set recordId and recordTypeId attributes if included while custom navigation to component
            pageReferenceParams.compliancequest__recordTypeId ? component.set('v.recordTypeId', pageReferenceParams.compliancequest__recordTypeId) : "";
            pageReferenceParams.compliancequest__recordId ? component.set('v.recordId', pageReferenceParams.compliancequest__recordId) : "";
            
            let defaultAttributeParams = pageReferenceParams.compliancequest__defaultFieldValues ? component.find("pageRefUtils").decodeDefaultFieldValues(pageReferenceParams.compliancequest__defaultFieldValues): null ;
            if(defaultAttributeParams){
                component.set('v.sObjectName',defaultAttributeParams.sObjectName);
                component.set('v.nextAction',defaultAttributeParams.nextAction);
            }         
        }
        
        helper
            .invokeAction(component.get('c.getActionOverrideFor'), 
                          helper.getComponentParams(component))
        	.then(function ({actionOverrides, recordTypeId}) {
                if (actionOverrides && actionOverrides.length > 0) {
                    var workspaceAPI = component.find("workspace");
                    workspaceAPI.isConsoleNavigation().then(function(response) {
                        component.set('v.isConsole' , response);
                        helper.setAdditionalParam(component, recordTypeId, response);
                        component.set("v.component", actionOverrides[0]);
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
                }
                else {
                    helper.showError(component);
                }
            }).catch(function (errors) {
                helper.showError(component, errors);
            });
    },
    refresh: function (component, event, helper) {
        $A.get('e.force:refreshView').fire();
    },
    handleRedirect: function (component, event, helper) {
        if(component.get('v.isConsole') === true){
            var recId = event.getParam('recordId');
            var focusedTabId = '';
            var workspaceAPI = component.find("workspace");
            
            workspaceAPI.getFocusedTabInfo()
            .then(function(response) {
                focusedTabId = response.tabId;
            })
            .then(function(response){
                workspaceAPI.openTab({
                    pageReference: {
                        "type": "standard__recordPage",
                        "attributes": {
                            "recordId":recId,
                            "actionName":"view"
                        },
                        "state": {}
                    },
                    focus: true
                }).then(function(response){
                    workspaceAPI.closeTab({tabId: focusedTabId});
                }); 
            }).catch(function(error) {
                console.log(error);
            });
        }
        
    },

    /**
     * Method to save cq-form detail record
     */
     saveRecord: function(component, event, helper){
        var cqFormDetail =  component.find('dynamicComponent').find('childComponent');
        if(cqFormDetail){
            return new Promise($A.getCallback(function(resolve, reject) {
                cqFormDetail.saveRecord(false, true).then(function(recordId) {
                    // Display success toast message
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title :  $A.get("$Label.c.CQ_SUCCESS"),
                        message: $A.get("$Label.c.CQ_RECORD_CREATED"),
                        key: 'info_alt',
                        type: 'success',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                    resolve("Resolved");
                }).catch($A.getCallback(function(err) {
                    console.error(err);
                    reject(err)
                }));  
            }));
        }
    }

})