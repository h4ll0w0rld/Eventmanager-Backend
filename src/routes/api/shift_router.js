const shiftController = require('../../controllers/shift_controller');
const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;


const express = require('express');
const router = express.Router();

router.get('/:current_event_id/all/shift_category_id/:shift_category_id', checkRole, permissionMiddleware.checkGuest, shiftController.getAllShifts);
router.get('/:current_event_id/shift_id/:shift_id', checkRole, permissionMiddleware.checkGuest, shiftController.getShiftById);
// router.put('/setActive/:isActive/shift_id/:shift_id', shiftController.setisActive);
router.get('/:current_event_id/ShiftsByUser/status/:status/user_id/:user_id', checkRole, permissionMiddleware.checkCurrentUserOrAdmin, shiftController.getShiftsByUserAndEvent);


module.exports = router;