/**
 * index.js
 * @description :: index route file of client platform.
 */

const express =  require('express');
const router =  express.Router();
router.use('/client/auth',require('./auth'));
router.use(require('./organisationRoutes'));
router.use(require('./attendanceRoutes'));
router.use(require('./userRoutes'));

module.exports = router;
