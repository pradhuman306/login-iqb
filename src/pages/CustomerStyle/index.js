import React from "react";
import HeaderContainer from "../Header/HeaderContainer";
import Languages from "../Header/Languages";
import UserMenu from "../Header/UserMenu";
import CustomerStyle from "./CustomerStyle";

function CustomerStyleContainer(props) {
  const locale = props.locale;
  return (
    <>
      <div className="body-content">
        <CustomerStyle {...props} />
      </div>
    </>
  );
}

export default CustomerStyleContainer;
