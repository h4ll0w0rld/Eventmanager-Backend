const shiftController = require('../controllers/shift_controller');

const express = require('express');
const router = express.Router();

router.get('/getAllFromEvent/:event_id', shiftController.getAllShifts);
router.post('/add', shiftController.addShift);

module.exports = router;