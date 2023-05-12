const shiftCategoryController = require('../controllers/shiftCategory_controller');

const express = require('express');
const router = express.Router();

router.get('/names/:event_id', shiftCategoryController.getAllShiftCategories);
router.post('/add', shiftCategoryController.addShiftCategory);
router.get('/getContent/:id', shiftCategoryController.getShiftCategoryById);

module.exports = router;