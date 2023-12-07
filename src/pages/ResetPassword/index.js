import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ResetEmailSend } from "../../actions/auth";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import Languages from "../Header/Languages";
import ButtonLoader from "../Customloader/ButtonLoader";
import LoginHeaderContainer from "../Header/LoginHeaderContainer";
function ResetPassword(props) {
  const message = useSelector((state) => state.toasterReducer);
  const locale = props.locale;
  const nav = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerified, setVerified] = useState(false);
  const [error, setError] = useState({});
  const [btnPending, setBtnPending] = useState(false);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.langReducer).locale;
  const onChange = (value) => {
    if (value) {
      setVerified(true);
    }
  };
  useEffect(() => {
    setBtnPending(false);
  }, [message]);

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }
    const token = await executeRecaptcha("yourAction");
  }, []);

  useEffect(() => {
    if (!isVerified) {
      handleReCaptchaVerify();
    }
  }, [handleReCaptchaVerify]);

  return (
    <>
      <LoginHeaderContainer />
      <section className="login-main">
        <div className="column after-layer before-layer">
          <div className="c-card">
            <div className="c-card-wrap">
              <div className="form-header text-center">
                <h1>{locale.Reset_Password}</h1>
                <p>{locale.Reset_Password_Para}</p>
              </div>
              <div className="login-form">
                <Formik
                  initialValues={{ email: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.email) {
                      errors.email = locale.Please_enter_email_address;
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                      )
                    ) {
                      errors.email = locale.Invalid_email_address;
                    }
                    setError({ ...errors });
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    dispatch(ResetEmailSend(values, nav, language));
                    setBtnPending(true);
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting, dirty, handleReset }) => (
                    <Form action="" id="loginForm">
                      <div className="form-group mb-3">
                        <label>{locale.Email_address}</label>
                        <Field
                          type="text"
                          name="email"
                          className={`form-control ${
                            error.email ? "input-error" : ""
                          }`}
                          placeholder={locale.Enter_your_email}
                        />
                        <ErrorMessage
                          className="error"
                          name="email"
                          component="span"
                        />
                      </div>
                      <div className="mb-3">
                        <GoogleReCaptchaProvider reCaptchaKey="6Lc3PA0gAAAAAFYHbs-xTdR2Kfd72HhE_IPgvVEw">
                          <GoogleReCaptcha onVerify={onChange} />
                        </GoogleReCaptchaProvider>
                      </div>
                      <div className="form-group mt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting || !isVerified}
                          className="btn btn-primary w-100"
                        >
                          {btnPending ? <ButtonLoader /> : locale.Send}
                        </button>
                      </div>
                      <div className="form-group">
                        <p className="text-center inline-link">
                          {locale.Back_to}{" "}
                          <Link className="btn btn-inline" to="/signin">
                            {locale.Login}{" "}
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

export default ResetPassword;
