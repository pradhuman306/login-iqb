import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { editCustomers } from "../../actions/customerAction";
import { useDispatch, useSelector } from "react-redux";
import { totalDayLeftSubscription } from "../../actions/auth";
import ButtonLoader from "../Customloader/ButtonLoader";
function EditCustomers(props) {
  const locale = props.locale;
  const elementRef = useRef();
  const dispatch = useDispatch();
  const [customerData, setCustomer] = useState({ ...props.customer });
  const [total_days, settotal_days] = useState("");
  const [error, setError] = useState({});

  useEffect(() => {
    setCustomer({ ...props.customer });
    settotal_days(totalDayLeftSubscription({ ...props.customer }));
    console.log(props.customer);
    console.log(total_days);
    console.log(customerData.end);
  }, [props.id]);

  const [btnPending, setBtnPending] = useState(false);
  const message = useSelector((state) => state.toasterReducer);
  useEffect(() => {
    setBtnPending(false);
  }, [message]);
  const {
    kvk,
    type,
    firstname,
    lastname,
    searchable_expire,
    mobile,
    name,
    short_name,
    discount,
    address,
    zipcode,
    residence,
    country,
    email,
    email_billing,
    phone,
    start,
    end,
    activate,
  } = customerData;

  return (
    <div
      className="modal right fade"
      id="editcustomer"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content right-modal">
          <div className="modal-head">
            <h4>{locale.Edit + " " + locale.Customer} </h4>
            <a
              onClick={(e) => e.preventDefault()}
              ref={elementRef}
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img src="/assets/images/icon-close.svg" alt="" />
            </a>
          </div>
          {Object.keys(customerData).length != 0 ? (
            <div className="modal-body">
              <Formik
                enableReinitialize
                initialValues={{
                  kvk,
                  type,
                  firstname,
                  lastname,
                  searchable_expire: searchable_expire
                    ? new Date(searchable_expire).toISOString().substr(0, 10)
                    : "",
                  mobile,
                  name,
                  short_name,
                  address,
                  zipcode,
                  residence,
                  country,
                  email,
                  email_billing,
                  phone,
                  discount: discount !== null ? discount : "",
                  start: start ? start.split(" ")[0] : "",
                  end: end ? end.split(" ")[0] : "",
                  activate,
                }}
                validate={(values) => {
                  const errors = {};
                  console.log(end);
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

                  if (!values.start) {
                    errors.start = locale.Start_date_is_required;
                  }

                  if (
                    !values.lastname ||
                    (values.lastname && values.lastname.length < 3)
                  ) {
                    errors.lastname = locale.Last_name_is_required;
                  }

                  // if (
                  //   !values.phone ||
                  //   (values.phone &&
                  //     (values.phone > 9999999999 ||
                  //       values.phone < 1000000000)) ||
                  //   isNaN(values.phone) == true
                  // ) {
                  //   errors.phone = "Please enter valid phone number";
                  // }
                  // if (
                  //   !values.mobile ||
                  //   (values.mobile &&
                  //     (values.mobile > 9999999999 ||
                  //       values.mobile < 1000000000)) ||
                  //   isNaN(values.mobile) == true
                  // ) {
                  //   errors.mobile = "Please enter a valid mobile number";
                  // }
                  if (!values.name || (values.name && values.name.length < 3)) {
                    errors.name = locale.Business_name_is_required;
                  }
                  // if (
                  //   !values.short_name ||
                  //   (values.short_name && values.short_name.length < 3)
                  // ) {
                  //   errors.short_name = "Name is required";
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
                  // if (
                  //   !values.zipcode ||
                  //   (values.zipcode &&
                  //     (values.zipcode > 999999 || values.zipcode < 100000)) ||
                  //   isNaN(values.zipcode) == true
                  // ) {
                  //   errors.zipcode = "Please enter a valid zip code";
                  // }
                  if (!values.kvk || isNaN(values.kvk) == true) {
                    errors.kvk = locale.Please_enter_a_valid_kvk;
                  }
                  // if (
                  //   !values.email_billing ||
                  //   (values.email_billing &&
                  //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                  //       values.email_billing
                  //     ))
                  // ) {
                  //   errors.email_billing = "Invalid email address";
                  // }
                  // if (
                  //   !values.discount ||
                  //   (values.discount && isNaN(values.discount) == true)
                  // ) {
                  //   errors.discount = "Please enter correct discount rate";
                  // }
                  if (!values.type) {
                    errors.type = locale.Select_a_type;
                  }
                  setError({ ...errors });
                  console.log(error);
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setBtnPending(true);
                  values.firstname =
                    values.firstname.charAt(0).toUpperCase() +
                    values.firstname.slice(1);
                  values.lastname =
                    values.lastname.charAt(0).toUpperCase() +
                    values.lastname.slice(1);
                  values.customer_id = customerData.customer_id;
                  dispatch(editCustomers(values, locale, elementRef.current));

                  setSubmitting(false);
                }}
              >
                {({ values, isSubmitting, dirty, handleReset, touched }) => (
                  <Form action="">
                    <div className="form-fields-wrap">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="alert alert-danger">
                      {total_days > 0
                        ? customerData.trial_period
                          ? locale.Trial_will_expire +
                            " " +
                            total_days +
                            " days"
                          : locale.Subscription_will_expire +
                            " " +
                            total_days +
                            " days"
                        : customerData.trial_period
                        ? locale.Trial_expired
                        : locale.Subs_expired}
                        </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-4">
                            <label>
                              KVK <span className="error">*</span>
                            </label>
                            <Field
                              type="number"
                              name="kvk"
                              placeholder=""
                              className={`form-control  ${
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
                              {locale.Type} <span className="error">*</span>
                            </label>
                            <Field
                              as="select"
                              name="type"
                              className={`form-control ${
                                touched.type && error.type ? "input-error" : ""
                              }`}
                            >
                              <option value="">
                                {locale.Type + " " + locale.Customer}{" "}
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
                              {locale.Last_name}{" "}
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
                            </label>
                            <div className="input-group date" id="datepicker1">
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
                            {/* <ErrorMessage
                              className="error"
                              name="mobile"
                              component="span"
                            /> */}
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
                                touched.name && error.name ? "input-error" : ""
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
                          <div className="form-group mb-4">
                            <label>{locale.Short_Name}</label>
                            <Field
                              type="text"
                              name="short_name"
                              className="form-control"
                              // value={
                              //   values.short_name
                              //     ? values.name
                              //         .replaceAll(" ", "_")
                              //         .toLowerCase()
                              //     : values.short_name
                              //         .replaceAll(" ", "_")
                              //         .toLowerCase()
                              // }
                              readOnly
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mb-4">
                            <label>
                              {locale.Address} <span className="error">*</span>
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
                              className="form-control"
                            />
                            {/* <ErrorMessage
                              className="error"
                              name="zipcode"
                              component="span"
                            /> */}
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
                              {locale.Country} <span className="error">*</span>
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
                            <label>{locale.Billing_Email} </label>
                            <Field
                              type="text"
                              name="email_billing"
                              className="form-control"
                            />
                            {/* <ErrorMessage
                              className="error"
                              name="email_billing"
                              component="span"
                            /> */}
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
                              type="text"
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
                            <label>{locale.Start_date}</label>
                            <span className="error">*</span>
                            <div className="input-group date" id="datepicker1">
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
                        <img src="/assets/images/icon-calendar.svg" alt="" />
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
                            <label>{locale.End_date}</label>
                            <div className="input-group date" id="datepicker2">
                              <Field
                                type="date"
                                className={`form-control ${
                                  touched.end && error.end ? "input-error" : ""
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
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group mb-4">
                            <label htmlFor="switch">
                              {locale.Customer + " " + locale.Status}
                            </label>
                            <div className="toggle-switch">
                              <Field
                                type="checkbox"
                                className="form-control"
                                name="activate"
                                id="switch1"
                              />
                              {/* <input type="checkbox" name="" id="switch" /> */}
                              <label htmlFor="switch1">{locale.Toggle}</label>
                            </div>
                          </div>
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
                            {btnPending ? <ButtonLoader /> : "Update"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default EditCustomers;
