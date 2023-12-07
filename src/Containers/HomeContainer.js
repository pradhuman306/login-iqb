import React, { useEffect } from "react";
import Admin from "../pages/Admin";
import Customer from "../pages/Customer";
import User from "../pages/User";
import { useDispatch, useSelector } from "react-redux";
import CustomLoader from "../pages/Customloader";
import { SET_PDF_DATA, SET_DOC_DATA } from "../constants/actionTypes";
import { langs } from "../locale/localization";
function HomeContainer(props) {
  const locale = langs(useSelector((state) => state.langReducer).locale);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authReducer);
  let pending = useSelector((state) => state.styleReducer).pending;
  useEffect(() => {
    if (["user"].includes(auth.role)) {
      dispatch({ type: SET_PDF_DATA, payload: [] });
      dispatch({ type: SET_DOC_DATA, payload: [] });
    }
  }, []);

  // const pending = true;
  if (["super_admin"].includes(auth.role)) {
    pending = false;
    localStorage.removeItem("style");
    document.documentElement.style.removeProperty("--baseFont");
    document.documentElement.style.removeProperty("--baseFontsize");
  }
  console.log(pending);
  return (
    <>
      {!pending ? (
        auth.role == "customer" ? (
          <Customer {...props} locale={locale} />
        ) : auth.role == "super_admin" ? (
          <Admin {...props} locale={locale} />
        ) : (
          <User {...props} locale={locale} />
        )
      ) : (
        <div className="main-loader">
          <CustomLoader />
        </div>
      )}
    </>
  );
}

export default HomeContainer;
