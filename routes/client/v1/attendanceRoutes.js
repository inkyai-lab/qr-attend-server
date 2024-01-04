/**
 * attendanceRoutes.js
 * @description :: CRUD API routes for attendance
 */

const express = require('express');
const router = express.Router();
const attendanceController = require('../../../controller/client/v1/attendanceController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');

router.route('/client/api/v1/attendance/create').post(auth(PLATFORM.CLIENT),checkRolePermission,attendanceController.signIn);
router.route('/client/api/v1/attendance/update/:id').put(auth(PLATFORM.CLIENT),checkRolePermission,attendanceController.signOut); 
   
router.route('/client/api/v1/attendance/list').post(auth(PLATFORM.CLIENT),checkRolePermission,attendanceController.findAllAttendance);
router.route('/client/api/v1/attendance/count').post(auth(PLATFORM.CLIENT),checkRolePermission,attendanceController.getAttendanceCount);
router.route('/client/api/v1/attendance/:id').get(auth(PLATFORM.CLIENT),checkRolePermission,attendanceController.getAttendance);

module.exports = router;
