// export * from "./routes";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import LayoutContainer from "../Containers/LayoutContainer";
import HomeContainer from "../Containers/HomeContainer";
import ResetPassword from "../pages/ResetPassword";
import CreateNewPassword from "../pages/ResetPassword/CreateNewPassword";
import Setting from "../pages/Setting";
import Signin from "../pages/Signin";
import UserManagement from "../pages/UserManagement";
import CustomerManagement from "../pages/CustomerManagement";
import CustomerStyleContainer from "../pages/CustomerStyle";
import QuestionnaireAccessManagement from "../pages/AccessManagemet/QuestionnaireAccessManagement";
import UserAccessManagement from "../pages/AccessManagemet/UserAccessManegement";
import ViewCustomer from "../pages/CustomerManagement/ViewCustomer";
import ViewUser from "../pages/UserManagement/ViewUser";
import QuestionnaireBuilder from "../pages/QuestionBuilder/QuestionnaireBuilder";
import QuestionnaireManagement from "../pages/AccessManagemet/QuestionnaireManagement";
import Invoicing from "../pages/Invoice/Invoicing";
import QuestionnaireView from "../pages/ViewQuestions/QuestionnaireView";
import QuestionnaireEdit from "../pages/QuestionBuilder/QuestionnaireEdit";
import PDFview from "../pages/Pdf/PDFview";
import CustomerPermissionRoute from "./CustomerPermissionRoute";
import { useSelector } from "react-redux";
import { langs } from "../locale/localization";
import Resetlink from "../pages/ResetPassword/Resetlink";

import EmailTemplate from "../pages/EmailTemplate";
import RequestAccess from "../pages/RequestAccess";
import SubscriptionExpired from "../pages/SubscriptionExpired";
import RegistrationEmail from "../pages/EmailTemplate/RegistrationEmail";

function Router(props) {
  const { auth } = props;
  const logged_in_route = localStorage.getItem("logged_in_route")
    ? atob(localStorage.getItem("logged_in_route"))
    : "/signin";
  const locale = langs(useSelector((state) => state.langReducer).locale);

  return (
    <Routes>
      {!props.auth.isAuthenticated && (
        <>
          <Route
            key="signin"
            path="signin"
            element={<Signin locale={locale} />}
          />
          <Route
            key="signincustomer"
            path="signin/:customer"
            element={<Signin locale={locale} />}
          />
          <Route
            key="reset-password"
            path="reset-password"
            element={<ResetPassword locale={locale} />}
          />
          <Route
            key="reset-link"
            path="reset-link"
            element={<Resetlink locale={locale} />}
          />

          <Route
            key="reset-password_token"
            path="reset-password/:token"
            element={<CreateNewPassword locale={locale} />}
          />

          <Route
            key="RequestAccess"
            path="request-access"
            element={<RequestAccess locale={locale} />}
          />


        </>
      )}
      {auth.isAuthenticated && (
        <>
          <Route
            key="dashboard"
            path="dashboard"
            element={
              <PrivateRoute>
                <LayoutContainer
                  auth={auth}
                  children={<HomeContainer {...props} locale={locale} />}
                />
              </PrivateRoute>
            }
          />
          <Route
            key="settings"
            path="settings"
            element={
              <PrivateRoute>
                <LayoutContainer
                  auth={auth}
                  children={<Setting {...props} locale={locale} />}
                />
              </PrivateRoute>
            }
          />
          {["customer", "super_admin"].includes(auth.role) && (
            <Route
              key="user-management"
              path="user-management"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={<UserManagement {...props} locale={locale} />}
                  />
                </PrivateRoute>
              }
            />
          )}
          {["super_admin"].includes(auth.role) && (
            <Route
              key="questionnaire-builder"
              path="questionnaire-builder"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={
                      <QuestionnaireBuilder {...props} locale={locale} />
                    }
                  />
                </PrivateRoute>
              }
            />
          )}

          <Route
            key="subscription-expired"
            path="subscription-expired"
            element={
              <LayoutContainer
                auth={auth}
                children={<SubscriptionExpired {...props} locale={locale} />}
              />
            }
          />

          {["customer", "super_admin"].includes(auth.role) && (
            <Route
              key="view-user"
              path="/user/:id"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={<ViewUser {...props} locale={locale} />}
                  />
                </PrivateRoute>
              }
            />
          )}
          {["user", "customer"].includes(auth.role) && (
            <Route
              key="questionnaire-view"
              path="/questionnaire/:id"
              element={
                <PrivateRoute>
                  <LayoutContainer auth={auth}>
                    <CustomerPermissionRoute>
                      {/* <UserPermissionRoute {...props}> */}
                      <QuestionnaireView {...props} locale={locale} />

                      {/* </UserPermissionRoute> */}
                    </CustomerPermissionRoute>
                  </LayoutContainer>
                </PrivateRoute>
              }
            />
          )}

          <Route
            key="pdf-view"
            path="pdf"
            element={
              <PrivateRoute>
                <LayoutContainer
                  auth={auth}
                  children={<PDFview {...props} locale={locale} />}
                />
              </PrivateRoute>
            }
          />

          {["super_admin"].includes(auth.role) && (
            <>
              <Route
                key="questionnaire-edit"
                path="/questionnaire-edit/:id"
                element={
                  <PrivateRoute>
                    <LayoutContainer
                      auth={auth}
                      children={
                        <QuestionnaireEdit {...props} locale={locale} />
                      }
                    />
                  </PrivateRoute>
                }
              />
              <Route
                key="email-template"
                path="email-template"
                element={
                  <PrivateRoute>
                    <LayoutContainer
                      auth={auth}
                      children={<EmailTemplate {...props} locale={locale} />}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                key="Registration-template"
                path="registration-template"
                element={
                <PrivateRoute>   
                  <LayoutContainer
                  auth={auth}
                  children={<RegistrationEmail {...props} locale={locale} />}
                />
                </PrivateRoute>}
              />
            </>
          )}

          {["super_admin"].includes(auth.role) && (
            <Route
              key="customer-management"
              path="customer-management"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={<CustomerManagement {...props} locale={locale} />}
                  />
                </PrivateRoute>
              }
            />
          )}
          {["super_admin"].includes(auth.role) && (
            <Route
              key="view-customer"
              path="customer/:id"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={<ViewCustomer {...props} locale={locale} />}
                  />
                </PrivateRoute>
              }
            />
          )}
          {["customer"].includes(auth.role) && (
            <Route
              key="customer-style"
              path="customer-style"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={
                      <CustomerStyleContainer {...props} locale={locale} />
                    }
                  />
                </PrivateRoute>
              }
            />
          )}
          {["super_admin"].includes(auth.role) && (
            <Route
              key="questionnaire-access-management"
              path="questionnaire-access-management"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={
                      <QuestionnaireAccessManagement
                        {...props}
                        locale={locale}
                      />
                    }
                  />
                </PrivateRoute>
              }
            />
          )}

          {["super_admin"].includes(auth.role) && (
            <Route
              key="questionnaire-management"
              path="questionnaire-management"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={
                      <QuestionnaireManagement {...props} locale={locale} />
                    }
                  />
                </PrivateRoute>
              }
            />
          )}

          {["super_admin"].includes(auth.role) && (
            <Route
              key="invoicing"
              path="invoicing"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={<Invoicing {...props} locale={locale} />}
                  />
                </PrivateRoute>
              }
            />
          )}

          {["customer"].includes(auth.role) && (
            <Route
              key="user-access-mannagement"
              path="user-access-mannagement"
              element={
                <PrivateRoute>
                  <LayoutContainer
                    auth={auth}
                    children={
                      <UserAccessManagement {...props} locale={locale} />
                    }
                  />
                </PrivateRoute>
              }
            />
          )}
        </>
      )}
      <>
        <Route
          path="*"
          element={
            <Navigate
              to={auth.isAuthenticated ? "/dashboard" : logged_in_route}
            />
          }
        />
      </>
    </Routes>
  );
}

export default Router;
