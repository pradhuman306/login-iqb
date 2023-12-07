import {
  VIEW_CUSTOMER,
  SET_PENDING,
  SET_CUSTOMER_USERS,
  SET_CUSTOMER_STYLE,
} from "../constants/actionTypes";

const initialState = {
  customerData: [],
  pending: true,
  usersList: [],
  customerStyle: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VIEW_CUSTOMER:
      return {
        ...state,
        customerData: action.payload,
        pending: false,
      };
    case SET_PENDING:
      return {
        ...state,
        pending: true,
      };
    case SET_CUSTOMER_USERS:
      return {
        ...state,
        usersList: action.payload,
      };
    case SET_CUSTOMER_STYLE:
      return {
        ...state,
        customerStyle: action.payload,
      };
    default:
      return state;
  }
}
