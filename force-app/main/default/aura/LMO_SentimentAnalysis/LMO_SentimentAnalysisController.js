({
    getSentimentAnalysis: function(component, event, helper) {
        helper.fetchSentimentAnalysisRecords(component, event, helper);
    },

    PredictionSentiments: function(component, event, helper) {
        component.set("v.getSentimentPredictionOutput", " ");
        var SentimentInput = component.get("v.getSentimentInput");

        if (!SentimentInput) {
            helper.DisplayToast(component, event, 'Please provide the values for Sentiment Input', 'Error');
        } else {

            var action = component.get("c.CreateSentimentsandInvokeFunctionModel");
            component.set("v.IsSpinner", true);

            action.setParams({
                SentimentsInput: SentimentInput
            });



            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var oRes = response.getReturnValue();
                    component.set("v.DisabledButton", true);


                    helper.DisplayToast(component, event, 'The system has Invoke Sentiments Salesforce Functions.', 'Success');

                    component.set("v.getSentimentPredictionOutput", oRes);
                    window.setTimeout(
                        $A.getCallback(function() {
                            //helper.getSetimentsResult(component, event, helper, oRes);
                            component.set("v.DisabledButton", false);
                            window.location.reload();
                        }), 3000
                    );


                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            component.set("v.getSentimentPredictionOutput", errors[0].message);
                            component.set("v.IsSpinner", false);

                        }
                    } else {
                        component.set("v.getSentimentPredictionOutput", 'Something went wrong!!');
                        component.set("v.IsSpinner", false);

                    }
                }
            });

            $A.enqueueAction(action);


        }

    },

})