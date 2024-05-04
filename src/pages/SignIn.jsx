import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SweetAlert } from "../utils/Alert";

export const SignIn = () => {
  const backgroundImageURL = "https://source.unsplash.com/Mv9hjnEUHR4/600x800";
  const inputRef = useRef();
  const [file, setFile] = useState();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("file_token");
    if (token) {
      navigate("/");
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleUserInfo = (event) => {
    setUserInfo((prev) => {
      return {
        ...prev,
        [event.target.id]: event.target.value,
      };
    });
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected File:", selectedFile);
    setFile(selectedFile);
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (userInfo.email === "" || userInfo.password === "") {
      SweetAlert("error", "No field should be empty", 2500);
    } else {
      try {
        setLoading(true);
        axios
          .post("http://localhost:8080/api/user/sign-in", userInfo)
          .then((res) => {
            setLoading(false);
            if (res.status === 200) {
              navigate("/");
              const token = res.data.token;
              localStorage.setItem("file_token", token);
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
            SweetAlert("error", error?.response?.data?.message, 2500);
          });
      } catch (error) {
        setLoading(false);
        console.log(error);
        SweetAlert("error", error?.response?.data?.message, 2500);
      }
    }
  };
  const singUpByExcel = async () => {
    if (file === null || file === "") {
      SweetAlert("error", "No file selected", 2500);
    } else {
      try {
        const formData = new FormData();
        formData.append("file", file);
        await axios
          .post(
            "http://localhost:8080/api/user/sign-in-via-excel",
            formData,

            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            const token = res.data.token;
            localStorage.setItem("file_token", token);
          })
          .then(() => navigate("/"))
          .then((res) => setFile(null));
      } catch (error) {
        console.log(error);
        SweetAlert("error", `${error?.response?.data?.errorMessage}`, 2500);
      }
    }
  };
  return (
    <div
      onSubmit={handleFormSubmit}
      className="h-full bg-gray-400 rounded-md dark:bg-gray-900 border"
    >
      <div className="mx-auto">
        <div className="flex justify-center px-6 py-7">
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            <div
              className="w-full h-auto bg-gray-400 dark:bg-gray-800 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
              style={{ backgroundImage: `url(${backgroundImageURL})` }}
            ></div>

            <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
              <h3 className="py-4 text-2xl text-center text-gray-800 dark:text-white">
                Log in Here !
              </h3>
              <form className="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded">
                <div className="mb-4">
                  <div className="mb-4"></div>
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    value={userInfo.email}
                    onChange={handleUserInfo}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="***********"
                    value={userInfo.password}
                    onChange={handleUserInfo}
                  />
                </div>

                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    {loading ? "Loading...!" : "Submit"}
                  </button>
                </div>

                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <a
                    className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="text-center">
                  <span className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline ">
                    Don't have an account yet ?{" "}
                    <Link
                      className="hover:underline font-semibold"
                      to={"/sign-up"}
                    >
                      Sing Up
                    </Link>
                  </span>
                </div>
              </form>
              <div className="mb-6 text-center">
                <input
                  type="file"
                  ref={inputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".xlsx, .xls"
                />
                {file === null || file === undefined ? (
                  <button
                    onClick={handleButtonClick}
                    className="w-full px-4 py-2 font-bold text-white bg-teal-700 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                  >
                    SignIn using Excel file
                  </button>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <div>
                      <button
                        disabled
                        className="w-full px-4 py-2 font-bold text-white bg-teal-700 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                      >
                        {file && file.name}
                      </button>
                    </div>

                    <div className="flex justify-center space-x-5">
                      <div>
                        <button
                          onClick={handleButtonClick}
                          className=" px-4 py-2 font-bold text-white bg-teal-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                        >
                          Choose another file
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={singUpByExcel}
                          className="w-full px-4 py-2 font-bold text-white bg-teal-700 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
