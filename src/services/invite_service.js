const crypto = require('crypto');
const { inviteToken } = require('../models'); // make sure index.js exports them
const validationService = require('./validation_service');
const db = require("../models");
const UserEvent = db.userEvent;
const Activity = db.activity;

const User = db.user;
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function createInvite(eventId, userId) {
  const token = generateToken();
  console.log('Generated token:', token);


  if (!inviteToken) throw new Error('InviteToken model is undefined!');
  await inviteToken.destroy({
    where: { eventId, userId }
  });

  return inviteToken.create({
    token,
    eventId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // 3 days
  });
}

async function validateInvite(token) {
  const invite = await inviteToken.findOne({ where: { token, used: false } });
  if (!invite) throw new Error('Invalid invite');
  if (invite.expiresAt < new Date()) throw new Error('Invite expired');
  return invite;
}

async function acceptInvite(token, currentUserId) {
  // 1️⃣ Validate invite
  const invite = await validateInvite(token);
  console.log("userId from invite:", invite.userId, "currentUserId:", currentUserId);

 try {
         //const userEvent = await validationService.isUserinEvent(user_id, event_id);
         const user = await validationService.isUserIDValid(invite.userId);
         if (user.emailAddress) {
            console.log("User email:", user.emailAddress);
             throw Object.assign(new Error('User already claimed!'), { statusCode: 400 });
         }
         console.log("check");
         // if (user.firstName !== firstName || user.lastName !== lastName) {
         //     throw Object.assign(new Error('Name does not match!'), { statusCode: 400 });
         // }
 
         await db.sequelize.transaction(async (t) => {
             if (!await UserEvent.findOne({ where: { UserId: currentUserId, EventId: invite.eventId } })) {
                 await UserEvent.create({ UserId: currentUserId, EventId: invite.eventId, user: true }, { transaction: t });
             }
             console.log("Updating activities for user:", invite.userId);
             await Activity.update({ user_id: currentUserId }, { where: { user_id: invite.userId } }, { transaction: t });
             await UserEvent.destroy({ where: { UserId: invite.userId, EventId: invite.eventId } }, { transaction: t });
             await User.destroy({ where: { id: invite.userId } }, { transaction: t });
             console.log("Marking invite as used");
         })
         res.status(204).send({ message: "successful claimed User" })
     } catch (error) {
         console.log("Error in acceptInvite:", error);  
         //res.status(400).send({ message: error.message });
     }
}

module.exports = { createInvite, validateInvite, acceptInvite };
