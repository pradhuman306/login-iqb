import React, { useEffect } from "react";
import Languages from "./Languages";
import { langs } from "../../locale/localization";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LoggedInuserInfo } from "../../actions/auth";
import { getApolloClient } from "../../actions/appollo";
import { useQuery } from "@apollo/client";
import { GET_HEADER_OPTIONS, GET_MENUS } from "../../actions/query";

function LoginHeaderContainer() {
  const locale = langs(useSelector((state) => state.langReducer).locale);
  const style = useSelector((state) => state.styleReducer).style || null;
  const lang = useSelector((state) => state.langReducer).locale;
  const dispatch = useDispatch();
  const handleClick = (e) => {
    document.body.classList.toggle("menu-open");
    const navIcon = document.getElementById("nav-icon");
    navIcon.classList.toggle("open");
  };

  
  useEffect(() => {
    dispatch(LoggedInuserInfo());
  }, []);


  const apolloClient = getApolloClient();
  const menuNames = {
    EN: 'main-menu',   // Replace with your menu names
    NL: 'main-menu-ne',
    // Add more languages and menu names as needed
  };
  

  const { loading, error, data } = useQuery(GET_MENUS, {
    client: apolloClient,
  });

  const { loading:loadingHeader, error:errorHeader, data:dataHeader } = useQuery(GET_HEADER_OPTIONS, {
    client: apolloClient,
  });




  // if (loading) return ;
  if (error) return <p>Error: {error.message}</p>;


  const currentMenuName = menuNames[lang];
  const menus = data?.menus.nodes || [];


  // if (loadingHeader) return ;
  if (errorHeader) return <p>Error: {errorHeader.message}</p>;
  const header = dataHeader?.allHeader.nodes[0].header;

  return (
    <div className="body-header">

      {/* <div
        className="overlay-close"
        onClick={(e) => {
          handleClick(e);
        }}
      ></div> */}
      {loading ? <nav>
        <div className="login-navbar-header">
          <div className="container">
            <div className="navbar-inr">
              <div className="navbar-left">
                <Link to="/">
                  <img
                    src={
                      style && style.iqbstyle
                        ? style.iqbstyle.logo
                        : "/assets/images/logo.svg"
                    }
                    className="image"
                  />
                </Link>
              </div>
              <div className="navbar-center">

   
   
        <ul>
        
            <li >
              <a href="https://iqb-tool.com/">
           Home
          </a>
            </li>
            
            <li >
              <a href="https://iqb-tool.com/about-us">
           About Us
          </a>
            </li>
            
            <li >
              <a href="https://iqb-tool.com/forms">
           Forms
          </a>
            </li>
            
            <li >
            <a href="https://iqb-tool.com/contact-us">
           Contact Us
          </a>
            </li>
       
        </ul>
    
   

</div>
            
              <div className="navbar-right">
                <Languages />
                <div className="login-btn">
                  <Link className="btn btn-primary login-btn" to="/signin">
                    {locale.Login}
                  </Link>
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
          </div>
        </div>
      </nav>: <nav>
        <div className="login-navbar-header">
          <div className="container">
            <div className="navbar-inr">
              <div className="navbar-left">
                <Link to="/">
                  <img
                    src={
                      style && style.iqbstyle
                        ? style.iqbstyle.logo
                        : header.logo?.mediaItemUrl
                    }
                    className="image"
                  />
                </Link>
              </div>
              <div className="navbar-center">
  {menus.map(menu => (
    menu.name === currentMenuName && (
   
   
        <ul key={'main-menu'}>
          {menu.menuItems.nodes.map((item,i) => (
            <li key={i}>
              <a href={item.menus.menuUrl}>
             {item.label} 
          </a>
            </li>
          ))}
        </ul>
    
    )
  ))}

</div>
            
              <div className="navbar-right">
                <Languages />
                <div className="login-btn">
                  <Link className="btn btn-primary login-btn" to="/signin">
                    {locale.Login}
                  </Link>
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
          </div>
        </div>
      </nav>}
     
      <div className="responsive-navigation">
        <div className="container">
          <div className="res-navigation-inr">
            <div className="res-nav-wrap">
            {menus.map(menu => (
    menu.name === currentMenuName && (
   
   
        <ul key={'responsive-menu'}>
          {menu.menuItems.nodes.map((item,i) => (
            <li key={'res'+i}>
              <a href={item.menus.menuUrl}>
             {item.label} 
          </a>
            </li>
          ))}
        </ul>
    
    )
  ))}
              <div className="language-wrap">
                <p className="language-label">
                Language
                </p>
                <div className="language-toggle">
                <Languages />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginHeaderContainer;
