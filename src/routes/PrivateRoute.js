import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { totalDayLeftSubscription } from "../actions/auth";
import * as localStorage from "../common/localStorage";
import Container from "../pages/SubscriptionExpired/Container";
function PrivateRoute({ children, auth }) {
  const nav = useNavigate();
  const userData = useSelector((state) => state.authReducer).userdata;
  const token = localStorage.get("iqb_token")
    ? atob(localStorage.get("iqb_token"))
    : null;
  const logged_in_route = localStorage.get("logged_in_route")
    ? atob(localStorage.get("logged_in_route"))
    : "/signin";
  const trial_days = totalDayLeftSubscription(userData);

  if (["customer"].includes(children.props.auth.role)) {
    if (trial_days < 1) {
      nav("/subscription-expired");
      return <Container auth={children.props.auth} />;
    }
  }

  return token ? children : <Navigate to={logged_in_route} />;
}
export default PrivateRoute;
