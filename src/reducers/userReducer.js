import { SET_USERS, SET_SEARCH_USERS } from "../constants/actionTypes";

const initialState = {
  userList: [],
  searchList: [],
  pending: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        userList: action.payload,
        pending: false,
      };
    case SET_SEARCH_USERS:
      return {
        ...state,
        searchList: action.payload,
      };
    default:
      return state;
  }
}
