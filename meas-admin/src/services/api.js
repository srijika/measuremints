import request from '../utils/request';


// ****START GLOBAL API **** 
export function approvebussiness(params) {
  return request('/api/approvebussiness', { method: 'POST', body: params, });
}

// ****START GLOBAL API ****

// ****START AUTH API **** 
export function login(params) {
  return request('/api/admin/login', { method: 'POST', body: {...params, isOtp: "0", firbaseToken:'' }, });
}
export function Register(params) {
  return request('/api/signup', { method: 'POST', body: params, });
}
export function forgetpassword(params) {
  return request('/api/forgetpassword', { method: 'POST', body: params, });
}
export function resetpassword(params) {
  return request('/api/admin/resetpassword', { method: 'POST', body: params, });
  
}
export function varifyUser(params) {
  return request('/api/verify/otp', {method: 'POST', body: params});
}

export function resendOTPTOUser(params) {
  return request('/api/send-otp-to-user', {method: 'POST', body: params});
}

export function resetPassword(params) {
  return request('/api/admin/resetPassword', {method: 'POST', body: params});
}

export function changePassword(params) {
  return request('/api/changepassword', {method: 'POST', body: params});
}
// ****END AUTH API **** 



// ****START DASHBOARD API **** 
export function getDashboardData(val) {
  return request('/api/dashboard', { method: 'POST', body: val, });
} 
// ****END DASHBOARD API **** 



// ****START USERS API **** 
export function getUserList(params) {
  return request('/api/getalluserlist', { method: 'POST', body: params, });
}
export function getprofile(val) {
  return request('/api/getprofile', { method: 'POST', body: val, });
}
 
export function updateprofile(val) {
  return request('/api/admin/updateprofile', { method: 'POST', body: val, });
}

export function getUserDetail(params) {
  return request('/api/getprofile', { method: 'POST', body: params, });
}
export function editUsers(params) {
  return request('/api/editUsers', { method: 'POST', body: params, });
}
export function deleteUser(params) {
  return request('/api/deleteuser', { method: 'POST', body: params, });
}
// ****END USERS API **** 


// ****START PAGES API **** 
export function getPagesList(params){
  return request('/api/getAll-pages',{method:'POST', body:params});
}

export function createPages(params) {
  return request('/api/create-pages',{method:'POST', body:params});
}

export function pagesDetail(params) {
  return request('/api/get-pages?slug='+params,{method:'GET'});
}

export function editPages(params) {
  return request('/api/update-pages',{method:'PUT', body:params});
}

export function deletePages(params) {
  return request('/api/delete-pages?slug='+params,{method:'DELETE'});
}
// ****END PAGES API **** 




// ****START NOTIFICATIONS API **** 
export function getNotifList(params){
  return request('/api/notification/listing',{method:'POST', body:params});
}

export function createNotif(params) {
  return request('/api/add-notification',{method:'POST', body:params});
}

export function deleteNotif(params) {
  return request('/api/delete-notification',{method:'POST', body:params});
}
// ****END NOTIFICATIONS API **** 


// ****START CATEGORY API **** 
export async function  getCategoryList(params) {
  return await request('/list/category',{method:'POST',body:params})
}

export function createCategory(params) {
  return request('/create/category',{method:'POST',body:params})
}

export function updateCategory(params) {
  return request('/update/category',{method:'POST',body:params})
}

export function deleteCategory(params) {
  return request('/delete/category',{method:'POST',body:params})
}


// ****END CATEGORY API **** 


// ****START SUB CATEGORY API **** 
export function createSubCat(params) {
  return request('/create-sub-category', { method: 'POST', body: params, });
}
export function updateSubCat(params) {
  return request('/update-sub-category', { method: 'POST', body: params, });
}
export function getallsubcategries(params) {
  return request('/getAll-sub-category', { method: 'POST',  body: params,}); 
}
export async function getSubCatbyCategory(params) {
  const data = await request('/sub-category-by-category', { method: 'POST', body: params, });
  return data;
}
export function catSubDetail(params) {
  return request('/get-sub-category', {method: 'POST', body: params,});
}
export function deleteSubCat(params) {
  return request('/delete-sub-category', {method: 'POST', body: params,});
}
// ****END SUB CATEGORY API **** 





// ****START SETTINGS API **** 

// ****END SETTINGS API **** 













