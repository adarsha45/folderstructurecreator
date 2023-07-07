({
    setAdditionalParam:function(component, recordTypeId, isConsoleApp){
        let additionalParam = component.get('v.additionalParam') ? component.get('v.additionalParam') : {};
        if(recordTypeId != null){
            additionalParam.recordTypeId = recordTypeId;
        }
        component.set('v.errorMsgOnComponentNotFound', $A.get("$Label.c.SQX_ERR_MSG_CQ_ACTION_COMPONENT_NOT_FOUND"));
        additionalParam.purposeOfSig = component.get('v.purposeOfSig');
        additionalParam.noRedirect = isConsoleApp;
        component.set('v.additionalParam', additionalParam);
    },
    getComponentParams:function(component){
        let componentParam = {};
        componentParam.recordId = component.get('v.recordId');
        componentParam.sObjectType = component.get('v.sObjectName');
        componentParam.recordTypeId = component.get('v.recordTypeId');
        
        return componentParam;
    },
    showError: function(component, errors){
        console.error(errors);
        component.set('v.errorMsg', $A.get("$Label.c.SQX_ERR_MSG_CQ_ACTION_NOT_FOUND"));
    }
})