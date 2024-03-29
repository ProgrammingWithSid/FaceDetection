import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const WebCamCapture = ({ onLogin, onCapture }) => {
  const webcamRef = React.useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const captureSnapshot = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log("Captured image source:", imageSrc); // Log the captured image source

    if (imageSrc) {
      // Set the captured image in the state
      setCapturedImage(imageSrc);
      console.log(imageSrc)
      onCapture(imageSrc); // Pass captured image to parent component

      try {
        const response = await axios.post("/api/uploadImage", {
          image: imageSrc,
        });
        console.log("Image uploaded successfully:", response.data);
        // Once image is uploaded, proceed with login
        onLogin();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("No image captured");
    }
  };

  useEffect(() => {
    console.log("Captured image state:", capturedImage);
  }, [capturedImage]);

  return (
    <div>
      <h2>Webcam Capture</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        mirrored={true}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
      />
      <button onClick={captureSnapshot}>Capture Snapshot</button>
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" />
        </div>
      )}
    </div>
  );
};

export default WebCamCapture;
