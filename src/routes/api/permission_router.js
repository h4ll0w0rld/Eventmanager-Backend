const permissionController = require('../../controllers/permission_controller');
const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;

const express = require('express');
const router = express.Router();



router.put('/:current_event_id/makeEditor/shift_category_id/:shift_category_id/user_id/:user_id', checkRole, permissionMiddleware.checkAdmin, permissionController.makeEditor);
router.put('/:current_event_id/makeAdmin/user_id/:user_id', checkRole, permissionMiddleware.checkAdmin, permissionController.makeAdmin);



module.exports = router;
