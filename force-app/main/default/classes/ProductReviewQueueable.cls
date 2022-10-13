public with sharing class ProductReviewQueueable implements Queueable{
    private String reviewID;
    private String reviewData;

    public ProductReviewQueueable (String id, String data){
        this.reviewID=id;
        this.reviewData=data;
    }

    public void execute(QueueableContext context) {

        
        Long startTime = DateTime.now().getTime();
        
        String Jsonpayload = '{"sentimentsmessage": "'+reviewData+'"}';

        functions.Function myFunction = functions.Function.get('TDX_Demo.sentiment');
        functions.FunctionInvocation invocation = myFunction.invoke(Jsonpayload);
        String jsonResponse = invocation.getResponse();
        Long endTime = DateTime.now().getTime();
        Long milliseconds = endTime - startTime;
        System.debug(reviewID);
        jsonResponse=jsonResponse.replace('"','');
        Product_Review__c review = new Product_Review__c(Id = reviewId,
        Prediction_Result__c = jsonResponse,Sentiment_Score__c=Decimal.valueOf(jsonResponse), Response_Time_ms__c = milliseconds);
        update review;  
    }
}
