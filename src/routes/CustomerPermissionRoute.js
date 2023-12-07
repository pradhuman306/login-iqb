import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { getSingleCustomerPermission } from "../actions/customerAction";
import { SET_CUST_PERM_PENDING } from "../constants/actionTypes";
import CustomLoader from "../pages/Customloader";

const CustomerPermissionRoute = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;

  let selectedCustomer = useSelector(
    (state) => state.switchCustomerReducer
  ).selectedCustomer;
  console.log(props.children.props.auth.role);
  const customerPermission = useSelector(
    (state) => state.customerPermissionsReducer
  ).customerPermissionsList;
  const pending = useSelector(
    (state) => state.customerPermissionsReducer
  ).pending;

  useEffect(() => {
    dispatch({ type: SET_CUST_PERM_PENDING });
    if (["customer"].includes(props.children.props.auth.role)) {
      dispatch(
        getSingleCustomerPermission(props.children.props.auth.userdata.id)
      );
    } else {
      dispatch(getSingleCustomerPermission(selectedCustom.data.id));
    }
  }, []);
  let allPermissions = [];
  if (customerPermission.length > 0) {
    customerPermission.forEach((item) => {
      allPermissions.push(item.id.toString());
    });
  }
  const [permission, setPermission] = useState(allPermissions);

  let selectedCustom = localStorage.getItem("selCustomer")
    ? JSON.parse(localStorage.getItem("selCustomer"))
    : localStorage.getItem("customerdata")
    ? JSON.parse(localStorage.getItem("customerdata"))[0]
    : {};

  useEffect(() => {
    dispatch({ type: SET_CUST_PERM_PENDING });
    if (selectedCustomer === {}) {
      selectedCustomer = selectedCustom;
    }

    let allPermissions = [];
    if (customerPermission.length > 0) {
      customerPermission.forEach((item) => {
        allPermissions.push(item.id.toString());
      });
    }
    setPermission(allPermissions);
    console.log(selectedCustomer);
  }, [selectedCustomer, customerPermission]);
  console.log(permission);
  if (permission.includes(id)) {
    return props.children;
  } else {
    return <Navigate to="dashboard" />;
  }
};
export default CustomerPermissionRoute;
