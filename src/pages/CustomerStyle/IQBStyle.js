import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { UpdateStyle, getFontFamily } from "../../actions/customerAction";
import Select from "react-select";
import ButtonLoader from "../Customloader/ButtonLoader";

const fs = [
  { value: "12px", label: "12px" },
  { value: "13px", label: "13px" },
  { value: "14px", label: "14px" },
  { value: "15px", label: "15px" },
  { value: "16px", label: "16px" },
  { value: "17px", label: "17px" },
  { value: "18px", label: "18px" },
];

function IQBStyle(props) {
  const locale = props.locale;
  const dispatch = useDispatch();
  const [btnPending, setBtnPending] = useState(false);
  useEffect(() => {
    dispatch(getFontFamily());
  }, []);

  const fontfamilylist = useSelector(
    (state) => state.customerReducer
  ).fontfamilylist;

  const [values, setValues] = useState({
    font_family: props.style ? props.style.font_family : "Inter",
    font_size: props.style ? props.style.font_size : "14px",
    primary_color: props.style ? props.style.primary_color : "#dedede",
    secondary_color: props.style ? props.style.secondary_color : "#000000",
  });
  const [img, setImg] = useState(props.style ? props.style.logo : null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setImg(props.style ? props.style.logo : null);
    setValues({
      ...values,
      font_family: props.style ? props.style.font_family : "Inter",
      font_size: props.style ? props.style.font_size : "14px",
      primary_color: props.style ? props.style.primary_color : "#dedede",
      secondary_color: props.style ? props.style.secondary_color : "#000000",
    });
  }, [props.style]);

  const handleChange = (e, name) => {
    if (name == "logo") {
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
      // console.log(e);

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
    dispatch(UpdateStyle(values, locale, setBtnPending));
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="">{locale.Font_family}</label>

            <Select
              style={{ width: "100%" }}
              options={fontfamilylist}
              name="font_family"
              // defaultValue={{
              //   value: values.font_family,
              //   label: values.font_family,
              // }}
              value={{
                value: values.font_family,
                label: values.font_family,
              }}
              onChange={(e) =>
                handleChange({ target: { value: e.value } }, "font_family")
              }
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="">{locale.Font_size}</label>
            <Select
              style={{ width: "100%" }}
              options={fs}
              name="font_size"
              value={{ value: values.font_size, label: values.font_size }}
              onChange={(e) =>
                handleChange({ target: { value: e.value } }, "font_size")
              }
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="">{locale.Primary_color}</label>
            <div className="colorBox">
              <span>{values.primary_color}</span>
              <input
                type="color"
                className="colorInput"
                name="primary_color"
                value={values.primary_color}
                onChange={(e) => handleChange(e, "primary_color")}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="">{locale.Secondary_color}</label>
            <div className="colorBox">
              <span>{values.secondary_color}</span>

              <input
                type="color"
                className="colorInput"
                value={values.secondary_color}
                name="secondary_color"
                onChange={(e) => handleChange(e, "secondary_color")}
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
                  data-bs-original-title="Upload image"
                >
                  <input
                    type="file"
                    name="letter_pad"
                    id="letter_pad"
                    className=""
                    placeholder="Enter letter_pad"
                    onChange={(e) => handleChange(e, "logo")}
                  />
                  <input
                    type="hidden"
                    name="old_letter_pad"
                    id="old_letter_pad"
                    value=""
                  />
                  <label htmlFor="letter_pad" className="image-button">
                    <img src="/assets/images/icon-image.svg" alt="" />
                    {locale.Upload_logo_here}{" "}
                  </label>
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
            <button
              disabled={error}
              className="btn btn-primary"
              onClick={() => saveData()}
            >
             {btnPending ? <ButtonLoader/> :locale.Save}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default IQBStyle;
