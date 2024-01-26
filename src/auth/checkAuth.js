import { jwtDecode } from "jwt-decode";

export function isTokenExpired() {
  let token = localStorage.getItem("token");
  if (!token) {
    return true;
  }
  let decodedToken = jwtDecode(token);
  let currentDate = new Date();

  // JWT exp is in seconds
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    localStorage.removeItem("token");
    return true;
  } else {
    return false;
  }
}
