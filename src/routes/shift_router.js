const shiftController = require('../controllers/shift_controller');

const express = require('express');
const router = express.Router();

router.get('/all/shift_category_id/:shift_category_id', shiftController.getAllShifts);
router.get('/shift_id/:shift_id', shiftController.getShiftById);
router.put('/setActive/:isActive/shift_id/:shift_id', shiftController.setisActive);
router.get('/ShiftsByUser/user_id/:user_id/event_id/:event_id', shiftController.getShiftsByUserAndEvent);


module.exports = router;