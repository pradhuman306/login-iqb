import authReducer from "./authReducer";
import langReducer from "./langReducer";
import toasterReducer from "./toasterReducer";
import styleReducer from "./styleReducer";
import customerReducer from "./customerReducer";
import userReducer from "./userReducer";
import { combineReducers } from "redux";
import questionnaireReducer from "./questionnaireReducer";
import customerPermissionsReducer from "./customerPermissionsReducer";
import getuserlistReducer from "./getuserlistReducer";
import viewCustomerReducer from "./viewCustomerReducer";
import viewUserReducer from "./viewUserReducer";
import viewQuestionnaireReducer from "./viewQuestionnaireReducer";
import pdfReducer from "./pdfReducer";
import switchCustomerReducer from "./switchCustomerReducer";
import answerReducer from "./answerReducer";
import docReducer from "./docReducer";
import emailTemplateReducer from "./emailTemplateReducer";
import * as actionTypes from "../constants/actionTypes";
const appReducer = combineReducers({
  authReducer,
  langReducer,
  styleReducer,
  toasterReducer,
  customerReducer,
  userReducer,
  questionnaireReducer,
  customerPermissionsReducer,
  getuserlistReducer,
  viewCustomerReducer,
  viewUserReducer,
  viewQuestionnaireReducer,
  pdfReducer,
  switchCustomerReducer,
  answerReducer,
  docReducer,
  emailTemplateReducer,
});

export default function (state, action) {
  if (action.type === actionTypes.USER_LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
}
