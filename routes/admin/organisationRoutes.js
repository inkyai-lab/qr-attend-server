/**
 * organisationRoutes.js
 * @description :: CRUD API routes for organisation
 */

const express = require('express');
const router = express.Router();
const organisationController = require('../../controller/admin/organisationController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/organisation/list').post(auth(PLATFORM.ADMIN),checkRolePermission,organisationController.findAllOrganisation);
router.route('/admin/organisation/count').post(auth(PLATFORM.ADMIN),checkRolePermission,organisationController.getOrganisationCount);
router.route('/admin/organisation/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,organisationController.getOrganisation);
router.route('/admin/organisation/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,organisationController.updateOrganisation);    
router.route('/admin/organisation/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,organisationController.partialUpdateOrganisation);

module.exports = router;
