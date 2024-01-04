/**
 * preferenceController.js
 * @description : exports action methods for preference.
 */

const Preference = require('../../model/preference');
const preferenceSchemaKey = require('../../utils/validation/preferenceValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
    
/**
 * @description : find all documents of Preference from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Preference(s). {status, message, data}
 */
const findAllPreference = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      preferenceSchemaKey.findFilterKeys,
      Preference.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Preference, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundPreferences = await dbService.paginate( Preference,query,options);
    if (!foundPreferences || !foundPreferences.data || !foundPreferences.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundPreferences });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Preference from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Preference. {status, message, data}
 */
const getPreference = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundPreference = await dbService.findOne(Preference,query, options);
    if (!foundPreference){
      return res.recordNotFound();
    }
    return res.success({ data :foundPreference });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Preference.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getPreferenceCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      preferenceSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedPreference = await dbService.count(Preference,where);
    return res.success({ data : { count: countedPreference } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Preference with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Preference.
 * @return {Object} : updated Preference. {status, message, data}
 */
const updatePreference = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      preferenceSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPreference = await dbService.updateOne(Preference,query,dataToUpdate);
    if (!updatedPreference){
      return res.recordNotFound();
    }
    return res.success({ data :updatedPreference });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : partially update document of Preference with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Preference.
 * @return {obj} : updated Preference. {status, message, data}
 */
const partialUpdatePreference = async (req,res) => {
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
      preferenceSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedPreference = await dbService.updateOne(Preference, query, dataToUpdate);
    if (!updatedPreference) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedPreference });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  findAllPreference,
  getPreference,
  getPreferenceCount,
  updatePreference,
  partialUpdatePreference    
};