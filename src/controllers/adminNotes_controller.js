const db = require("../models");
const handleError = require('../services/error_service').handleErrors;



const AdminNote = db.adminNote;
const User = db.user;


// Create a new admin note for a user
const createAdminNote = async (req, res, next) => {
    const { userId } = req.params;
    const adminId = req.currentUserId;
    const { note } = req.body;
    console.log("Creating admin note:", { userId, adminId, note });
    try {
        

        if (!note) {
            throw Object.assign(new Error('Note content is required'), { statusCode: 400 });
        }

        const adminNote = await AdminNote.create({
            userId,
            adminId,
            note
        });

        res.status(201).json(adminNote);
    } catch (error) {
        next(handleError(error, 'adminNoteController'));
    }
};

// Get all admin notes for a user
const getAdminNotesForUser = async (req, res, next) => {
    const { userId } = req.params;
    const requesterId = req.currentUserId;

    try {
       

        const notes = await AdminNote.findAll({
            where: { userId },
            include: [
                { model: User, as: 'admin', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(notes);
    } catch (error) {
        next(handleError(error, 'adminNoteController'));
    }
};

// Update an existing admin note
const updateAdminNote = async (req, res, next) => {
    const { noteId } = req.params;
    const adminId = req.currentUserId;
    const { note } = req.body;

    try {
      
        const existingNote = await AdminNote.findByPk(noteId);
        if (!existingNote) {
            throw Object.assign(new Error('Admin note not found'), { statusCode: 404 });
        }

        // Optional: restrict edit to the author only
        // if (existingNote.adminId !== adminId) throw new Error('Cannot edit others notes');

        existingNote.note = note || existingNote.note;
        await existingNote.save();

        res.status(200).json(existingNote);
    } catch (error) {
        next(handleError(error, 'adminNoteController'));
    }
};

// Delete an admin note
const deleteAdminNote = async (req, res, next) => {
    const { noteId } = req.params;
    const adminId = req.currentUserId;

    try {
      

        const deleted = await AdminNote.destroy({ where: { id: noteId } });
        if (!deleted) {
            throw Object.assign(new Error('Admin note not found'), { statusCode: 404 });
        }

        res.status(204).send({ message: 'Admin note deleted successfully' });
    } catch (error) {
        next(handleError(error, 'adminNoteController'));
    }
};

module.exports = {
    createAdminNote,
    getAdminNotesForUser,
    updateAdminNote,
    deleteAdminNote
};
