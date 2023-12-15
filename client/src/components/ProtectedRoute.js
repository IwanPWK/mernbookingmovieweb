import { message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { SetUser } from "../redux/usersSlice";
// import { HideLoading, ShowLoading } from "../redux/loadersSlice";

function ProtectedRoute({ children }) {
  const count = useRef(null);
  const [user, setUser] = useState(null);
  //   const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      //   dispatch(ShowLoading());
      const response = await GetCurrentUser();
      console.log(response);
      //   dispatch(HideLoading());
      if (response.success) {
        // dispatch(SetUser(response.data));
        setUser(response.data);
        if (
          localStorage.getItem("status") === null &&
          localStorage.getItem("user") === "OK"
        ) {
          message.success("Welcome back " + response.data.name);
          localStorage.setItem("status", "success");
        } else if (localStorage.getItem("status") === null) {
          message.success("Welcome " + response.data.name);
          localStorage.setItem("status", "success");
        }
      } else {
        // dispatch(SetUser(null));
        setUser(null);
        message.error("Something wrong, please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("status");
        localStorage.setItem("user", "OK");
        navigate("/login");
      }
    } catch (error) {
      setUser(null);
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
