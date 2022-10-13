trigger CustomerProductTrigger on Customer_Product__c (after insert) {
    if(System.Trigger.isInsert){
        List<hztr__Tile_Item__c> tilesToInsert = new List<hztr__Tile_Item__c>();
        for(Customer_Product__c cp:System.Trigger.NEW){
            tilesToInsert.add(new hztr__Tile_Item__c(Name=cp.Name,hztr__Link_URL__c='/'+cp.Id,hztr__Photo_URL__c='/reviewproducts/resource/ProductImages/'+cp.Image__c));
        }
        if(!tilesToInsert.isEmpty()){
            insert tilesToInsert;
        }
    }
}