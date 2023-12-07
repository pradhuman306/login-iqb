import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ResetEmailSend } from "../../actions/auth";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import Languages from "../Header/Languages";
import LoginHeaderContainer from "../Header/LoginHeaderContainer";
function Resetlink(props) {
  const locale = props.locale;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerified, setVerified] = useState(false);
  const [error, setError] = useState({});
  const dispatch = useDispatch();

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
                <img src="/assets/images/right.png" className="right-image" />
                <h2>{locale.Reset_link_sent_successfully}</h2>
                <div className="mt-2">
                <p className="text-center">{locale.Reset_content}</p>
                <div className="form-group">
                  <p className="text-center inline-link">
                  {locale.Go_to}
                    <Link className="btn btn-inline" to="/signin">
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

export default Resetlink;
