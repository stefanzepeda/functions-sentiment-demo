/*
This class will call different salesforce model function i.e. Iris,ChatBot,Sentiments Analysis,Customer Churn
*/

public with sharing class LMO_UtilityClass {
 
    // Start of Sentiments Functions
     @AuraEnabled
     public static List <Sentiment_Analysis__c> getSentimentAnalysisRecords() {
        return [SELECT Id, Name, Sentiments_Input__c, Sentiments_Prediction_Output__c,Response_Time__c FROM Sentiment_Analysis__c Order by CreatedDate DESC limit 5];
    }
    
    @AuraEnabled
    public static String CreateSentimentsandInvokeFunctionModel(String SentimentsInput) {
        Long startTime = DateTime.now().getTime();

        /*Sentiment_Analysis__c Sentiments = new Sentiment_Analysis__c(Sentiments_Input__c = SentimentsInput);
        insert Sentiments;
        
        String Jsonpayload=     '{'+
        '    "sentimentsmessage": " '+Sentiments.Sentiments_Input__c+'",'+
        '    "sentimentsrecordid": "'+Sentiments.Id+'"'+
        '}';
        
        system.debug('Jsonpayload ==> '+Jsonpayload);
        System.enqueueJob(new LMO_InvokeSentimentModelFunctions(Jsonpayload));*/
        
        String Jsonpayload = '{"sentimentsmessage": "'+SentimentsInput+'"}';

        functions.Function myFunction = functions.Function.get('TDX_Demo.sentiment');
        functions.FunctionInvocation invocation = myFunction.invoke(Jsonpayload);
        String jsonResponse = invocation.getResponse();
        Long endTime = DateTime.now().getTime();
        Long milliseconds = endTime - startTime;

        Sentiment_Analysis__c Sentiments = new Sentiment_Analysis__c(Sentiments_Input__c = SentimentsInput,
        Sentiments_Prediction_Output__c = jsonResponse, Response_Time__c = milliseconds);
        insert Sentiments;
        return Sentiments.Sentiments_Prediction_Output__c;
    }
    
    
     @AuraEnabled
    public static string getpredictedSentiments(Id SentimentsRecordId) {
        string SentimentsPredictionOutput = [SELECT Id, Name, Sentiments_Input__c, Sentiments_Prediction_Output__c FROM Sentiment_Analysis__c where Id =:SentimentsRecordId ].Sentiments_Prediction_Output__c;
        return SentimentsPredictionOutput;
    }
    // End of Sentiments Functions
}