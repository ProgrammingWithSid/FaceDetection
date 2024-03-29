import React, {useState} from "react";
import AuthForm from "./components/AuthForm";
import WebCamCapture from "./components/WebCamCapture";

// import FaceRecognition from "./FaceRecognition"; 

function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(true);
   const handleLogin =() => {
    setIsLoggedIn(false);
   };

  return (
    <div className="App">
      <h1>Face Recognition Web Application</h1>
      {/* Render either the AuthForm or FaceRecognition based on user authentication status */}
      {isLoggedIn ? <AuthForm onLogin={handleLogin}/> : <WebCamCapture/>}
    </div>
  );
}

export default App;
