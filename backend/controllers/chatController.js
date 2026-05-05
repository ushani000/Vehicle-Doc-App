const db = require('../models');
const { Op } = require('sequelize');
const Message = db.Message;

/**
 * Save a message (used for socket.io saving)
 */
const saveMessage = async (data) => {
  try {
    const message = await Message.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content,
      fileUrl: data.fileUrl || null,
    });

    console.log('✅ Message saved:', message.toJSON());
    return message;
  } catch (error) {
    console.error('❌ Failed to save message:', error.message);
    throw error;
  }
};

/**
 * Retrieve all messages between two users and mark unread ones as read
 */
const getMessagesBetweenUsers = async (req, res) => {
    console.log('✅ getMessagesBetweenUsers triggered');
  const { senderId, receiverId } = req.query;
    console.log(`📨 Fetching messages between senderId=${senderId} and receiverId=${receiverId}`);

  try {
    await db.Message.update(
      { read: true },
      {
        where: {
          senderId,
          receiverId,
          read: false,
        },
      }
    );

    const messages = await db.Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error.message);
    res.status(500).json({ message: 'Could not fetch messages', error: error.message });
  }
};

/**
 * Send a new message (with or without file) via REST API
 * ✅ Emits socket message after saving
 */
const sendMessage = async (req, res) => {
  try {
    const { content, senderId, receiverId } = req.body;
    const file = req.file;

    const messageData = {
      content,
      senderId,
      receiverId,
      fileUrl: file ? `/uploads/${file.filename}` : null,
    };

    const message = await saveMessage(messageData);

    const io = req.app.get('io');
    io.emit('receive_message', {
      id: message.id,
      content: message.content,
      fileUrl: message.fileUrl,
      senderId: message.senderId,
      receiverId: message.receiverId,
      timestamp: message.createdAt,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('❌ Error in sendMessage:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve latest message and unread count for each user
 */
const getMessagesWithUsers = async (req, res) => {
  const { officerId } = req.query;

  try {
    const users = await db.User.findAll({
      where: { role: 'user' },
      attributes: ['id', 'name', 'email'],
    });

    const result = [];

    for (const user of users) {
      const lastMessage = await db.Message.findOne({
        where: {
          [Op.or]: [
            { senderId: user.id, receiverId: officerId },
            { senderId: officerId, receiverId: user.id },
          ],
        },
        order: [['createdAt', 'DESC']],
      });

      const unreadCount = await db.Message.count({
        where: {
          senderId: user.id,
          receiverId: officerId,
          read: false,
        },
      });

      result.push({
        userId: user.id,
        name: user.name,
        email: user.email,
        lastMessage: lastMessage?.content || null,
        lastMessageTime: lastMessage?.createdAt || null,
        unreadCount,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error fetching messages with users:', error.message);
    res.status(500).json({ message: 'Could not fetch messages', error: error.message });
  }
};

// ✅ Export all functions
module.exports = {
  saveMessage,
  getMessagesBetweenUsers,
  sendMessage,
  getMessagesWithUsers,
};
