import {
  SET_CUSTOMERS,
  CHECK_SHORT_NAME,
  SET_SEARCH_CUSTOMER,
  SET_FONT_FAMILY_LIST,
} from "../constants/actionTypes";

const initialState = {
  customerList: [],
  pending: true,
  checkshortname: "",
  searchList: [],
  fontfamilylist: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CUSTOMERS:
      return {
        ...state,
        customerList: action.payload,
        pending: false,
      };
    case CHECK_SHORT_NAME:
      return {
        ...state,
        checkshortname: action.payload,
      };
    case SET_SEARCH_CUSTOMER:
      return {
        ...state,
        searchList: action.payload,
        pending: false,
      };
    case SET_FONT_FAMILY_LIST:
      return {
        ...state,
        fontfamilylist: action.payload,
        pending: false,
      };
    default:
      return state;
  }
}
