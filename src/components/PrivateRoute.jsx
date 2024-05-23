import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import checkTokenAndNavigate from "../utils/JwtDecode";
import Swal from "sweetalert2";

const PrivateRoute = () => {
  const [validUser, setValidUser] = useState(false);
  const token = localStorage.getItem("file_token");
  useEffect(() => {
    if (!checkTokenAndNavigate(token)) {
      localStorage.removeItem("file_token");
    }
  }, []);

  return token && checkTokenAndNavigate(token) ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default PrivateRoute;
