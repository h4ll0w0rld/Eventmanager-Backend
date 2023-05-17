const shiftCategoryController = require('../controllers/shiftCategory_controller');

const express = require('express');
const router = express.Router();

router.get('/names/:event_id', shiftCategoryController.getAllShiftCategoryNames);
router.delete('/delete/:id', shiftCategoryController.deleteShiftCategory);
router.post('/add', shiftCategoryController.addShiftCategory);
router.get('/getShifts/:id', shiftCategoryController.getShiftCategoryById);
router.get('/getAllShiftCategoriesByEvent/:event_id', shiftCategoryController.getAllShiftCategoriesByEvent);

module.exports = router;