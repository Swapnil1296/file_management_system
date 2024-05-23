const express = require("express");
const {
  UploadFiles,
  DownloadFiles,
  getUserUploadedFiles,
  DeleteFiles,
  uploadAudio,
} = require("../controllers/file.controller");
const multer = require("multer");
const app = require("../config/firebaseConfig");
const { FileValidation } = require("../helpers/validateFile");

const routers = express.Router();
const fs = require("fs");
const verifyToken = require("../helpers/AuthVerification");
const { default: axios } = require("axios");

// const directory = "upload-files";
// if (!fs.existsSync(directory)) {
//   fs.mkdirSync(directory);
// }
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "upload-files/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// const upload = multer({ storage: multer.memoryStorage() });
// routers.post("/upload-files", verifyToken, FileValidation, (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     console.log("Uploaded file object:", req.file); // Log entire file object
//     console.log("Uploaded file buffer:", req.file.buffer); // Check buffer
//     res.status(200).json({ message: "File uploaded successfully." });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
// routers.post("/upload-audio", upload.single("audio"), verifyToken, uploadAudio);
routers.post("/upload-files", verifyToken, FileValidation("file"), UploadFiles);
routers.get("/download-files/:file_id", verifyToken, DownloadFiles);
routers.get(
  "/user-uploaded-files/:user_id/:page",
  verifyToken,
  getUserUploadedFiles
);

routers.delete("/delete-files/:fileId", verifyToken, DeleteFiles);
routers.post(
  "/upload-audio",
  verifyToken,
  FileValidation("audio"),

  uploadAudio
);

module.exports = routers;
