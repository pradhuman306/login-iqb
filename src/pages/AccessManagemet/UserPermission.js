import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { SetUserPermission } from "../../actions/questionnaireMgmtActions";
function UserPermission(props) {
  const locale = props.locale;
  const dispatch = useDispatch();
  const elementRef = useRef();
  const [customerQues, setCustomerQues] = useState([]);
  const [user, setUser] = useState({ ...props.user });
  console.log(user);
  const questionnairesList = [];
  useEffect(() => {
    setUser({ ...props.user });
  }, [props.user]);
  let selectedPList = [];
  let tmp = [];
  if (props.user && props.user.permission && props.user.permission.length > 0) {
    props.user.permission.map((item) => {
      tmp.push(item.type);
    });
  }

  props.permissionTypes &&
    props.permissionTypes.map((item) => {
      if (tmp.includes(item.type)) {
        selectedPList.push({ value: item.id, label: item.value });
      }
      questionnairesList.push({ value: item.id, label: item.value });
    });

  useEffect(() => {
    let tmp1 = [];
    if (
      props.user &&
      props.user.permission &&
      props.user.permission.length > 0
    ) {
      props.user.permission.map((item) => {
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
  }, [props.user.permission]);

  const handelCustomerQuesTypes = (e) => {
    setCustomerQues(e);
  };
  const onClickCustomerSubmit = () => {
    let tmp = [];
    customerQues.map((item) => {
      tmp.push(item.value);
    });

    dispatch(
      SetUserPermission(
        { user_id: user.user_id, "questionnaire_id[]": tmp },
        props.role,
        props.id,
        locale
      )
    );
    setCustomerQues([]);
    elementRef.current.click();
  };
  return (
    <div
      className="modal right fade"
      id="user-permition"
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
                              {user && user.firstname && (
                                <div className="user-wrap">
                                  <h5 className="user-icon">
                                    {user.firstname[0].toUpperCase()}
                                    {user.lastname[0].toUpperCase()}
                                  </h5>
                                  <div className="user-detail">
                                    <h6>{`${user.firstname} ${user.lastname}`}</h6>
                                    {/* <p>Minebytes Inc</p> */}
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
                </div>
              </div>
              <div className="frm-btn-wrap">
                <div className="row">
                  <div className="col-md-12 text-center mt-4">
                    <button
                      type="button"
                      onClick={() => onClickCustomerSubmit()}
                      className="btn btn-primary m-auto"
                    >
                      {locale.Save}
                    </button>
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

export default UserPermission;
