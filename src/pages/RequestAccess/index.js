import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { registrationTrial } from "../../actions/customerAction";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ButtonLoader from "../Customloader/ButtonLoader";
import LoginHeaderContainer from "../Header/LoginHeaderContainer";
import Footer from "../Footer";
function RequestAccess(props) {
  const locale = props.locale;
  const dispatch = useDispatch();
  const [error, setError] = useState({});

  const [pendingbtn, setpendingbtn] = useState(false);
  const message = useSelector((state) => state.toasterReducer);
  useEffect(() => {
    setpendingbtn(false);
  }, [message]);

  const date = new Date();

  const date1 = new Date(
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
  );
  const end_date = new Date(date1.getTime() + 14 * 3600 * 1000 * 24);
  const currentMonth = date1.getMonth() + 1;
  const currentYear = date1.getFullYear();
  const endMonth = end_date.getMonth() + 1;
  const end_date_customer =
    end_date.getFullYear() + "-" + endMonth + "-" + end_date.getDate();

  return (
    <>
      <LoginHeaderContainer />
      <section className="login-main request-access">
        <div className="login-main-wrapper">
          <div className="column register-column">
            <div className="c-card  after-layer before-layer">
              <div className="c-card-wrap">
                <div className="form-header text-center">
                  <h1>{locale.Request_access}</h1>
                  <p>{locale.Request_access_para}</p>
                </div>
                <div className="login-form">
                  <Formik
                    initialValues={{
                      kvk: "",
                      type: "",
                      searchable_expire: end_date_customer + " 00:00:00",
                      name: "",
                      short_name: "",
                      discount: "",
                      firstname: "",
                      lastname: "",
                      // password: "",
                      address: "",
                      zipcode: "",
                      residence: "",
                      country: "",
                      email: "",
                      email_billing: "",
                      phone: "",
                      mobile: "",
                      start: "",
                      end: "",
                    }}
                    validate={(values) => {
                      const errors = {};
                      if (
                        !values.email ||
                        (values.email &&
                          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                            values.email
                          ))
                      ) {
                        errors.email = locale.Email_invalid;
                      }

                      if (
                        !values.firstname ||
                        (values.firstname && values.firstname.length < 3)
                      ) {
                        errors.firstname = locale.First_name_is_required;
                      }

                      if (
                        !values.lastname ||
                        (values.lastname && values.lastname.length < 3)
                      ) {
                        errors.lastname = locale.Last_name_is_required;
                      }

                      if (
                        !values.name ||
                        (values.name && values.name.length < 3)
                      ) {
                        errors.name = locale.Business_name_is_required;
                      }

                      if (!values.type) {
                        errors.type = locale.Select_a_type;
                      }

                      setError({ ...errors });

                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      setpendingbtn(true);
                      values.firstname =
                        values.firstname.charAt(0).toUpperCase() +
                        values.firstname.slice(1);
                      values.lastname =
                        values.lastname.charAt(0).toUpperCase() +
                        values.lastname.slice(1);
                      values.short_name = values.name;
                      values.trial_period = true;
                      values.start =
                        date1.getFullYear() +
                        "-" +
                        currentMonth +
                        "-" +
                        date1.getDate();
                      values.end = end_date_customer;

                      dispatch(
                        registrationTrial(
                          values,
                          resetForm,
                          "trial_customer",
                          locale
                        )
                      );
                      // resetForm();
                      // elementRef.current.click();
                      setSubmitting(false);
                    }}
                  >
                    {({
                      values,
                      isSubmitting,
                      dirty,
                      handleReset,
                      touched,
                    }) => (
                      <Form action="" id="newcustomer">
                        <div className="">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group mb-4">
                                <label>
                                  {locale.First_name}
                                  <span className="error">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="firstname"
                                  className={`form-control ${
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
                                <label>
                                  {locale.Last_name}
                                  <span className="error">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="lastname"
                                  className={`form-control ${
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
                            <div className="col-md-6">
                              <div className="form-group mb-4">
                                <label>
                                  {locale.Email}
                                  <span className="error">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="email"
                                  className={`form-control ${
                                    touched.email && error.email
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  className="error"
                                  name="email"
                                  component="span"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group mb-4">
                                <label>
                                  {locale.Type}
                                  <span className="error">*</span>
                                </label>
                                <Field
                                  as="select"
                                  name="type"
                                  className={`form-control ${
                                    touched.type && error.type
                                      ? "input-error"
                                      : ""
                                  }`}
                                >
                                  <option value="">
                                    {locale.Type + " " + locale.Customer}
                                  </option>
                                  <option value="Business">Business</option>
                                  <option value="Personal">Personal</option>
                                  <option value="BV">BV</option>
                                  <option value="NV">NV</option>
                                </Field>
                                <ErrorMessage
                                  className="error"
                                  name="type"
                                  component="span"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>
                                  {locale.Business_Name}
                                  <span className="error">*</span>
                                </label>
                                <Field
                                  type="text"
                                  name="name"
                                  className={`form-control ${
                                    touched.name && error.name
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  className="error"
                                  name="name"
                                  component="span"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{locale.Phone}</label>
                                <Field
                                  type="text"
                                  name="phone"
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 text-center mt-4">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="btn btn-primary w-100"
                            >
                              {pendingbtn ? <ButtonLoader /> : locale.Register}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                
                <div className="form-group text-center">
                  {/* <Link className="decoration" to="signin">{locale.Sign_in}</Link> */}
                  <p className="text-center inline-link">
                  {locale.Have_an_account}{" "}
                    <Link className="btn btn-inline" to="/signin">
                    {locale.Sign_in}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="6"
                        height="10"
                        viewBox="0 0 6 10"
                        fill="none"
                      >
                        <path
                          d="M1 0.722107L5 4.72211L1 8.72211"
                          stroke="#3079ff"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </Link>
                  </p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer locale={locale} />
    </>
  );
}

export default RequestAccess;
