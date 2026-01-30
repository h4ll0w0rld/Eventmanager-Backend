const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;
const adminNotesController = require('../../controllers/adminNotes_controller');

const express = require('express');
const router = express.Router();



router.post(
    '/:current_event_id/users/:userId/admin-notes',
    checkRole,
    permissionMiddleware.checkAdmin,
    adminNotesController.createAdminNote
);

router.get(
    '/:current_event_id/users/:userId/admin-notes',
     checkRole,
    permissionMiddleware.checkAdmin,
    adminNotesController.getAdminNotesForUser
);

router.patch(
    '/:current_event_id/admin-notes/:noteId',
    checkRole,
    permissionMiddleware.checkAdmin,
    adminNotesController.updateAdminNote
);

router.delete(
    '/:current_event_id/admin-notes/:noteId',
    checkRole,
    permissionMiddleware.checkAdmin,
    adminNotesController.deleteAdminNote
);

module.exports = router;
