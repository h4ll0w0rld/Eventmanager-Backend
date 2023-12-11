const shiftCategoryController = require('../../controllers/shiftCategory_controller');
const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;


const express = require('express');
const router = express.Router();

router.get('/:current_event_id/names', checkRole, permissionMiddleware.checkGuest, shiftCategoryController.getAllShiftCategoryNames);
router.delete('/:current_event_id/delete/id/:id', checkRole, permissionMiddleware.checkAdmin, shiftCategoryController.deleteShiftCategory);
router.post('/:current_event_id/add', checkRole, permissionMiddleware.checkAdmin, shiftCategoryController.addShiftCategory);
router.post('/:current_event_id/addShiftBlockToCategory/shift_category_id/:shift_category_id', checkRole, permissionMiddleware.checkEditor, shiftCategoryController.addShiftBlock);
router.get('/:current_event_id/id/:id/getShifts', checkRole, permissionMiddleware.checkGuest, shiftCategoryController.getShiftCategoryById);
router.get('/:current_event_id/all', checkRole, permissionMiddleware.checkGuest, shiftCategoryController.getAllShiftCategoriesByEvent);

module.exports = router;