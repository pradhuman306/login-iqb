import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HeaderContainer from "../Header/HeaderContainer";
import CustomLoader from "../Customloader";
import { singleUser } from "../../actions/userAction";
import EditUser from "./EditUser";
const ViewUser = (props) => {
  const locale = props.locale;
  console.log(locale);
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;
  const userState = useSelector((state) => state.viewUserReducer);
  const user = userState.userData;
  const pending = userState.pending;

  useEffect(() => {
    dispatch(singleUser(id));
  }, []);
  console.log(user);
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
                    id="nav-user-tab"
                    data-bs-toggle="tab"
                    href="#user"
                    role="tab"
                    aria-controls="nav-user"
                    aria-selected="true"
                  >
                    {locale.Basic_info}
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
                            {user.firstname[0].toUpperCase() +
                              user.lastname[0].toUpperCase()}
                          </h5>
                          <div className="user-detail">
                            <h6>{user.firstname + " " + user.lastname}</h6>
                            <p>{user.email}</p>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <ul className="btn-group">
                      <li>
                        {" "}
                        <label
                          className={`status-label ${
                            user.activate ? "active-label" : "inactive-label"
                          }`}
                        >
                          {user.activate ? locale.Active : locale.Inactive}
                        </label>
                      </li>
                      <li className="ms-3">
                        <button
                          className="btn btn-border"
                          data-bs-toggle="modal"
                          data-bs-target="#editUser"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {locale.Edit + " " + locale.User}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade show active"
                id="user"
                aria-labelledby="nav-user-tab"
              >
                <div className="card style-card">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group mb-4 customselect">
                        <label>{locale.customer_name}</label>
                        <input
                          type="text"
                          className="form-control"
                          name=""
                          value={
                            user.customer.length > 0
                              ? user.customer.map((item, i) => item.name)
                              : ""
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group mb-4">
                        <label>{locale.Searchable}</label>

                        <div className="input-group date" id="datepicker1">
                          <input
                            type="text"
                            className="form-control"
                            name="searchable"
                            value={
                              user.searchable_expire
                                ? user.searchable_expire.split(" ")[0]
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group mb-4">
                        <label>{locale.First_name}</label>
                        <input
                          type="text"
                          name="firstname"
                          className="form-control"
                          value={user.firstname}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group mb-4">
                        <label>{locale.Last_name}</label>
                        <input
                          type="text"
                          name="lastname"
                          className="form-control"
                          value={user.lastname}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group mb-4">
                        <label>{locale.Phone_No}</label>
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          value={user.phone}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group mb-4">
                        <label>{locale.Email_address}</label>
                        <input
                          type="text"
                          name="email"
                          className="form-control"
                          value={user.email}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group mb-4">
                        <label>{locale.Start_date}</label>

                        <div className="input-group date" id="datepicker1">
                          <input
                            type="text"
                            className="form-control"
                            name="startdate"
                            value={user.start ? user.start.split(" ")[0] : ""}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group mb-4">
                        <label>{locale.End_date}</label>

                        <div className="input-group date" id="datepicker2">
                          <input
                            type="text"
                            className="form-control"
                            name="enddate"
                            value={user.end ? user.end.split(" ")[0] : ""}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <EditUser
        user={user}
        id={user.id}
        customer_id={props.auth.userdata.id}
        role={props.auth.role}
        customer_name={`${props.auth.userdata.firstname} ${props.auth.userdata.lastname}`}
        auth={props.auth}
        {...props}
      />
    </>
  );
};
export default ViewUser;
