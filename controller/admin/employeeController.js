/**
 * employeeController.js
 * @description : exports action methods for employee.
 */

const Employee = require('../../model/employee');
const employeeSchemaKey = require('../../utils/validation/employeeValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const deleteDependentService = require('../../utils/deleteDependent');
const utils = require('../../utils/common');
   
/**
 * @description : create document of Employee in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Employee. {status, message, data}
 */ 
const addEmployee = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      employeeSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Employee(dataToCreate);
    let createdEmployee = await dbService.create(Employee,dataToCreate);
    return res.success({ data : createdEmployee });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : create multiple documents of Employee in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Employees. {status, message, data}
 */
const bulkInsertEmployee = async (req,res)=>{
  try {
    if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
      return res.badRequest();
    }
    let dataToCreate = [ ...req.body.data ];
    for (let i = 0;i < dataToCreate.length;i++){
      dataToCreate[i] = {
        ...dataToCreate[i],
        addedBy: req.user.id
      };
    }
    let createdEmployees = await dbService.create(Employee,dataToCreate);
    createdEmployees = { count: createdEmployees ? createdEmployees.length : 0 };
    return res.success({ data:{ count:createdEmployees.count || 0 } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : find all documents of Employee from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Employee(s). {status, message, data}
 */
const findAllEmployee = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      employeeSchemaKey.findFilterKeys,
      Employee.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Employee, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundEmployees = await dbService.paginate( Employee,query,options);
    if (!foundEmployees || !foundEmployees.data || !foundEmployees.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundEmployees });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Employee from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Employee. {status, message, data}
 */
const getEmployee = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundEmployee = await dbService.findOne(Employee,query, options);
    if (!foundEmployee){
      return res.recordNotFound();
    }
    return res.success({ data :foundEmployee });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Employee.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getEmployeeCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      employeeSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedEmployee = await dbService.count(Employee,where);
    return res.success({ data : { count: countedEmployee } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Employee with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Employee.
 * @return {Object} : updated Employee. {status, message, data}
 */
const updateEmployee = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      employeeSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedEmployee = await dbService.updateOne(Employee,query,dataToUpdate);
    if (!updatedEmployee){
      return res.recordNotFound();
    }
    return res.success({ data :updatedEmployee });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : partially update document of Employee with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Employee.
 * @return {obj} : updated Employee. {status, message, data}
 */
const partialUpdateEmployee = async (req,res) => {
  try {
    if (!req.params.id){
      res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    delete req.body['addedBy'];
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      employeeSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedEmployee = await dbService.updateOne(Employee, query, dataToUpdate);
    if (!updatedEmployee) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedEmployee });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : deactivate document of Employee from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Employee.
 * @return {Object} : deactivated Employee. {status, message, data}
 */
const softDeleteEmployee = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedEmployee = await deleteDependentService.softDeleteEmployee(query, updateBody);
    if (!updatedEmployee){
      return res.recordNotFound();
    }
    return res.success({ data:updatedEmployee });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete document of Employee from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Employee. {status, message, data}
 */
const deleteEmployee = async (req,res) => {
  try {
    if (!req.params.id){
      return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
    }
    const query = { _id:req.params.id };
    let deletedEmployee;
    if (req.body.isWarning) { 
      deletedEmployee = await deleteDependentService.countEmployee(query);
    } else {
      deletedEmployee = await deleteDependentService.deleteEmployee(query);
    }
    if (!deletedEmployee){
      return res.recordNotFound();
    }
    return res.success({ data :deletedEmployee });
  }
  catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : delete documents of Employee in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyEmployee = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    let deletedEmployee;
    if (req.body.isWarning) {
      deletedEmployee = await deleteDependentService.countEmployee(query);
    }
    else {
      deletedEmployee = await deleteDependentService.deleteEmployee(query);
    }
    if (!deletedEmployee){
      return res.recordNotFound();
    }
    return res.success({ data :deletedEmployee });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};
    
/**
 * @description : deactivate multiple documents of Employee from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Employee.
 * @return {Object} : number of deactivated documents of Employee. {status, message, data}
 */
const softDeleteManyEmployee = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedEmployee = await deleteDependentService.softDeleteEmployee(query, updateBody);
    if (!updatedEmployee) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedEmployee });
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};

module.exports = {
  addEmployee,
  bulkInsertEmployee,
  findAllEmployee,
  getEmployee,
  getEmployeeCount,
  updateEmployee,
  partialUpdateEmployee,
  softDeleteEmployee,
  deleteEmployee,
  deleteManyEmployee,
  softDeleteManyEmployee    
};