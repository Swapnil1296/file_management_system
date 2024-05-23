import { jwtDecode } from "jwt-decode";
const checkTokenAndNavigate = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return false;
  }
};

export default checkTokenAndNavigate;
