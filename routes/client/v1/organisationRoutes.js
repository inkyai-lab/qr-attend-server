/**
 * organisationRoutes.js
 * @description :: CRUD API routes for organisation
 */

const express = require('express');
const router = express.Router();
const organisationController = require('../../../controller/client/v1/organisationController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/client/api/v1/organisation/:id').get(auth(PLATFORM.CLIENT),checkRolePermission,organisationController.getOrganisation);

module.exports = router;
