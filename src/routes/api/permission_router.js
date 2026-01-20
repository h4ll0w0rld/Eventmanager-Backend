const permissionController = require('../../controllers/permission_controller');
const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;

const express = require('express');
const router = express.Router();


router.get('/:current_event_id/isAdmin/user_id/:user_id', checkRole, permissionMiddleware.checkIsAdmin, permissionController.isAd);
router.put('/:current_event_id/makeEditor/shift_category_id/:shift_category_id/user_id/:user_id', checkRole, permissionMiddleware.checkAdmin, permissionController.makeEditor);
router.put('/:current_event_id/removeEditor/shift_category_id/:shift_category_id/user_id/:user_id', checkRole, permissionMiddleware.checkAdmin, permissionController.removeEditor);
router.put('/:current_event_id/makeAdmin/user_id/:user_id', checkRole, permissionMiddleware.checkAdmin, permissionController.makeAdmin);
router.put('/:current_event_id/removeAdmin/user_id/:user_id', checkRole, permissionMiddleware.checkAdmin, permissionController.removeAdmin);
router.get('/:current_event_id/getRoles', checkRole, permissionMiddleware.checkGuest, permissionController.getRoles)

// router.get("/roles/:current_event_id", checkRole, (req, res) => {
//     return res.json(req.roles);
// });
module.exports = router;
