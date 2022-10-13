({
	  fetchSentimentAnalysisRecords: function(component, event, helper) {
        var action = component.get("c.getSentimentAnalysisRecords");
        
        action.setCallback(this, function(response) {
            var state = response.getState(); 

            if (state === "SUCCESS") {
                component.set("v.SentimentAnalysisList", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    DisplayToast: function(component, event, Message, Type) {
        var toast = $A.get("e.force:showToast");
        toast.setParams({
            "title": Type,
            "message": Message,
            type: Type
        });
        toast.fire();
    },
    
    
     getSetimentsResult: function(component, event, helper, recordId) {

        var action = component.get("c.getpredictedSentiments");
        action.setParams({
            SentimentsRecordId: recordId
        });

        action.setCallback(this, function(response) {
            var state = response.getState();

            if (state === "SUCCESS") {
                var oRes = response.getReturnValue();
                helper.fetchSentimentAnalysisRecords(component, event, helper);
                component.set("v.getSentimentPredictionOutput", oRes);
                component.set("v.getSentimentInput", '');
                component.set("v.DisabledButton", false);
                component.set("v.IsSpinner", false);
             
            
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        component.set("v.IsSpinner", false);
                       
                        helper.DisplayToast(component, event, errors[0].message, 'Error');

                    }
                } else {
                    component.set("v.IsSpinner", false);
                  
                    component.set("v.IrisSpecies", 'Something went wrong!!');
                }
            }
        });
        $A.enqueueAction(action);
    },
})