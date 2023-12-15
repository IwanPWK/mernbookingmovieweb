import { message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
// import { HideLoading, ShowLoading } from "../redux/loadersSlice";

function ProtectedRoute({ children }) {
  const count = useRef(null);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      //   dispatch(ShowLoading());
      const response = await GetCurrentUser();
      console.log(response);
      //   dispatch(HideLoading());
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
        // dispatch(SetUser(null));
        dispatch(SetUser(null));
        message.error("Something wrong, please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("status");
        navigate("/login");
      }
    } catch (error) {
      dispatch(SetUser(null));
      //   dispatch(HideLoading());
      //   dispatch(SetUser(null));
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
      <div>
        {user.name}
        {children}
      </div>
    )
  );
}

export default ProtectedRoute;