/**
 * attendance.js
 * @description :: functions used to register attendance
 */

const Preference = require('../model/preference');
const Attendance = require('../model/attendance');
const dbService = require('../utils/dbService');
const dayjs = require('dayjs');
var isToday = require('dayjs/plugin/isToday');
dayjs.extend(isToday);

/**
 * getLocationDistance : get distance between two locations in km, using Haversine Formula
 * @param {number} lat1 : latitude of branch.
 * @param {number} lng1 : longitude of branch.
 * @param {number} lat2 : latitude of user.
 * @param {number} lng2 : longitude of user.
 * @return {number} : distance between two locations in km
 */

function getLocationDistance (lat1, lng1, lat2, lng2) {
  const earthRadius = 6371; // Radius of the earth in km
  function deg2rad (deg) {
    return deg * (Math.PI / 180);
  }
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
  Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; // Distance in km
  return distance;
}

/**
 * @description : login user.
 * @param {string} branch : office branch name.
 * @param {number} latitude : latitude of user.
 * @param {number} longitude : longitude of user.
 * @return {Object} : returns authentication status. {flag, data}
 */
const verifyLocation = async (branch, latitude, longitude) => {
  try {

    let where = {
      isActive:  true,
      isDeleted: false
    };       
    let preference = await dbService.findOne(Preference, where);
    if (preference) {
      const location = preference.officeLocations.find(officeLocation => (officeLocation.branch === branch));
      if (!location){
        return {
          flag: true,
          data: 'Branch not set'
        };
      }
      const distance = await getLocationDistance(location.latitude, location.longitude, latitude, longitude);
      if (distance > 0.3 && preference.isStrictLocation){
        return {
          flag: true,
          data: 'Restricted location'
        };
      }
      if (distance > 0.3){
        return {
          flag: true,
          data: 'Out of location range'
        };
      }
      return {
        flag:false,
        data: 'In location range'
      };
            
    } else {
      return {
        flag:true,
        data:'preference not exists'
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * checkAttendanceDuplicate: check user today's attendance
 * @param {string} userId : user id
 * @return {boolean} : validation status
 */
async function checkAttendanceDuplicate (userId){
  // Get today's date
  let startOfToday = dayjs().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
  let endOfToday = dayjs().set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 999);

  let filter = { 
    addedBy: userId,
    signedInAt: {  
      $gte: startOfToday, 
      $lte: endOfToday  
    },
    isActive: true,
    isDeleted: false
  };

  let found = await dbService.findOne(Attendance,filter);
  if (found){
    return true;
  }
  return false;
}

/**
 * checkValidSignOutTime: check user today's attendance
 * @param {string} userId : user id
 * @return {boolean} : validation status
 */
async function checkValidSignOutTime (id){
  try {
    let filter = { 
      _id: id,
      isActive: true,
      isDeleted: false
    };
    const foundAttendance = await dbService.findOne(Attendance,filter);
    if (!foundAttendance) {
      return false;
    };
    const signInDate = foundAttendance.signedInAt;
    const isSameDay = dayjs(signInDate).isToday();
    if (isSameDay){
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  verifyLocation,
  checkAttendanceDuplicate,
  checkValidSignOutTime
};