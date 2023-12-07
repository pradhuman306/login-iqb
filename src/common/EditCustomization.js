import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function EditCustomizations(props) {
  const attributesData = props.attributesData;
  const locale = props.locale;
  let attrData = {};
  if (attributesData !== null) {
    attributesData.forEach((item) => {
      console.log(item);
      if (item.value == "1" || item.value === true) {
        attrData[item.key] = true;
      }

      if (item.value !== "0" && item.value !== "1" && item.value !== false) {
        attrData[item.key] = item.value;
      }
    });
  }

  const [formData, setFormData] = useState(attrData);
  const [checkBoxData, setcheckBoxData] = useState(attrData);
  console.log(checkBoxData);
  const handleChange = (e) => {
    if (e.target.type !== "text") {
      checkBoxData[e.target.name] = !checkBoxData[e.target.name];
      setcheckBoxData({ ...checkBoxData });

      if (e.target.checked) {
        formData[e.target.name] = true;
      } else {
        delete formData[e.target.name];
      }
    } else {
      checkBoxData[e.target.name] = e.target.value;
      setcheckBoxData({ ...checkBoxData });
      if (e.target.value === "") {
        delete formData[e.target.name];
      } else {
        console.log(e.target.value);
        formData[e.target.name] = e.target.value;
      }
      setFormData(formData);
    }

    setFormData(formData);
    console.log(formData);
  };

  return (
    <div
      className="modal fade"
      id={`editcustomizations`}
      tabIndex="-1"
      aria-labelledby="editcustomizations1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4>{locale.Customize_the_questionnaire}</h4>
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img src="/assets/images/icon-close.svg" alt="" />
            </button>
          </div>
          <div className="modal-body justify-content-center">
            <div className="">
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mb-4">
                      <input
                        name="FML_SAVABLE"
                        type="checkbox"
                        className="form-control"
                        id="saveable"
                        checked={checkBoxData["FML_SAVABLE"]}
                        onChange={(e) => handleChange(e)}
                      />
                      <label htmlFor="saveable">
                        {locale.Is_this_questionnaire_type_FML}
                      </label>
                    </div>
                    <div
                      className={`form-group mb-4 fml_title_box ${
                        !checkBoxData["FML_SAVABLE"] ? "d-none" : ""
                      }`}
                    >
                      <label htmlFor="fml_title">
                        {" "}
                        {locale.Enter_FML_title}
                      </label>
                      <input
                        name="FML_TITLE"
                        type="text"
                        className="form-control"
                        id="fml_title"
                        value={checkBoxData["FML_TITLE"]}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mb-4">
                      <input
                        name="UNCAT_VISIBLE"
                        type="checkbox"
                        checked={checkBoxData["UNCAT_VISIBLE"]}
                        className="form-control"
                        id="uncategorized"
                        onChange={(e) => handleChange(e)}
                      />
                      <label htmlFor="uncategorized">
                        {locale.Do_Uncategorized_section_visible_on_frontend}
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              data-bs-dismiss="modal"
              className="btn btn-primary"
              onClick={() => props.yes(formData)}
            >
              {locale.Save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCustomizations;
