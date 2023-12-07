import config from "../config";
import * as ajaxCall from "../common/ajaxCall";
import * as actionTypes from "../constants/actionTypes";
import { GetUsersPermissionList } from "./questioerAction";
import { GetCustomerUsers } from "./userAction";
import { getSingleCustomerPermission } from "./customerAction";

const getPermissions = (type, text) => ({
  type,
  payload: text,
});

export const GetCustomerPermissionList = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}customerpermissionslist`)
    .then((res) => {
      console.log(res);
      dispatch(
        getPermissions(actionTypes.GET_CUSTOMERPERMISSIONS, res.data.data)
      );
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const SetCustomerPermission = (payload, locale, modal) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}setcustomerpermission`, payload)
    .then((response) => {
      dispatch(GetCustomerPermissionList());
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Customer_permission_updated_successfully,
      });
      modal.click();
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const SetUserPermission = (payload, role, id, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}setuserpermission`, payload)
    .then((response) => {
      if (role == "super_admin") {
        dispatch(GetUsersPermissionList());
      } else {
        dispatch(GetCustomerUsers(id));

        dispatch(getSingleCustomerPermission(id));
      }
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.User_permission_updated_successfully,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const SetMultiUserPermission = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}setmultipleuserpermission`, payload)
    .then((response) => {
      dispatch(GetCustomerPermissionList());
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.User_permission_updated_successfully,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: locale.Select_at_least_one_user,
      });
    });
};
