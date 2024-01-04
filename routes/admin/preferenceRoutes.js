/**
 * preferenceRoutes.js
 * @description :: CRUD API routes for preference
 */

const express = require('express');
const router = express.Router();
const preferenceController = require('../../controller/admin/preferenceController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/preference/list').post(auth(PLATFORM.ADMIN),checkRolePermission,preferenceController.findAllPreference);
router.route('/admin/preference/count').post(auth(PLATFORM.ADMIN),checkRolePermission,preferenceController.getPreferenceCount);
router.route('/admin/preference/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,preferenceController.getPreference);
router.route('/admin/preference/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,preferenceController.updatePreference);    
router.route('/admin/preference/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,preferenceController.partialUpdatePreference);

module.exports = router;
