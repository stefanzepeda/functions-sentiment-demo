import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import ProductImages from '@salesforce/resourceUrl/ProductImages';

import IMAGE_FIELD from '@salesforce/schema/Customer_Product__c.Image__c';
const fields = [IMAGE_FIELD];

export default class ProductImage extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    product;

    get imageURL() {
        
        const pathURL= getFieldValue(this.product.data, IMAGE_FIELD);
        console.log(pathURL);
        return `${ProductImages}/${pathURL}`;
    }

    
}