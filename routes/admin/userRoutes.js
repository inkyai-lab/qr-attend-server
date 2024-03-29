/**
 * userRoutes.js
 * @description :: CRUD API routes for user
 */

const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin/userController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/user/me').get(auth(PLATFORM.ADMIN),userController.getLoggedInUserInfo);
router.route('/admin/user/list').post(auth(PLATFORM.ADMIN),checkRolePermission,userController.findAllUser);
router.route('/admin/user/count').post(auth(PLATFORM.ADMIN),checkRolePermission,userController.getUserCount);
router.route('/admin/user/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,userController.getUser);
router.route('/admin/user/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,userController.updateUser);    
router.route('/admin/user/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,userController.partialUpdateUser);
router.route('/admin/user/change-password').put(auth(PLATFORM.ADMIN),userController.changePassword);
router.route('/admin/user/update-profile').put(auth(PLATFORM.ADMIN),userController.updateProfile);

module.exports = router;
