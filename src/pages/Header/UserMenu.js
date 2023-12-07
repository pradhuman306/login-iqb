import React, { useContext } from "react";
import AuthContext from "../../context/authContext";
import { useLocation, Link } from "react-router-dom";
function UserMenu(props) {
  const path = useLocation().pathname;
  const auth = useContext(AuthContext);
  const { role } = auth;
  const locale = props.locale;
  console.log(locale);
  return (
    <>
      {["customer", "super_admin"].includes(role) && (
        <ul className="management-menu">
          <li
            className={
              path === "/user-management" || path === "/user-access-mannagement"
                ? "active"
                : ""
            }
          >
            <a href="#!">{locale.User}</a>
            <ul className="dropdown-menu">
              <li>
                <Link to="/user-management">{locale.Management}</Link>
              </li>
              {role === "customer" && (
                <li>
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
            className={
              path === "/customer-management" || path === "/customer-style"
                ? "active"
                : ""
            }
          >
            <a href="#!">{locale.Customer}</a>
            <ul className="dropdown-menu">
              {role == "super_admin" && (
                <li>
                  <Link to="/customer-management">{locale.Management}</Link>
                </li>
              )}
              {role === "customer" && (
                <li>
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
            className={
              path === "/questionnaire-access-management" ||
              path === "/questionnaire-management"
                ? "active"
                : ""
            }
          >
            <a href="#!">{locale.Questionnaire}</a>
            <ul className="dropdown-menu">
              <li>
                <Link to="/questionnaire-management">{locale.Management}</Link>
              </li>
              {["super_admin"].includes(role) && (
                <li>
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
            <li>
              <Link to="/customer-style">{locale.Style}</Link>
            </li>
          )}
        </ul>
      )}
    </>
  );
}

export default UserMenu;
