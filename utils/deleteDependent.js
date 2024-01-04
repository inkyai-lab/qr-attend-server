/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let Organisation = require('../model/organisation');
let Preference = require('../model/preference');
let Attendance = require('../model/attendance');
let Employee = require('../model/employee');
let User = require('../model/user');
let UserTokens = require('../model/userTokens');
let ActivityLog = require('../model/activityLog');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');

const deleteOrganisation = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Organisation,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deletePreference = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Preference,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAttendance = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Attendance,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteEmployee = async (filter) =>{
  try {
    let employee = await dbService.findMany(Employee,filter);
    if (employee && employee.length){
      employee = employee.map((obj) => obj.id);

      const attendanceFilter = { $or: [{ employeeId : { $in : employee } }] };
      const attendanceCnt = await dbService.deleteMany(Attendance,attendanceFilter);

      let deleted  = await dbService.deleteMany(Employee,filter);
      let response = { attendance :attendanceCnt, };
      return response; 
    } else {
      return {  employee : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) =>{
  try {
    let user = await dbService.findMany(User,filter);
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const organisationFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const organisationCnt = await dbService.deleteMany(Organisation,organisationFilter);

      const preferenceFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const preferenceCnt = await dbService.deleteMany(Preference,preferenceFilter);

      const attendanceFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const attendanceCnt = await dbService.deleteMany(Attendance,attendanceFilter);

      const employeeFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const employeeCnt = await dbService.deleteMany(Employee,employeeFilter);

      const userFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userCnt = await dbService.deleteMany(User,userFilter);

      const userTokensFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userTokensCnt = await dbService.deleteMany(UserTokens,userTokensFilter);

      const roleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const roleCnt = await dbService.deleteMany(Role,roleFilter);

      const projectRouteFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const projectRouteCnt = await dbService.deleteMany(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole,userRoleFilter);

      let deleted  = await dbService.deleteMany(User,filter);
      let response = {
        organisation :organisationCnt,
        preference :preferenceCnt,
        attendance :attendanceCnt,
        employee :employeeCnt,
        user :userCnt + deleted,
        userTokens :userTokensCnt,
        role :roleCnt,
        projectRoute :projectRouteCnt,
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserTokens = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserTokens,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteActivityLog = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(ActivityLog,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await dbService.findMany(Role,filter);
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const userRoleCnt = await dbService.deleteMany(UserRole,userRoleFilter);

      let deleted  = await dbService.deleteMany(Role,filter);
      let response = {
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter);
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId : { $in : projectroute } }] };
      const routeRoleCnt = await dbService.deleteMany(RouteRole,routeRoleFilter);

      let deleted  = await dbService.deleteMany(ProjectRoute,filter);
      let response = { routeRole :routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(RouteRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const countOrganisation = async (filter) =>{
  try {
    const organisationCnt =  await dbService.count(Organisation,filter);
    return { organisation : organisationCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countPreference = async (filter) =>{
  try {
    const preferenceCnt =  await dbService.count(Preference,filter);
    return { preference : preferenceCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countAttendance = async (filter) =>{
  try {
    const attendanceCnt =  await dbService.count(Attendance,filter);
    return { attendance : attendanceCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countEmployee = async (filter) =>{
  try {
    let employee = await dbService.findMany(Employee,filter);
    if (employee && employee.length){
      employee = employee.map((obj) => obj.id);

      const attendanceFilter = { $or: [{ employeeId : { $in : employee } }] };
      const attendanceCnt =  await dbService.count(Attendance,attendanceFilter);

      let response = { attendance : attendanceCnt, };
      return response; 
    } else {
      return {  employee : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await dbService.findMany(User,filter);
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const organisationFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const organisationCnt =  await dbService.count(Organisation,organisationFilter);

      const preferenceFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const preferenceCnt =  await dbService.count(Preference,preferenceFilter);

      const attendanceFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const attendanceCnt =  await dbService.count(Attendance,attendanceFilter);

      const employeeFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const employeeCnt =  await dbService.count(Employee,employeeFilter);

      const userFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userCnt =  await dbService.count(User,userFilter);

      const userTokensFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userTokensCnt =  await dbService.count(UserTokens,userTokensFilter);

      const roleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const roleCnt =  await dbService.count(Role,roleFilter);

      const projectRouteFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const projectRouteCnt =  await dbService.count(ProjectRoute,projectRouteFilter);

      const routeRoleFilter = { $or: [{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ userId : { $in : user } },{ addedBy : { $in : user } },{ updatedBy : { $in : user } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        organisation : organisationCnt,
        preference : preferenceCnt,
        attendance : attendanceCnt,
        employee : employeeCnt,
        user : userCnt,
        userTokens : userTokensCnt,
        role : roleCnt,
        projectRoute : projectRouteCnt,
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserTokens = async (filter) =>{
  try {
    const userTokensCnt =  await dbService.count(UserTokens,filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countActivityLog = async (filter) =>{
  try {
    const activityLogCnt =  await dbService.count(ActivityLog,filter);
    return { activityLog : activityLogCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await dbService.findMany(Role,filter);
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { $or: [{ roleId : { $in : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter);
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { $or: [{ routeId : { $in : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await dbService.count(RouteRole,filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await dbService.count(UserRole,filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteOrganisation = async (filter,updateBody) =>{  
  try {
    const organisationCnt =  await dbService.updateMany(Organisation,filter);
    return { organisation : organisationCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeletePreference = async (filter,updateBody) =>{  
  try {
    const preferenceCnt =  await dbService.updateMany(Preference,filter);
    return { preference : preferenceCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAttendance = async (filter,updateBody) =>{  
  try {
    const attendanceCnt =  await dbService.updateMany(Attendance,filter);
    return { attendance : attendanceCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteEmployee = async (filter,updateBody) =>{  
  try {
    let employee = await dbService.findMany(Employee,filter, { id:1 });
    if (employee.length){
      employee = employee.map((obj) => obj.id);

      const attendanceFilter = { '$or': [{ employeeId : { '$in' : employee } }] };
      const attendanceCnt = await dbService.updateMany(Attendance,attendanceFilter,updateBody);
      let updated = await dbService.updateMany(Employee,filter,updateBody);

      let response = { attendance :attendanceCnt, };
      return response;
    } else {
      return {  employee : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,updateBody) =>{  
  try {
    let user = await dbService.findMany(User,filter, { id:1 });
    if (user.length){
      user = user.map((obj) => obj.id);

      const organisationFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const organisationCnt = await dbService.updateMany(Organisation,organisationFilter,updateBody);

      const preferenceFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const preferenceCnt = await dbService.updateMany(Preference,preferenceFilter,updateBody);

      const attendanceFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const attendanceCnt = await dbService.updateMany(Attendance,attendanceFilter,updateBody);

      const employeeFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const employeeCnt = await dbService.updateMany(Employee,employeeFilter,updateBody);

      const userFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userCnt = await dbService.updateMany(User,userFilter,updateBody);

      const userTokensFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userTokensCnt = await dbService.updateMany(UserTokens,userTokensFilter,updateBody);

      const roleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const roleCnt = await dbService.updateMany(Role,roleFilter,updateBody);

      const projectRouteFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const projectRouteCnt = await dbService.updateMany(ProjectRoute,projectRouteFilter,updateBody);

      const routeRoleFilter = { '$or': [{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);

      const userRoleFilter = { '$or': [{ userId : { '$in' : user } },{ addedBy : { '$in' : user } },{ updatedBy : { '$in' : user } }] };
      const userRoleCnt = await dbService.updateMany(UserRole,userRoleFilter,updateBody);
      let updated = await dbService.updateMany(User,filter,updateBody);

      let response = {
        organisation :organisationCnt,
        preference :preferenceCnt,
        attendance :attendanceCnt,
        employee :employeeCnt,
        user :userCnt + updated,
        userTokens :userTokensCnt,
        role :roleCnt,
        projectRoute :projectRouteCnt,
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response;
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserTokens = async (filter,updateBody) =>{  
  try {
    const userTokensCnt =  await dbService.updateMany(UserTokens,filter);
    return { userTokens : userTokensCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteActivityLog = async (filter,updateBody) =>{  
  try {
    const activityLogCnt =  await dbService.updateMany(ActivityLog,filter);
    return { activityLog : activityLogCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody) =>{  
  try {
    let role = await dbService.findMany(Role,filter, { id:1 });
    if (role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);

      const userRoleFilter = { '$or': [{ roleId : { '$in' : role } }] };
      const userRoleCnt = await dbService.updateMany(UserRole,userRoleFilter,updateBody);
      let updated = await dbService.updateMany(Role,filter,updateBody);

      let response = {
        routeRole :routeRoleCnt,
        userRole :userRoleCnt,
      };
      return response;
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody) =>{  
  try {
    let projectroute = await dbService.findMany(ProjectRoute,filter, { id:1 });
    if (projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { '$or': [{ routeId : { '$in' : projectroute } }] };
      const routeRoleCnt = await dbService.updateMany(RouteRole,routeRoleFilter,updateBody);
      let updated = await dbService.updateMany(ProjectRoute,filter,updateBody);

      let response = { routeRole :routeRoleCnt, };
      return response;
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody) =>{  
  try {
    const routeRoleCnt =  await dbService.updateMany(RouteRole,filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody) =>{  
  try {
    const userRoleCnt =  await dbService.updateMany(UserRole,filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteOrganisation,
  deletePreference,
  deleteAttendance,
  deleteEmployee,
  deleteUser,
  deleteUserTokens,
  deleteActivityLog,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countOrganisation,
  countPreference,
  countAttendance,
  countEmployee,
  countUser,
  countUserTokens,
  countActivityLog,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteOrganisation,
  softDeletePreference,
  softDeleteAttendance,
  softDeleteEmployee,
  softDeleteUser,
  softDeleteUserTokens,
  softDeleteActivityLog,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
