const User = require('mongoose').model('User');
const mongoose = require('mongoose');
require('../models/User');
const faceapi = require('face-api.js');
const { canvas, faceDetectionNet, faceDetectionOptions } = faceapi;
const fs = require('fs');
const path = require('path');
const { loadImage } = require('canvas');



function ensureTempDirectoryExists() {
  const tempDirectory = path.join(__dirname, '..', 'temp'); // Assuming the temp directory is in the parent directory of the current file
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory);
  }
}

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
}

async function detectFaces(imagePath) {
  console.log(imagePath)
  const img = await loadImage(imagePath);
  const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();
  return detections;
}

async function detectFacesController(faceImage) {
  try {
      // Convert base64 image data to image buffer
      ensureTempDirectoryExists();
      const base64Data = faceImage.replace(/^data:image\/jpeg;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Write image buffer to a temporary file
        const tempImagePath = path.join(__dirname, '..', 'temp', 'tempImage.jpg');
        fs.writeFileSync(tempImagePath, imageBuffer);

        // Load face-api models
        await loadModels();

        // Detect faces in the uploaded image
        const detections = await detectFaces(tempImagePath);

      return detections
  } catch (error) {
      console.error('Error detecting faces:', error);
      res.status(500).json({ success: false, error: 'Error detecting faces' });
  }
}

const Register = async (req, res) => {
    try {
      console.log(req.body)
      const { name, email, age,phone, faceImage} = req.body; // Include landmarks and descriptors in the request body
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      const detections = await detectFacesController(faceImage)
      console.log('faceImae',faceImage);
      console.log('detection',detections)
      const newUser = new User({
        name : name,
        email: email,
        age: age,
        phone: phone,
        faceImage : faceImage,
        detection : detections
      })
      await newUser.save();
  
      res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }
  
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  const uploadImage = async (req, res) => {
    try {
      const { image } = req.body;
      // Here, you can process the uploaded image (e.g., save it to the server, perform face recognition, etc.)
      console.log("Received image:", image);
      // Send a response indicating the successful upload
      res
        .status(200)
        .json({ success: true, message: "Image uploaded successfully" });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  module.exports = {
    Register,
    Login,
    uploadImage
  }