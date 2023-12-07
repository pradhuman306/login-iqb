import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import HeaderContainer from "../Header/HeaderContainer";
import { GetStyle, singleCustomer } from "../../actions/customerAction";
import CustomLoader from "../Customloader";
import CustomerStyle from "../CustomerStyle/CustomerStyle";
import EditCustomers from "./EditCustomer";
import { GetCustomerUsers } from "../../actions/userAction";
import UserManagement from "../UserManagement";
const ViewCustomer = (props) => {
  const locale = props.locale;
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;
  const customerState = useSelector((state) => state.viewCustomerReducer);
  const customer = customerState.customerData;
  const customerStyle = customerState.customerStyle;

  const pending = customerState.pending;
  // const pending = true;
  const [cid, setId] = useState("");

  useEffect(() => {
    dispatch(singleCustomer(id));
    dispatch(GetCustomerUsers(id));
    dispatch(GetStyle({ customer_id: id }));
  }, []);

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
  } = customer;

  return (
    <>
      <div className="body-content">
        {pending ? (
          <div className="loader-wrap">
            <CustomLoader />
          </div>
        ) : (
          <div className="customer-info-form-fields">
            <div className="row">
              <div className="col-md-12 mb-4">
                <div className="nav nav-tabs">
                  <a
                    className="active"
                    id="nav-customer-tab"
                    data-bs-toggle="tab"
                    href="#customer"
                    role="tab"
                    aria-controls="nav-customer"
                    aria-selected="true"
                  >
                    {locale.Basic_info}
                  </a>
                  <a
                    className=""
                    id="nav-style-tab"
                    data-bs-toggle="tab"
                    href="#style"
                    role="tab"
                    aria-controls="nav-style"
                    aria-selected="true"
                  >
                    {locale.Style}
                  </a>
                  <a
                    className=""
                    id="nav-user-tab"
                    data-bs-toggle="tab"
                    href="#user"
                    role="tab"
                    aria-controls="nav-user"
                    aria-selected="true"
                  >
                    {locale.User}
                  </a>
                </div>
              </div>
            </div>
            <div className="tab-content">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <div className="user-list q-user-list d-flex justify-content-between pt-4 pb-4">
                    <ul>
                      <li>
                        <div className="user-wrap">
                          <h5 className="user-icon">
                            {customer.firstname[0].toUpperCase() +
                              customer.lastname[0].toUpperCase()}
                          </h5>
                          <div className="user-detail">
                            <h6>
                              {customer.firstname + " " + customer.lastname}
                              {" ("}
                              <span>{customer.short_name}</span>
                              {")"}
                            </h6>
                            <p>{customer.email}</p>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <ul className="btn-group">
                      <li>
                        {" "}
                        <label
                          className={`status-label ${
                            customer.activate
                              ? "active-label"
                              : "inactive-label"
                          }`}
                        >
                          {customer.activate ? locale.Active : locale.Inactive}
                        </label>
                      </li>
                      <li className="ms-3">
                        <button
                          className="btn btn-border"
                          data-bs-toggle="modal"
                          data-bs-target="#editcustomer"
                          onClick={(e) => {
                            e.preventDefault();

                            setId(customer.customer_id);
                          }}
                        >
                          {locale.Edit + " " + locale.Customer}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade active show"
                id="customer"
                aria-labelledby="nav-style-tab"
              >
                {Object.keys(customer).length != 0 ? (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      kvk,
                      type,
                      firstname,
                      lastname,
                      searchable_expire: searchable_expire
                        ? new Date(searchable_expire)
                            .toISOString()
                            .substr(0, 10)
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
                      start: start
                        ? new Date(start).toISOString().substr(0, 10)
                        : "",
                      end: end ? new Date(end).toISOString().substr(0, 10) : "",
                      activate,
                    }}
                  >
                    <div className="card style-card">
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>KVK</label>
                            <Field
                              type="number"
                              name="kvk"
                              placeholder=""
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label> {locale.Type}</label>
                            <Field
                              type="text"
                              name="type"
                              placeholder=""
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label> {locale.First_name} </label>
                            <Field
                              type="text"
                              name="firstname"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.Last_name} </label>
                            <Field
                              type="text"
                              name="lastname"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>
                              {" "}
                              {locale.Searchable + " " + locale.Expire}
                            </label>

                            <div className="input-group date" id="datepicker1">
                              <Field
                                type="text"
                                className="form-control"
                                name="searchable_expire"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label> {locale.Mobile}</label>
                            <Field
                              type="text"
                              name="mobile"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label> {locale.Business_Name} </label>
                            <Field
                              type="text"
                              name="name"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.Short_Name}</label>
                            <Field
                              type="text"
                              name="short_name"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.Address}</label>
                            <Field
                              type="text"
                              name="address"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.Zip_Code}</label>
                            <Field
                              type="text"
                              name="zipcode"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label> {locale.Email}</label>
                            <Field
                              type="text"
                              name="email"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.Billing_Email} </label>
                            <Field
                              type="text"
                              name="email_billing"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.Phone}</label>
                            <Field
                              type="text"
                              name="phone"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.Discount}</label>
                            <Field
                              type="text"
                              name="discount"
                              className="form-control"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.Start_date}</label>

                            <div className="input-group date" id="datepicker1">
                              <Field
                                type="text"
                                className="form-control"
                                name="start"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group mb-4">
                            <label>{locale.End_date}</label>

                            <div className="input-group date" id="datepicker2">
                              <Field
                                type="text"
                                className="form-control"
                                name="end"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Formik>
                ) : (
                  ""
                )}
              </div>

              <div
                className="tab-pane fade"
                id="style"
                aria-labelledby="nav-style-tab"
              >
                <CustomerStyle
                  style={customerStyle && customerStyle}
                  role={props.auth.role}
                  id={id}
                  {...props}
                />
              </div>
              <div
                className="tab-pane fade"
                id="user"
                aria-labelledby="nav-user-tab"
              >
                <UserManagement {...props} id={id} />
              </div>
            </div>
          </div>
        )}
      </div>

      <EditCustomers customer={customer} id={cid} {...props} />
    </>
  );
};
export default ViewCustomer;
