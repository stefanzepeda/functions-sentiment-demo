#!/bin/bash
# Import 25 reviews to invoke functions
sfdx force:data:tree:import -p ./data/export-demo-small-Customer_Product__c-Product_Review__c-plan.json