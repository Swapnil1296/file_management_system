const {
  getDownloadURL,
  uploadBytesResumable,
  ref,
  getStorage,
  deleteObject,
} = require("firebase/storage");
const db = require("../config/dbConfig");
const errorHandler = require("../helpers/errorHandler");
const verifyUser = require("../middleware/verifyUser");
const {
  AddFiles,
  GetFileNameToDownload,
  getUserUploadedFiles,
  getTotalFileCount,
} = require("../models/files.models");
const giveCurrentDateTime = require("../helpers/CurrentDate");

module.exports = {
  UploadFiles: async (req, res, next) => {
    try {
      const { email, userId } = req.user;
      const userExists = await verifyUser(email, userId);

      if (userExists.status !== "success") {
        return res.status(400).json({ message: "Invalid User" });
      }
      if (!req.file) {
        return res.status(501).json({ message: "No file uploaded" });
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
      const firebaseName = req.file.originalname + email;
      const fileInfo = {
        originalname: req.file.originalname,
        filename: req.file.filename || req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        firebaseName,
        user_id: userId,
      };

      const result = await AddFiles(fileInfo);

      if (result.status !== 200) {
        throw new Error("Failed to add file info to database");
      }

      const downloadURL = await getDownloadURL(snapshot.ref);

      res
        .status(200)
        .json({ message: "success", data: result.data, downloadURL });
    } catch (error) {
      console.error("Error in UploadFiles:", error);
      next(errorHandler(501, error.message || "Internal server error"));
    }
  },
  DownloadFiles: async (req, res, next) => {
    try {
      const { email, userId } = req.user;
      const userExists = await verifyUser(email, userId);

      if (userExists.status !== "success") {
        return res.status(400).json({ message: "Invalid User" });
      }

      const { file_id } = req.params;
      const result = await GetFileNameToDownload(String(file_id), userId);

      const storage = getStorage();
      const starsRef = ref(storage, `files/${result.firebase_link}`);
      const downloadURL = await getDownloadURL(starsRef);

      if (downloadURL !== null || downloadURL === "") {
        res
          .status(200)
          .json({ status: 200, message: "success", url: downloadURL });
      }
    } catch (error) {
      console.error("Error in DownloadFiles:", error);
      next(errorHandler(501, error.message || "Internal server error"));
    }
  },
  getUserUploadedFiles: async (req, res, next) => {
    try {
      const { email, userId } = req.user;
      const { user_id, page = 1 } = req.params;
      const { pageSize = 3 } = req.query; // Default to page size of 3 if not provided

      if (user_id !== userId) {
        next(errorHandler(401, "Unauthorized access"));
        return; // Return early to prevent further execution
      }

      // Calculate the offset based on page number and page size for pagination
      const offset = (page - 1) * pageSize;

      // Call your function to get user uploaded files with pagination
      const getFiles = await getUserUploadedFiles(user_id, offset, pageSize);

      // Get total count of files for the user
      const totalCount = await getTotalFileCount(user_id);

      // Calculate total number of pages
      const totalPages = Math.ceil(totalCount / pageSize);

      res.status(200).json({ message: "success", files: getFiles, totalPages });
    } catch (error) {
      console.log("Error in getUserUploadedFiles:", error);
      next(errorHandler(501, error.message || "Internal server error"));
    }
  },

  DeleteFiles: async (req, res, next) => {
    try {
      const { email, userId } = req.user;
      const userExists = await verifyUser(email, userId);

      if (userExists.status !== "success") {
        return res.status(400).json({ message: "Invalid User" });
      }

      const { fileId } = req.params;
      if (!fileId) {
        throw new Error("file id is required");
      }

      const result = await GetFileNameToDownload(fileId, userId);

      const storage = getStorage();
      const desertRef = ref(storage, `files/${result.firebase_link}`);
      deleteObject(desertRef)
        .then(async () => {
          const x = await db.query("DELETE FROM files WHERE id = $1", [fileId]);
          console.log(x);
          res
            .status(200)
            .json({ message: "File deleted successfully", status: 200 });
        })
        .catch((error) => {
          console.log("error while in DeleteFiles:===>", error);
          next(errorHandler(501, error.message || "Internal server error"));
        });
    } catch (error) {
      console.log("error while in DeleteFiles:===>", error);
      next(errorHandler(501, error.message || "Internal server error"));
    }
  },
  uploadAudio: async (req, res, next) => {
    console.log(req.file);
    try {
      const { email, userId } = req.user;
      const userExists = await verifyUser(email, userId);

      if (userExists.status !== "success") {
        return res.status(400).json({ message: "Invalid User" });
      }
      if (!req.file) {
        return res.status(501).json({ message: "No file uploaded" });
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
      const firebaseName = req.file.originalname + email;
      const fileInfo = {
        originalname: req.file.originalname,
        filename: req.file.filename || req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        firebaseName,
        user_id: userId,
      };

      const result = await AddFiles(fileInfo);

      if (result.status !== 200) {
        throw new Error("Failed to add file info to database");
      }

      const downloadURL = await getDownloadURL(snapshot.ref);

      res
        .status(200)
        .json({ message: "success", data: result.data, downloadURL });
    } catch (error) {
      console.error("Error in UploadFiles:", error);
      next(errorHandler(501, error.message || "Internal server error"));
    }
  },
};
