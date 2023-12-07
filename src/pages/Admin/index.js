import Tippy from "@tippyjs/react";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { GetCustomers } from "../../actions/customerAction";
import { GetUsers } from "../../actions/userAction";
import CustomLoader from "../Customloader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

function Admin(props) {
  const today_date = new Date();
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const locale = props.locale;
  const customerList = useSelector(
    (state) => state.customerReducer
  ).customerList;
  const pending = useSelector((state) => state.customerReducer).pending;
  const [searchedList, setList] = useState([...customerList]);
  const userList = useSelector((state) => state.userReducer).userList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetUsers());
    dispatch(GetCustomers());
  }, []);
  const [trial_cust, settrialCount] = useState(0);
  const [newData, setNewData] = useState([
    0, 34, 56, 78, 99, 101, 33, 44, 55, 66, 12, 1,
  ]);
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Octomber",
    "November",
    "December",
  ];
  const options = {
    responsive: true,
    scale: {
      ticks: {
        precision: 0,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Subscription",
        data: newData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  console.log(newData);
  useEffect(() => {
    if (customerList.length > 0) {
      let trial_count = 0;
      customerList.forEach((element) => {
        if (element.trial_period) {
          trial_count++;
        }
      });
      settrialCount(trial_count);
    }
    let tmp = customerList.filter((item, index) => {
      if (index <= 5) {
        if (!item.trial_period) {
          return true;
        }
      }
      return false;
    });
    setList([...tmp]);
    let tempData = [];
    for (let i = 0; i <= 11; i++) {
      let count = 0;
      customerList.forEach((item) => {
        if (new Date(item.start).getMonth() === i) {
          count++;
        }
      });
      tempData.push(count);
    }
    console.log(tempData);
    setNewData([...tempData]);
  }, [customerList]);
  const columns = useMemo(
    () => [
      {
        name: locale.Customer,
        selector: (row) => {
          let newName = row.name.split(" ");
          let firstC = newName[0][0];
          let lastC = "";
          if (newName[1]) {
            lastC = newName[1][0].toUpperCase();
          }
          return (
            <div className="user-wrap">
              <h5 className="user-icon">{firstC.toUpperCase() + lastC}</h5>
              <div className="user-detail">{row.name}</div>
            </div>
          );
        },
        sortable: true,
        // width: "250px",
      },
      {
        name: locale.User,
        selector: (row) => {
          return (
            <>
              {row.users.length >= 1 ? (
                <Tippy
                  content={
                    <ul className="">
                      {row.users.map((element, index) => (
                        <li key={element.id}>
                          {" "}
                          {element.firstname + " " + element.lastname}
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <span className="badge">{row.users.length}</span>
                </Tippy>
              ) : (
                ""
              )}
            </>
          );
        },
        sortable: true,
        hide: "md",
      },
      {
        name: "Type",
        selector: (row) => {
          return <span className="">Monthly</span>;
        },
        sortable: true,
        hide: "md",
      },

      {
        name: "Next due date",
        selector: (row) => (row.end ? row.end.split(" ")[0] : ""),
        sortable: true,
        hide: "md",
      },
    ],
    [locale]
  );
  return (
    <>
      {/* <div className="body-content">
        <div className="analytics">
          <div className="row">
            <div className="col-md-3">
              <div className="">
                <div className="total-customers">
                  {customerList.length}
                  <h6>Total customers</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="">
                <div className="total-users">
                  {userList.length}
                  <h6>Total users</h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="">
                <div className="trial-cust">
                  {trial_cust}{" "}
                  <h6>
                    {"Trial customer" + `${trial_cust.length > 1 ? "s" : ""}`}
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="">
                <div className="subs-cust">
                  {customerList.length - trial_cust}{" "}
                  <h6>
                    {"Subscriber" +
                      `${customerList.length - trial_cust > 1 ? "s" : ""}`}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="subscription-details mt-5">
            <h4 className="mb-3">Recent Subscriptions</h4>
            <DataTable
              columns={columns}
              data={searchedList}
              progressPending={pending}
              progressComponent={<CustomLoader />}
            />
            <Line options={options} data={data} />
          </div>
        </div>
      </div> */}
      <div className="body-content">
        <h1 className="mt-0 mb-3">
          {locale.Hello} 👋{" "}
          {props.auth.userdata.firstname + " " + props.auth.userdata.lastname},
        </h1>
        <h4 className="sub-heading mb-3">{locale.Welcome_note}</h4>

        <p>{locale.Customer_welcome_content}</p>
        <div className="alert alert-warning">{locale.Note}</div>
      </div>
    </>
  );
}

export default Admin;
