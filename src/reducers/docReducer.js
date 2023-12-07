import { SET_DOC_DATA, SET_DOC_PENDING } from "../constants/actionTypes";

const initialState = {
  docData: [],
  pending: true,
  pdfUrl: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_DOC_DATA:
      return {
        ...state,
        docData: action.payload.length > 0 ? [action.payload[0]] : [],
        pending: false,
      };
    case SET_DOC_PENDING:
      return {
        ...state,
        pending: true,
      };
    default:
      return state;
  }
}
