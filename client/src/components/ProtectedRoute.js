import { message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/loadersSlice";

function ProtectedRoute({ children }) {
  const count = useRef(null);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetCurrentUser();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));

        const docTimestamp = new Date(response.data.createdAt); // timestamp from mongoDB

        const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds.

        const currentTimestamp = new Date(); // Current time.

        //  Calculate the time difference between the MongoDB timestamp and the current time.
        const differenceTimes = currentTimestamp - docTimestamp;

        if (
          localStorage.getItem("status") === null &&
          differenceTimes > twentyFourHoursInMilliseconds // Check if the difference is more than 24 hours (in milliseconds).
        ) {
          message.success("Welcome back " + response.data.name);
          localStorage.setItem("status", "success");
        } else if (localStorage.getItem("status") === null) {
          message.success("Welcome " + response.data.name);
          localStorage.setItem("status", "success");
        }
      } else {
        dispatch(SetUser(null));
        message.error("Something wrong, please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("status");
        navigate("/login");
      }
    } catch (error) {
      dispatch(SetUser(null));
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (count.current == null) {
      if (localStorage.getItem("token")) {
        getCurrentUser();
      } else {
        message.error("Please login first");
        navigate("/login");
      }
    }

    return () => {
      count.current = 1;
    };
  });

  return (
    user && (
      <div className="layout p-1">
        <div className="header bg-primary flex justify-between p-2">
          <div>
            <h1
              className="text-2xl text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              IWANMOVIES
            </h1>
          </div>

          <div className="bg-white p-1 flex gap-1">
            <i className="ri-shield-user-line text-primary"></i>
            <h1
              className="text-sm underline"
              onClick={() => {
                if (user.isAdmin) {
                  navigate("/admin");
                } else {
                  navigate("/profile");
                }
              }}
            >
              {user.name}
            </h1>

            <i
              className="ri-logout-box-r-line ml-2 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("status");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>
        <div className="content mt-1 p-1">{children}</div>
      </div>
    )
  );
}

export default ProtectedRoute;
