
#!/bin/bash
# Ask users for prefix
echo Enter environment suffix, this will be used to name the scratch org and functions environment
read prefix
# Set up scratch org
sfdx force:org:create -f config/project-scratch-def.json --setalias "${prefix}_ORG" --durationdays 7 --setdefaultusername --json --loglevel fatal
sfdx force:package:install --wait 10 --package 04t1t00000203qYAAQ # Install package used in community UI
sfdx force:source:push --json --loglevel fatal --forceoverwrite
sfdx force:data:tree:import -p ./data/export-demo-Customer_Product__c-Product_Review__c-plan.json 
sfdx force:data:tree:import -p ./data/export-demo2-Customer_Product__c-Product_Review__c-plan.json 
sfdx force:data:tree:import -p ./data/export-demo3-Customer_Product__c-Product_Review__c-plan.json 
sleep 30s
sfdx force:community:publish -n "Product Feedback" # Publish community
sf login functions # Set up functions
sf env create compute -o "${prefix}_ORG" -a "${prefix}_FUNC"
sf deploy functions -o "${prefix}_ORG"
sfdx force:org:open -p /lightning/n/Product_Sentiment # Open landing page