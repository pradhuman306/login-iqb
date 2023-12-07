import { PDFDownloadLink, usePDF } from "@react-pdf/renderer";
import {
  SET_PDF_DATA,
  SET_PDF_PENDING,
  GET_PDF_DATA,
  SET_PDF_URL,
} from "../constants/actionTypes";
import PDFFile from "../pages/Pdf/PDFFile";

const initialState = {
  pdfData: [],
  pending: true,
  pdfUrl: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PDF_DATA:
      return {
        ...state,
        pdfData: action.payload.length > 0 ? [action.payload[0]] : [],
        pending: false,
      };
    case SET_PDF_PENDING:
      return {
        ...state,
        pending: true,
      };
    case GET_PDF_DATA:
      return {
        ...state,
        pending: false,
      };
    case SET_PDF_URL:
      return {
        ...state,
        pdfUrl: action.payload,
      };

    default:
      return state;
  }
}
