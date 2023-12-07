import config from "../config";
import * as ajaxCall from "../common/ajaxCall";
import * as actionTypes from "../constants/actionTypes";
import PDFFile from "../pages/Pdf/PDFFile";
import PDFdata from "../pages/Pdf/PDFdata";
import { BlobProvider, PDFDownloadLink, usePDF } from "@react-pdf/renderer";

const setQuestionnaire = (type, text) => ({
  type,
  payload: text,
});

export const GetQuetionnaireTypes = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}questionnairetypes`)
    .then((res) => {
      console.log("sssdsdsds", res);
      dispatch(setQuestionnaire(actionTypes.SET_QUESTIONNAIRE, res.data.data));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const submitQuestions = (payload, nav, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}submitquestions`, payload)
    .then((res) => {
      console.log("sssdsdsds", res);

      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Data_submitted_successfully,
      });

      dispatch(GetQuetionnaireTypes());
      nav("/questionnaire-management");
      // dispatch(setQuestionnaire(actionTypes.SET_QUESTIONNAIRE, res.data.data));
    })
    .catch((error) => {
      console.log(error);
      if (error.response.data.questionnaireType) {
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: error.response.data.questionnaireType[0],
        });
      } else {
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: error.response.data.message,
        });
      }

      console.log("sssdsdsds", error);
    });
};

export const generatePDF =
  (payload, customerData, type, locale) => (dispatch) => {
    // dispatch({ type: SET_PDF_PENDING });

    ajaxCall
      .post(`${config.BASE_URL}getsubmitresult`, payload)
      .then((res) => {
        console.log("sssdsdsds", res);

        if (type === "PDF") {
          dispatch({
            type: actionTypes.SET_PDF_DATA,
            payload: [res.data.data, customerData],
          });
          dispatch({
            type: actionTypes.SUCCESS_MESSAGE,
            payload: locale.PDF_file_downloaded_successfully,
          });
        } else if (type === "DOC") {
          dispatch({
            type: actionTypes.SET_DOC_DATA,
            payload: [res.data.data, customerData],
          });
          dispatch({
            type: actionTypes.SUCCESS_MESSAGE,
            payload: locale.DOC_file_downloaded_successfully,
          });
        }

        // nav("/questionnaire-management");
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: error.response.data.message,
        });
      });
  };

export const saveAnswer = (payload, locale) => (dispatch) => {
  // dispatch({ type: SET_PDF_PENDING });

  ajaxCall
    .post(`${config.BASE_URL}submitanswer`, payload)
    .then((res) => {
      console.log("sssdsdsds", res);
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.File_saved_succeessfully,
      });
      dispatch(
        answerList({
          questionnaire_type: payload.questionnaire_type,
          user_id: payload.user_id,
        })
      );
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};
export const answerList = (payload) => (dispatch) => {
  // dispatch({ type: SET_PDF_PENDING });

  ajaxCall
    .get(
      `${config.BASE_URL}answerlist?questionnaire_type=` +
        payload.questionnaire_type +
        "&user_id=" +
        payload.user_id
    )
    .then((res) => {
      console.log("sssdsdsds", res);
      dispatch({
        type: actionTypes.SET_ANSWER_LIST,
        payload: res.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const getListAnswer = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_ANSWER_LIST_PENDING });

  ajaxCall
    .post(`${config.BASE_URL}getquestionnaireresult`, payload)
    .then((res) => {
      console.log("sssdsdsds", res);
      dispatch({
        type: actionTypes.SET_ANSWER_DATA,
        payload: res.data.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const updateQuestions = (payload, nav, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}updatequestinnaire`, payload)
    .then((res) => {
      console.log("sssdsdsds", res);
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Data_updated_successfully,
      });

      dispatch(GetQuetionnaireTypes());
      nav("/questionnaire-management");
      // dispatch(setQuestionnaire(actionTypes.SET_QUESTIONNAIRE, res.data.data));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
      console.log("sssdsdsds", error);
    });
};

export const deleteQuestionnaire = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}deletequestinnaire/` + payload)
    .then((res) => {
      console.log("sssdsdsds", res);
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Record_deleted_successfully,
      });

      dispatch(GetQuetionnaireTypes());
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
      console.log("sssdsdsds", error);
    });
};

export const getQuestionsbyid = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_QUESTIONNAIRE_PENDING });
  ajaxCall
    .get(`${config.BASE_URL}questionslist/` + payload)
    .then((res) => {
      console.log("sssdsdsds", res);

      dispatch(setQuestionnaire(actionTypes.VIEW_QUESTIONNAIRE, res.data.data));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
      console.log("sssdsdsds", error);
    });
};

export const GetUsersPermissionList = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}userspermissionslist`)
    .then((res) => {
      console.log("qwertyu", res);
      dispatch({ type: actionTypes.GET_USERSLIST, payload: res.data.data });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const GetQuestionnaireCat = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}categories`)
    .then((res) => {
      console.log("qwertyu", res);
      dispatch({
        type: actionTypes.SET_QUESTIONNAIRE_CAT,
        payload: res.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const QuestionBuilder = (payload) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}questionbuilder`, payload)
    .then((res) => {
      console.log(res);
      // dispatch(setQuestionnaire(actionTypes.SET_QUESTIONNAIRE, res.data.data));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const displaySubanswerBelowOptions = (payload) => (dispatch) => {
  if (payload.length > 0) {
    payload.forEach((item) => {
      if (item.element === "RadioButtons" || item.element === "Checkboxes") {
        item.options.forEach((opt) => {
          let id = "fid_preview_" + opt.key;

          if (opt.subanswer) {
            if (document.getElementById(id)) {
              if (
                document.getElementById(id).parentElement.children.length === 2
              ) {
                document.getElementById(id).parentElement.innerHTML +=
                  '<input type="text" class="subanswer-input form-control" />';
              }
            }
          } else {
            if (document.getElementById(id)) {
              if (
                document.getElementById(id).parentElement.children.length === 3
              ) {
                document.getElementById(id).parentElement.children[2].remove();
              }
            }
          }
        });
      }
    });
  }
};

export const updateEmailTemplate = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}actionmailtemplate`, payload)
    .then((response) => {
      console.log(response);

      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Updated_successfully,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const updateRegistrationTemplate = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}registrationmailtemplate`, payload)
    .then((response) => {
      console.log(response);
      dispatch(getRegistrationEmailTemplate());
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Updated_successfully,
      });
 
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const getEmailTemplate = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}getmailtemplate`)
    .then((response) => {
      console.log(response);

      dispatch({
        type: actionTypes.SET_EMAIL_TEMPLATE,
        payload: response.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const getRegistrationEmailTemplate = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}getregistrationmailtemplate`)
    .then((response) => {
      console.log(response);

      dispatch({
        type: actionTypes.SET_REGISTRATION_TEMPLATE,
        payload: response.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

