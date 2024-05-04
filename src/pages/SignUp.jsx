import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SweetAlert } from "../utils/Alert";
import axios from "axios";

export const SignUp = () => {
  const backgroundImageURL = "https://source.unsplash.com/Mv9hjnEUHR4/600x800";
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    c_password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("file_token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setUserInfo((prevUserInfo) => {
      return {
        ...prevUserInfo,
        [event.target.id]: event.target.value,
      };
    });
  };
  const signUpUser = async (data) => {
    try {
      setLoading(true);
      await axios
        .post("http://localhost:8080/api/user/sign-up", data)
        .then((res) => {
          if (res.status === 200) {
            SweetAlert("success", `User signed up successfully`, 2500).then(
              () => navigate("/sign-in")
            );
          }
        })
        .then(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      console.log("error===>", error?.response?.data?.errorMessage);
      SweetAlert("error", `${error?.response?.data?.errorMessage}`, 2500);
    }
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { password, c_password, username, email } = userInfo;
    if (password === "" || email === "" || username === "") {
      SweetAlert("error", "No field should be empty", 2500);
    } else if (password !== c_password) {
      SweetAlert("error", "Passwords do not match", 2500);
    } else {
      const user = {
        user_name: username,
        password: password,
        email: email,
      };
      signUpUser(user);
    }
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile);
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
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
            "http://localhost:8080/api/user/sign-up-via-excel",
            formData,

            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then(() => navigate("/sign-in"))
          .then((res) => setFile(null));
      } catch (error) {
        console.log(error);
        SweetAlert("error", `${error?.response?.data?.errorMessage}`, 2500);
      }
    }
  };

  return (
    <div className="h-full bg-gray-400 rounded-md dark:bg-gray-900 border">
      <div className="mx-auto">
        <div className="flex justify-center px-6 py-7">
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            <div
              className="w-full h-auto bg-gray-400 dark:bg-gray-800 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
              style={{ backgroundImage: `url(${backgroundImageURL})` }}
            ></div>

            <div className="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
              <h3 className="py-4 text-2xl text-center text-gray-800 dark:text-white">
                Create an Account!
              </h3>
              <form
                onSubmit={handleFormSubmit}
                className="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded"
              >
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="username"
                    >
                      First Name
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      value={userInfo.username}
                      onChange={handleChange}
                      placeholder="First Name"
                      autoComplete="off"
                    />
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="mb-4">
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
                    value={userInfo.email}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border border-red-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      placeholder="******************"
                      value={userInfo.password}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 dark:text-white"
                      htmlFor="c_password"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="c_password"
                      type="password"
                      value={userInfo.c_password}
                      onChange={handleChange}
                      placeholder="******************"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    {loading ? <span>Loading...</span> : "Register Account"}
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
                  <span className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800">
                    Already have an account?{" "}
                    <Link
                      className="hover:underline font-semibold"
                      to={"/sign-in"}
                    >
                      Login!
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
                    SignUp using Excel file
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
