const { HfInference } = require("@huggingface/inference");
require('dotenv').config();

const client = new HfInference(process.env.HF_ACCESS_TOKEN);

const spamKeywords = ["scam", "fake", "fraud", "cheat", "spam", "illegal", "deceptive"];

// URL regex pattern to detect URLs in text
const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const getSentiment = async (text) => {
    try {
        const output = await client.textClassification({
            model: "siebert/sentiment-roberta-large-english",
            inputs: text,
            provider: "hf-inference",
        });

        // Convert sentiment to lowercase to match the enum in the model
        const rawSentiment = output[0]?.label || 'neutral';
        const sentiment = rawSentiment.toLowerCase();
        
        // Check for spam keywords
        const hasSpamKeywords = spamKeywords.some(word => text.toLowerCase().includes(word));
        
        // Check for URLs in the text
        const hasUrls = urlPattern.test(text);
        
        // Mark as spam if it contains spam keywords or URLs
        const isSpam = hasSpamKeywords || hasUrls;
        
        // Determine reason for spam classification
        let spamReason = null;
        if (isSpam) {
            if (hasUrls) {
                spamReason = "Contains URL";
            } else if (hasSpamKeywords) {
                spamReason = "Contains spam keywords";
            }
        }

        return {
            sentiment,
            isSpam,
            spamReason
        };

    } catch (error) {
        console.error('Error with Hugging Face API:', error);
        throw new Error('Error analyzing sentiment');
    }
}

module.exports = { getSentiment };
