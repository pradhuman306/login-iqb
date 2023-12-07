import { VIEW_USER, SET_PENDING_USERS } from "../constants/actionTypes";

const initialState = {
  userData: [],
  pending: true,
};
export default function (state = initialState, action) {
  switch (action.type) {
    case VIEW_USER:
      return {
        ...state,
        userData: action.payload,
        pending: false,
      };
    case SET_PENDING_USERS:
      return {
        ...state,
        pending: true,
      };

    default:
      return state;
  }
}
