const express = require("express");
const {
  UploadFiles,
  DownloadFiles,
  getUserUploadedFiles,
  DeleteFiles,
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
routers.get("/fetch-file-content", async (req, res) => {
  try {
    // Replace 'FIREBASE_STORAGE_URL' with your actual Firebase Storage URL

    const firebaseStorageUrl =
      "https://firebasestorage.googleapis.com/v0/b/file-management-5a68f.appspot.com/o/files%2FALKEM_ETH_08-May-2024%20(11).csvswapnil%40gmail.com?alt=media&token=171250cb-0544-4fba-9d3d-db6eb871c085";
    // const firebaseStorageUrl =
    //   "https://firebasestorage.googleapis.com/v0/b/file-management-5a68f.appspot.com/o/files%2FScreenrecording_20240430_113847.mp4swapnil12%40gmail.com?alt=media&token=fb3a3c0a-e22a-4fb7-99b8-43dead0539a4";

    // Fetch file content from Firebase Storage
    const response = await axios.get(firebaseStorageUrl, {
      responseType: "blob", // Set responseType to 'blob' to receive binary data
    });

    // Send file content back to the client
    // res.set("Content-Type", response.headers["content-type"]);
    console.log("response:", response.data);
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error("Error fetching file content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = routers;
