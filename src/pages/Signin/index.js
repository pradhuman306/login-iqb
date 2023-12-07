import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import * as Cokkie from "../../common/Cookies";

import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { GetStyleByCustomer } from "../../actions/customerAction";
import CustomLoader from "../Customloader";
import {
  REMOVE_STYLE_PENDING,
  SET_STYLE_PENDING,
} from "../../constants/actionTypes";
import ButtonLoader from "../Customloader/ButtonLoader";
import Languages from "../Header/Languages";
import LoginHeaderContainer from "../Header/LoginHeaderContainer";
const Signin = (props) => {
  const locale = props.locale;
  const message = useSelector((state) => state.toasterReducer);
  let path = useLocation().pathname;
  let newPath = path.replaceAll("/", "");

  localStorage.setItem("logged_in_route", btoa(path));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const email = Cokkie.getCookie("email") ? Cokkie.getCookie("email") : "";
  const password = Cokkie.getCookie("password")
    ? Cokkie.getCookie("password")
    : "";
  const remember =
    Cokkie.getCookie("email") && Cokkie.getCookie("password") ? true : false;

  const { executeRecaptcha } = useGoogleReCaptcha();
  const auth = useSelector((state) => state.authReducer);
  let style = useSelector((state) => state.styleReducer).style || null;
  let pending = useSelector((state) => state.styleReducer).pending;
  const [pendingLogin, setPendingLogin] = useState(false);
  if (newPath === "signin") {
    style = null;
    pending = false;
    document.documentElement.style.removeProperty("--baseFont");
    document.documentElement.style.removeProperty("--baseFontsize");
    document.documentElement.style.removeProperty("--themeColor");
    document.documentElement.style.removeProperty("--acentColor");
    const link = document.createElement("link");
    link.href = "/assets/images/logo.svg";
    link.rel = "shortcut icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  const [isVerified, setVerified] = useState(false);
  const [error, setError] = useState({});
  const [signInPending, setsignInPending] = useState(false);

  useEffect(() => {
    // setTimeout(() => {
    //   setsignInPending(false);
    // }, 1000);
  }, []);

  const onChange = (value) => {
    if (value) {
      setVerified(true);
    }
  };

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }
    const token = await executeRecaptcha("yourAction");
  }, []);

  useEffect(() => {
    setPendingLogin(false);
  }, [message]);

  useEffect(() => {
    if (!isVerified) {
      handleReCaptchaVerify();
    }
  }, [handleReCaptchaVerify]);
  useEffect(() => {
    if (params && params.customer) {
      dispatch({ type: SET_STYLE_PENDING });
      dispatch(GetStyleByCustomer(params.customer));
    }
  }, []);
  const buttonStyle =
    style && style.iqbstyle
      ? {
          background: style.iqbstyle.secondary_color,
          color: style.iqbstyle.primary_color,
          borderColor: style.iqbstyle.secondary_color,
        }
      : {};
  const fontFamilylink = document.createElement("link");
  if (style && style.iqbstyle) {
    document.documentElement.style.setProperty(
      "--baseFont",
      style.iqbstyle.font_family
    );
    fontFamilylink.href =
      "https://fonts.googleapis.com/css2?family=" +
      style.iqbstyle.font_family.replaceAll(" ", "+") +
      ":wght@400;500;600;700&display=swap";
  } else {
    fontFamilylink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
  }
  fontFamilylink.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(fontFamilylink);

  return (
    <>
      <LoginHeaderContainer />
      <section className="login-main">
        {!signInPending ? (
          <div className="column">
            <div className="c-card  after-layer before-layer">
              <div className="c-card-wrap">
                <div className="form-header text-center">
                  <h1>{locale.Login}</h1>
                  <p>{locale.LoginPara}</p>
                </div>
                <div className="login-form">
                  <Formik
                    initialValues={{
                      email: email,
                      password: password,
                      rememberme: remember,
                    }}
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
                      if (!values.password) {
                        errors.password = locale.Please_enter_password;
                      }
                      setError({ ...errors });
                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      setPendingLogin(true);
                      dispatch(login(values));
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting, dirty, handleReset, touched }) => (
                      <Form action="" id="loginForm">
                        <div className="form-group mb-3">
                          <label>{locale.Email_address}</label>
                          <Field
                            type="text"
                            name="email"
                            className={`form-control ${
                              touched.email && error.email ? "input-error" : ""
                            }`}
                            placeholder={locale.Enter_your_email}
                          />
                          <ErrorMessage
                            className="error"
                            name="email"
                            component="span"
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label>{locale.Password}</label>
                          <Field
                            type="password"
                            name="password"
                            className={`form-control ${
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
                        <div className="form-group d-flex align-items-center justify-content-between mb-3">
                          <div className="form-check">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="rememberme"
                              id="flexCheckDefault"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
                            >
                              {locale.Remember_me}
                            </label>
                          </div>
                          <Link className="decoration" to="/reset-password">
                            {locale.Forgot_password}
                          </Link>
                        </div>
                        <div className="mb-3">
                          <GoogleReCaptchaProvider reCaptchaKey="6LcG418jAAAAADXWA49EzMg4nU8RQZ0kUJJTbQ2S">
                            <GoogleReCaptcha onVerify={onChange} />
                          </GoogleReCaptchaProvider>
                        </div>
                        <div className="form-group mt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            style={buttonStyle}
                            className="btn btn-primary w-100"
                          >
                            {pendingLogin ? <ButtonLoader /> : locale.Login}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                
                {/* <Languages /> */}
                <div className="form-group">
                  <p className="text-center inline-link">
                    {locale.Not_access_yet}
                    <Link className="btn btn-inline" to="/request-access">
                      {locale.Sign_up}
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
        ) : (
          <div className="main-loader">
            <CustomLoader />
          </div>
        )}
      </section>
      <Footer locale={locale} />
    </>
  );
};

export default Signin;
