import config from "../config";
import * as ajaxCall from "../common/ajaxCall";
import * as actionTypes from "../constants/actionTypes";
import * as localstorage from "../common/localStorage";
import * as api from "../common/api";


const setStyle = (type, text) => ({
  type,
  payload: text,
});

const setCustomer = (type, text) => ({
  type,
  payload: text,
});

export const UpdateStyle = (payload, locale,setBtnPending) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}updatestyle`, payload)
    .then((response) => {
      if (response.status == 200) {
        setBtnPending(false);
        let role = localStorage.getItem("role")
          ? atob(localStorage.getItem("role"))
          : "";
        if (["customer"].includes(role)) {
          dispatch(GetStyle(payload));
        }

        dispatch({
          type: actionTypes.SUCCESS_MESSAGE,
          payload: locale.Customer_style_updated,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};
export const getFontFamily = () => (dispatch) => {
  api
    .get(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAgXOEJ4f2jdpb51EZzFn8HRGD9VoVrn0Q&sort=popularity"
    )
    .then((response) => {
      if (response.status == 200) {
        let allItems = [];
        for (let i = 0; i <= 99; i++) {
          if (response.data.items[i].category == "sans-serif") {
            allItems.push({
              value: response.data.items[i].family,
              label: response.data.items[i].family,
            });
          }
        }
        dispatch({
          type: actionTypes.SET_FONT_FAMILY_LIST,
          payload: allItems,
        });
      }
    });
};
export const getPdfData = () => (dispatch) => {
  dispatch({
    type: actionTypes.GET_PDF_DATA,
  });
};

export const UpdatePDFStyle = (payload, locale, setBtnPending) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}updatepdfstyle`, payload)
    .then((response) => {
      if (response.status == 200) {
        setBtnPending(false);
        dispatch(GetStyle(payload));
        dispatch({
          type: actionTypes.SUCCESS_MESSAGE,
          payload: locale.Customer_pdf_style_updated,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const GetStyle = (payload) => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}style/${payload.customer_id}`)
    .then((res) => {
      let role = localStorage.getItem("role")
        ? atob(localStorage.getItem("role"))
        : "";

      if (["customer", "user"].includes(role)) {
        localstorage.set("style", JSON.stringify(res.data.data));
        let customerdata = localstorage.get("customerdata")
          ? JSON.parse(localstorage.get("customerdata"))
          : null;
        if (customerdata) {
          customerdata["iqb_style"] = res.data.data.iqbstyle;
          customerdata["pdf_style"] = res.data.data.pdfstyle;
          localstorage.set("customerdata", JSON.stringify(customerdata));
        }
        dispatch(setStyle(actionTypes.SET_STYLE, res.data.data));
      } else if (["super_admin"].includes(role)) {
        dispatch({
          type: actionTypes.SET_CUSTOMER_STYLE,
          payload: res.data.data,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const GetStyleByCustomer = (payload) => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}entrypage?customer=${payload}`)
    .then((res) => {
      localstorage.set("style", JSON.stringify(res.data.data));
      dispatch(setStyle(actionTypes.SET_STYLE, res.data.data));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const GetCustomers = () => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}customers`)
    .then((res) => {
      dispatch(setCustomer(actionTypes.SET_CUSTOMERS, res.data.data));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const AddCustomers =
  (payload, resetform, modal, locale) => (dispatch) => {
    ajaxCall
      .post(`${config.BASE_URL}addcustomer`, payload)
      .then((response) => {
        dispatch(GetCustomers());
        dispatch(checkShortName(""));
        resetform();
        if (modal === "trial_customer") {
          dispatch({
            type: actionTypes.SUCCESS_MESSAGE,
            payload: locale.Register_customer_message,
          });
        } else {
          dispatch({
            type: actionTypes.SUCCESS_MESSAGE,
            payload: locale.Customer_added_successfully,
          });
          modal.click();
        }
      })
      .catch((error) => {
        if (error.response.data.email) {
          if (error.response.data.email[0]) {
            dispatch({
              type: actionTypes.ERROR_MESSAGE,
              payload: locale.Email_already_exist,
            });
          }
        } else if (error.response.data.short_name) {
          if (error.response.data.short_name[0]) {
            dispatch({
              type: actionTypes.ERROR_MESSAGE,
              payload: error.response.data.short_name[0],
            });
          }
        } else {
          dispatch({
            type: actionTypes.ERROR_MESSAGE,
            payload: error.response.data.message,
          });
        }
      });
  };

export const registrationTrial =
  (payload, resetform, modal, locale) => (dispatch) => {
    ajaxCall
      .post(`${config.BASE_URL}requestaccess`, payload)
      .then((response) => {
        dispatch(GetCustomers());
        dispatch(checkShortName(""));
        resetform();

        if (response.data.new_trial) {
          dispatch({
            type: actionTypes.SUCCESS_MESSAGE,
            payload: locale.Register_customer_message,
          });
        } else {
          dispatch({
            type: actionTypes.SUCCESS_MESSAGE,
            payload:
              "Customer already registered. Trial period updated successfully please login.",
          });
        }
      })
      .catch((error) => {
        if (error.response.data.email) {
          if (error.response.data.email[0]) {
            dispatch({
              type: actionTypes.ERROR_MESSAGE,
              payload: locale.Email_already_exist,
            });
          }
        } else if (error.response.data.short_name) {
          if (error.response.data.short_name[0]) {
            dispatch({
              type: actionTypes.ERROR_MESSAGE,
              payload: error.response.data.short_name[0],
            });
          }
        } else {
          dispatch({
            type: actionTypes.ERROR_MESSAGE,
            payload: error.response.data.message,
          });
        }
      });
  };

export const editCustomers = (payload, locale, modal) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}updatecustomer`, payload)
    .then((response) => {
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Customer_updated_successfully,
      });
      dispatch(GetCustomers());
      dispatch(singleCustomer(payload.customer_id));
      modal.click();
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const deleteCustomer = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}deleteuser`, { id: payload.values })
    .then((response) => {
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Record_deleted_successfully,
      });
      dispatch(customerSearch({ values: payload.prevValues }));
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const customerSearch = (payload) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}customersearch`, payload.values)
    .then((res) => {
      dispatch(setCustomer(actionTypes.SET_SEARCH_CUSTOMER, res.data.data));

      dispatch(GetCustomers());
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const recoverCustomer = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}recoveruser`, { id: payload.values })
    .then((response) => {
      dispatch(customerSearch({ values: payload.prevValues }));

      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Record_recovered_successfully,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const setInactive = (payload, locale) => (dispatch) => {
  ajaxCall
    .post(`${config.BASE_URL}setinactive/${payload}`)
    .then((response) => {
      dispatch({
        type: actionTypes.SUCCESS_MESSAGE,
        payload: locale.Record_updated_successfully,
      });
      dispatch(GetCustomers());
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: error.response.data.message,
      });
    });
};

export const singleCustomer = (payload) => (dispatch) => {
  dispatch({ type: actionTypes.SET_PENDING });
  ajaxCall
    .get(`${config.BASE_URL}customer/${payload}`)
    .then((res) => {
      dispatch({ type: actionTypes.VIEW_CUSTOMER, payload: res.data.data[0] });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: err.response.data.message,
      });
    });
};

export const getSingleCustomerPermission = (payload) => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}getcustomerpermission/${payload}`)
    .then((res) => {
      dispatch({
        type: actionTypes.GET_CUSTOMERPERMISSIONS,
        payload: res.data.data[0].permission,
      });

      dispatch({
        type: actionTypes.GET_USERSLIST,
        payload: res.data.data[0].users,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: err.response.data.message,
      });
    });
};

export const getFinalPermission = (payload) => (dispatch) => {
  ajaxCall
    .get(`${config.BASE_URL}getcustomerpermission/${payload}`)
    .then((res) => {
      dispatch({
        type: actionTypes.GET_CUSTOMERPERMISSIONS,
        payload: res.data.data[0].permission,
      });
    })
    .catch((err) => {
      dispatch({
        type: actionTypes.ERROR_MESSAGE,
        payload: err.response.data.message,
      });
    });
};

export const checkShortName = (payload) => (dispatch) => {
  if (payload.length != 0) {
    ajaxCall
      .get(`${config.BASE_URL}checkshortname/${payload}`)
      .then((res) => {
        dispatch({
          type: actionTypes.CHECK_SHORT_NAME,
          payload: res.data.status,
        });
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.CHECK_SHORT_NAME,
          payload: 0,
        });
        dispatch({
          type: actionTypes.ERROR_MESSAGE,
          payload: err.response.data.message,
        });
      });
  } else {
    dispatch({
      type: actionTypes.CHECK_SHORT_NAME,
      payload: "",
    });
  }
};
