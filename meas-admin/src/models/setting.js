import {approvebussiness , resetpassword, resendOTPTOUser, varifyUser, 
    } from '../services/api'
import {message} from 'antd'; 



export default {
  namespace: 'setting',

  state: {
    getBuss:{count:0},
    update:{count:0}, 
    create:{count:0},
    resetp:{count:0},
    approve:{count:0},
    otp:{count:0},
    verifyotp:{count:0},
    getSingleBussines: {}
	},

  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {

    *approveBuss({ payload }, { call, put }) {
      const response = yield call(approvebussiness, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      if(response.status) {
        if(payload.isBussinessVerified){
            message.success('Business successfully approved!', 5);
        }else{
            message.success('Business successfully rejected!', 5);
        }
      } 
      yield put({ type: 'approve', ...response});
    },
    *changePassword({ payload }, { call, put }) {
      let user =  JSON.parse(localStorage.getItem('user'));
      const email = user.username;
      let val = { username: email, password: payload.password, old_password: payload.oldPassword, otpchk: true };
      const response = yield call(resetpassword, val);
      console.log(payload)
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      if(response.status) {message.success(response.msg || response.message, 5);
      } 
      yield put({ type: 'resetp', ...response});
    },
    *resendOTPTOUser({ payload }, { call, put }) {
      const response = yield call(resendOTPTOUser, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      // if(response.status) {message.success(response.msg || response.message, 5);} 
      yield put({ type: 'otp', ...response});
    },
    *varifyUser({ payload }, { call, put }) {
      const response = yield call(varifyUser, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      if(response.status) {message.success(response.msg || response.message, 5);} 
      yield put({ type: 'verifyotp', ...response});
    },
    *clearVerifyOTP({ payload }, { call, put }) {
      yield put({ type: 'clearVerifyOTP'});
    },
	*clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear'});
    },
  },

  reducers: {
    getBuss(state, action) {
      return { ...state, getBuss:action };
    },
    getSellerBussines(state, action) {
      return { ...state, getBuss:action };
    },
    getSingleBussines(state, action) {
      return { ...state, getSingleBussines:action };
    },
    busslist(state, action) {
      return { ...state, busslist:action };
    },
    busssellerlist(state, action) {
      return { ...state, busssellerlist:action };
    },
    create(state, action) {
		action.count = state.create.count+1;
		return { ...state, create:action };
    },
    update(state, action) {
      action.count = state.update.count+1;
      return { ...state, update:action };
    },
    approve(state, action) {
      action.count = state.approve.count+1;
      return { ...state, approve:action };
    },
    approveReset(state, action) {
      return { ...state, approve:{count:0} };
    },
    resetp(state, action) {
      action.count = state.resetp.count+1;
      return { ...state, resetp:action };
    },
    otp(state, action) {
      return { ...state, otp:action };
    },
    verifyotp(state, action) {
      return { ...state, verifyotp:action };
    },
    clearVerifyOTP(state, action) {
		  return { ...state, verifyotp:{count:0}};
    },
    clear(state, action) {
		  return { ...state, create:{count:0}, approve:{count:0}, update:{count:0}, resetp:{count:0}, otp:{count:0}, verifyotp:{count:0}};
    },
  },
};