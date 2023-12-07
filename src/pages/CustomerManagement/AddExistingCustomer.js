import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCustomer,
  customerSearch,
  recoverCustomer,
} from "../../actions/customerAction";
import ButtonLoader from "../Customloader/ButtonLoader";
function AddExistingCustomer(props) {
  const locale = props.locale;
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const customerSearchList = useSelector(
    (state) => state.customerReducer
  ).searchList;

  const [prevValues, setPrevValues] = useState({});
  const [error, setError] = useState({});
  // let newUserId = [];
  // props.userList.map((item) => {
  //   newUserId.push(item.id);
  // });
  useEffect(() => {
    setPending(false);
  }, [customerSearchList]);
  return (
    <div
      className="modal right fade"
      id="addExistingCustomer"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content right-modal">
          <div className="modal-head">
            <h4>{locale.Add_Existing_Customer} </h4>

            <a
              onClick={(e) => e.preventDefault()}
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img src="/assets/images/icon-close.svg" alt="" />
            </a>
          </div>
          <div className="modal-body">
            <Formik
              enableReinitialize
              initialValues={{
                firstname: "",
                lastname: "",
                email: "",
              }}
              validate={(values) => {
                const errors = {};
                // if (!values.firstname && !values.lastname && !values.email) {
                //   errors.email = "Fill altleast one value.";
                //   errors.firstname = "Fill altleast one value.";
                //   errors.lastname = "Fill altleast one value.";
                // }
                setError({ ...errors });
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setPending(true);
                dispatch(
                  customerSearch({
                    values: values,
                  })
                );

                setPrevValues({ ...values });
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, dirty, handleReset, touched }) => (
                <Form action="">
                  <div className="form-fields-wrap">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-4">
                          <label>{locale.First_name} </label>
                          <Field
                            type="text"
                            name="firstname"
                            className={`form-control  ${
                              touched.firstname && error.firstname
                                ? "input-error"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            className="error"
                            name="firstname"
                            component="span"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-4">
                          <label>{locale.Last_name} </label>
                          <Field
                            type="text"
                            name="lastname"
                            className={`form-control  ${
                              touched.lastname && error.lastname
                                ? "input-error"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            className="error"
                            name="lastname"
                            component="span"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{locale.Email} </label>
                          <Field
                            type="text"
                            name="email"
                            className={`form-control  ${
                              touched.email && error.email ? "input-error" : ""
                            }`}
                          />
                          <ErrorMessage
                            className="error"
                            name="email"
                            component="span"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        {customerSearchList.length != 0 ? (
                          <div className="user-list">
                            <ul>
                              {customerSearchList &&
                                customerSearchList.map((customer) => (
                                  <li key={customer.id}>
                                    <div className="user-wrap">
                                      <h5 className="user-icon">
                                        {customer.firstname[0].toUpperCase()}
                                        {customer.lastname[0].toUpperCase()}
                                      </h5>
                                      <div className="user-detail">
                                        <h6>{`${customer.firstname} ${customer.lastname}`}</h6>
                                        <p>{customer.email}</p>
                                      </div>
                                    </div>
                                    <div className="">
                                      {customer.deleted ? (
                                        <button
                                          className="btn sml-btn btn-border"
                                          onClick={() => {
                                            dispatch(
                                              recoverCustomer(
                                                {
                                                  prevValues: prevValues,
                                                  values: customer.id,
                                                },
                                                locale
                                              )
                                            );
                                          }}
                                        >
                                          {locale.Add}
                                        </button>
                                      ) : (
                                        <button
                                          className="btn sml-btn btn-border text-danger"
                                          onClick={() => {
                                            dispatch(
                                              deleteCustomer(
                                                {
                                                  prevValues: prevValues,
                                                  values: customer.id,
                                                },
                                                locale
                                              )
                                            );

                                            //  dispatch(userSearch(prevValues));
                                          }}
                                        >
                                          {locale.Remove}
                                        </button>
                                      )}
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="frm-btn-wrap">
                    <div className="row">
                      <div className="col-md-12 text-center mt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary m-auto"
                        >
                          {pending ? <ButtonLoader /> : locale.Search}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddExistingCustomer;
