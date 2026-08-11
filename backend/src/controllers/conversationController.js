const prisma = require('../config/db');

/**
 * Format user details into a unified partner profile representation
 */
function formatPartnerProfile(user) {
  if (!user) return { name: 'Unknown User', role: 'User', avatar: 'U' };

  if (user.role === 'STUDENT' && user.student) {
    const name = `${user.student.firstName} ${user.student.lastName}`.trim();
    return {
      userId: user.id,
      name: name || user.email,
      role: 'Student',
      programme: user.student.programme || 'Student',
      avatar: name ? `${name.charAt(0)}` : 'S',
      avatarUrl: user.student.profilePicUrl || null
    };
  }

  if (user.role === 'RECRUITER' && user.recruiter) {
    const name = user.recruiter.companyName;
    return {
      userId: user.id,
      name: name,
      role: 'Employer Recruiter',
      position: user.recruiter.position || 'Recruiter',
      avatar: name ? name.substring(0, 2).toUpperCase() : 'RC',
      avatarUrl: user.recruiter.companyProfile?.logoUrl || null
    };
  }

  if (user.role === 'UNIVERSITY' && user.university) {
    const name = user.university.universityName;
    return {
      userId: user.id,
      name: name,
      role: 'University Placement Office',
      avatar: name ? name.substring(0, 2).toUpperCase() : 'UNI',
      avatarUrl: null
    };
  }

  return {
    userId: user.id,
    name: user.email.split('@')[0],
    role: user.role,
    avatar: user.email.charAt(0).toUpperCase(),
    avatarUrl: null
  };
}

async function getConversations(req, res) {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          include: {
            student: true,
            recruiter: { include: { companyProfile: true } },
            university: true
          }
        },
        user2: {
          include: {
            student: true,
            recruiter: { include: { companyProfile: true } },
            university: true
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const formatted = await Promise.all(
      conversations.map(async (c) => {
        const partnerUser = c.user1Id === userId ? c.user2 : c.user1;
        const partner = formatPartnerProfile(partnerUser);
        const lastMsg = c.messages[0];

        const unreadCount = await prisma.message.count({
          where: {
            conversationId: c.id,
            senderId: { not: userId },
            isRead: false
          }
        });

        return {
          id: c.id,
          partner,
          lastMessage: lastMsg ? lastMsg.content : 'No messages yet',
          lastTime: lastMsg ? lastMsg.createdAt.toISOString() : c.createdAt.toISOString(),
          unreadCount
        };
      })
    );

    res.json({ success: true, conversations: formatted });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
}

async function startConversation(req, res) {
  try {
    const userId = req.user.id;
    const { recipientUserId } = req.body;

    if (!recipientUserId) {
      return res.status(400).json({ error: 'recipientUserId is required' });
    }

    if (recipientUserId === userId) {
      return res.status(400).json({ error: 'Cannot start conversation with yourself' });
    }

    // Sort user IDs to enforce uniqueness
    const [u1, u2] = [userId, recipientUserId].sort();

    let conversation = await prisma.conversation.findFirst({
      where: {
        user1Id: u1,
        user2Id: u2
      },
      include: {
        user1: {
          include: {
            student: true,
            recruiter: { include: { companyProfile: true } },
            university: true
          }
        },
        user2: {
          include: {
            student: true,
            recruiter: { include: { companyProfile: true } },
            university: true
          }
        }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: u1,
          user2Id: u2
        },
        include: {
          user1: {
            include: {
              student: true,
              recruiter: { include: { companyProfile: true } },
              university: true
            }
          },
          user2: {
            include: {
              student: true,
              recruiter: { include: { companyProfile: true } },
              university: true
            }
          }
        }
      });
    }

    const partnerUser = conversation.user1Id === userId ? conversation.user2 : conversation.user1;
    const partner = formatPartnerProfile(partnerUser);

    res.json({
      success: true,
      conversation: {
        id: conversation.id,
        partner,
        lastMessage: '',
        lastTime: conversation.createdAt.toISOString(),
        unreadCount: 0
      }
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
}

async function getMessages(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });

    if (!conversation || (conversation.user1Id !== userId && conversation.user2Id !== userId)) {
      return res.status(404).json({ error: 'Conversation not found or access denied' });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: {
        sender: {
          select: {
            id: true,
            role: true,
            email: true,
            student: { select: { firstName: true, lastName: true } },
            recruiter: { select: { companyName: true } },
            university: { select: { universityName: true } }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    const formatted = messages.map(m => {
      let senderName = m.sender.email;
      if (m.sender.role === 'STUDENT' && m.sender.student) {
        senderName = `${m.sender.student.firstName} ${m.sender.student.lastName}`.trim();
      } else if (m.sender.role === 'RECRUITER' && m.sender.recruiter) {
        senderName = m.sender.recruiter.companyName;
      } else if (m.sender.role === 'UNIVERSITY' && m.sender.university) {
        senderName = m.sender.university.universityName;
      }

      return {
        id: m.id,
        senderId: m.senderId,
        senderName,
        senderRole: m.sender.role,
        content: m.content,
        isMe: m.senderId === userId,
        isRead: m.isRead,
        createdAt: m.createdAt.toISOString()
      };
    });

    res.json({ success: true, messages: formatted });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

async function sendMessage(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });

    if (!conversation || (conversation.user1Id !== userId && conversation.user2Id !== userId)) {
      return res.status(404).json({ error: 'Conversation not found or access denied' });
    }

    const recipientUserId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: userId,
        content: content.trim()
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    // Send notification to recipient
    await prisma.notification.create({
      data: {
        userId: recipientUserId,
        title: 'New Message Received',
        message: `You received a message: "${content.trim().substring(0, 50)}..."`,
        type: 'MESSAGE'
      }
    });

    let senderName = req.user.email;
    if (req.user.role === 'STUDENT' && req.user.student) {
      senderName = `${req.user.student.firstName} ${req.user.student.lastName}`.trim();
    } else if (req.user.role === 'RECRUITER' && req.user.recruiter) {
      senderName = req.user.recruiter.companyName;
    } else if (req.user.role === 'UNIVERSITY' && req.user.university) {
      senderName = req.user.university.universityName;
    }

    res.status(201).json({
      success: true,
      message: {
        id: message.id,
        senderId: message.senderId,
        senderName,
        senderRole: req.user.role,
        content: message.content,
        isMe: true,
        isRead: false,
        createdAt: message.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

async function markAsRead(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
}

module.exports = {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  markAsRead
};
