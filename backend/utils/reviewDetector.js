const { HfInference } = require("@huggingface/inference");
require('dotenv').config();

const client = new HfInference(process.env.HF_ACCESS_TOKEN);

const getSentiment = async (text) => {
    try {
        const output = await client.textClassification({
            model: "siebert/sentiment-roberta-large-english",
            inputs: text,
            provider: "hf-inference",
        });

        return output[0]?.label || 'neutral';

    } catch (error) {
        console.error('Error with Hugging Face API:', error);
        throw new Error('Error analyzing sentiment');
    }
}

module.exports = { getSentiment };
