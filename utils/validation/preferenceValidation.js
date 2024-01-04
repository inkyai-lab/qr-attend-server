/**
 * preferenceValidation.js
 * @description :: validate each post and put request as per preference model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of preference */
exports.schemaKeys = joi.object({
  workDays: joi.string().allow(null).allow(''),
  workHour: joi.string().allow(null).allow(''),
  isStrictLocation: joi.string().allow(null).allow(''),
  isStrictWorkHour: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of preference for updation */
exports.updateSchemaKeys = joi.object({
  workDays: joi.string().allow(null).allow(''),
  workHour: joi.string().allow(null).allow(''),
  isStrictLocation: joi.string().allow(null).allow(''),
  isStrictWorkHour: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of preference for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      workDays: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      workHour: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isStrictLocation: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isStrictWorkHour: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
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
