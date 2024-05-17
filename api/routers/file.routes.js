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

const upload = multer({ storage: multer.memoryStorage() });
routers.post("/upload-files", upload.single("file"), verifyToken, UploadFiles);
routers.get("/download-files/:file_id", verifyToken, DownloadFiles);
routers.get(
  "/user-uploaded-files/:user_id/:page",
  verifyToken,
  getUserUploadedFiles
);

routers.delete("/delete-files/:fileId", verifyToken, DeleteFiles);
routers.post("/upload-audio", upload.single("audio"), verifyToken, uploadAudio);
module.exports = routers;
