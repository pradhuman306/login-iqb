import { SET_EMAIL_TEMPLATE,SET_REGISTRATION_TEMPLATE } from "../constants/actionTypes";

const initialState = {
  emailTemplate: {},
  registrationTemplate:{},
  pending: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_EMAIL_TEMPLATE:
      return {
        ...state,
        emailTemplate: action.payload,
        pending: false,
      };

      case SET_REGISTRATION_TEMPLATE:
        return {
          ...state,
          registrationTemplate: action.payload,
          pending: false,
        };

    default:
      return state;
  }
}
