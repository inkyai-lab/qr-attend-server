/**
 * organisationController.js
 * @description : exports action methods for organisation.
 */

const Organisation = require('../../model/organisation');
const organisationSchemaKey = require('../../utils/validation/organisationValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../utils/common');
    
/**
 * @description : find all documents of Organisation from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Organisation(s). {status, message, data}
 */
const findAllOrganisation = async (req,res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      organisationSchemaKey.findFilterKeys,
      Organisation.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }
    if (req.body.isCountOnly){
      let totalRecords = await dbService.count(Organisation, query);
      return res.success({ data: { totalRecords } });
    }
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }
    let foundOrganisations = await dbService.paginate( Organisation,query,options);
    if (!foundOrganisations || !foundOrganisations.data || !foundOrganisations.data.length){
      return res.recordNotFound(); 
    }
    return res.success({ data :foundOrganisations });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
        
/**
 * @description : find document of Organisation from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Organisation. {status, message, data}
 */
const getOrganisation = async (req,res) => {
  try {
    let query = {};
    if (!ObjectId.isValid(req.params.id)) {
      return res.validationError({ message : 'invalid objectId.' });
    }
    query._id = req.params.id;
    let options = {};
    let foundOrganisation = await dbService.findOne(Organisation,query, options);
    if (!foundOrganisation){
      return res.recordNotFound();
    }
    return res.success({ data :foundOrganisation });
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : returns total number of documents of Organisation.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getOrganisationCount = async (req,res) => {
  try {
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      organisationSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (typeof req.body.where === 'object' && req.body.where !== null) {
      where = { ...req.body.where };
    }
    let countedOrganisation = await dbService.count(Organisation,where);
    return res.success({ data : { count: countedOrganisation } });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : update document of Organisation with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Organisation.
 * @return {Object} : updated Organisation. {status, message, data}
 */
const updateOrganisation = async (req,res) => {
  try {
    let dataToUpdate = {
      ...req.body,
      updatedBy:req.user.id,
    };
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      organisationSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedOrganisation = await dbService.updateOne(Organisation,query,dataToUpdate);
    if (!updatedOrganisation){
      return res.recordNotFound();
    }
    return res.success({ data :updatedOrganisation });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};
    
/**
 * @description : partially update document of Organisation with data by id;
 * @param {obj} req : request including id in request params and data in request body.
 * @param {obj} res : response of updated Organisation.
 * @return {obj} : updated Organisation. {status, message, data}
 */
const partialUpdateOrganisation = async (req,res) => {
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
      organisationSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id:req.params.id };
    let updatedOrganisation = await dbService.updateOne(Organisation, query, dataToUpdate);
    if (!updatedOrganisation) {
      return res.recordNotFound();
    }
    return res.success({ data:updatedOrganisation });
  } catch (error){
    return res.internalServerError({ message:error.message });
  }
};

module.exports = {
  findAllOrganisation,
  getOrganisation,
  getOrganisationCount,
  updateOrganisation,
  partialUpdateOrganisation    
};