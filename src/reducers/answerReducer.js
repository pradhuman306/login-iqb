import {
  SET_ANSWER_LIST,
  SET_ANSWER_LIST_PENDING,
  SET_ANSWER_DATA,
  REMOVE_ANSWER_DATA,
} from "../constants/actionTypes";

const initialState = {
  answerList: [],
  answerData: [],
  pending: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ANSWER_LIST:
      return {
        ...state,
        answerList: action.payload,
        pending: false,
      };
    case SET_ANSWER_LIST_PENDING:
      return {
        ...state,
        pending: true,
      };
    case SET_ANSWER_DATA:
      return {
        ...state,
        answerData: action.payload,
        pending: false,
      };
    case REMOVE_ANSWER_DATA:
      return {
        ...state,
        answerData: [],
      };

    default:
      return state;
  }
}
