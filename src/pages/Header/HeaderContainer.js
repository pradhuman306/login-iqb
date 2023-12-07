import React, { useEffect } from "react";
import UserMenu from "./UserMenu";
import { langs } from "../../locale/localization";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { LoggedInuserInfo } from "../../actions/auth";
import { signout } from "../../actions/auth";
import LanguageOne from "./LanguageOne";
import Languages from "./Languages";

function HeaderContainer(props) {
  const locale = langs(useSelector((state) => state.langReducer).locale);
  const style = useSelector((state) => state.styleReducer).style || null;
  const role = props.role.role;
  console.log("abc", props);
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const handleClick = (e) => {
    document.body.classList.toggle("menu-open");
    const navIcon = document.getElementById("nav-icon");
    navIcon.classList.toggle("open");
  };

  const logout = (e) => {
    document.body.classList.remove("menu-open");
    dispatch(signout(locale));
  };

  useEffect(() => {
    dispatch(LoggedInuserInfo());
  }, []);
  return (
    <div className="body-header">
      <div
        className="overlay-close"
        onClick={(e) => {
          handleClick(e);
        }}
      ></div>
      <nav>
        <div className="navbar-header">
          <div className="navbar-left">
            <Link to="/">
              <img
                src={
                  ["super_admin"].includes(role)
                    ? "/assets/images/logo.svg"
                    : style && style.iqbstyle
                    ? style.iqbstyle.logo
                    : "/assets/images/logo.svg"
                }
                alt=""
              />
            </Link>
          </div>
          <div className="navbar-right">
            <UserMenu locale={locale} />
            {/* <LanguageOne /> */}
            <Languages/>
            <div className="loggedIn-wrap">
              <a
                href="#"
                className="active-user"
              >
                <div className="user-profile">
                  <h4>{props.userdata.firstname[0].toUpperCase()}
                  {props.userdata.lastname[0].toUpperCase()}</h4>
                </div>
                <div className="user-dtl">
                  <h4>{props.userdata.firstname} {props.userdata.lastname}</h4>
                  <p className="user-type">{props.role}</p>
                </div>
              </a>
              <ul className="dropdown-menu">
                <li
                  className={path === "/settings" ? "active" : ""}
                >
                  <Link to="/settings">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_187_2628)">
                        <path
                          className="fill"
                          d="M7.50022 4.77295C5.9964 4.77295 4.77295 5.9964 4.77295 7.50022C4.77295 9.00404 5.9964 10.2275 7.50022 10.2275C9.00404 10.2275 10.2275 9.00404 10.2275 7.50022C10.2275 5.9964 9.00404 4.77295 7.50022 4.77295ZM7.50022 8.86386C6.74831 8.86386 6.13659 8.25213 6.13659 7.50022C6.13659 6.74831 6.74831 6.13659 7.50022 6.13659C8.25213 6.13659 8.86386 6.74831 8.86386 7.50022C8.86386 8.25213 8.25213 8.86386 7.50022 8.86386Z"
                          fill="#0E0B3D"
                        />
                        <path
                          className="fill"
                          d="M14.5368 9.216L12.9454 7.8175C12.9516 7.71155 12.9547 7.6055 12.9547 7.5C12.9547 7.39445 12.9516 7.28841 12.9454 7.18246L14.5367 5.784C14.7808 5.56945 14.8395 5.21241 14.677 4.93095L13.3134 2.56905C13.1509 2.28759 12.8123 2.15991 12.5044 2.26409L10.498 2.94291C10.3207 2.826 10.1368 2.71964 9.94757 2.62445L9.5323 0.548091C9.46861 0.229409 9.18875 0 8.86375 0H6.13648C5.81148 0 5.53162 0.229409 5.46789 0.548091L5.05262 2.62445C4.86339 2.71964 4.67957 2.82605 4.50225 2.94291L2.49566 2.26409C2.18793 2.16 1.84925 2.28759 1.68671 2.56905L0.32307 4.93095C0.16057 5.21241 0.219297 5.56945 0.463434 5.784L2.05471 7.18246C2.04862 7.28827 2.04557 7.39432 2.04557 7.5C2.04557 7.60568 2.04862 7.71177 2.05475 7.81755L0.463479 9.216C0.219343 9.43055 0.160615 9.78759 0.323115 10.069L1.68675 12.4309C1.8493 12.7124 2.18789 12.84 2.49571 12.7359L4.50221 12.057C4.67952 12.174 4.86339 12.2803 5.05262 12.3755L5.46789 14.4519C5.53162 14.7706 5.81148 15 6.13648 15H8.86375C9.18875 15 9.46861 14.7706 9.5323 14.4519L9.94757 12.3755C10.1368 12.2804 10.3206 12.174 10.4979 12.0571L12.5045 12.7359C12.8123 12.84 13.1509 12.7125 13.3134 12.431L14.6771 10.069C14.8397 9.78759 14.7809 9.43055 14.5368 9.216ZM12.4121 11.265L10.6063 10.6541C10.3917 10.5816 10.1551 10.6203 9.97489 10.7574C9.69952 10.9669 9.39943 11.1405 9.08298 11.2735C8.87439 11.3611 8.7228 11.5465 8.67843 11.7684L8.3048 13.6364H6.69543L6.32184 11.7684C6.27748 11.5465 6.12589 11.3611 5.9173 11.2735C5.60066 11.1405 5.30062 10.9669 5.02543 10.7574C4.84521 10.6202 4.60866 10.5815 4.39398 10.6541L2.58816 11.265L1.78348 9.87127L3.21498 8.61323C3.3848 8.464 3.46962 8.24027 3.44139 8.016C3.42002 7.84605 3.40921 7.67245 3.40921 7.5C3.40921 7.32755 3.42002 7.15395 3.44143 6.984C3.46966 6.75968 3.38484 6.536 3.21502 6.38673L1.78348 5.12868L2.58816 3.73491L4.39402 4.34582C4.60862 4.41836 4.84512 4.37968 5.02539 4.24259C5.30071 4.03309 5.6008 3.85945 5.9173 3.7265C6.12589 3.63886 6.27748 3.4535 6.32184 3.23159L6.69543 1.36364H8.3048L8.67839 3.23164C8.72275 3.4535 8.87434 3.63891 9.08293 3.72655C9.39943 3.8595 9.69952 4.03314 9.9748 4.24264C10.155 4.37977 10.3916 4.4185 10.6062 4.34591L12.4119 3.73505L13.2166 5.12877L11.7852 6.38682C11.6154 6.536 11.5306 6.75955 11.5588 6.98373C11.5802 7.15455 11.591 7.32827 11.591 7.50005C11.591 7.67182 11.5802 7.84555 11.5588 8.01636C11.5306 8.24059 11.6155 8.46414 11.7852 8.61332L13.2168 9.87136L12.4121 11.265Z"
                          fill="#0E0B3D"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_187_2628">
                          <rect width="15" height="15" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>{locale.Setting}</span>
                  </Link>
                </li>
                <li onClick={() => logout()}>
                  <a href="#!">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <path
                        d="M9.375 1.875H11.875C12.2065 1.875 12.5245 2.0067 12.7589 2.24112C12.9933 2.47554 13.125 2.79348 13.125 3.125V11.875C13.125 12.2065 12.9933 12.5245 12.7589 12.7589C12.5245 12.9933 12.2065 13.125 11.875 13.125H9.375"
                        stroke="#0E0B3D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.46967 3.21967C4.76256 2.92678 5.23744 2.92678 5.53033 3.21967C5.82322 3.51256 5.82322 3.98744 5.53033 4.28033L3.68566 6.125H9.375C9.78921 6.125 10.125 6.46079 10.125 6.875C10.125 7.28921 9.78921 7.625 9.375 7.625H3.68566L5.53033 9.46967C5.82322 9.76256 5.82322 10.2374 5.53033 10.5303C5.23744 10.8232 4.76256 10.8232 4.46967 10.5303L1.34467 7.40533C1.19822 7.25888 1.125 7.06694 1.125 6.875C1.125 6.77331 1.14524 6.67634 1.18191 6.58791C1.21851 6.49945 1.27276 6.41658 1.34467 6.34467L4.46967 3.21967Z"
                        fill="#0E0B3D"
                      />
                    </svg>
                    <span>{locale.Log_out}</span>
                  </a>
                </li>
              </ul>
            </div>
            <div
              className="sideToggle"
              onClick={(e) => {
                handleClick(e);
              }}
            >
              <div id="nav-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    d="M1.875 4.75H13.125"
                    stroke="#232323"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.875 10.75H13.125"
                    stroke="#232323"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  className="open-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.28033 2.21967C3.98744 1.92678 3.51256 1.92678 3.21967 2.21967C2.92678 2.51256 2.92678 2.98744 3.21967 3.28033L6.68934 6.75L3.21967 10.2197C2.92678 10.5126 2.92678 10.9874 3.21967 11.2803C3.51256 11.5732 3.98744 11.5732 4.28033 11.2803L7.75 7.81066L11.1746 11.2353C11.4675 11.5282 11.9424 11.5282 12.2353 11.2353C12.5282 10.9424 12.5282 10.4675 12.2353 10.1746L8.81066 6.75L12.2353 3.32538C12.5282 3.03249 12.5282 2.55761 12.2353 2.26472C11.9424 1.97183 11.4675 1.97183 11.1746 2.26472L7.75 5.68934L4.28033 2.21967Z"
                    fill="#232323"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default HeaderContainer;
