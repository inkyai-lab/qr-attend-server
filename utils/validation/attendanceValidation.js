/**
 * attendanceValidation.js
 * @description :: validate each post and put request as per attendance model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./commonFilterValidation');

/** validation keys and properties of attendance */
exports.schemaKeys = joi.object({
  employeeId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  signedInAt: joi.date().options({ convert: true }).allow(null).allow(''),
  signedOutAt: joi.date().options({ convert: true }).allow(null).allow(''),
  signedInLocation: joi.object({
    latitude:joi.number(),
    longitude:joi.number()
  }).allow(0),
  signedOutLocation: joi.object({
    latitude:joi.number(),
    longitude:joi.number()
  }).allow(0),
  signInIP: joi.string().allow(null).allow(''),
  signOutIP: joi.string().allow(null).allow(''),
  isSignedInFlag: joi.boolean(),
  isSignedOutFlag: joi.boolean(),
  isDeleted: joi.boolean(),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of attendance for updation */
exports.updateSchemaKeys = joi.object({
  employeeId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  signedInAt: joi.date().options({ convert: true }).allow(null).allow(''),
  signedOutAt: joi.date().options({ convert: true }).allow(null).allow(''),
  signedInLocation: joi.object({
    latitude:joi.number(),
    longitude:joi.number()
  }).allow(0),
  signedOutLocation: joi.object({
    latitude:joi.number(),
    longitude:joi.number()
  }).allow(0),
  isSignedInFlag: joi.boolean(),
  isSignedOutFlag: joi.boolean(),
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of attendance for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      employeeId: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object()),
      signedInAt: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      signedOutAt: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      signedInLocation: joi.alternatives().try(joi.array().items(),joi.number(),joi.object()),
      signedOutLocation: joi.alternatives().try(joi.array().items(),joi.number(),joi.object()),
      isSignedInFlag: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isSignedOutFlag: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
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
