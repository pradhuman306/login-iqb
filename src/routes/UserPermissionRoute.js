import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { GetUsersPermissionList } from "../actions/questioerAction";

const UserPermissionRoute = (props) => {
  const dispatch = useDispatch();
  const userPermissionList = useSelector(
    (state) => state.getuserlistReducer
  ).usersList;
  const params = useParams();
  const id = params.id;
  console.log(id);
  console.log(props);
  let newFinalPermission = [];
  userPermissionList.forEach((element) => {
    newFinalPermission.push(element.id.toString());
  });

  useEffect(() => {
    // if (props.role.role === "user") {
    //   dispatch(
    //     getSingleCustomerPermission(
    //       customerdata[selectValue["selectCustomer"]].data.id
    //     )
    //   );
    // } else if (props.role.role === "customer") {
    //   dispatch(getSingleCustomerPermission(props.role.userdata.id));
    // } else {
    //   dispatch(GetUsersPermissionList());
    // }
    dispatch(GetUsersPermissionList());
  }, []);

  return newFinalPermission.includes(id) ? (
    props.children
  ) : (
    <Navigate to="dashboard" />
  );
};
export default UserPermissionRoute;
