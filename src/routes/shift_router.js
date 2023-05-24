const shiftController = require('../controllers/shift_controller');

const express = require('express');
const router = express.Router();

router.get('/all/shift_category_id/:shift_category_id', shiftController.getAllShifts);
router.post('/add', shiftController.addShift);

module.exports = router;