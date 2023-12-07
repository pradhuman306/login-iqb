import {
  SET_USER_CUSTOMERS,
  SET_USER_SELECTED_CUSTOMER,
} from "../constants/actionTypes";

const initialState = {
  customerList: localStorage.getItem("customerdata")
    ? JSON.parse(localStorage.getItem("customerdata"))
    : [],
  selectedCustomer: localStorage.getItem("selCustomer")
    ? JSON.parse(localStorage.getItem("selCustomer"))
    : localStorage.getItem("customerdata")
    ? JSON.parse(localStorage.getItem("customerdata"))[0]
    : {},
  pending: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_CUSTOMERS:
      return {
        ...state,
        customerList: action.payload,
        pending: false,
      };
    case SET_USER_SELECTED_CUSTOMER:
      localStorage.setItem("selCustomer", JSON.stringify(action.payload));
      return {
        ...state,
        selectedCustomer: action.payload,
        pending: false,
      };
    default:
      return state;
  }
}
