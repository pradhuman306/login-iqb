import {  gql } from '@apollo/client';
export const GET_MENUS = gql`
query Menus {
    menus {
      nodes {
        id
        name
        menuItems {
          nodes {
            id
            label
            uri
            url
            menus {
              menuUrl
            }
          }
        }
      }
    }
  }
`;

export const GET_HEADER_OPTIONS = gql`
query MyQuery {
    allHeader {
      nodes {
        header {
          logo {
            mediaItemUrl
          }
        }
      }
    }
  }
`;

export const GET_FOOTER_OPTIONS = gql`
query NewQuery($languages: [LanguageCodeEnum!] = EN) {
    allFooter(where: {languages: $languages}) {
      nodes {
        title
        footer {
          logo {
            mediaItemUrl
          }
          belowLogoContent
          builtWithText
          copyrightText
          email
          letsConnectText
          socialMedia {
            icon 
            url
          }
          buildWithSite
          footerCopyrightSite
        }
      }
    }
  }
`;