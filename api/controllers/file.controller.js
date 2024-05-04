const {
  getDownloadURL,
  uploadBytesResumable,
  ref,
  getStorage,
} = require("firebase/storage");
const db = require("../config/dbConfig");
const errorHandler = require("../helpers/errorHandler");
const verifyUser = require("../middleware/verifyUser");
const { AddFiles } = require("../models/files.models");
const giveCurrentDateTime = require("../helpers/CurrentDate");

module.exports = {
  UploadFiles: async (req, res, next) => {
    try {
      const { email, userId } = req.user;
      const userExists = await verifyUser(email, userId);

      if (userExists.status !== "success") {
        return res.status(400).json({ message: "Invalid User" });
      }

      const dateTime = giveCurrentDateTime();
      const storage = getStorage();
      const storagePath = `files/${req.file.originalname + email}`;

      const storageRef = ref(storage, storagePath);
      const metadata = { contentType: req.file.mimetype };

      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );

      if (snapshot.state !== "success") {
        throw new Error("File upload failed");
      }

      const fileInfo = {
        originalname: req.file.originalname,
        filename: req.file.filename || req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };

      const result = await AddFiles(fileInfo);

      if (result.status !== 200) {
        throw new Error("Failed to add file info to database");
      }

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("snapshot.ref: ==>", snapshot.ref);

      res
        .status(200)
        .json({ message: "success", data: result.data, downloadURL });
    } catch (error) {
      console.error("Error in UploadFiles:", error);
      next(errorHandler(501, error.message || "Internal server error"));
    }
  },
};
