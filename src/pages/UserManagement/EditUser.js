import React, { useRef, useState, useEffect } from "react";
import { editUser } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOM_COMPONENTS } from "../../common/CustomSelect";
import Select from "react-select";
import { GetCustomers } from "../../actions/customerAction";
import ButtonLoader from "../Customloader/ButtonLoader";
function EditUser(props) {
  const locale = props.locale;
  const elementRef = useRef();
  const dispatch = useDispatch();
  const [userData, setUser] = useState({ ...props.user });
  // const [selCustomer, setSelCustomer] = useState([]);
  let selCustomer = [];
  const message = useSelector((state) => state.toasterReducer);
  const loggedIncustomer =
    localStorage.getItem("customerdata") &&
    JSON.parse(localStorage.getItem("customerdata"));
  const [customerSelected, setCustomer] = useState([]);
  const [btnPending, setBtnPending] = useState(false);
  useEffect(() => {
    setBtnPending(false);
  }, [message]);
  const [inputValues, setInputValue] = useState({
    "customer_id[]": ["customer"].includes(props.auth.role)
      ? props.auth.userdata.id
      : [],
    firstname: "",
    id: "",
    lastname: "",
    email: "",
    startdate: "",
    enddate: "",
    phone: "",
    searchable: "",
    activate: false,
  });
  const cid = props.auth.userdata.id;
  useEffect(() => {
    setUser({ ...props.user });
  }, [props.id]);
  useEffect(() => {
    dispatch(GetCustomers());
  }, []);
  const handleChangeSelect = (e) => {
    let newArray = [];
    setInputValue({ ...inputValues, "customer_id[]": e });
    e.map((item) => {
      newArray.push(item.value);
    });

    setCustomer([...newArray]);
  };

  useEffect(() => {
    let selCusId = [];
    const {
      id,
      firstname,
      lastname,
      email,
      phone,
      start,
      end,
      searchable_expire,
      activate,
      customer,
    } = props.user;

    if (customer != undefined) {
      customer.map((item) => {
        let newName = item.name.split(" ");
        console.log(newName);
        let FirstC = newName[0][0].toUpperCase();
        let LastC = "";
        if (newName[1] !== undefined) {
          LastC = newName[1][0].toUpperCase();
        }
        selCustomer.push({
          key: item.customer_id,
          value: item.customer_id,
          label: item.name,
          shortForm: FirstC + LastC,
        });
        selCusId.push(item.customer_id);
      });
    }

    ["customer"].includes(props.auth.role)
      ? setCustomer(props.auth.userdata.id)
      : setCustomer(selCusId);

    if (Object.keys(userData).length != 0) {
      setInputValue({
        "customer_id[]": ["customer"].includes(props.auth.role)
          ? props.auth.userdata.id
          : selCustomer,
        firstname: firstname,
        lastname: lastname,
        email: email,
        id: id,
        startdate: start?.split(" ")[0],
        enddate: end ? end.split(" ")[0] : "",
        phone: phone,
        searchable: searchable_expire ? searchable_expire.split(" ")[0] : "",
        activate: activate,
      });
    }
  }, [userData]);
  console.log(userData);
  const customerData = useSelector(
    (state) => state.customerReducer
  ).customerList;

  const customerList = [];
  customerData &&
    customerData.map((item) => {
      let newName = item.name.split(" ");
      let FirstC = newName[0][0].toUpperCase();
      let LastC = "";

      if (newName[1] !== undefined) {
        LastC = newName[1][0].toUpperCase();
      }

      customerList.push({
        value: item.customer_id,
        label: item.name,
        shortForm: FirstC + LastC,
      });
    });

  const [validation, setValidation] = useState({
    phone: false,
    "customer_id[]": ["customer"].includes(props.auth.role) ? true : false,
    firstname: false,
    lastname: false,
    email: false,
    startdate: false,
  });

  const [touched, setTouched] = useState({
    phone: false,
    "customer_id[]": false,
    firstname: false,
    lastname: false,
    email: false,
    startdate: false,
  });

  //handle submit updates
  function handleChange(event) {
    const { name, value } = event.target;
    if (name == "firstname" || name == "lastname") {
      let newValue = value.charAt(0).toUpperCase() + value.slice(1);
      setInputValue({ ...inputValues, [name]: newValue });
    } else if (name === "activate") {
      setInputValue({ ...inputValues, [name]: event.target.checked });
    } else {
      setInputValue({ ...inputValues, [name]: value });
    }
    //setTouched({ ...touched, [name]: true });
  }

  const checkValidation = () => {
    let errors = validation;
    //first Name validation
    if (!inputValues.firstname) {
      errors.firstname = locale.First_name_is_required;
    } else {
      errors.firstname = false;
    }
    if (!inputValues.startdate) {
      errors.startdate = locale.Start_date_is_required;
    } else {
      errors.startdate = false;
    }

    //Customer Name validation
    if (inputValues["customer_id[]"].length <= 0) {
      errors["customer_id[]"] = locale.Customer_name_is_required;
    } else {
      errors["customer_id[]"] = false;
    }

    //last Name validation
    if (!inputValues.lastname) {
      errors.lastname = locale.Last_name_is_required;
    } else {
      errors.lastname = false;
    }
    //last Name validation
    if (!inputValues.phone) {
      errors.phone = locale.Phone_no_is_required;
    } else {
      errors.phone = false;
    }
    //last Name validation
    if (!inputValues.email) {
      errors.email = locale.Email_is_required;
    } else if (
      inputValues.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputValues.email)
    ) {
      errors.email = locale.Email_invalid;
    } else {
      errors.email = false;
    }
    setValidation(errors);
    if (
      errors["customer_id[]"] == false &&
      errors.firstname == false &&
      errors.lastname == false &&
      errors.phone == false &&
      errors.email == false &&
      errors.startdate == false
    ) {
      return true;
    }
  };

  useEffect(() => {
    Object.keys(userData).length != 0 && checkValidation();
  }, [inputValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let tmp = { ...inputValues };
    if (checkValidation()) {
      setBtnPending(true);
      tmp["customer_id[]"] = customerSelected;
      if (props.auth.role === "super_admin") {
        if (props.cid) {
          dispatch(
            editUser({
              values: tmp,
              uid: props.cid,
              modal: elementRef.current,
              locale: locale,
            })
          );
        } else {
          dispatch(
            editUser({
              values: tmp,
              modal: elementRef.current,
              id: props.id,
              locale: locale,
            })
          );
        }
      } else {
        dispatch(
          editUser({
            values: tmp,
            uid: props.auth.userdata.id,
            modal: elementRef.current,
            locale: locale,
          })
        );
      }
    } else {
      let errors = {};
      if (
        validation["customer_id[]"] != false
        // != false ||
        // validation["customer_id[]"] != []
      ) {
        errors["customer_id[]"] = true;
      }
      if (validation.firstname != false) {
        errors.firstname = true;
      }
      if (validation.startdate != false) {
        errors.startdate = true;
      }

      if (validation.phone != false) {
        errors.phone = true;
      }
      if (validation.email != false) {
        errors.email = true;
      }
      if (validation.lastname != false) {
        errors.lastname = true;
      }
      setTouched({ ...errors });
    }
  };

  return (
    <div
      className="modal right fade"
      id="editUser"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content right-modal">
          <div className="modal-head">
            <h4>{locale.Edit + " " + locale.User} </h4>
            <a
              onClick={(e) => e.preventDefault()}
              ref={elementRef}
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img src="/assets/images/icon-close.svg" alt="" />
            </a>
          </div>
          <div className="modal-body">
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <div className="form-fields-wrap">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4 customselect">
                      <label>{locale.Customer + " " + locale.Name}</label>
                      {["customer"].includes(props.auth.role) ? (
                        <Select
                          style={{ width: "100%" }}
                          isDisabled={true}
                          value={{
                            label: loggedIncustomer.data.name,
                            value: cid,
                          }}
                        />
                      ) : (
                        <>
                          <Select
                            style={{ width: "100%" }}
                            isMulti
                            components={CUSTOM_COMPONENTS}
                            options={customerList}
                            name="customer_id[]"
                            value={inputValues["customer_id[]"]}
                            onChange={(e) => handleChangeSelect(e)}
                            onBlur={() =>
                              setTouched({ ...touched, "customer_id[]": true })
                            }
                          />

                          <span className="error">
                            {validation["customer_id[]"] &&
                              touched["customer_id[]"] &&
                              validation["customer_id[]"]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label>{locale.Searchable}</label>
                      <div className="input-group date" id="datepicker1">
                        <input
                          type="date"
                          className="form-control"
                          name="searchable"
                          onChange={(e) => handleChange(e)}
                          value={inputValues.searchable}
                        />
                      </div>
                      <span className="error">
                        {" "}
                        {validation.searchable &&
                          touched.searchable &&
                          validation.searchable}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label>
                        {locale.First_name}<span className="error">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        value={inputValues.firstname}
                        onBlur={() =>
                          setTouched({ ...touched, firstname: true })
                        }
                      />

                      <span className="error">
                        {" "}
                        {validation.firstname &&
                          touched.firstname &&
                          validation.firstname}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label>
                        {locale.Last_name}<span className="error">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        onBlur={() =>
                          setTouched({ ...touched, lastname: true })
                        }
                        value={inputValues.lastname}
                      />
                      <span className="error">
                        {" "}
                        {validation.lastname &&
                          touched.lastname &&
                          validation.lastname}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label>
                        {locale.Phone_No}<span className="error">*</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        onChange={(e) => handleChange(e)}
                        value={inputValues.phone}
                        onBlur={() => setTouched({ ...touched, phone: true })}
                      />
                      <span className="error">
                        {" "}
                        {validation.phone && touched.phone && validation.phone}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label>
                        {locale.Email_address}<span className="error">*</span>
                      </label>
                      <input
                        type="text"
                        name="email"
                        onChange={(e) => handleChange(e)}
                        className="form-control"
                        value={inputValues.email}
                        onBlur={() => setTouched({ ...touched, email: true })}
                      />
                      <span className="error">
                        {message.type === "error" ? message.message : ""}
                        {validation.email && touched.email && validation.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label>{locale.Start_date}</label>
                      <span className="error">*</span>
                      <div className="input-group date" id="datepicker1">
                        <input
                          type="date"
                          onChange={(e) => handleChange(e)}
                          className="form-control"
                          name="startdate"
                          value={inputValues.startdate}
                          onBlur={() =>
                            setTouched({ ...touched, startdate: true })
                          }
                        />
                      </div>
                      <span className="error">
                        {" "}
                        {validation.startdate &&
                          touched.startdate &&
                          validation.startdate}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label>{locale.End_date}</label>

                      <div className="input-group date" id="datepicker2">
                        <input
                          type="date"
                          onChange={(e) => handleChange(e)}
                          className="form-control"
                          name="enddate"
                          value={inputValues.enddate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group mb-4">
                      <label htmlFor="switch">
                        {locale.User + " " + locale.Status}
                      </label>
                      <div className="toggle-switch">
                        {/* <Field
                                type="checkbox"
                                className="form-control"
                                name="activate"
                                id="switch"
                              /> */}
                        <input
                          type="checkbox"
                          className="form-control"
                          name="activate"
                          id="switch"
                          checked={inputValues.activate}
                          value={inputValues.activate}
                          onChange={(e) => handleChange(e)}
                        />
                        <label htmlFor="switch">Toggle</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="frm-btn-wrap">
                <div className="row">
                  <div className="col-md-12 text-center mt-4">
                    <button type="submit" className="btn btn-primary m-auto">
                      {btnPending ? <ButtonLoader /> : locale.Submit}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
