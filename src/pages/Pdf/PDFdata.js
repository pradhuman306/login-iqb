// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getPdfData } from "../../actions/customerAction";
import PDFFile from "./PDFFile";

const PDFdata = (props) => {
  //   const dispatch = useDispatch();
  //   const pdfData = useSelector((style) => style.pdfReducer);
  //   const pdfContent = pdfData.pdfData;
  //   const pending = pdfData.pending;
  //   console.log(pdfContent);
  //   useEffect(() => {
  //     dispatch(getPdfData());
  //   }, []);
  return <>{<PDFFile data={props} />}</>;
};
export default PDFdata;
