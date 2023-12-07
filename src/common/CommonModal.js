import React from "react";
import { useState } from "react";

function CommonModal(props) {
  const [date, setDate] = useState("");
  const handleChange = (e) => {
    setDate(e.target.value);
  };
  let Todaydate = new Date();
  let month = Todaydate.getMonth() + 1;
  let day = Todaydate.getDate();
  let year = Todaydate.getFullYear();

  let maxDate = year + "-" + month + "-" + day;

  return (
    <div
      className="modal fade"
      id={`common_${props.id}`}
      tabIndex="-1"
      aria-labelledby="commonModal"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4>Select the retention period</h4>
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
            <form>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group mb-4">
                    <label htmlFor="">Select Date</label>
                    <input
                      name="retention_period"
                      type="date"
                      placeholder=""
                      className="form-control"
                      min={maxDate}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                data-bs-dismiss={date !== "" ? "modal" : "test"}
                className="btn btn-primary"
                id="save"
                onClick={() => props.yes(date)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommonModal;
