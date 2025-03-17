const Redis = require("ioredis");
const redisClient = new Redis(
  process.env.REDIS_URL
);

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Helper functions for chat
const MESSAGE_PREFIX = "msg:";
const CONVERSATION_PREFIX = "conv:";
const TTL = 60 * 60 * 24 * 7; // 7 days in seconds

// Store a message in Redis with TTL
const cacheMessage = async (message) => {
  try {
    const key = `${MESSAGE_PREFIX}${message._id}`;
    await redisClient.hmset(key, {
      conversationId: message.conversationId.toString(),
      sender: message.sender.toString(),
      text: message.text,
      status: message.status,
      createdAt: message.createdAt.toISOString(),
    });
    await redisClient.expire(key, TTL);

    // Add to conversation's message list
    await redisClient.lpush(
      `${CONVERSATION_PREFIX}${message.conversationId}`,
      message._id.toString()
    );
  } catch (error) {
    console.error("Redis cache error:", error);
  }
};

// Get a message from Redis
const getCachedMessage = async (messageId) => {
  try {
    const key = `${MESSAGE_PREFIX}${messageId}`;
    const exists = await redisClient.exists(key);
    if (!exists) return null;

    const message = await redisClient.hgetall(key);
    return message;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
};

// Update message status in Redis
const updateCachedMessageStatus = async (messageId, status) => {
  try {
    const key = `${MESSAGE_PREFIX}${messageId}`;
    const exists = await redisClient.exists(key);
    if (!exists) return false;

    await redisClient.hset(key, "status", status);
    return true;
  } catch (error) {
    console.error("Redis update error:", error);
    return false;
  }
};

// Get cached messages for a conversation
const getCachedConversationMessages = async (conversationId) => {
  try {
    const messageIds = await redisClient.lrange(
      `${CONVERSATION_PREFIX}${conversationId}`,
      0,
      -1
    );
    if (!messageIds.length) return [];

    const pipeline = redisClient.pipeline();
    messageIds.forEach((id) => {
      pipeline.hgetall(`${MESSAGE_PREFIX}${id}`);
    });

    const results = await pipeline.exec();
    return results
      .filter(([err, result]) => !err && result)
      .map(([_, result]) => result);
  } catch (error) {
    console.error("Redis get conversation error:", error);
    return [];
  }
};

// Remove message from Redis (when transferred to MongoDB)
const removeCachedMessage = async (messageId) => {
  try {
    const key = `${MESSAGE_PREFIX}${messageId}`;
    const message = await getCachedMessage(messageId);
    if (!message) return;

    await redisClient.del(key);

    // Remove from conversation list
    if (message.conversationId) {
      await redisClient.lrem(
        `${CONVERSATION_PREFIX}${message.conversationId}`,
        0,
        messageId
      );
    }
  } catch (error) {
    console.error("Redis remove error:", error);
  }
};

module.exports = {
  redisClient,
  cacheMessage,
  getCachedMessage,
  updateCachedMessageStatus,
  getCachedConversationMessages,
  removeCachedMessage,
};
