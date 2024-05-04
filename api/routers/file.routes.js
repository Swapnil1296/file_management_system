const express = require("express");
const { UploadFiles } = require("../controllers/file.controller");
const multer = require("multer");
const app = require("../config/firebaseConfig");

const routers = express.Router();
const fs = require("fs");
const verifyToken = require("../helpers/AuthVerification");
const { getStorage } = require("firebase/storage");

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
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });
routers.post("/upload-files", upload.single("file"), verifyToken, UploadFiles);
module.exports = routers;
