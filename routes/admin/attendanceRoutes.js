/**
 * attendanceRoutes.js
 * @description :: CRUD API routes for attendance
 */

const express = require('express');
const router = express.Router();
const attendanceController = require('../../controller/admin/attendanceController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/attendance/list').post(auth(PLATFORM.ADMIN),checkRolePermission,attendanceController.findAllAttendance);
router.route('/admin/attendance/count').post(auth(PLATFORM.ADMIN),checkRolePermission,attendanceController.getAttendanceCount);
router.route('/admin/attendance/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,attendanceController.getAttendance);

module.exports = router;
