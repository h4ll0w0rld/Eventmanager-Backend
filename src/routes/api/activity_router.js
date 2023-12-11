const activityController = require('../../controllers/activity_controller');
const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;

const express = require('express');
const router = express.Router();

router.get('/:current_event_id/add/shift_category_id/:shift_category_id/shift_id/:shift_id', checkRole, permissionMiddleware.checkEditor, activityController.addActivity);
router.get('/:current_event_id/availableUsers/shift_category_id/:shift_category_id/activity_id/:activity_id', checkRole, permissionMiddleware.checkEditor, activityController.getAvailableUsers);
router.put('/:current_event_id/addUser/shift_category_id/:shift_category_id/activity_id/:activity_id/user_id/:user_id', checkRole, permissionMiddleware.checkCurrentUserOrEditor, activityController.addUserToActivity);
router.put('/:current_event_id/removeUser/shift_category_id/:shift_category_id/activity_id/:activity_id/', checkRole, permissionMiddleware.checkUser, activityController.removeUserFromActivity);
router.get('/:current_event_id/all/shift_category_id/:shift_category_id', checkRole, permissionMiddleware.checkGuest, activityController.getActivitiesByShiftCategory);

module.exports = router;