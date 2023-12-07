import config from "../config";
import * as api from "../common/api";
import * as ajaxCall from "../common/ajaxCall";
import * as actionTypes from "../constants/actionTypes";
import * as localstorage from "../common/localStorage";
import * as Cookie from "../common/Cookies";
import { GetStyle } from "./customerAction";
import { SET_STYLE_PENDING } from "../constants/actionTypes";

const loginSuccess = (type, text) => ({
  type,
  payload: text,
});

const setStyle = (type, text) => ({
  type,
  payload: text,
});

const changedLang = (type, text) => ({
  type,
  payload: text,
});

export const signout = (locale) => (dispatch) => {
  dispatch({
    type: actionTypes.USER_LOGOUT,
  });
  dispatch({
    type: actionTypes.AUTH_ERROR,
  });

  dispatch({
    type: actionTypes.SUCCESS_MESSAGE,
    payload: locale.Signed_out_successfully,
  });
  dispatch({ type: SET_STYLE_PENDING });
  let logged_in_route = localstorage.get("logged_in_route")
    ? atob(localstorage.get("logged_in_route"))
    : "/signin";
  // window.location.href = logged_in_route;
};

export const login = (loginDetails) => (dispatch) => {
  const { email, password, rememberme } = loginDetails;
  const payload = { email, password };
  if (rememberme) {
    Cookie.setCookie("email", email, 30);
    Cookie.setCookie("password", password, 30);
  } else {
    Cookie.clear("email");
    Cookie.clear("password");
  }
  api
    .post(`${config.BASE_URL}login`, payload)
    .then((response) => {
      let {
        token,
        role,
        data: { userdata, customerdata },
        message,
      } = response.data;
      if (response.status == 200) {
        console.log(response);
        localstorage.set("iqb_token", btoa(token));
        localstorage.set("userdata", JSON.stringify(userdata));
        if (customerdata) {
          localstorage.set("customerdata", JSON.stringify(customerdata));
        }
        localstorage.set("role", btoa(role));
        let date = new Date();
        date = new Date(date.setDate(date.getDate() + 7));
        console.log("🚀 ~ file: auth.js ~ line 63 ~ .then ~ date", date);
        localstorage.set("exp", btoa(date));

        if (role === "customer") {
          dispatch({ type: actionTypes.SET_STYLE_PENDING });
          dispatch(GetStyle({ customer_id: userdata.id }));
        } else if (role === "user") {
          dispatch({
            type: actionTypes.SET_USER_CUSTOMERS,
            payload: customerdata,
          });

          dispatch(GetStyle({ customer_id: customerdata[0].data.id }));
        } else {
          dispatch(setStyle(actionTypes.SET_STYLE, null));
        }

        // else if(role == 'user'){
        //   dispatch(GetStyle({customer_id: customerdata.data.id}))
        // }
        dispatch(loginSuccess(actionTypes.USER_LOADED, response.data));
        dispatch({
          type: actionTypes.SUCCESS_MESSAGE,
          payload: response.data.message,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.AUTH_ERROR,
      });
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const ResetEmailSend = (payload, nav, language) => (dispatch) => {
  api
    .get(
      `${config.BASE_URL}resetlink?email=${payload.email}&language=${language}`
    )
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: actionTypes.SUCCESS_MESSAGE,
          payload: response.data.message,
        });
        if (nav != "") {
          nav("/reset-link");
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const ResetPassword = (payload) => (dispatch) => {
  api
    .post(`${config.BASE_URL}resetpassword`, payload)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: actionTypes.SUCCESS_MESSAGE,
          payload: response.data.message,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const UpdateProfile = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}updateusersetting`, payload)
    .then((response) => {
      payload.id = payload.user_id;
      if (response.status == 200) {
        localstorage.set("userdata", JSON.stringify(payload));
        if (response.data.status === 1) {
          dispatch({
            type: actionTypes.SUCCESS_MESSAGE,
            payload: locale.User_settings_update_successfully,
          });
        }
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const UpdatePassword = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}updatepassword`, payload)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: actionTypes.SUCCESS_MESSAGE,
          payload: locale.Password_changed_successfully,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const ChangeLanguage = (payload) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}setlocalization`, { lang: payload })
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: actionTypes.SUCCESS_MESSAGE,
          payload: response.data.message,
        });
        dispatch(changedLang(actionTypes.CHANGE_LANG, payload));
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const LoggedInuserInfo = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}loggeduserinfo`)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: actionTypes.LOGGED_USER_INFO,
          payload: response.data.data,
        });
        localstorage.set("userdata", JSON.stringify(response.data.data));
        console.log(response);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const totalDayLeftSubscription = (UserData) => {
  const endDate = UserData.end;

  const date = new Date();
  const todayDate = new Date(
    date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
  );
  const EndDate = new Date(endDate);
  const trial_days =
    (EndDate.getTime() - todayDate.getTime()) / (3600 * 24 * 1000);

  return trial_days;
};
