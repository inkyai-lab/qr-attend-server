/**
 * seeder.js
 * @description :: functions that seeds mock data to run the application
 */

const bcrypt = require('bcrypt');
const User = require('../model/user');
const Preference = require('../model/preference');
const authConstant = require('../constants/authConstant');
const Role = require('../model/role');
const ProjectRoute = require('../model/projectRoute');
const RouteRole = require('../model/routeRole');
const UserRole = require('../model/userRole');
const { replaceAll } = require('../utils/common');
const dbService = require('../utils/dbService');
const uuid = require('uuid').v4;

/* seeds default users */
async function seedUser () {
  try {
    let userToBeInserted = {};
    userToBeInserted = {
      'password':'Password@1',
      'isDeleted':false,
      'username':'admin',
      'email':'yundijat.eth@gmail.com',
      'isActive':true,
      'userType':authConstant.USER_TYPES.Admin
    };
    userToBeInserted.password = await  bcrypt.hash(userToBeInserted.password, 8);
    let admin = await dbService.updateOne(User, { 'username':'admin' }, userToBeInserted,  { upsert: true });
    console.info('Users seeded 🍺');
  } catch (error){
    console.log('User seeder failed due to ', error.message);
  }
}

/* seeds default users */
async function seedPreference () {
  try {

    let preferenceToBeInserted = {
      'workDays':'',
      'workHour':'',
      'officeLocations':[
        {
          qrToken: uuid(),
          branch:'Minna',
          latitude:9.618485756541178,
          longitude:6.5459333488767015
        }
      ],
      'isStrictLocation':true,
      'isStrictWorkHour':false,
    };
    const preferenceExist = await dbService.findOne(Preference, { isActive:true });
    if (!preferenceExist) {
      let preference = await dbService.create(Preference, preferenceToBeInserted);
      console.info('Preference seeded 🍺');
    }
    console.log('Preference is upto date 🍺');
  } catch (error){
    console.log('Preference seeder failed due to ', error.message);
  }
}

/* seeds roles */
async function seedRole () {
  try {
    const roles = [ 'Admin', 'User' ];
    const insertedRoles = await dbService.findMany(Role, { code: { '$in': roles.map(role => role.toUpperCase()) } });
    const rolesToInsert = [];
    roles.forEach(role => {
      if (!insertedRoles.find(insertedRole => insertedRole.code === role.toUpperCase())) {
        rolesToInsert.push({
          name: role,
          code: role.toUpperCase(),
          weight: 1
        });
      }
    });
    if (rolesToInsert.length) {
      const result = await dbService.create(Role, rolesToInsert);
      if (result) console.log('Role seeded 🍺');
      else console.log('Role seeder failed!');
    } else {
      console.log('Role is upto date 🍺');
    }
  } catch (error) {
    console.log('Role seeder failed due to ', error.message);
  }
}

/* seeds routes of project */
async function seedProjectRoutes (routes) {
  try {
    if (routes  && routes.length) {
      let routeName = '';
      const dbRoutes = await dbService.findMany(ProjectRoute, {});
      let routeArr = [];
      let routeObj = {};
      routes.forEach(route => {
        routeName = `${replaceAll((route.path).toLowerCase(), '/', '_')}`;
        route.methods.forEach(method => {
          routeObj = dbRoutes.find(dbRoute => dbRoute.route_name === routeName && dbRoute.method === method);
          if (!routeObj) {
            routeArr.push({
              'uri': route.path.toLowerCase(),
              'method': method,
              'route_name': routeName,
            });
          }
        });
      });
      if (routeArr.length) {
        const result = await dbService.create(ProjectRoute, routeArr);
        if (result) console.info('ProjectRoute model seeded 🍺');
        else console.info('ProjectRoute seeder failed.');
      } else {
        console.info('ProjectRoute is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('ProjectRoute seeder failed due to ', error.message);
  }
}

/* seeds role for routes */
async function seedRouteRole () {
  try {
    const routeRoles = [ 
      {
        route: '/admin/attendance/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/attendance/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/attendance/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/attendance/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/attendance/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/attendance/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/attendance/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/attendance/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/attendance/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/attendance/create',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/attendance/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/attendance/addbulk',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/attendance/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/attendance/update/:id',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/attendance/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/attendance/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/admin/attendance/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/attendance/updatebulk',
        role: 'User',
        method: 'PUT' 
      },
      {
        route: '/admin/attendance/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/attendance/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/attendance/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/attendance/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/attendance/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/employee/create',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/employee/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/employee/addbulk',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/employee/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/employee/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/employee/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/employee/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/employee/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/employee/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/employee/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/employee/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/employee/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/employee/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/employee/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/employee/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/employee/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/employee/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/employee/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/employee/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/employee/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/employee/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/admin/employee/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/employee/deletemany',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/employee/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/organisation/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/organisation/list',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/organisation/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/organisation/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/organisation/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/admin/organisation/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/organisation/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/organisation/count',
        role: 'User',
        method: 'POST' 
      },
      {
        route: '/admin/organisation/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/organisation/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/organisation/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/organisation/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/organisation/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/organisation/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/organisation/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/organisation/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/organisation/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/organisation/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/organisation/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/organisation/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/organisation/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/preference/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/preference/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/preference/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/preference/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/preference/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/preference/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/preference/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/preference/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/preference/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/preference/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/preference/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/preference/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/preference/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/preference/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/preference/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/preference/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/preference/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/preference/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/admin/user/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/admin/user/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/updatebulk',
        role: 'Admin',
        method: 'PUT' 
      },
      {
        route: '/admin/user/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/user/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/user/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/user/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/usertokens/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/usertokens/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/usertokens/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/usertokens/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/activitylog/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/activitylog/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/activitylog/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/activitylog/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/role/create',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/addbulk',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/role/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/role/update/:id',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/updatebulk',
        role: 'System_User',
        method: 'PUT' 
      },
      {
        route: '/admin/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/admin/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/routerole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/admin/userrole/list',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/:id',
        role: 'System_User',
        method: 'GET' 
      },
      {
        route: '/admin/userrole/count',
        role: 'System_User',
        method: 'POST' 
      },
      {
        route: '/admin/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/admin/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/admin/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/list',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/:id',
        role: 'Admin',
        method: 'GET'
      },
      {
        route: '/client/api/v1/attendance/:id',
        role: 'User',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/attendance/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/attendance/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/create',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/addbulk',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/attendance/update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/attendance/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/attendance/partial-update/:id',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/attendance/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/attendance/updatebulk',
        role: 'User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/attendance/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/attendance/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/attendance/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/attendance/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/attendance/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/create',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/addbulk',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/employee/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/employee/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/softdelete/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/softdeletemany',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/employee/delete/:id',
        role: 'Admin',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/employee/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/employee/deletemany',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/employee/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/list',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/:id',
        role: 'Admin',
        method: 'GET'
      },
      {
        route: '/client/api/v1/organisation/:id',
        role: 'User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/organisation/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/organisation/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/count',
        role: 'User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/organisation/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/organisation/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/organisation/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/organisation/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/organisation/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/organisation/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/organisation/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/organisation/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/organisation/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/organisation/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/preference/list',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/preference/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/preference/:id',
        role: 'Admin',
        method: 'GET'
      },
      {
        route: '/client/api/v1/preference/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/preference/count',
        role: 'Admin',
        method: 'POST'
      },
      {
        route: '/client/api/v1/preference/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/preference/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/preference/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/preference/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/preference/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/preference/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/preference/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/preference/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/preference/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/preference/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/preference/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/preference/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/preference/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/list',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/:id',
        role: 'Admin',
        method: 'GET' 
      },
      {
        route: '/client/api/v1/user/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/user/count',
        role: 'Admin',
        method: 'POST' 
      },
      {
        route: '/client/api/v1/user/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/partial-update/:id',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/updatebulk',
        role: 'Admin',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/user/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/user/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/user/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertokens/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertokens/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertokens/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertokens/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/usertokens/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/usertokens/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertokens/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertokens/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertokens/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertokens/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/usertokens/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/usertokens/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/activitylog/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/activitylog/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/activitylog/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/activitylog/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/activitylog/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/activitylog/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/activitylog/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/activitylog/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/activitylog/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/activitylog/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/activitylog/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/activitylog/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/role/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/role/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/role/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/role/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/projectroute/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/projectroute/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/projectroute/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/projectroute/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/routerole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/routerole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/routerole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/routerole/deletemany',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/create',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/addbulk',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/list',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/:id',
        role: 'System_User',
        method: 'GET'
      },
      {
        route: '/client/api/v1/userrole/count',
        role: 'System_User',
        method: 'POST'
      },
      {
        route: '/client/api/v1/userrole/update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/partial-update/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/updatebulk',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/softdelete/:id',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/softdeletemany',
        role: 'System_User',
        method: 'PUT'
      },
      {
        route: '/client/api/v1/userrole/delete/:id',
        role: 'System_User',
        method: 'DELETE'
      },
      {
        route: '/client/api/v1/userrole/deletemany',
        role: 'System_User',
        method: 'POST'
      },

    ];
    if (routeRoles && routeRoles.length) {
      const routes = [...new Set(routeRoles.map(routeRole => routeRole.route.toLowerCase()))];
      const routeMethods = [...new Set(routeRoles.map(routeRole => routeRole.method))];
      const roles = [ 'Admin', 'User', 'System_User' ];
      const insertedProjectRoute = await dbService.findMany(ProjectRoute, {
        uri: { '$in': routes },
        method: { '$in': routeMethods },
        'isActive': true,
        'isDeleted': false
      });
      const insertedRoles = await dbService.findMany(Role, {
        code: { '$in': roles.map(role => role.toUpperCase()) },
        'isActive': true,
        'isDeleted': false
      });
      let projectRouteId = '';
      let roleId = '';
      let createRouteRoles = routeRoles.map(routeRole => {
        projectRouteId = insertedProjectRoute.find(pr => pr.uri === routeRole.route.toLowerCase() && pr.method === routeRole.method);
        roleId = insertedRoles.find(r => r.code === routeRole.role.toUpperCase());
        if (projectRouteId && roleId) {
          return {
            roleId: roleId.id,
            routeId: projectRouteId.id
          };
        }
      });
      createRouteRoles = createRouteRoles.filter(Boolean);
      const routeRolesToBeInserted = [];
      let routeRoleObj = {};

      await Promise.all(
        createRouteRoles.map(async routeRole => {
          routeRoleObj = await dbService.findOne(RouteRole, {
            routeId: routeRole.routeId,
            roleId: routeRole.roleId,
          });
          if (!routeRoleObj) {
            routeRolesToBeInserted.push({
              routeId: routeRole.routeId,
              roleId: routeRole.roleId,
            });
          }
        })
      );
      if (routeRolesToBeInserted.length) {
        const result = await dbService.create(RouteRole, routeRolesToBeInserted);
        if (result) console.log('RouteRole seeded 🍺');
        else console.log('RouteRole seeder failed!');
      } else {
        console.log('RouteRole is upto date 🍺');
      }
    }
  } catch (error){
    console.log('RouteRole seeder failed due to ', error.message);
  }
}

/* seeds roles for users */
async function seedUserRole (){
  try {
    const userRoles = [{
      'username':'admin',
      'password':'Password@1'
    }];
    const defaultRoles = await dbService.findMany(Role);
    const insertedUsers = await dbService.findMany(User, { username: { '$in': userRoles.map(userRole => userRole.username) } });
    let user = {};
    const userRolesArr = [];
    userRoles.map(userRole => {
      user = insertedUsers.find(user => user.username === userRole.username && user.isPasswordMatch(userRole.password) && user.isActive && !user.isDeleted);
      if (user && user.userType === authConstant.USER_TYPES.Admin) {
        userRolesArr.push({
          userId: user.id,
          roleId: defaultRoles.find((d)=>d.code === 'ADMIN')._id
        }); 
      }
    });
    let userRoleObj = {};
    const userRolesToBeInserted = [];
    if (userRolesArr.length) {
      await Promise.all(
        userRolesArr.map(async userRole => {
          userRoleObj = await dbService.findOne(UserRole, {
            userId: userRole.userId,
            roleId: userRole.roleId
          });
          if (!userRoleObj) {
            userRolesToBeInserted.push({
              userId: userRole.userId,
              roleId: userRole.roleId
            });
          }
        })
      );
      if (userRolesToBeInserted.length) {
        const result = await dbService.create(UserRole, userRolesToBeInserted);
        if (result) console.log('UserRole seeded 🍺');
        else console.log('UserRole seeder failed');
      } else {
        console.log('UserRole is upto date 🍺');
      }
    }
  } catch (error) {
    console.log('UserRole seeder failed due to ', error.message);
  }
}

async function seedData (allRegisterRoutes){
  await seedUser();
  await seedPreference();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();

};
module.exports = seedData;