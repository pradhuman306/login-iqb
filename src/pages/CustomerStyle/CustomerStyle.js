import React, { useEffect } from "react";
import IQBStyle from "./IQBStyle";
import PDFStyle from "./PDFStyle";
import { useSelector } from "react-redux";

function CustomerStyle(props) {
  let style = useSelector((state) => state.styleReducer).style;
  if (props.role && ["super_admin"].includes(props.role)) {
    style = props.style;
  }

  const locale = props.locale;

  useEffect(() => {}, [style]);

  return (
    <div className="customer-main">
      <div className="row">
        <div className="col-md-6">
        
          <div className="card style-card">
          <h2 className="mb-4">IQB {locale.Style}</h2>
            <IQBStyle {...props} style={style && style.iqbstyle} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card style-card">
          <h2 className="mb-4">PDF {locale.Style}</h2>
            <PDFStyle {...props} style={style && style.pdfstyle} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerStyle;
