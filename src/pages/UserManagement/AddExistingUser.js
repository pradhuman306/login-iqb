import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, userSearch, recoverUser } from "../../actions/userAction";
import ButtonLoader from "../Customloader/ButtonLoader";

function AddExistingUser(props) {
  const locale = props.locale;
  const dispatch = useDispatch();
  const userSearchList = useSelector((state) => state.userReducer).searchList;
  const [prevValues, setPrevValues] = useState({});
  const [pending, setPending] = useState(false);
  const [displayMsg, setdisplayMsg] = useState(false);
  const [error, setError] = useState({});
  const [count, setCount] = useState(0);
  let newUserId = [];
  props.userList.map((item) => {
    newUserId.push(item.id);
  });
  console.log(userSearchList);
  useEffect(() => {
    setPending(false);

    if (["customer"].includes(props.auth.role)) {
      if (userSearchList) {
        userSearchList.map((user) => {
          if (
            user.customer_user_id
              .split(",")
              .includes(props.auth.userdata.id.toString())
          ) {
            setCount(1);
          }
        });
      }
    }
  }, [userSearchList]);
  return (
    <div
      className="modal right fade"
      id="addExistingUser"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content right-modal">
          <div className="modal-head">
            <h4>{locale.Add_Existing_User} </h4>
            <a
              onClick={(e) => e.preventDefault()}
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img src="/assets/images/icon-close.svg" alt="" />
            </a>
          </div>
          <div className="modal-body">
            <Formik
              enableReinitialize
              initialValues={{
                firstname: "",
                lastname: "",
                email: "",
              }}
              validate={(values) => {
                const errors = {};
                // if (!values.firstname && !values.lastname && !values.email) {
                //   errors.email = "Fill altleast one value.";
                //   errors.firstname = "Fill altleast one value.";
                //   errors.lastname = "Fill altleast one value.";
                // }
                setError({ ...errors });
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setdisplayMsg(true);
                setPending(true);
                if (props.auth.role === "super_admin") {
                  dispatch(
                    userSearch({
                      values: values,
                    })
                  );
                } else {
                  dispatch(
                    userSearch({
                      values: values,
                      uid: props.auth.userdata.id,
                    })
                  );
                }

                setPrevValues({ ...values });
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, dirty, handleReset, touched }) => (
                <Form action="">
                  <div className="form-fields-wrap">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-4">
                          <label>{locale.First_name}</label>
                          <Field
                            type="text"
                            name="firstname"
                            className={`form-control  ${
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
                          <label>{locale.Last_name}</label>
                          <Field
                            type="text"
                            name="lastname"
                            className={`form-control  ${
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
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{locale.Email}</label>
                          <Field
                            type="text"
                            name="email"
                            className={`form-control  ${
                              touched.email && error.email ? "input-error" : ""
                            }`}
                          />
                          <ErrorMessage
                            className="error"
                            name="email"
                            component="span"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        {userSearchList.length != 0 ? (
                          <div className="user-list">
                            <ul>
                              {userSearchList &&
                                userSearchList.map((user) =>
                                  ["customer"].includes(props.auth.role) ? (
                                    user.customer_user_id
                                      .split(",")
                                      .includes(
                                        props.auth.userdata.id.toString()
                                      ) && (
                                      <li key={user.id}>
                                        <div className="user-wrap">
                                          <h5 className="user-icon">
                                            {user.firstname[0].toUpperCase()}
                                            {user.lastname[0].toUpperCase()}
                                          </h5>
                                          <div className="user-detail">
                                            <h6>{`${user.firstname} ${user.lastname}`}</h6>
                                            <p>{user.email}</p>
                                          </div>
                                        </div>
                                        <div className="">
                                          {user.deleted ? (
                                            <button
                                              className="btn sml-btn btn-border"
                                              onClick={() => {
                                                if (
                                                  props.auth.role ===
                                                  "super_admin"
                                                ) {
                                                  dispatch(
                                                    recoverUser({
                                                      prevValues: prevValues,
                                                      values: user.id,
                                                      locale: locale,
                                                    })
                                                  );
                                                } else {
                                                  dispatch(
                                                    recoverUser({
                                                      uid: props.auth.userdata
                                                        .id,
                                                      prevValues: prevValues,
                                                      values: user.id,
                                                      locale: locale,
                                                    })
                                                  );
                                                }
                                              }}
                                            >
                                              {locale.Add}
                                            </button>
                                          ) : (
                                            <button
                                              className="btn sml-btn btn-border text-danger"
                                              onClick={() => {
                                                if (
                                                  props.auth.role ===
                                                  "super_admin"
                                                ) {
                                                  dispatch(
                                                    deleteUser({
                                                      prevValues: prevValues,
                                                      values: user.id,
                                                      locale: locale,
                                                    })
                                                  );
                                                } else {
                                                  dispatch(
                                                    deleteUser({
                                                      uid: props.auth.userdata
                                                        .id,
                                                      prevValues: prevValues,
                                                      values: user.id,
                                                      locale: locale,
                                                    })
                                                  );
                                                }

                                                //  dispatch(userSearch(prevValues));
                                              }}
                                            >
                                              {locale.Remove}
                                            </button>
                                          )}
                                        </div>
                                      </li>
                                    )
                                  ) : (
                                    <li key={user.id}>
                                      <div className="user-wrap">
                                        <h5 className="user-icon">
                                          {user.firstname[0].toUpperCase()}
                                          {user.lastname[0].toUpperCase()}
                                        </h5>
                                        <div className="user-detail">
                                          <h6>{`${user.firstname} ${user.lastname}`}</h6>
                                          <p>{user.email}</p>
                                        </div>
                                      </div>
                                      <div className="">
                                        {user.deleted ? (
                                          <button
                                            className="btn sml-btn btn-border"
                                            onClick={() => {
                                              if (
                                                props.auth.role ===
                                                "super_admin"
                                              ) {
                                                dispatch(
                                                  recoverUser({
                                                    prevValues: prevValues,
                                                    values: user.id,
                                                    locale: locale,
                                                  })
                                                );
                                              } else {
                                                dispatch(
                                                  recoverUser({
                                                    uid: props.auth.userdata.id,
                                                    prevValues: prevValues,
                                                    values: user.id,
                                                    locale: locale,
                                                  })
                                                );
                                              }
                                            }}
                                          >
                                            Add
                                          </button>
                                        ) : (
                                          <button
                                            className="btn sml-btn btn-border text-danger"
                                            onClick={() => {
                                              if (
                                                props.auth.role ===
                                                "super_admin"
                                              ) {
                                                dispatch(
                                                  deleteUser({
                                                    prevValues: prevValues,
                                                    values: user.id,
                                                    locale: locale,
                                                  })
                                                );
                                              } else {
                                                dispatch(
                                                  deleteUser({
                                                    uid: props.auth.userdata.id,
                                                    prevValues: prevValues,
                                                    values: user.id,
                                                    locale: locale,
                                                  })
                                                );
                                              }

                                              //  dispatch(userSearch(prevValues));
                                            }}
                                          >
                                            {locale.Remove}
                                          </button>
                                        )}
                                      </div>
                                    </li>
                                  )
                                )}
                            </ul>
                            {displayMsg &&
                            count === 0 &&
                            ["customer"].includes(props.auth.role) ? (
                              <div className=" w-100 alert alert-danger">
                                {locale.Not_existing_user}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        )}
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
                          {pending ? <ButtonLoader /> : locale.Search}
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
  );
}

export default AddExistingUser;
