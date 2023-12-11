const eventController = require('../../controllers/event_controller');
const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;

const express = require('express');
const router = express.Router();

router.post('/add', eventController.addEvent);
router.get('/:current_event_id/allUsersByEvent', checkRole, permissionMiddleware.checkAdmin, eventController.getAllUsersByEvent);
router.delete('/:current_event_id/delete', checkRole, permissionMiddleware.checkAdmin, eventController.deleteEventById);
router.get('/:current_event_id/addUserToEvent/user_id/:user_id', checkRole, permissionMiddleware.checkAdmin, eventController.addUserToEvent);
router.get('/:current_event_id/removeUserFromEvent/user_id/:user_id', checkRole, permissionMiddleware.checkCurrentUserOrAdmin, eventController.removeUserFromEvent);


module.exports = router;


