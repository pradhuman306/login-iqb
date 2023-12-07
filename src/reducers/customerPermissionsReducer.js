import {
  GET_CUSTOMERPERMISSIONS,
  SET_CUST_PERM_PENDING,
} from "../constants/actionTypes";
const role = atob(localStorage.getItem("role"));
const initialState = {
  userList: [],
  customerPermissionsList: localStorage.getItem("selCustomer")
    ? JSON.parse(localStorage.getItem("selCustomer")).permission
    : localStorage.getItem("customerdata") && ["user"].includes(role)
    ? JSON.parse(localStorage.getItem("customerdata"))[0].permission
    : [],
  pending: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CUSTOMERPERMISSIONS:
      return {
        ...state,
        customerPermissionsList: action.payload,
        pending: false,
      };
    case SET_CUST_PERM_PENDING:
      return {
        ...state,
        pending: true,
      };

    default:
      return state;
  }
}
