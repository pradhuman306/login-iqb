import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmailTemplate,
  updateEmailTemplate,
} from "../../actions/questioerAction";
import CustomLoader from "../Customloader";
import ButtonLoader from "../Customloader/ButtonLoader";
const ResetEmail = (props) => {
  const message = useSelector((state) => state.toasterReducer);
  const locale = props.locale;
  const [error, setError] = useState({});

  const dispatch = useDispatch();
  const language = useSelector((state) => state.langReducer).locale;
  const emailTemplateData = useSelector(
    (state) => state.emailTemplateReducer
  ).emailTemplate;

  const [pendingBtn, setPendingBtn] = useState(false);
  const [templateObj, setTemplateObj] = useState({
    body: "",
    subject: "",
    id: "",
  });

  useEffect(() => {
    setPendingBtn(false);
  }, [message]);

  useEffect(() => {
    if (Object.keys(emailTemplateData).length !== 0) {
      console.log(emailTemplateData);
      console.log(emailTemplateData[language]);
      if (emailTemplateData[language] !== null) {
        console.log(emailTemplateData[language]);
        let body = emailTemplateData[language].body;
        let subject = emailTemplateData[language].subject;
        let id = emailTemplateData[language].id;
        templateObj.body = body;
        templateObj.subject = subject;
        templateObj.id = id;
        setTemplateObj({ ...templateObj });
      }
    }
  }, [emailTemplateData, language]);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={templateObj}
        validate={(values) => {
          const errors = {};
          if (!values.subject) {
            errors.subject = locale.Subject_required;
          }

          if (!values.body) {
            errors.body = locale.Message_body_required;
          }

          setError({ ...errors });

          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // resetForm();
          // elementRef.current.click();
          values.language = language;
          setPendingBtn(true);
          dispatch(updateEmailTemplate(values, locale));
          setSubmitting(false);
        }}
      >
        {({ values, isSubmitting, dirty, handleReset, touched }) => (
          <div className="">
        
       
                <div className="row">
                  <div className="col-12">
                    <h2 className="mb-3">{locale.Email_template}</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Form action="" id="">
                      <div className="card style-card">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group mb-4">
                              <label>
                                Email {locale.Subject}{" "}
                                <span className="error">*</span>
                              </label>
                              <Field
                                type="text"
                                name="subject"
                                className={`form-control ${
                                  touched.subject && error.subject
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                              <ErrorMessage
                                className="error"
                                name="subject"
                                component="span"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group mb-4">
                              <label>
                                Email {locale.Message_Body}{" "}
                                <span className="error">*</span>
                              </label>
                              <Field
                                as="textarea"
                                name="body"
                                className={`form-control ${
                                  touched.body && error.body
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                              <ErrorMessage
                                className="error"
                                name="body"
                                component="span"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <input type="hidden" name="id" />
                          </div>
                        </div>
                        <div className="">
                          <div className="row">
                            <div className="col-md-12 mt-4">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                              >
                                {pendingBtn ? <ButtonLoader /> : locale.Update}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
          
           
          
          
          </div>
        )}
      </Formik>
    </>
  );
};

export default ResetEmail;
