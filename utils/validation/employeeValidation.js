/**
 * employeeValidation.js
 * @description :: validate each post and put request as per employee model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');
const { convertObjectToEnum } = require('../common');  
const employeeDefault = require('../../constants/employee');    

/** validation keys and properties of employee */
exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  staff_id: joi.string().allow(null).allow(''),
  email: joi.string().email().allow(null).allow(''),
  department: joi.string().allow(null).allow(''),
  gender: joi.string().allow(null).allow(''),
  branch: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of employee for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  staff_id: joi.string().allow(null).allow(''),
  email: joi.string().email().allow(null).allow(''),
  department: joi.string().allow(null).allow(''),
  gender: joi.string().allow(null).allow(''),
  branch: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of employee for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      staff_id: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      email: joi.alternatives().try(joi.array().items(),joi.string().email(),joi.object()),
      department: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      branch: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
