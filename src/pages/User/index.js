import React from "react";
import HeaderContainer from "../Header/HeaderContainer";

function User(props) {
  const locale = props.locale;
  return (
    <>
      <div className="body-content">
        <h1 className="mt-0 mb-3">
          {locale.Hello} 👋{" "}
          {props.auth.userdata.firstname + " " + props.auth.userdata.lastname},
        </h1>
        <h4 className="sub-heading mb-3">{locale.Welcome_note}</h4>
        <p>{locale.Customer_welcome_content}</p>
        <div className="alert alert-warning">{locale.Note}</div>
      </div>
    </>
  );
}

export default User;
