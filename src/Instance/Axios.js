import axios from "axios";

const instance = axios.create({
  //   baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://localhost:8080",
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Insert authorization token on request call
    const alkem_token = localStorage.getItem("file_token");
    config.headers["Authorization"] = `Bearer ${alkem_token}`;

    return window.navigator.onLine
      ? config
      : Promise.reject({
          response: {
            data: { message: "Check your internet connection", status: 1 },
            status: 400,
          },
        });
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("file_token");

      window.location.href = "/sign-in";
    } else {
      return Promise.reject(error.response);
    }
  }
);

export default instance;
