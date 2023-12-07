import { GET_USERSLIST, SET_SINGLE_USER_PERM } from "../constants/actionTypes";

const initialState = {
  usersList: [],
  selUserPermissions: [],
  pending: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USERSLIST:
      return {
        ...state,
        usersList: action.payload,
        pending: false,
      };
    case SET_SINGLE_USER_PERM:
      return {
        ...state,
        selUserPermissions: action.payload,
      };
    default:
      return state;
  }
}
