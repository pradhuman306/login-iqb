import {
  SET_QUESTIONNAIRE,
  SET_QUESTIONNAIRE_CAT,
} from "../constants/actionTypes";

const initialState = {
  questionnaireList: [],
  questionnaireCatlist: [],
  pending: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_QUESTIONNAIRE:
      return {
        ...state,
        questionnaireList: action.payload,
        pending: false,
      };
    case SET_QUESTIONNAIRE_CAT:
      return {
        ...state,
        questionnaireCatlist: action.payload,
      };
    default:
      return state;
  }
}
