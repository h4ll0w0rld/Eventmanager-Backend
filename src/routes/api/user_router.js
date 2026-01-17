const userController = require('../../controllers/user_controller');
const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;


const express = require('express');
const router = express.Router();

router.get('/eventsByUser/user_id/:user_id', permissionMiddleware.checkCurrentUser, userController.getEventsByUser);
router.delete('/delete/user_id/:user_id', permissionMiddleware.checkCurrentUser, userController.deleteUserById);
router.get('/:current_event_id/id/:id', checkRole, permissionMiddleware.checkCurrentUserOrAdmin, userController.getUserById);
router.post('/:current_event_id/add', checkRole, permissionMiddleware.checkAdmin, userController.addUser);
router.get('/:current_event_id/claimUser/:user_id', userController.claimUser);

module.exports = router;
