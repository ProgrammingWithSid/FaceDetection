import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const FaceRecognition = () => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadModels = () => {
      return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models")
      ]).catch(error => {
        console.error("Error loading models:", error);
      });
    };

    const startVideo = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error starting video:", error);
      }
    };

    const detectFace = async () => {
      try {
        const video = videoRef.current;

        // Check if the video is ready
        if (video.readyState !== 4) {
          console.warn("Video is not ready yet.");
          return;
        }

        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        intervalRef.current = setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }, 100);
      } catch (error) {
        console.error("Error detecting face:", error);
      }
    };

    loadModels().then(startVideo).then(detectFace);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div>
      <h2>Face Recognition</h2>
      <video ref={videoRef} autoPlay muted width="640" height="480"></video>
    </div>
  );
};

export default FaceRecognition;
