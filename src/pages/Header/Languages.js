import React, { useState } from "react";
import { ChangeLanguage } from "../../actions/auth";
import { useDispatch, useSelector } from "react-redux";

function Languages() {
  const dispatch = useDispatch();
  const locale = useSelector((state) => state.langReducer).locale;
  const [lang, setLang] = useState(locale);
  const changeLang = () => {
    dispatch(ChangeLanguage(lang == "EN" ? "NL" : "EN"));
    setLang(lang == "EN" ? "NL" : "EN");

  };
  return (
    <ul className="login-language-menu">
      <li className={`language-switcher ${lang == 'EN' ? 'lang-active':''}`} onClick={() => changeLang()}>
        <a href="#!" onClick={(e) => e.preventDefault()}>
          <span>EN</span>
        </a>
      </li>
      <li className={`language-switcher ${lang == 'NL' ? 'lang-active':''}`} onClick={() => changeLang()}>
        <a href="#!" onClick={(e) => e.preventDefault()}>
          <span>NL</span>
        </a>
      </li>
    </ul>
  );
}

export default Languages;
