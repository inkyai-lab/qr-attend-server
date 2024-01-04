/**
 * organisationController.js
 * @description : exports action methods for organisation.
 */

const Organisation = require('../../../model/organisation');
const organisationSchemaKey = require('../../../utils/validation/organisationValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/common');
        
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

module.exports = { getOrganisation };