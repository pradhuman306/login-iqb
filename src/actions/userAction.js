import config from "../config";
import * as ajaxCall from "../common/ajaxCall";
import * as actionTypes from "../constants/actionTypes";
const setUser = (type, text) => ({
  type,
  payload: text,
});
const customerdata = localStorage.getItem("customerdata")
  ? JSON.parse(localStorage.getItem("customerdata"))
  : null;
export const GetUsers = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}users`)
    .then((res) => {
      dispatch(setUser(actionTypes.SET_USERS, res.data.data));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};
export const GetUserPermission = (id) => (dispatch) => {
  console.log("fdsfdsf");
  ajaxCall
    .get(`${config.BASE_URL}getuserpermission/` + id)
    .then((res) => {
      dispatch(setUser(actionTypes.SET_SINGLE_USER_PERM, res.data.data));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const GetCustomerUsers = (payload) => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}getuserbycustomerid/${payload}`)
    .then((res) => {
      dispatch(setUser(actionTypes.SET_USERS, res.data.data[0].users));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const addUser = (payload) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}createuser`, payload.values)
    .then((response) => {
      if (payload.uid) {
        dispatch(GetCustomerUsers(payload.uid));
      } else {
        dispatch(GetUsers());
      }
      payload.modal.click();
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: payload.locale.User_add_successfully,
      });
    })
    .catch((error) => {
      if (error.response.data.email[0]) {
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: payload.locale.Email_already_exist,
        });
      } else {
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: error.response.data.message,
        });
      }
    });
};

export const editUser = (payload) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}updateuser`, payload.values)
    .then((response) => {
      if (payload.uid) {
        dispatch(GetCustomerUsers(payload.uid));
      } else {
        dispatch(GetUsers());
      }
      if (payload.id) {
        dispatch(singleUser(payload.id));
      }

      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: payload.locale.User_updated_succeessfully,
      });
      payload.modal.click();
    })
    .catch((error) => {
      if (error.response.data.email[0]) {
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: error.response.data.email[0],
        });
      } else {
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: error.response.data.message,
        });
      }
    });
};

export const deleteUser = (payload) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}deleteuser`, { id: payload.values })
    .then((response) => {
      if (payload.uid && payload.prevValues) {
        dispatch(GetCustomerUsers(payload.uid));
        dispatch(userSearch({ uid: payload.uid, values: payload.prevValues }));
      } else if (!payload.uid && payload.prevValues) {
        dispatch(userSearch({ values: payload.prevValues }));
        dispatch(GetUsers());
      } else if (!payload.uid && !payload.prevValues) {
        dispatch(GetUsers());
      }
      if (payload.uid && payload.values) {
        dispatch(GetCustomerUsers(payload.uid));
      }
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: payload.locale.Record_deleted_successfully,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const userSearch = (payload) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}usersearch`, payload.values)
    .then((res) => {
      dispatch(setUser(actionTypes.SET_SEARCH_USERS, res.data.data));
      if (payload.uid) {
        dispatch(GetCustomerUsers(payload.uid));
      } else {
        dispatch(GetUsers());
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const recoverUser = (payload) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}recoveruser`, { id: payload.values })
    .then((response) => {
      if (payload.uid) {
        dispatch(userSearch({ values: payload.prevValues, uid: payload.uid }));
      } else {
        dispatch(userSearch({ values: payload.prevValues }));
      }

      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: payload.locale.Record_recovered_successfully,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const setInactive = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}setinactive/${payload.values}`)
    .then((res) => {
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Record_updated_successfully,
      });
      if (payload.uid) {
        dispatch(GetCustomerUsers(payload.uid));
      } else {
        dispatch(GetUsers());
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const singleUser = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_PENDING_USERS });
  ajaxCall
    .get(`${config.BASE_URL}user/${payload}`)
    .then((res) => {
      dispatch({ type: actionTypes.VIEW_USER, payload: res.data.data[0] });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: err.response.data.message,
      });
    });
};
