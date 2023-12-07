import React, { useEffect } from "react";
import Router from "./routes/index";
import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { langs } from "./locale/localization";

import "react-toastify/dist/ReactToastify.css";

// import HeaderContainer from "./pages/Header/HeaderContainer";

function App() {
  const auth = useSelector((state) => state.authReducer);
  const message = useSelector((state) => state.toasterReducer);
  const locale = langs(useSelector((state) => state.langReducer).locale);
  const path = window.location.pathname.replaceAll("/", "");
  const dispatch = useDispatch();
  let style = useSelector((state) => state.styleReducer).style || null;
  console.log(auth);
  useEffect(() => {
    switch (message.type) {
      case "success":
        toast.success(message.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
        });
        break;
      case "error":
        toast.error(message.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
        });
        break;
      case "warning":
        toast.warning(message.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
        });
        break;
      default:
        toast.info(message.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
        });
        break;
    }
  }, [message]);

  const convertToRGB = (str) => {
    if (str.length != 6) {
      throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = str.match(/.{1,2}/g);
    var aRgb = [
      parseInt(aRgbHex[0], 16),
      parseInt(aRgbHex[1], 16),
      parseInt(aRgbHex[2], 16),
    ];
    return aRgb;
  };

  useEffect(() => {
    if (["customer", "user"].includes(auth.role)) {
      let primaryColor = convertToRGB(
        style.iqbstyle.primary_color.substring(1)
      );
      let secondryColor = convertToRGB(
        style.iqbstyle.secondary_color.substring(1)
      );
      document.documentElement.style.setProperty("--themeColor", secondryColor);
      document.documentElement.style.setProperty("--acentColor", primaryColor);
      document.documentElement.style.setProperty(
        "--baseFontsize",
        style.iqbstyle.font_size
      );
      document.documentElement.style.setProperty(
        "--baseFont",
        style.iqbstyle.font_family
      );
      const link = document.createElement("link");
      if (style === null) {
        link.href = "/assets/images/logo.svg";
      } else {
        link.href = style.iqbstyle.logo;
      }
      link.rel = "shortcut icon";
      document.getElementsByTagName("head")[0].appendChild(link);

      const fontFamilylink = document.createElement("link");
      if (style === null) {
        fontFamilylink.href =
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      } else {
        fontFamilylink.href =
          "https://fonts.googleapis.com/css2?family=" +
          style.iqbstyle.font_family.replaceAll(" ", "+") +
          ":wght@400;500;600;700&display=swap";
      }
      fontFamilylink.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(fontFamilylink);
    } else {
      document.documentElement.style.removeProperty("--themeColor");
      document.documentElement.style.removeProperty("--acentColor");
    }
  }, [style]);

  console.log("🚀 ~ file: App.js ~ line 44 ~ App ~ message", message);

  return (
    <>
      {style === null && (
        <link
          href={
            "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          }
          rel="stylesheet"
        ></link>
      )}

      <BrowserRouter>
        <Router auth={auth} locale={locale} />
        <ToastContainer limit={2} autoClose={1000} />
      </BrowserRouter>
    </>
  );
}

export default App;
