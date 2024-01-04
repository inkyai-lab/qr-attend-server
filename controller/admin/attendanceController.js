/**
 * attendanceController.js
 * @description : exports action methods for attendance.
 */

const Attendance = require('../../model/attendance');
const attendanceSchemaKey = require('../../utils/validation/attendanceValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
    
/**
 * @description : find all documents of Attendance from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Attendance(s). {status, message, data}
 */
const findAllAttendance = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      attendanceSchemaKey.findFilterKeys,
      Attendance.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Attendance, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundAttendances = await dbService.paginate( Attendance,query,options);
    if (!foundAttendances || !foundAttendances.data || !foundAttendances.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundAttendances });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Attendance from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Attendance. {status, message, data}
 */
const getAttendance = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundAttendance = await dbService.findOne(Attendance,query, options);
    if (!foundAttendance){
      return res.recordNotFound();
    }
    return res.success({ data :foundAttendance });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Attendance.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getAttendanceCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      attendanceSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedAttendance = await dbService.count(Attendance,where);
    return res.success({ data : { count: countedAttendance } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  findAllAttendance,
  getAttendance,
  getAttendanceCount    
};