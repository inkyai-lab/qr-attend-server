/**
 * attendanceController.js
 * @description : exports action methods for attendance.
 */

const Attendance = require('../../../model/attendance');
const attendanceSchemaKey = require('../../../utils/validation/attendanceValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const dayjs = require('dayjs');
const attendanceService =  require('../../../services/attendance');
const utils = require('../../../utils/common');
   
/**
 * @description : create document of Attendance in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Attendance. {status, message, data}
 */ 
const signIn = async (req, res) => {
  try {
    const date = new Date();
    let dataToCreate = { ...req.body || {} };
    dataToCreate.signedInAt = date;
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      attendanceSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let attendanceDuplicate = await attendanceService.checkAttendanceDuplicate(req.user.id);
    if (attendanceDuplicate){
      return res.badRequest({ message: 'Duplicate attendance signIn' });
    }

    delete dataToCreate.signedOutAt;
    delete dataToCreate.signedOutLocation;
    delete dataToCreate.isSignedOutFlag;

    let { 
      latitude, 
      longitude 
    } = req.body.signedInLocation;
    let { branch } = req.body;
    let locationCheck = await attendanceService.verifyLocation(branch, latitude, longitude);
    if (locationCheck.flag && (locationCheck.data === 'Branch not set' || locationCheck.data === 'Restricted location')){
      return res.badRequest({ message: locationCheck.data });
    }
    
    dataToCreate.addedBy = req.user.id;
    dataToCreate.isSignedInFlag = locationCheck.flag;
    dataToCreate = new Attendance(dataToCreate);
    let createdAttendance = await dbService.create(Attendance,dataToCreate);
    return res.success({ data : createdAttendance });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
   
/**
 * @description : update document of Attendance with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Attendance.
 * @return {Object} : updated Attendance. {status, message, data}
 */
const signOut = async (req,res) => {
  try {
    const date = new Date();
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    dataToUpdate.signedOutAt = date;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      attendanceSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    let validSignOutTime = await attendanceService.checkValidSignOutTime(req.params.id);
    if (!validSignOutTime){
      return res.badRequest({ message: 'signOut time expired' });
    }

    let { 
      latitude, 
      longitude 
    } = req.body.signedOutLocation;
    let { branch } = req.body;
    let locationCheck = await attendanceService.verifyLocation(branch, latitude, longitude);
    if (locationCheck.flag && (locationCheck.data === 'Branch not set' || locationCheck.data === 'Restricted location')){
      return res.badRequest({ message: locationCheck.data });
    }

    const signOutData = {
      signedOutAt: dataToUpdate.signedOutAt,
      signedOutLocation: dataToUpdate.signedOutLocation,
      updatedBy: dataToUpdate.updatedBy,
      isSignedOutFlag: locationCheck.flag,
    };
    const query = { 
      _id:req.params.id, 
      addedBy:req.user.id 
    };
    let updatedAttendance = await dbService.updateOne(Attendance,query,signOutData);
    if (!updatedAttendance){
      return res.recordNotFound();
    }
    return res.success({ data :updatedAttendance });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

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
    query.addedBy = req.user.id;
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
    query.addedBy = req.user.id;
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
    where.addedBy = req.user.id;
    let countedAttendance = await dbService.count(Attendance,where);
    return res.success({ data : { count: countedAttendance } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  signIn,
  signOut,
  findAllAttendance,
  getAttendance,
  getAttendanceCount
};