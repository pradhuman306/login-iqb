import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import {
  SetCustomerPermission,
  SetMultiUserPermission,
} from "../../actions/questionnaireMgmtActions";
import { useDispatch, useSelector } from "react-redux";
import { GetUserPermission } from "../../actions/userAction";
import ButtonLoader from "../Customloader/ButtonLoader";
function QuestionnairePermission(props) {
  const locale = props.locale;
  const singleUserPerm = useSelector(
    (state) => state.getuserlistReducer
  ).selUserPermissions;
  const message = useSelector((state) => state.toasterReducer);
  let tmp = [];
  let selectedPList = [];
  let questionnairesList = [];
  const elementRef = useRef();
  const dispatch = useDispatch();
  const [customerQues, setCustomerQues] = useState(null);
  const [userQues, setUserQues] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isSelect, setIsSelect] = useState("#customer");
  const [selUserPermission, setSelUserPermission] = useState([]);
  if (props.data && props.data.permission && props.data.permission.length > 0) {
    props.data.permission.map((item) => {
      tmp.push(item.type);
    });
  }
  const [btnPending, setBtnPending] = useState(false);
  useEffect(() => {
    setBtnPending(false);
  }, [message]);
  useEffect(() => {
    let selUserPerm = [];
    if (singleUserPerm.length > 0) {
      singleUserPerm.forEach((element) => {
        if (element.permission !== null) {
          if (element.permission.length > 0) {
            element.permission.forEach((item) => {
              selUserPerm.push({ value: item.id, label: item.value });
            });
          }
        }
      });
    }
    setUserQues([...selUserPerm]);
  }, [singleUserPerm]);
  if (props.permissionTypes && props.permissionTypes.length > 0) {
    props.permissionTypes.map((item) => {
      if (tmp.includes(item.type)) {
        selectedPList.push({ value: item.id, label: item.value });
      }
      questionnairesList.push({ value: item.id, label: item.value });
    });
  }
  const handleClick = (e) => {
    console.log(e.target.hash);
    setIsSelect(e.target.hash);
  };
  const users = [];
  props.data &&
    props.data.users &&
    props.data.users.map((item) => {
      users.push({
        value: item.user_id,
        label: `${item.firstname} ${item.lastname}`,
      });
    });
  useEffect(() => {
    let tmp1 = [];
    if (
      props.data &&
      props.data.permission &&
      props.data.permission.length > 0
    ) {
      props.data.permission.map((item) => {
        tmp1.push(item.type);
      });
    }
    let selectedPListtmp = [];
    if (props.permissionTypes && props.permissionTypes.length > 0) {
      props.permissionTypes.map((item) => {
        if (tmp1.includes(item.type)) {
          selectedPListtmp.push({ value: item.id, label: item.value });
        }
      });
    }
    setCustomerQues([...selectedPListtmp]);
  }, [props.data.permission]);
  const [data, setData] = useState({ ...props.data });
  useEffect(() => {
    setData({ ...props.data });
  }, [props.data]);
  const handelCustomerQuesTypes = (e) => {
    setCustomerQues(e);
  };
  const handelUserQuesTypes = (e) => {
    setUserQues(e);
  };

  const onClickCustomerSubmit = () => {
    setBtnPending(true);
    let tmp = [];
    customerQues.map((item) => {
      tmp.push(item.value);
    });
    dispatch(
      SetCustomerPermission(
        {
          customer_id: props.data.customer_id,
          "questionnaire_id[]": tmp,
        },
        locale,
        elementRef.current
      )
    );
    setCustomerQues([]);
  };

  const onClickUserSubmit = () => {
    setBtnPending(true);
    let tmp = [];
    userQues.map((item) => {
      tmp.push(item.value);
    });
    console.log(customerQues);
    console.log(userQues);
    dispatch(
      SetMultiUserPermission(
        {
          "user_id[]": selectedUser,
          "questionnaire_id[]": tmp,
        },
        locale
      )
    );
    onClickCustomerSubmit();
    // setCustomerQues([]);
    // elementRef.current.click();
  };

  return (
    <div
      className="modal right fade"
      id="questionnaire-permition"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content right-modal">
          <div className="modal-head">
            <h4>{locale.Questionnaire + " " + locale.Permissions}</h4>
            <a
              ref={elementRef}
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
            <form action="">
              <div className="form-fields-wrap">
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(e);
                        }}
                      >
                        {locale.Customer}
                      </a>
                      {users.length > 0 && (
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleClick(e);
                          }}
                          className=""
                          id="nav-user-tab"
                          data-bs-toggle="tab"
                          href="#user"
                          role="tab"
                          aria-controls="nav-profile"
                          aria-selected="false"
                        >
                          {locale.User}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="customer"
                    aria-labelledby="nav-customer-tab"
                  >
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <div className="user-list q-user-list">
                          <ul>
                            <li>
                              {data && data.firstname && (
                                <div className="user-wrap">
                                  <h5 className="user-icon">
                                    {data.firstname[0].toUpperCase()}
                                    {data.lastname[0].toUpperCase()}
                                  </h5>
                                  <div className="user-detail">
                                    <h6>{`${data.firstname} ${data.lastname}`}</h6>
                                    <p>{data.name}</p>
                                  </div>
                                </div>
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{locale.Questionnaire}</label>
                          <Select
                            style={{ width: "100%" }}
                            isMulti
                            options={questionnairesList}
                            name="Questionnaire"
                            value={customerQues ? customerQues : selectedPList}
                            onChange={(e) => handelCustomerQuesTypes(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {users.length > 0 && (
                    <div
                      className="tab-pane fade"
                      id="user"
                      aria-labelledby="nav-user-tab"
                    >
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <div className="form-group">
                            <label>{locale.Select_user}</label>
                            <Select
                              style={{ width: "100%" }}
                              options={users}
                              name="font_size"
                              // value={{ value: values.font_size, label: values.font_size }}
                              onChange={(e) => {
                                console.log("==================>", e);
                                setSelectedUser(e.value);
                                dispatch(GetUserPermission(e.value));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>{locale.Questionnaire}</label>
                            <Select
                              style={{ width: "100%" }}
                              isMulti
                              options={
                                customerQues ? customerQues : selectedPList
                              }
                              name="UserQues"
                              value={userQues}
                              onChange={(e) => handelUserQuesTypes(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="frm-btn-wrap">
                <div className="row">
                  <div className="col-md-12 text-center mt-3">
                    {isSelect === "#customer" ? (
                      <button
                        type="button"
                        className="btn btn-primary m-auto"
                        onClick={() => onClickCustomerSubmit()}
                      >
                        {" "}
                        {btnPending ? <ButtonLoader /> : locale.Save}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary m-auto"
                        onClick={() => onClickUserSubmit()}
                      >
                        {btnPending ? <ButtonLoader /> : locale.Save}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionnairePermission;
