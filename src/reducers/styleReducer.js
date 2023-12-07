import {
  REMOVE_STYLE_PENDING,
  SET_STYLE,
  SET_STYLE_PENDING,
} from "../constants/actionTypes";
import * as localStorage from "../common/localStorage";
const initialState = {
  style: localStorage.get("style")
    ? JSON.parse(localStorage.get("style"))
    : null,
  pending: false,
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_STYLE:
      return {
        ...state,
        style: action.payload,
        pending: false,
      };
    case SET_STYLE_PENDING:
      return {
        ...state,
        pending: true,
      };
    case REMOVE_STYLE_PENDING:
      return {
        ...state,
        pending: false,
      };

    default:
      return state;
  }
}
