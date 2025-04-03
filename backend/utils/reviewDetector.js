// reviewDetector.js

require('dotenv').config();
const useHfInference = process.env.USE_HF === 'true';

// Common spam detection heuristics
const spamKeywords = ["scam", "fake", "fraud", "cheat", "spam", "illegal", "deceptive"];
// Regex pattern to detect URLs in text
const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

// ------------------------------
// Hugging Face Inference Option
// ------------------------------
let hfClient;
if (useHfInference) {
  const { HfInference } = require("@huggingface/inference");
  hfClient = new HfInference(process.env.HF_ACCESS_TOKEN);
}

/**
 * Uses Hugging Face Inference to analyze the sentiment of the text.
 * @param {string} text - The review text.
 * @returns {Promise<string>} - Returns the sentiment as a string.
 */
const analyzeWithHF = async (text) => {
  try {
    const output = await hfClient.textClassification({
      model: "siebert/sentiment-roberta-large-english",
      inputs: text,
      provider: "hf-inference",
    });
    // Use the model's first prediction and default to 'neutral'
    const rawSentiment = output[0]?.label || 'neutral';
    return rawSentiment.toLowerCase();
  } catch (error) {
    console.error("Error with Hugging Face API:", error);
    throw new Error("Error analyzing sentiment with Hugging Face");
  }
};

// ------------------------------
// Local Fine-Tuned BERT Option
// ------------------------------
let localModel = null;
let localTokenizer = null;

/**
 * Loads a fine-tuned BERT model and its tokenizer.
 * This is only used when USE_HF is not set to true.
 */
async function loadLocalModel() {
  try {
    // Replace 'some-transformer-library' with your actual transformer library
    const { BertTokenizer, BertForSequenceClassification } = require('some-transformer-library');
    localTokenizer = await BertTokenizer.fromPretrained('bert-base-uncased');
    localModel = await BertForSequenceClassification.fromPretrained('path-to-your-fine-tuned-model');
    console.log("Local model and tokenizer loaded successfully.");
  } catch (error) {
    console.error("Failed to load local model:", error);
  }
}

// Load local model only if we are not using HF Inference
if (!useHfInference) {
  loadLocalModel();
}

/**
 * Uses the locally loaded BERT model to predict sentiment.
 * @param {string} text - The review text.
 * @returns {Promise<string>} - Returns the sentiment as a string.
 */
const analyzeWithLocalModel = async (text) => {
  if (!localModel || !localTokenizer) {
    throw new Error("Local model or tokenizer not loaded");
  }
  const tokens = localTokenizer.encode(text, { addSpecialTokens: true });
  const prediction = await localModel.predict(tokens);
  // Determine sentiment based on the prediction's label
  if (prediction.label === 'positive') {
    return 'positive';
  } else if (prediction.label === 'negative') {
    return 'negative';
  }
  return 'neutral';
};

// ------------------------------
// Combined getSentiment Function
// ------------------------------

/**
 * Analyzes review text to determine its sentiment and whether it should be flagged as spam.
 * Uses either Hugging Face inference or a local model based on configuration.
 * Applies additional heuristics (e.g., review length, presence of spam keywords, URLs).
 * @param {string} reviewText - The text of the review.
 * @returns {Promise<object>} - An object containing sentiment, isSpam flag, and spamReason.
 */
const getSentiment = async (reviewText) => {
  let sentiment = 'neutral';

  // Step 1: Analyze sentiment using the selected model
  try {
    if (useHfInference) {
      sentiment = await analyzeWithHF(reviewText);
    } else {
      sentiment = await analyzeWithLocalModel(reviewText);
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    sentiment = 'neutral';
  }

  // Step 2: Initialize spam detection flags and reasons
  let isSpam = false;
  let spamReason = "";

  // Heuristic 1: Review length check (flag extremely short reviews)
  if (reviewText.trim().length < 20) {
    isSpam = true;
    spamReason = "Review too short";
  }

  // Heuristic 2: Check for spam keywords
  const hasSpamKeywords = spamKeywords.some(word =>
    reviewText.toLowerCase().includes(word)
  );
  if (hasSpamKeywords) {
    isSpam = true;
    spamReason = spamReason
      ? spamReason + " & Contains spam keywords"
      : "Contains spam keywords";
  }

  // Heuristic 3: Check for URLs in the text
  const hasUrls = urlPattern.test(reviewText);
  if (hasUrls) {
    isSpam = true;
    spamReason = spamReason
      ? spamReason + " & Contains URL"
      : "Contains URL";
  }

  // Optionally, you could adjust the sentiment based on spam indicators here if needed.

  return { sentiment, isSpam, spamReason };
};

module.exports = { getSentiment };
