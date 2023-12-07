import React from "react";
import { Link } from "react-router-dom";
import { langs } from "../../locale/localization";
import { useSelector } from "react-redux";
import { getApolloClient } from "../../actions/appollo";
import { GET_FOOTER_OPTIONS, GET_MENUS } from "../../actions/query";
import { useQuery } from "@apollo/client";

function Footer(props) {
  // const locale = props.locale;
  const date = new Date();
  const apolloClient = getApolloClient();
  const locale = langs(useSelector((state) => state.langReducer).locale);
  const style = useSelector((state) => state.styleReducer).style || null;
  const lang = useSelector((state) => state.langReducer).locale;

  const footerMenuNames = {
    EN: 'footer-menu',   // Replace with your menu names
    NL: 'footer-menu-nl',
    // Add more languages and menu names as needed
  };
  
  const { loading:loadingFooter, error:errorFooter, data:dataFooter } = useQuery(GET_FOOTER_OPTIONS, {
    client: apolloClient,
    variables: {
      languages: lang, // Adjust to match your GraphQL enum format
    },
  });


  const { loading:loadingMenu, error:errorMenu, data:dataMenu } = useQuery(GET_MENUS, {
    client: apolloClient,
    variables: {
      languages: lang, // Adjust to match your GraphQL enum format
    },
  });

  

  if (loadingFooter) return <p>Loading...</p>;
if (errorFooter) return <p>Error: {errorFooter.message}</p>;

const footer = dataFooter.allFooter.nodes[0].footer;

if (loadingMenu) return <p>Loading...</p>;
if (errorMenu) return <p>Error: {errorMenu.message}</p>;
const currentMenuNameFooter = footerMenuNames[lang];
console.log(dataMenu);
const menusFooter = dataMenu.menus.nodes || [];

  return (
    <div className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-box footer-logo">
            <Link to="/">
              <img
                src={
                  style && style.iqbstyle
                    ? style.iqbstyle.logo
                    : footer.logo.mediaItemUrl
                }
                className="image"
              />
            </Link>
            <p>
            {footer.belowLogoContent}
              {/* <span>{locale.Achieving_more_with_less}</span> <span className="seprator"></span>{" "}
              <span>{locale.Quick_and_easy_form_obligation}</span> */}
            </p>
          </div>
         
        {menusFooter.map(menu => (
          menu.name === currentMenuNameFooter && (
            
            <React.Fragment key={menu.name}>
              
              <div className="footer-box">
              <ul className="footer-links">
  {menu.menuItems.nodes.slice(0, 3).map((item,i) => (
    <li key={'main1'+i}>
    <a href={item.menus.menuUrl}>
             {item.label} 
             </a>
    </li>
  ))}
</ul>
</div>

<div className="footer-box">
              <ul className="footer-links">
  {menu.menuItems.nodes.slice(3).map((item,i) => (
    <li key={'main2'+i}>
      <a href={item.menus.menuUrl}>
        {item.label} 
      </a>
    </li>
  ))}
</ul>
</div>
</React.Fragment>
          )
        ))}
      
    
        
          <div className="footer-box footer-last-box">
            <h4>{footer.letsConnectText}</h4>
            <ul className="footer-address">
              <li>
                <a className="decoration" href={"mailto:"+footer.email}>
                {footer.email}
                </a>
              </li>
            </ul>
            <ul className="social-menu">
      {footer.socialMedia.map((social,i)=>(
        <li key={'icon'+i}><a href={social.url}><div  dangerouslySetInnerHTML={{__html: social.icon}} /></a></li>
      ))}
    </ul>
          
          </div>
        </div>
        <div className="footer-bottom">
          <p>
          © {date.getFullYear()}{" "}
            <a href="#" className="decoration">
            {footer.footerCopyrightSite}
            </a>{" "}
            |  {footer.copyrightText}
          </p>
          <p>
           {footer.builtWithText} ❤ <a href="https://nextige.com/"> {footer.buildWithSite}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
