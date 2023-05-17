const shiftCategoryController = require('../controllers/shiftCategory_controller');

const express = require('express');
const router = express.Router();

router.get('/names/:event_id', shiftCategoryController.getAllShiftCategories);
router.delete('/delete/:id', shiftCategoryController.deleteShiftCategory);
router.post('/add', shiftCategoryController.addShiftCategory);
router.get('/getShifts/:id', shiftCategoryController.getShiftCategoryById);

module.exports = router;