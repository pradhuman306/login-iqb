import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { langs } from "../../locale/localization";

import { signout, totalDayLeftSubscription } from "../../actions/auth";
import {
  getSingleCustomerPermission,
  GetStyle,
} from "../../actions/customerAction";
import {
  GetQuetionnaireTypes,
  GetUsersPermissionList,
} from "../../actions/questioerAction";
import {
  SET_DOC_DATA,
  SET_PDF_DATA,
  SET_USER_SELECTED_CUSTOMER,
  SUCCESS_MESSAGE,
} from "../../constants/actionTypes";
import UserMenu from "../Header/UserMenu";

function SideNav(props) {
  const dispatch = useDispatch();

  const style = useSelector((state) => state.styleReducer).style || null;
  const locale = langs(useSelector((state) => state.langReducer).locale);
  const UserData = useSelector((state) => state.authReducer).userdata;
  const trial_days = totalDayLeftSubscription(UserData);
  const days = trial_days > 1 ? " days" : " day";
  const questionaireTypes = useSelector(
    (state) => state.questionnaireReducer
  ).questionnaireList;

  const userPermissionList = useSelector(
    (state) => state.getuserlistReducer
  ).usersList;
  const [permission, setPermission] = useState([]);
  useEffect(() => {
    userPermissionList.map((item) => {
      console.log(item);
      if (props.role.userdata.id === item.user_id) {
        setPermission(item.permission);
      }
    });
  }, [userPermissionList]);

  const customerdata = localStorage.getItem("customerdata")
    ? JSON.parse(localStorage.getItem("customerdata"))
    : null;
  const selCustomer = localStorage.getItem("selCustomer")
    ? JSON.parse(localStorage.getItem("selCustomer"))
    : customerdata
    ? customerdata[0]
    : null;

  let customerList = [];
  if (customerdata !== null && props.role.role === "user") {
    customerdata.forEach((element) => {
      customerList.push({
        label: element.companydata.name,
        value: element,
        isDisabled: element.permission.length < 1 ? true : false,
      });
    });
  }
  let index = 0;
  if (props.role.role === "user") {
    index = customerdata.findIndex((object) => {
      return object.data.id === selCustomer.data.id;
    });
  }
  const [selectValue, setSelectvalue] = useState({
    selectCustomer: index,
  });

  const selectCustomer = (e) => {
    dispatch(GetStyle({ customer_id: e.value.data.id }));
    dispatch({ type: SET_PDF_DATA, payload: [] });
    dispatch({ type: SET_DOC_DATA, payload: [] });
    setTimeout(() => {
      dispatch({
        type: SUCCESS_MESSAGE,
        payload: e.value.companydata.name + locale.Selected_successfully,
      });
    }, 2000);

    dispatch({
      type: SET_USER_SELECTED_CUSTOMER,
      payload: e.value,
    });
    index = customerdata.findIndex((object) => {
      return object.data.id === e.value.data.id;
    });
    setSelectvalue({ ...selectValue, selectCustomer: index });
    // localStorage.setItem("selCustomer", JSON.stringify(e.value));
    console.log(selectValue["selectCustomer"]);
    props.parentCallback(true);
  };

  const role = props.role.role;
  const path = useLocation().pathname;
  let name = "";

  let newData = localStorage.getItem("userdata")
    ? JSON.parse(localStorage.getItem("userdata"))
    : props.role.userdata;

  if (props.role.userdata || localStorage.getItem("userdata")) {
    name = newData.firstname + " " + newData.lastname;
  }

  const logout = (e) => {
    document.body.classList.remove("menu-open");
    dispatch(signout(locale));
  };

  const handleClick = () => {
    document.body.classList.toggle("menu-open");
    const navIcon = document.getElementById("nav-icon");
    navIcon.classList.toggle("open");
  };
  let customerPermissionList = useSelector(
    (state) => state.customerPermissionsReducer
  ).customerPermissionsList;
  let customerPermId = [];
  console.log(customerPermissionList);
  useEffect(() => {
    dispatch(GetQuetionnaireTypes());

    if (props.role.role === "user") {
      dispatch(
        getSingleCustomerPermission(
          customerdata[selectValue["selectCustomer"]].data.id
        )
      );
    } else if (props.role.role === "customer") {
      dispatch(getSingleCustomerPermission(props.role.userdata.id));
    } else {
      dispatch(GetUsersPermissionList());
    }
    // if (props.role.role === "user") {
    //   console.log(selCustomer);
    //   dispatch(GetStyle({ customer_id: selCustomer.data.id }));
    // }
  }, []);

  useEffect(() => {
    if (props.role.role === "user") {
      dispatch(
        getSingleCustomerPermission(
          customerdata[selectValue["selectCustomer"]].data.id
        )
      );
    }
  }, [selectValue]);
  useEffect(() => {
    if (customerPermissionList !== null) {
      customerPermissionList.forEach((item) => {
        if (!customerPermId.includes(item.id)) {
          customerPermId.push(item.id);
        }
      });
    }
  }, [customerPermissionList]);
  return (
    <aside className="sidebar">
      <div className="sidebar-wrap">
        <div className="sidebar-body">
          <div className="sidebar-nav-title">{locale.Navigations}</div>
          <ul>
            <li
              onClick={(e) => {
                handleClick(e);
              }}
              className={path === "/dashboard" ? "active" : ""}
            >
              <Link to="/dashboard">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.25 8.125H2.5C2.33424 8.125 2.17527 8.19085 2.05806 8.30806C1.94085 8.42527 1.875 8.58424 1.875 8.75V12.5C1.875 12.6658 1.94085 12.8247 2.05806 12.9419C2.17527 13.0592 2.33424 13.125 2.5 13.125H6.25C6.41576 13.125 6.57473 13.0592 6.69194 12.9419C6.80915 12.8247 6.875 12.6658 6.875 12.5V8.75C6.875 8.58424 6.80915 8.42527 6.69194 8.30806C6.57473 8.19085 6.41576 8.125 6.25 8.125ZM5.625 11.875H3.125V9.375H5.625V11.875ZM12.5 1.875H8.75C8.58424 1.875 8.42527 1.94085 8.30806 2.05806C8.19085 2.17527 8.125 2.33424 8.125 2.5V6.25C8.125 6.41576 8.19085 6.57473 8.30806 6.69194C8.42527 6.80915 8.58424 6.875 8.75 6.875H12.5C12.6658 6.875 12.8247 6.80915 12.9419 6.69194C13.0592 6.57473 13.125 6.41576 13.125 6.25V2.5C13.125 2.33424 13.0592 2.17527 12.9419 2.05806C12.8247 1.94085 12.6658 1.875 12.5 1.875ZM11.875 5.625H9.375V3.125H11.875V5.625ZM12.5 10H11.25V8.75C11.25 8.58424 11.1842 8.42527 11.0669 8.30806C10.9497 8.19085 10.7908 8.125 10.625 8.125C10.4592 8.125 10.3003 8.19085 10.1831 8.30806C10.0658 8.42527 10 8.58424 10 8.75V10H8.75C8.58424 10 8.42527 10.0658 8.30806 10.1831C8.19085 10.3003 8.125 10.4592 8.125 10.625C8.125 10.7908 8.19085 10.9497 8.30806 11.0669C8.42527 11.1842 8.58424 11.25 8.75 11.25H10V12.5C10 12.6658 10.0658 12.8247 10.1831 12.9419C10.3003 13.0592 10.4592 13.125 10.625 13.125C10.7908 13.125 10.9497 13.0592 11.0669 12.9419C11.1842 12.8247 11.25 12.6658 11.25 12.5V11.25H12.5C12.6658 11.25 12.8247 11.1842 12.9419 11.0669C13.0592 10.9497 13.125 10.7908 13.125 10.625C13.125 10.4592 13.0592 10.3003 12.9419 10.1831C12.8247 10.0658 12.6658 10 12.5 10ZM6.25 1.875H2.5C2.33424 1.875 2.17527 1.94085 2.05806 2.05806C1.94085 2.17527 1.875 2.33424 1.875 2.5V6.25C1.875 6.41576 1.94085 6.57473 2.05806 6.69194C2.17527 6.80915 2.33424 6.875 2.5 6.875H6.25C6.41576 6.875 6.57473 6.80915 6.69194 6.69194C6.80915 6.57473 6.875 6.41576 6.875 6.25V2.5C6.875 2.33424 6.80915 2.17527 6.69194 2.05806C6.57473 1.94085 6.41576 1.875 6.25 1.875ZM5.625 5.625H3.125V3.125H5.625V5.625Z" fill="#0E0B3D"/>
</svg>

                <span>{locale.Home}</span>
              </Link>
            </li>
            {["super_admin"].includes(role) && (
              <li className={path === "/email-template" ? "active" : ""}>
                {" "}
                <Link to="/email-template">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.5 2.5H12.5C13.1875 2.5 13.75 3.0625 13.75 3.75V11.25C13.75 11.9375 13.1875 12.5 12.5 12.5H2.5C1.8125 12.5 1.25 11.9375 1.25 11.25V3.75C1.25 3.0625 1.8125 2.5 2.5 2.5Z" stroke="#0E0B3D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M13.75 3.75L7.5 8.125L1.25 3.75" stroke="#0E0B3D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

                  <span>CMS</span>
                </Link>
              </li>
            )}
            {role == "super_admin" && (
              <>
                <li className={path === "/invoicing" ? "active" : ""}>
                  <Link to="/invoicing">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.93751 6.56254H7.5C7.66577 6.56254 7.82474 6.49669 7.94195 6.37948C8.05916 6.26227 8.125 6.1033 8.125 5.93754C8.125 5.77178 8.05916 5.61281 7.94195 5.4956C7.82474 5.37839 7.66577 5.31254 7.5 5.31254H6.875V5.00004C6.875 4.83428 6.80916 4.67531 6.69195 4.5581C6.57474 4.44089 6.41577 4.37504 6.25 4.37504C6.08424 4.37504 5.92527 4.44089 5.80806 4.5581C5.69085 4.67531 5.62501 4.83428 5.62501 5.00004V5.34379C5.24527 5.4209 4.90773 5.63636 4.67792 5.94833C4.4481 6.26031 4.3424 6.64655 4.38135 7.03207C4.42029 7.4176 4.60109 7.7749 4.88865 8.03461C5.17621 8.29433 5.55002 8.43793 5.93751 8.43754H6.5625C6.64538 8.43754 6.72487 8.47047 6.78348 8.52907C6.84208 8.58768 6.875 8.66716 6.875 8.75004C6.875 8.83292 6.84208 8.91241 6.78348 8.97101C6.72487 9.02962 6.64538 9.06254 6.5625 9.06254H5.00001C4.83424 9.06254 4.67527 9.12839 4.55806 9.2456C4.44085 9.36281 4.37501 9.52178 4.37501 9.68754C4.37501 9.8533 4.44085 10.0123 4.55806 10.1295C4.67527 10.2467 4.83424 10.3125 5.00001 10.3125H5.62501V10.625C5.62501 10.7908 5.69085 10.9498 5.80806 11.067C5.92527 11.1842 6.08424 11.25 6.25 11.25C6.41577 11.25 6.57474 11.1842 6.69195 11.067C6.80916 10.9498 6.875 10.7908 6.875 10.625V10.2813C7.25474 10.2042 7.59228 9.98873 7.82209 9.67675C8.05191 9.36478 8.15761 8.97854 8.11866 8.59301C8.07972 8.20749 7.89892 7.85019 7.61136 7.59047C7.3238 7.33076 6.94999 7.18715 6.5625 7.18754H5.93751C5.85462 7.18754 5.77514 7.15462 5.71653 7.09601C5.65793 7.03741 5.62501 6.95792 5.62501 6.87504C5.62501 6.79216 5.65793 6.71268 5.71653 6.65407C5.77514 6.59547 5.85462 6.56254 5.93751 6.56254ZM13.125 7.50004H11.25V1.87504C11.2504 1.76491 11.2218 1.65662 11.1669 1.56113C11.112 1.46565 11.0329 1.38636 10.9375 1.33129C10.8425 1.27644 10.7347 1.24756 10.625 1.24756C10.5153 1.24756 10.4075 1.27644 10.3125 1.33129L8.4375 2.40629L6.5625 1.33129C6.46749 1.27644 6.35971 1.24756 6.25 1.24756C6.14029 1.24756 6.03252 1.27644 5.93751 1.33129L4.06251 2.40629L2.1875 1.33129C2.09249 1.27644 1.98472 1.24756 1.875 1.24756C1.76529 1.24756 1.65752 1.27644 1.5625 1.33129C1.46713 1.38636 1.38799 1.46565 1.33312 1.56113C1.27824 1.65662 1.24957 1.76491 1.25 1.87504V11.875C1.25 12.3723 1.44755 12.8492 1.79918 13.2009C2.15081 13.5525 2.62772 13.75 3.125 13.75H11.875C12.3723 13.75 12.8492 13.5525 13.2008 13.2009C13.5525 12.8492 13.75 12.3723 13.75 11.875V8.12504C13.75 7.95928 13.6842 7.80031 13.5669 7.6831C13.4497 7.56589 13.2908 7.50004 13.125 7.50004ZM3.125 12.5C2.95924 12.5 2.80027 12.4342 2.68306 12.317C2.56585 12.1998 2.5 12.0408 2.5 11.875V2.95629L3.75001 3.66879C3.84647 3.71918 3.95368 3.74549 4.06251 3.74549C4.17133 3.74549 4.27854 3.71918 4.37501 3.66879L6.25 2.59379L8.125 3.66879C8.22147 3.71918 8.32868 3.74549 8.4375 3.74549C8.54633 3.74549 8.65354 3.71918 8.75 3.66879L10 2.95629V11.875C10.0017 12.0883 10.0397 12.2996 10.1125 12.5H3.125ZM12.5 11.875C12.5 12.0408 12.4342 12.1998 12.3169 12.317C12.1997 12.4342 12.0408 12.5 11.875 12.5C11.7092 12.5 11.5503 12.4342 11.4331 12.317C11.3159 12.1998 11.25 12.0408 11.25 11.875V8.75004H12.5V11.875Z" fill="#0E0B3D"/>
</svg>

                    <span>{locale.Invoicing}</span>
                  </Link>
                </li>
              </>
            )}
            {["super_admin", "user", "customer"].includes(role) &&
              customerPermissionList !== null &&
              questionaireTypes.map((element, i) =>
                customerPermissionList.map((custPermission) =>
                  custPermission.id === element.id ? (
                    <li
                      key={i}
                      className={
                        path === "/questionnaire/" + element.id ? "active" : ""
                      }
                      onClick={(e) => {
                        handleClick(e);
                      }}
                    >
                      {console.log(permission)}
                      {permission !== null
                        ? permission.map(
                            (item) =>
                              item.id === element.id && (
                                <Link
                                  to={"/questionnaire/" + element.id}
                                  key={item.id}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                  >
                                    <path
                                      d="M8.75 1.25H3.75C3.41848 1.25 3.10054 1.3817 2.86612 1.61612C2.6317 1.85054 2.5 2.16848 2.5 2.5V12.5C2.5 12.8315 2.6317 13.1495 2.86612 13.3839C3.10054 13.6183 3.41848 13.75 3.75 13.75H11.25C11.5815 13.75 11.8995 13.6183 12.1339 13.3839C12.3683 13.1495 12.5 12.8315 12.5 12.5V5L8.75 1.25Z"
                                      stroke="#0E0B3D"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M8.75 1.25V5H12.5"
                                      stroke="#0E0B3D"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 8.125H5"
                                      stroke="#0E0B3D"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 10.625H5"
                                      stroke="#0E0B3D"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M6.25 5.625H5.625H5"
                                      stroke="#0E0B3D"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span>{element.value}</span>
                                </Link>
                              )
                          )
                        : ""}
                    </li>
                  ) : (
                    ""
                  )
                )
              )}
            <li
              onClick={(e) => {
                handleClick(e);
              }}
              className={path === "/settings" ? "active" : ""}
            >
              <Link to="/settings">
              {/* <img src="/assets/images/icon-setting.svg" alt="" /> */}
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_187_2817)">
<path d="M7.49973 4.77295C5.99592 4.77295 4.77246 5.9964 4.77246 7.50022C4.77246 9.00404 5.99592 10.2275 7.49973 10.2275C9.00355 10.2275 10.227 9.00404 10.227 7.50022C10.227 5.9964 9.00355 4.77295 7.49973 4.77295ZM7.49973 8.86386C6.74782 8.86386 6.1361 8.25213 6.1361 7.50022C6.1361 6.74831 6.74782 6.13659 7.49973 6.13659C8.25164 6.13659 8.86337 6.74831 8.86337 7.50022C8.86337 8.25213 8.25164 8.86386 7.49973 8.86386Z" fill="#0E0B3D"/>
<path d="M14.5365 9.216L12.9452 7.8175C12.9513 7.71155 12.9544 7.6055 12.9544 7.5C12.9544 7.39445 12.9513 7.28841 12.9452 7.18246L14.5364 5.784C14.7806 5.56945 14.8393 5.21241 14.6768 4.93095L13.3131 2.56905C13.1506 2.28759 12.812 2.15991 12.5042 2.26409L10.4977 2.94291C10.3204 2.826 10.1366 2.71964 9.94732 2.62445L9.53205 0.548091C9.46837 0.229409 9.18851 0 8.86351 0H6.13623C5.81123 0 5.53137 0.229409 5.46764 0.548091L5.05237 2.62445C4.86314 2.71964 4.67933 2.82605 4.50201 2.94291L2.49542 2.26409C2.18769 2.16 1.84901 2.28759 1.68646 2.56905L0.322826 4.93095C0.160326 5.21241 0.219053 5.56945 0.463189 5.784L2.05446 7.18246C2.04837 7.28827 2.04533 7.39432 2.04533 7.5C2.04533 7.60568 2.04837 7.71177 2.05451 7.81755L0.463235 9.216C0.219099 9.43055 0.160371 9.78759 0.322871 10.069L1.68651 12.4309C1.84905 12.7124 2.18764 12.84 2.49546 12.7359L4.50196 12.057C4.67928 12.174 4.86314 12.2803 5.05237 12.3755L5.46764 14.4519C5.53137 14.7706 5.81123 15 6.13623 15H8.86351C9.18851 15 9.46837 14.7706 9.53205 14.4519L9.94732 12.3755C10.1366 12.2804 10.3204 12.174 10.4977 12.0571L12.5042 12.7359C12.8121 12.84 13.1507 12.7125 13.3132 12.431L14.6768 10.069C14.8394 9.78759 14.7806 9.43055 14.5365 9.216ZM12.4118 11.265L10.606 10.6541C10.3914 10.5816 10.1549 10.6203 9.97464 10.7574C9.69928 10.9669 9.39919 11.1405 9.08273 11.2735C8.87414 11.3611 8.72255 11.5465 8.67819 11.7684L8.30455 13.6364H6.69519L6.3216 11.7684C6.27723 11.5465 6.12564 11.3611 5.91705 11.2735C5.60042 11.1405 5.30037 10.9669 5.02519 10.7574C4.84496 10.6202 4.60842 10.5815 4.39373 10.6541L2.58792 11.265L1.78323 9.87127L3.21473 8.61323C3.38455 8.464 3.46937 8.24027 3.44114 8.016C3.41978 7.84605 3.40896 7.67245 3.40896 7.5C3.40896 7.32755 3.41978 7.15395 3.44119 6.984C3.46942 6.75968 3.3846 6.536 3.21478 6.38673L1.78323 5.12868L2.58792 3.73491L4.39378 4.34582C4.60837 4.41836 4.84487 4.37968 5.02514 4.24259C5.30046 4.03309 5.60055 3.85945 5.91705 3.7265C6.12564 3.63886 6.27723 3.4535 6.3216 3.23159L6.69519 1.36364H8.30455L8.67814 3.23164C8.72251 3.4535 8.8741 3.63891 9.08269 3.72655C9.39919 3.8595 9.69928 4.03314 9.97455 4.24264C10.1548 4.37977 10.3914 4.4185 10.606 4.34591L12.4117 3.73505L13.2164 5.12877L11.7849 6.38682C11.6152 6.536 11.5304 6.75955 11.5585 6.98373C11.5799 7.15455 11.5908 7.32827 11.5908 7.50005C11.5908 7.67182 11.5799 7.84555 11.5585 8.01636C11.5304 8.24059 11.6152 8.46414 11.785 8.61332L13.2165 9.87136L12.4118 11.265Z" fill="#0E0B3D"/>
</g>
<defs>
<clipPath id="clip0_187_2817">
<rect width="15" height="15" fill="white"/>
</clipPath>
</defs>
</svg>


                <span>{locale.Setting}</span>
              </Link>
            </li>
          </ul>
          <div className="management-menu-m">
            <hr />
            {/* <UserMenu locale={locale} /> */}
            <>
              {["customer", "super_admin"].includes(role) && (
                <ul className="management-menu">
                  <li
                    onClick={(e) => {
                      handleClick(e);
                    }}
                  >
                    <Link to="/user-management">{locale.User}</Link>
                    <ul className="dropdown-menu">
                      <li
                        className={path === "/user-management" ? "active" : ""}
                      >
                        <Link to="/user-management">{locale.Management}</Link>
                      </li>
                      {role === "customer" && (
                        <li
                          className={
                            path === "/user-access-mannagement" ? "active" : ""
                          }
                        >
                          <Link to={"/user-access-mannagement"}>
                            {locale.Permissions}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              )}
              {["customer", "super_admin"].includes(role) && (
                <ul className="management-menu">
                  <li
                    onClick={(e) => {
                      handleClick(e);
                    }}
                  >
                    {role == "super_admin" && (
                      <Link to="/customer-management">{locale.Customer}</Link>
                    )}
                    {role === "customer" && (
                      <Link to="/customer-style">{locale.Customer}</Link>
                    )}
                    <ul className="dropdown-menu">
                      {role == "super_admin" && (
                        <li
                          className={
                            path === "/customer-management" ? "active" : ""
                          }
                        >
                          <Link to="/customer-management">
                            {locale.Management}
                          </Link>
                        </li>
                      )}
                      {role === "customer" && (
                        <li
                          className={path === "/customer-style" ? "active" : ""}
                        >
                          <Link to="/customer-style">{locale.Style}</Link>
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              )}
              {role === "super_admin" && (
                <ul className="management-menu">
                  <li
                    onClick={(e) => {
                      handleClick(e);
                    }}
                  >
                    <Link to="/questionnaire-management">
                      {locale.Questionnaire}
                    </Link>
                    <ul className="dropdown-menu">
                      <li
                        className={
                          path === "/questionnaire-management" ? "active" : ""
                        }
                      >
                        <Link to="/questionnaire-management">
                          {locale.Management}
                        </Link>
                      </li>
                      {["super_admin"].includes(role) && (
                        <li
                          className={
                            path === "/questionnaire-access-management"
                              ? "active"
                              : ""
                          }
                        >
                          <Link
                            to={
                              role == "super_admin"
                                ? "/questionnaire-access-management"
                                : "/user-access-mannagement"
                            }
                          >
                            {locale.Permissions}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                  {role === "customer" && (
                    <li
                      onClick={(e) => {
                        handleClick(e);
                      }}
                    >
                      <Link to="/customer-style">{locale.Style}</Link>
                    </li>
                  )}
                </ul>
              )}
            </>
          </div>
        </div>
        <div className="sidebar-footer">
          <span>
            {UserData.trial_period
              ? trial_days - 14 <= 0 && trial_days > 0
                ? trial_days + days + " " + locale.Sidenav_trial_left
                : trial_days <= 0 && ""
              : trial_days - 14 <= 0 && trial_days > 0
              ? locale.Sidenav_subscription_left + " " + trial_days + days
              : trial_days <= 0
              ? ""
              : ""}
          </span>
          {props.role.role === "user" && (
            <>
              {/* <hr /> */}
              <div className="dropdown">
                <label>Switch customer</label>
                <Select
                  classNamePrefix="select"
                  // defaultValue={customerList[0]}
                  options={customerList}
                  placeholder="Switch customer"
                  menuPlacement="top"
                  value={customerList[selectValue["selectCustomer"]]}
                  onChange={(e) => selectCustomer(e)}
                />
              </div>
            </>
          )}
          {/* <ul className="side-foot-menus">
            <li
              onClick={(e) => {
                handleClick(e);
              }}
              className={path === "/settings" ? "active" : ""}
            >
              <Link to="/settings">
                <svg
                  className="icon-settings"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.08168 13.9445C2.55298 12.9941 2.28862 12.5188 2.28862 12C2.28862 11.4812 2.55298 11.0059 3.08169 10.0555L4.43094 7.63L5.85685 5.24876C6.4156 4.31567 6.69498 3.84912 7.14431 3.5897C7.59364 3.33028 8.13737 3.3216 9.22483 3.30426L12 3.26L14.7752 3.30426C15.8626 3.3216 16.4064 3.33028 16.8557 3.5897C17.305 3.84912 17.5844 4.31567 18.1431 5.24876L19.5691 7.63L20.9183 10.0555C21.447 11.0059 21.7114 11.4812 21.7114 12C21.7114 12.5188 21.447 12.9941 20.9183 13.9445L19.5691 16.37L18.1431 18.7512C17.5844 19.6843 17.305 20.1509 16.8557 20.4103C16.4064 20.6697 15.8626 20.6784 14.7752 20.6957L12 20.74L9.22483 20.6957C8.13737 20.6784 7.59364 20.6697 7.14431 20.4103C6.69498 20.1509 6.4156 19.6843 5.85685 18.7512L4.43094 16.37L3.08168 13.9445Z"
                    stroke="rgb(49 49 49 / 70%)"
                    strokeWidth="2"
                  ></path>
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="rgb(49 49 49 / 70%)"
                    strokeWidth="2"
                  ></circle>
                </svg>
                <span>{locale.Setting}</span>
              </Link>
            </li>
            <li onClick={() => logout()}>
              <a>
                <svg
                  className="icon-logout"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="fill"
                    d="M2 12L1.21913 11.3753L0.719375 12L1.21913 12.6247L2 12ZM11 13C11.5523 13 12 12.5523 12 12C12 11.4477 11.5523 11 11 11V13ZM5.21913 6.3753L1.21913 11.3753L2.78087 12.6247L6.78087 7.6247L5.21913 6.3753ZM1.21913 12.6247L5.21913 17.6247L6.78087 16.3753L2.78087 11.3753L1.21913 12.6247ZM2 13H11V11H2V13Z"
                    fill="rgb(49 49 49 / 70%)"
                  ></path>
                  <path
                    className="fill"
                    d="M13.3424 20.5571L13.5068 19.5707L13.3424 20.5571ZM20.9391 20.7477L21.5855 21.5107L20.9391 20.7477ZM15.0136 3.1644L14.8492 2.178L15.0136 3.1644ZM20.9391 3.25232L21.5855 2.4893L20.9391 3.25232ZM13.5068 4.42933L15.178 4.15079L14.8492 2.178L13.178 2.45654L13.5068 4.42933ZM21 9.08276V14.9172H23V9.08276H21ZM15.178 19.8492L13.5068 19.5707L13.178 21.5435L14.8492 21.822L15.178 19.8492ZM11 8.13193V7.38851H9V8.13193H11ZM11 16.6115V16.066H9V16.6115H11ZM13.5068 19.5707C12.6833 19.4334 12.1573 19.3439 11.7726 19.2294C11.4147 19.1228 11.301 19.0276 11.237 18.9521L9.71094 20.2449C10.1209 20.7288 10.6432 20.9799 11.202 21.1462C11.7339 21.3046 12.4052 21.4147 13.178 21.5435L13.5068 19.5707ZM9 16.6115C9 17.395 8.99818 18.0752 9.06695 18.626C9.13917 19.2044 9.30096 19.7609 9.71094 20.2449L11.237 18.9521C11.173 18.8766 11.0978 18.7487 11.0515 18.3782C11.0018 17.9799 11 17.4463 11 16.6115H9ZM21 14.9172C21 16.5917 20.9976 17.7403 20.8773 18.5879C20.7609 19.4077 20.5567 19.7611 20.2927 19.9847L21.5855 21.5107C22.3825 20.8356 22.7086 19.9176 22.8575 18.8689C23.0024 17.8479 23 16.5306 23 14.9172H21ZM14.8492 21.822C16.4406 22.0872 17.7396 22.3061 18.7705 22.3311C19.8294 22.3566 20.7885 22.1858 21.5855 21.5107L20.2927 19.9847C20.0288 20.2082 19.6467 20.3516 18.8189 20.3316C17.963 20.311 16.8297 20.1245 15.178 19.8492L14.8492 21.822ZM15.178 4.15079C16.8297 3.87551 17.963 3.68904 18.8189 3.66836C19.6467 3.64836 20.0288 3.79177 20.2927 4.01534L21.5855 2.4893C20.7885 1.81418 19.8294 1.64336 18.7705 1.66895C17.7396 1.69385 16.4406 1.91277 14.8492 2.178L15.178 4.15079ZM23 9.08276C23 7.46941 23.0024 6.15211 22.8575 5.13109C22.7086 4.08239 22.3825 3.16442 21.5855 2.4893L20.2927 4.01534C20.5567 4.23891 20.7609 4.59225 20.8773 5.41214C20.9976 6.25971 21 7.40829 21 9.08276H23ZM13.178 2.45654C12.4052 2.58534 11.7339 2.69537 11.202 2.85375C10.6432 3.0201 10.1209 3.27116 9.71094 3.75513L11.237 5.04788C11.301 4.97236 11.4147 4.87716 11.7726 4.77061C12.1573 4.65609 12.6833 4.56658 13.5068 4.42933L13.178 2.45654ZM11 7.38851C11 6.55366 11.0018 6.02008 11.0515 5.62183C11.0978 5.25128 11.173 5.1234 11.237 5.04788L9.71094 3.75513C9.30096 4.2391 9.13917 4.79555 9.06695 5.37405C8.99818 5.92484 9 6.60502 9 7.38851H11Z"
                    fill="rgb(49 49 49 / 70%)"
                  ></path>
                </svg>
                <span>{locale.Log_out}</span>
              </a>
            </li>
          </ul> */}
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
