import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PDFFile from "./PDFFile";

const PDFview = () => (
  <>
    <PDFViewer>
      <PDFFile />
    </PDFViewer>
  </>
);

export default PDFview;
