trigger ProductReviewTrigger on Product_Review__c (after insert) {
    if(System.Trigger.isInsert){
        for(Product_Review__c pr:System.Trigger.NEW){
            System.debug(pr.Prediction_Result__c);
            if(pr.Prediction_Result__c==null){
                ID jobID = System.enqueueJob(new ProductReviewQueueable(pr.id,pr.Review__c));
            }
        }
        
    }

}