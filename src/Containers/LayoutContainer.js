import React, { useContext, useState } from "react";
import SideNav from "../pages/SideNav";
import AuthContext from "../context/authContext";
import CustomLoader from "../pages/Customloader";
import HeaderContainer from "../pages/Header/HeaderContainer";
function LayoutContainer({ children, auth }) {
  const [pending, setPending] = useState(false);

  const customerChange = (para) => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 2000);
  };

  return (
    <>
      <AuthContext.Provider value={{ ...auth }}>
        <HeaderContainer
          {...auth}
          // title={locale.Customer + " " + locale.Management}
        />
        <main className="">
          {!pending ? (
            <>
              <SideNav
                role={auth}
                parentCallback={(para) => {
                  customerChange(para);
                }}
              />
              <section className="body-main">{children}</section>{" "}
            </>
          ) : (
            <div className="full-body-loader">
              <CustomLoader />
            </div>
          )}
        </main>
      </AuthContext.Provider>
    </>
  );
}

export default LayoutContainer;
