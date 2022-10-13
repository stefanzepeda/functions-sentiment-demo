/**
 * Describe Sentiment here.
 *
 * The exported method is the entry point for your code when the function is invoked. 
 *
 * Following parameters are pre-configured and provided to your function on execution: 
 * @param event: represents the data associated with the occurrence of an event, and  
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */

import * as tf from '@tensorflow/tfjs';
import * as loader from './loader.js';
import * as ui from './ui.js';
import { OOV_INDEX, padSequences } from './sequence_utils.js';

const HOSTED_URLS = {
    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
};

const LOCAL_URLS = {
    model: './resources/model.json',
    metadata: './resources/metadata.json'
};

export default async function(event, context, logger) {

    logger.info(`Invoking Sentiment with payload ${JSON.stringify(event.data || {})}`);

    const { sentimentsmessage } = event.data;
    class SentimentPredictor {
        /**
         * Initializes the Sentiment demo.
         */
        async init(urls) {
            this.urls = urls;
            this.model = await loader.loadHostedPretrainedModel(urls.model);
            await this.loadMetadata();
            return this;
        }

        async loadMetadata() {
            const sentimentMetadata =
                await loader.loadHostedMetadata(this.urls.metadata);

            this.indexFrom = sentimentMetadata['index_from'];
            this.maxLen = sentimentMetadata['max_len'];
            console.log('indexFrom = ' + this.indexFrom);
            console.log('maxLen = ' + this.maxLen);

            this.wordIndex = sentimentMetadata['word_index'];
            this.vocabularySize = sentimentMetadata['vocabulary_size'];
            console.log('vocabularySize = ', this.vocabularySize);
        }

        predict(text) {
            // Convert to lower case and remove all punctuations.
            const inputText =
                text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
            // Convert the words to a sequence of word indices.
            const sequence = inputText.map(word => {
                let wordIndex = this.wordIndex[word] + this.indexFrom;
                if (wordIndex > this.vocabularySize) {
                    wordIndex = OOV_INDEX;
                }
                return wordIndex;
            });
            // Perform truncation and padding.
            const paddedSequence = padSequences([sequence], this.maxLen);
            const input = tf.tensor2d(paddedSequence, [1, this.maxLen]);

            const beginMs = performance.now();
            const predictOut = this.model.predict(input);
            const score = predictOut.dataSync()[0];
            predictOut.dispose();
            const endMs = performance.now();

            return { score: score, elapsed: (endMs - beginMs) };
        }
    };

    /**
     * Loads the pretrained model and metadata, and registers the predict
     * function with the UI.
     */
    async function setupSentiment() {

        const predictor = await new SentimentPredictor().init(HOSTED_URLS);
        let result = predictor.predict(sentimentsmessage);
        console.log(result.score.toFixed(6));
        var sentimentsresult = result.score.toFixed(6);

        return sentimentsresult;
    }

    var result = await setupSentiment();
    return result;
}