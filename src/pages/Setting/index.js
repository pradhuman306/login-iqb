import React, { useState, useContext } from "react";
import UserMenu from "../Header/UserMenu";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../../context/authContext";
import { UpdateProfile, UpdatePassword } from "../../actions/auth";
import Languages from "../Header/Languages";
import HeaderContainer from "../Header/HeaderContainer";
function Setting(props) {
  const auth = useContext(AuthContext);
  const locale = props.locale;

  const dispatch = useDispatch();
  const [error, setError] = useState({});

  var { firstname, lastname, phone, mobile, searchable_expire, email, id } =
    auth && auth.userdata ? auth.userdata : undefined;

  return (
    <>
      <div className="body-content">
        <div className="setting-form">
          <Formik
            initialValues={{
              email,
              firstname,
              lastname,
              phone,
              searchable_expire: searchable_expire
                ? new Date(searchable_expire).toISOString().substr(0, 16)
                : "",
            }}
            validate={(values) => {
              const errors = {};
              if (
                values.email &&
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = locale.Invalid_email_address;
              }

              if (values.firstname && values.firstname.length < 3) {
                errors.firstname =
                  locale.Please_enter + " " + locale.valid_first_name;
              }

              if (values.lastname && values.lastname.length < 3) {
                errors.lastname =
                  locale.Please_enter + " " + locale.valid_last_name;
              }

              if (
                values.phone &&
                (values.phone > 9999999999 || values.phone < 1000000000)
              ) {
                errors.phone =
                  locale.Please_enter + " " + locale.valid_phone_number;
              }
              setError({ ...errors });
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              values.user_id = id;
              dispatch(UpdateProfile(values, locale));
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, dirty, handleReset, touched }) => (
              <Form action="" id="profile-form">
                <div className="row">
                  <div className="col-4">
                    <h2 className="mb-4">{locale.Basic_info}</h2>
                  </div>
                  <div className="col-8">
                    <div className="row">
                      <div className="col-md-6 col-sm-6">
                        <div className="form-group mb-3">
                          <label htmlFor="">{locale.First_name}</label>
                          <Field
                            type="text"
                            name="firstname"
                            className={`form-control icon ${
                              touched.firstname && error.firstname
                                ? "input-error"
                                : ""
                            }`}
                            placeholder={locale.Enter_your_name}
                          />
                          <ErrorMessage
                            className="error"
                            name="firstname"
                            component="span"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div className="form-group mb-3">
                          <label htmlFor="">{locale.Last_name}</label>
                          <Field
                            type="text"
                            className={`form-control icon ${
                              touched.lastname && error.lastname
                                ? "input-error"
                                : ""
                            }`}
                            placeholder={locale.Enter_your_lastname}
                            name="lastname"
                          />
                          <ErrorMessage
                            className="error"
                            name="lastname"
                            component="span"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div className="form-group mb-3">
                          <label htmlFor="">{locale.Phone_No}</label>
                          <Field
                            type="number"
                            className={`form-control icon ${
                              touched.phone && error.phone ? "input-error" : ""
                            }`}
                            placeholder={locale.Enter_your_number}
                            name="phone"
                          />
                          <ErrorMessage
                            className="error"
                            name="phone"
                            component="span"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div className="form-group mb-3">
                          <label htmlFor="">{locale.Email_address}</label>
                          <Field
                            type="email"
                            className={`form-control icon ${
                              touched.email && error.email ? "input-error" : ""
                            }`}
                            placeholder={locale.Enter_your_email}
                            name="email"
                          />
                          <ErrorMessage
                            className="error"
                            name="email"
                            component="span"
                          />
                        </div>
                      </div>
                      {props.auth.role != "super_admin" ? (
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group mb-3">
                        <label htmlFor="">
                          {locale.Customer + " " + locale.Name}
                        </label>
                        <input
                          type="text"
                          className="form-control disabled"
                          value={firstname + " " + lastname}
                          placeholder=""
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group mb-3">
                        <label htmlFor="">
                          {locale.Searchable + "(" + locale.Date_time + ")"}{" "}
                        </label>
                        <div className="input-group date" id="datepicker">
                          <Field
                            type="datetime-local"
                            className="form-control"
                            name="searchable_expire"
                          />
                          {/* <span className="input-group-addon input-group-text">
                            <img
                              src="/assets/images/icon-calendar.svg"
                              alt=""
                            />
                          </span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                      <div className="col-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {locale.Update}
                    </button>
                  </div>
                    </div>
                  </div>
                 
                </div>
             
              </Form>
            )}
          </Formik>

          <Formik
            initialValues={{
              current_password: undefined,
              new_password: undefined,
              confirm_password: undefined,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.current_password) {
                errors.current_password =
                  locale.Enter + " " + locale.Current_password;
              }
              if (!values.new_password) {
                errors.new_password = locale.Enter + " " + locale.New_password;
              } else if (
                !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i.test(
                  values.new_password
                )
              ) {
                errors.new_password = locale.Password_strength_text;
              }
              if (
                values.new_password &&
                values.confirm_password &&
                values.new_password != values.confirm_password
              ) {
                errors.confirm_password = locale.Password_does_not_match;
                // errors.password = "Password does not match ";
              }
              setError({ ...errors });
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              values.user_id = id;
              dispatch(UpdatePassword(values, locale));
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, dirty, handleReset, touched }) => (
              <Form class="mt-4">
                
                <div className="row">
                  <div className="col-4">
                    <h2 className="mb-4">{locale.Change_password}</h2>
                  </div>
                  <div className="col-8">
                  <div className="row">
                  <div className="col-md-6 col-sm-6">
                    <div className="form-group mb-3">
                      <label htmlFor="">{locale.Current_password}</label>
                      <Field
                        type="password"
                        className={`form-control icon icon-lock ${
                          touched.current_password && error.current_password
                            ? "input-error"
                            : ""
                        }`}
                        placeholder={
                          locale.Enter + " " + locale.Current_password
                        }
                        name="current_password"
                      />
                      <ErrorMessage
                        className="error"
                        name="current_password"
                        component="span"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6">
                    <div className="form-group mb-3">
                      <label htmlFor="">{locale.New_password}</label>
                      <Field
                        type="password"
                        className={`form-control icon icon-lock ${
                          touched.new_password && error.new_password
                            ? "input-error"
                            : ""
                        }`}
                        placeholder={locale.Enter + " " + locale.New_password}
                        name="new_password"
                      />
                      <ErrorMessage
                        className="error"
                        name="new_password"
                        component="span"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6">
                    <div className="form-group mb-3">
                      <label htmlFor="">{locale.Confirm_new_password}</label>
                      <Field
                        type="password"
                        className={`form-control icon icon-lock ${
                          touched.confirm_password && error.confirm_password
                            ? "input-error"
                            : ""
                        }`}
                        placeholder={
                          locale.Enter + " " + locale.Confirm_new_password
                        }
                        name="confirm_password"
                      />
                      <ErrorMessage
                        className="error"
                        name="confirm_password"
                        component="span"
                      />
                    </div>
                  </div>
                  <div className="col-6"></div>
                  <div className="col-6">
                  <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {locale.Update}
                    </button>
                    </div>
                </div>
                  </div>
                </div>
             
               
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Setting;
