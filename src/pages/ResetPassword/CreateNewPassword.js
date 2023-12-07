import React, { useState } from "react";
import Footer from "../Footer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ResetPassword } from "../../actions/auth";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Languages from "../Header/Languages";
import { useEffect } from "react";
import ButtonLoader from "../Customloader/ButtonLoader";
import LoginHeaderContainer from "../Header/LoginHeaderContainer";
function CreateNewPassword(props) {
  const message = useSelector((state) => state.toasterReducer);
  const locale = props.locale;
  const [error, setError] = useState({});
  const [btnPending, setBtnPending] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    setBtnPending(false);
  }, [message]);
  return (
    <>
      <LoginHeaderContainer />
      <section className="login-main">
        <div className="column after-layer before-layer">
          <div className="c-card">
            <div className="c-card-wrap">
              <div className="form-header text-center">
                <h1>{locale.Reset_Password}</h1>
              </div>
              <div className="login-form">
                <Formik
                  initialValues={{ password: "", password_confirmation: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.password) {
                      errors.password = locale.Enter_your_password;
                    } else if (
                      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i.test(
                        values.password
                      )
                    ) {
                      errors.password = locale.Password_strength_text;
                    }
                    if (!values.password_confirmation) {
                      errors.password_confirmation =
                        locale.Enter_confirm_password;
                    }
                    if (
                      values.password &&
                      values.password_confirmation &&
                      values.password != values.password_confirmation
                    ) {
                      errors.password_confirmation =
                        locale.Password_does_not_match;
                      // errors.password = "Password does not match ";
                    }
                    setError({ ...errors });
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    values.token = params.token;
                    setBtnPending(true);
                    dispatch(ResetPassword(values));
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting, dirty, handleReset, touched }) => (
                    <Form action="" id="loginForm">
                      <div className="form-group mb-3">
                        <label>{locale.Password}</label>
                        <Field
                          type="password"
                          name="password"
                          className={`form-control icon icon-lock ${
                            touched.password && error.password
                              ? "input-error"
                              : ""
                          }`}
                          placeholder={locale.Enter_your_password}
                        />
                        <ErrorMessage
                          className="error"
                          name="password"
                          component="span"
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label>{locale.Confirm_password}</label>
                        <Field
                          type="password"
                          name="password_confirmation"
                          className={`form-control icon icon-lock ${
                            touched.password_confirmation &&
                            error.password_confirmation
                              ? "input-error"
                              : ""
                          }`}
                          placeholder={locale.Enter_your_password}
                        />
                        <ErrorMessage
                          className="error"
                          name="password_confirmation"
                          component="span"
                        />
                      </div>
                      <div className="form-group mt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary w-100"
                        >
                          {" "}
                          {btnPending ? <ButtonLoader /> : locale.Submit}
                          {}
                        </button>
                      </div>
                      <div className="form-group">
                        <p className="text-center">
                          {locale.Back_to}{" "}
                          <Link className="btn btn-inline" to="/">
                            {locale.Login}
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
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer locale={locale} />
    </>
  );
}

export default CreateNewPassword;
