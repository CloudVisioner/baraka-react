import { error } from "console";

// Get API URL from environment variable with fallback
const apiUrl = process.env.REACT_APP_API_URL;
export const serverApi: string = apiUrl || "http://localhost:3003";

// Debug logging (remove in production)
if (!apiUrl) {
  console.warn("⚠️ REACT_APP_API_URL is not set. Using default:", serverApi);
} else {
  console.log("✅ API URL configured:", serverApi);
}

export const Messages = {
    error1: "Something went wrong!",
    error2: "Please login first",
    error3: "Please fulfill all inputs!",
    error4: "Message is empty",
    error5: "Only images with jpeg, jpg, png format allowed!",
}