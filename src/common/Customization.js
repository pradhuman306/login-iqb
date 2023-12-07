import React from "react";
import { useState } from "react";

function Customizations(props) {
  const locale = props.locale;
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    if (e.target.type !== "text") {
      if (e.target.checked) {
        formData[e.target.name] = true;
        if (e.target.name === "FML_SAVABLE") {
          document.querySelector(".fml_title_box").classList.remove("d-none");
        }
      } else {
        if (e.target.name === "FML_SAVABLE") {
          document.querySelector(".fml_title_box").classList.add("d-none");
        }
        delete formData[e.target.name];
      }
    } else {
      if (e.target.value === "") {
        delete formData[e.target.name];
      } else {
        formData[e.target.name] = e.target.value;
      }
    }
    setFormData(formData);
    console.log(formData);
  };
  return (
    <div
      className="modal fade"
      id={`customizations`}
      tabIndex="-1"
      aria-labelledby="customizations1"
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
                        onChange={(e) => handleChange(e)}
                      />
                      <label htmlFor="saveable">
                        {locale.Is_this_questionnaire_type_FML}
                      </label>
                    </div>
                    <div className="form-group mb-4 d-none fml_title_box">
                      <label htmlFor="fml_title">
                        {" "}
                        {locale.Enter_FML_title}
                      </label>
                      <input
                        name="FML_TITLE"
                        type="text"
                        className="form-control"
                        id="fml_title"
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mb-4">
                      <input
                        name="UNCAT_VISIBLE"
                        type="checkbox"
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
    </div>
  );
}

export default Customizations;
