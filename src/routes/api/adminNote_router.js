const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;
const express = require('express');
const router = express.Router();

const adminNotesController = require('../../controllers/adminNotes_controller'); // make sure file exists

router.post(
    '/users/:userId/admin-notes',
    checkRole,
    permissionMiddleware.checkAdmin,
    adminNotesController.createAdminNote
);

router.get(
    '/users/:userId/admin-notes',
    checkRole,
    permissionMiddleware.checkAdmin,
    adminNotesController.getAdminNotesForUser
);

router.patch(
    '/admin-notes/:noteId',
    checkRole,
    permissionMiddleware.checkAdmin,
    adminNotesController.updateAdminNote
);

router.delete(
    '/admin-notes/:noteId',
    checkRole,
    permissionMiddleware.checkAdmin,
    adminNotesController.deleteAdminNote
);

module.exports = router;
