import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AddCustomers, checkShortName } from "../../actions/customerAction";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoader from "../Customloader/ButtonLoader";
function AddNewCustomer(props) {
  const locale = props.locale;
  const elementRef = useRef();
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [shortName, setShortname] = useState("");
  const handleChange = (e) => {
    dispatch(checkShortName(e));
    setShortname(e);
    // if (e.length == 0) {
    //   setError({ ...error, short_name: "This field is required" });
    // }
  };
  const [btnPending, setBtnPending] = useState(false);
  const message = useSelector((state) => state.toasterReducer);
  useEffect(() => {
    setBtnPending(false);
  }, [message]);
  const checkShortname = useSelector(
    (state) => state.customerReducer
  ).checkshortname;

  useEffect(() => {
    if (checkShortname.length != 0 && checkShortname == 0) {
      let errors = error;
      errors.short_name = locale.Please_enter_valid_short_name;
      setError({ ...errors });
    }
  }, [checkShortname]);

  const date = new Date();

  const date1 = new Date(
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
  );
  const end_date = new Date(date1.getTime() + 14 * 3600 * 1000 * 24);
  const currentMonth = date1.getMonth() + 1;
  const currentYear = date1.getFullYear();
  const endMonth = end_date.getMonth() + 1;

  return (
    <div className="body-content">
      <div className="usermanagement-main">
        <div
          className="modal right fade"
          id="addcustomer"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content right-modal">
              <div className="modal-head">
                <h4>{locale.Add_new_customer}</h4>
                <a
                  onClick={(e) => e.preventDefault()}
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={elementRef}
                >
                  <img src="/assets/images/icon-close.svg" alt="" />
                </a>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={{
                    kvk: "",
                    type: "",
                    searchable_expire: "",
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

                    // if (!values.start) {
                    //   errors.start = locale.Start_date_is_required;
                    // }
                    // if (!values.end) {
                    //   errors.end = locale.End_date_is_required;
                    // }

                    if (
                      !values.lastname ||
                      (values.lastname && values.lastname.length < 3)
                    ) {
                      errors.lastname = locale.Last_name_is_required;
                    }

                    // if (
                    //   !values.phone ||
                    //   isNaN(values.phone) == true
                    //   // (values.phone )
                    //   //  &&
                    //   // (values.phone > 9999999999 || values.phone < 1000000000))
                    //   // isNaN(values.phone) == true
                    // ) {
                    //   errors.phone = "Please enter phone number";
                    // }
                    // if (
                    //   !values.mobile ||
                    //   isNaN(values.mobile) == true
                    //   // (values.mobile )
                    //   // &&
                    //   //   (values.mobile > 9999999999 ||
                    //   //     values.mobile < 1000000000)) ||
                    //   // isNaN(values.mobile) == true
                    // ) {
                    //   errors.mobile = "Please enter mobile number";
                    // }
                    if (
                      !values.name ||
                      (values.name && values.name.length < 3)
                    ) {
                      errors.name = locale.Business_name_is_required;
                    }
                    // if (checkShortname == 0) {
                    //   errors.short_name = "Short name has already been used";
                    // }

                    if (
                      !values.address ||
                      (values.address && values.address.length < 3)
                    ) {
                      errors.address = locale.Address_is_required;
                    }
                    if (
                      !values.residence ||
                      (values.residence && values.residence.length < 3)
                    ) {
                      errors.residence = locale.Residence_address_is_required;
                    }
                    if (
                      !values.country ||
                      (values.country && values.country.length < 3)
                    ) {
                      errors.country = locale.Please_enter_a_valid_country_name;
                    }

                    if (
                      !values.kvk ||
                      (values.kvk &&
                        (values.kvk > 99999999 || values.kvk < 10000000)) ||
                      isNaN(values.kvk) == true
                    ) {
                      errors.kvk = locale.Please_enter_a_valid_kvk;
                    }
                    // if (!values.email_billing ||
                    //   values.email_billing &&
                    //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                    //     values.email_billing
                    //   )
                    // ) {
                    //   errors.email_billing = "Invalid email address";
                    // }
                    // if (!values.discount || values.discount && isNaN(values.discount) == true) {
                    //   errors.discount = "Please enter a Discount Rate";
                    // }
                    if (!values.type) {
                      errors.type = locale.Select_a_type;
                    }
                    // if (!values.password ||
                    //   values.password &&
                    //   !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/i.test(
                    //     values.password
                    //   )
                    // ) {
                    //   errors.password =
                    //     "The password should be min 8 and max 20 characters. It should have atleast a smallcase, uppercase, number and special character without white spaces";
                    // }
                    setError({ ...errors });

                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    setBtnPending(true);
                    values.firstname =
                      values.firstname.charAt(0).toUpperCase() +
                      values.firstname.slice(1);
                    values.lastname =
                      values.lastname.charAt(0).toUpperCase() +
                      values.lastname.slice(1);
                    values.short_name = shortName;

                    dispatch(
                      AddCustomers(
                        values,
                        resetForm,
                        elementRef.current,
                        locale
                      )
                    );

                    // resetForm();
                    // elementRef.current.click();

                    setSubmitting(false);
                  }}
                >
                  {({ values, isSubmitting, dirty, handleReset, touched }) => (
                    <Form action="" id="newcustomer">
                      <div className="form-fields-wrap">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>
                                KVK<span className="error">*</span>
                              </label>
                              <Field
                                type="number"
                                name="kvk"
                                placeholder=""
                                className={`form-control ${
                                  touched.kvk && error.kvk ? "input-error" : ""
                                }`}
                              />
                              <ErrorMessage
                                className="error"
                                name="kvk"
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
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>
                                {locale.First_name}{" "}
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
                                {locale.Searchable + " " + locale.Expire}
                              </label>{" "}
                              <div
                                className="input-group date"
                                id="datepicker1"
                              >
                                <Field
                                  type="date"
                                  className={`form-control ${
                                    touched.searchable_expire &&
                                    error.searchable_expire
                                      ? "input-error"
                                      : ""
                                  }`}
                                  name="searchable_expire"
                                />

                                {/* <span className="input-group-addon input-group-text">
                            <img
                              src="/assets/images/icon-calendar.svg"
                              alt=""
                            />
                          </span> */}
                              </div>
                              <ErrorMessage
                                className="error"
                                name="searchable_expire"
                                component="span"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>{locale.Mobile}</label>
                              <Field
                                type="text"
                                name="mobile"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>
                                {locale.Business_Name}{" "}
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
                                onBlur={(e) => {
                                  handleChange(
                                    !values.short_name
                                      ? values.name
                                          .replaceAll(" ", "_")
                                          .toLowerCase()
                                      : values.short_name
                                          .replaceAll(" ", "_")
                                          .toLowerCase()
                                  );
                                }}
                              />

                              <ErrorMessage
                                className="error"
                                name="name"
                                component="span"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>{locale.Short_Name}</label>
                              <Field
                                type="text"
                                name="short_name"
                                value={
                                  !values.short_name
                                    ? values.name
                                        .replaceAll(" ", "_")
                                        .toLowerCase()
                                    : values.short_name
                                        .replaceAll(" ", "_")
                                        .toLowerCase()
                                }
                                onBlur={() => {
                                  handleChange(
                                    !values.short_name
                                      ? values.name
                                          .replaceAll(" ", "_")
                                          .toLowerCase()
                                      : values.short_name
                                          .replaceAll(" ", "_")
                                          .toLowerCase()
                                  );
                                }}
                                className={`form-control ${
                                  touched.short_name && error.short_name
                                    ? "input-error"
                                    : ""
                                }`}
                              />

                              {checkShortname == 1 && checkShortname != "" ? (
                                <span className="success">
                                  {locale.Short_name_is_available}
                                </span>
                              ) : (
                                ""
                              )}
                              {checkShortname == 0 &&
                              checkShortname.length != 0 ? (
                                <span className="error">
                                  {locale.Short_name_has_already_been_used}
                                </span>
                              ) : (
                                ""
                              )}
                              <ErrorMessage
                                className="error"
                                name="short_name"
                                component="span"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>
                                {locale.Address}{" "}
                                <span className="error">*</span>
                              </label>
                              <Field
                                type="text"
                                name="address"
                                className={`form-control ${
                                  touched.address && error.address
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                              <ErrorMessage
                                className="error"
                                name="address"
                                component="span"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>{locale.Zip_Code}</label>
                              <Field
                                type="text"
                                name="zipcode"
                                className={`form-control ${
                                  touched.zipcode && error.zipcode
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>
                                {locale.Residance}{" "}
                                <span className="error">*</span>
                              </label>
                              <Field
                                type="text"
                                name="residence"
                                className={`form-control ${
                                  touched.residence && error.residence
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                              <ErrorMessage
                                className="error"
                                name="residence"
                                component="span"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>
                                {locale.Country}{" "}
                                <span className="error">*</span>
                              </label>
                              <Field
                                type="text"
                                name="country"
                                className={`form-control ${
                                  touched.country && error.country
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                              <ErrorMessage
                                className="error"
                                name="country"
                                component="span"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>
                                {locale.Email} <span className="error">*</span>
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
                              <label>{locale.Billing_Email}</label>
                              <Field
                                type="text"
                                name="email_billing"
                                className={`form-control ${
                                  touched.email_billing && error.email_billing
                                    ? "input-error"
                                    : ""
                                }`}
                              />
                              <ErrorMessage
                                className="error"
                                name="email_billing"
                                component="span"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>{locale.Phone}</label>
                              <Field
                                type="text"
                                name="phone"
                                className="form-control"
                              />
                              {/* <ErrorMessage
                            className="error"
                            name="phone"
                            component="span"
                          /> */}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>{locale.Discount}</label>
                              <Field
                                type="number"
                                name="discount"
                                className="form-control"
                              />
                              {/* <ErrorMessage
                            className="error"
                            name="discount"
                            component="span"
                          /> */}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>{locale.Start_date}</label>{" "}
                              <span className="error">*</span>
                              <div
                                className="input-group date"
                                id="datepicker1"
                              >
                                <Field
                                  type="date"
                                  className={`form-control ${
                                    touched.start && error.start
                                      ? "input-error"
                                      : ""
                                  }`}
                                  name="start"
                                />

                                {/* <span className="input-group-addon input-group-text">
                            <img
                              src="/assets/images/icon-calendar.svg"
                              alt=""
                            />
                          </span> */}
                              </div>
                              <ErrorMessage
                                className="error"
                                name="start"
                                component="span"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group mb-4">
                              <label>{locale.End_date}</label>{" "}
                              <div
                                className="input-group date"
                                id="datepicker2"
                              >
                                <Field
                                  type="date"
                                  className={`form-control ${
                                    touched.end && error.end
                                      ? "input-error"
                                      : ""
                                  }`}
                                  name="end"
                                />

                                {/* <span className="input-group-addon input-group-text">
                            <img
                              src="/assets/images/icon-calendar.svg"
                              alt=""
                            />
                          </span> */}
                              </div>
                              <ErrorMessage
                                className="error"
                                name="end"
                                component="span"
                              />
                            </div>
                          </div>
                        </div>

                        {/* <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label>Password</label>
                        <Field
                          type="password"
                          name="password"
                          className={`form-control ${
                            touched.password && error.password
                              ? "input-error"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          className="error"
                          name="password"
                          component="span"
                        />
                      </div>
                    </div>
                  </div> */}
                      </div>
                      <div className="frm-btn-wrap">
                        <div className="row">
                          <div className="col-md-12 text-center mt-4">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="btn btn-primary m-auto"
                            >
                              {btnPending ? <ButtonLoader /> : locale.Add}
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
      </div>
    </div>
  );
}

export default AddNewCustomer;
