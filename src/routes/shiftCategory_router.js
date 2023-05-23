const shiftCategoryController = require('../controllers/shiftCategory_controller');

const express = require('express');
const router = express.Router();

router.get('/names/event_id/:event_id', shiftCategoryController.getAllShiftCategoryNames);
router.delete('/delete/id/:id', shiftCategoryController.deleteShiftCategory);
router.post('/add', shiftCategoryController.addShiftCategory);
router.get('/id/:id/getShifts', shiftCategoryController.getShiftCategoryById);
router.get('/all/event_id/:event_id', shiftCategoryController.getAllShiftCategoriesByEvent);

module.exports = router;