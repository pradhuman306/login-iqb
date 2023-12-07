import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdatePDFStyle } from "../../actions/customerAction";
import ButtonLoader from "../Customloader/ButtonLoader";

function PDFStyle(props) {
  const dispatch = useDispatch();
  const [btnPending, setBtnPending] = useState(false);
  const locale = props.locale;
  const [values, setValues] = useState({
    titlecolor: props.style ? props.style.titlecolor : "#ff0000",
    headercolor: props.style ? props.style.headercolor : "#000000",
    backgroundcolor: props.style ? props.style.backgroundcolor : "#dadada",
  });
  const [img, setImg] = useState(props.style ? props.style.logo : null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setImg(props.style ? props.style.logo : null);
    setValues({
      titlecolor: props.style ? props.style.titlecolor : "#ff0000",
      headercolor: props.style ? props.style.headercolor : "#000000",
      backgroundcolor: props.style ? props.style.backgroundcolor : "#dadada",
    });
  }, [props.style]);

  const handleChange = (e, name) => {
    if (name == "pdflogo") {
      if (
        e.target.files[0].type === "image/png" ||
        e.target.files[0].type === "image/jpeg"
      ) {
        if (e.target.files[0].size <= 300000) {
          setValues({ ...values, ...{ logo: e.target.files[0] } });
          setImg(URL.createObjectURL(e.target.files[0]));
          setError(null);
        } else {
          setError("File size Exceeds 300.");
        }
      } else {
        setError("Only .jpg and .png format are allowed");
      }
    } else {
      setValues({
        ...values,
        ...{ [name]: e.target.value },
      });
    }
  };

  const saveData = () => {
    ["super_admin"].includes(props.role)
      ? (values.customer_id = props.id)
      : (values.customer_id = props.auth.userdata.id);
    if (!values.logo) {
      values.old_logo = img;
      delete values.logo;
    }
    setBtnPending(true);
    dispatch(UpdatePDFStyle(values, locale, setBtnPending));
  };
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="">{locale.Title_color}</label>
            <div className="colorBox">
              <span>{values.titlecolor}</span>
              <input
                type="color"
                className="colorInput"
                name="colorprime"
                value={values.titlecolor}
                onChange={(e) => handleChange(e, "titlecolor")}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="">{locale.Header_color}</label>

            <div className="colorBox">
              <span>{values.headercolor}</span>

              <input
                type="color"
                className="colorInput"
                name="colorprime"
                value={values.headercolor}
                onChange={(e) => handleChange(e, "headercolor")}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="">{locale.Background_color}</label>

            <div className="colorBox">
              <span>{values.backgroundcolor}</span>

              <input
                type="color"
                className="colorInput"
                value={values.backgroundcolor}
                onChange={(e) => handleChange(e, "backgroundcolor")}
              />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="form-group mb-3 cs-border">
            <label htmlFor="">Logo</label>
            <div className="row">
              <div className="col-md-9">
                <div
                  className="image-input"
                  data-toggle="tooltip"
                  data-placement="top"
                  data-bs-original-title="Upload pdf image"
                >
                  <input
                    type="file"
                    name="pdf_letter_pad"
                    id="pdf_letter_pad"
                    className=""
                    placeholder="Enter letter_pad"
                    onChange={(e) => handleChange(e, "pdflogo")}
                  />
                  <div className="upload-img">
                    <label htmlFor="pdf_letter_pad" className="image-button">
                      <img src="/assets/images/icon-image.svg" alt="" />
                      {locale.Upload_logo_here}{" "}
                    </label>
                  </div>
                </div>
                <span>{locale.Support_format}</span>
              </div>
              <div className="col-md-3">
                <div className="logo-wrapper">
                  {img && <img className="preview-img" src={img} alt="" />}
                </div>
              </div>
            </div>

            {error && (
              <span className="error" style={{ color: "red" }}>
                {error}
              </span>
            )}
          </div>
        </div>

        <div className="col-md-12">
          <div className="form-group">
            <button className="btn btn-primary" onClick={() => saveData()}>
            {btnPending ? <ButtonLoader/> :locale.Save}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PDFStyle;
