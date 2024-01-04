/**
 * employeeRoutes.js
 * @description :: CRUD API routes for employee
 */

const express = require('express');
const router = express.Router();
const employeeController = require('../../controller/admin/employeeController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/employee/create').post(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.addEmployee);
router.route('/admin/employee/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.bulkInsertEmployee);
router.route('/admin/employee/list').post(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.findAllEmployee);
router.route('/admin/employee/count').post(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.getEmployeeCount);
router.route('/admin/employee/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.getEmployee);
router.route('/admin/employee/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.updateEmployee);    
router.route('/admin/employee/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.partialUpdateEmployee);
router.route('/admin/employee/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.softDeleteEmployee);
router.route('/admin/employee/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.softDeleteManyEmployee);
router.route('/admin/employee/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.deleteEmployee);
router.route('/admin/employee/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,employeeController.deleteManyEmployee);

module.exports = router;
