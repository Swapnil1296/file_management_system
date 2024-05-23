const multer = require("multer");
const path = require("path");
const AdmZip = require("adm-zip");

// Function to log file details
const getFileDetails = async (req, res, next) => {
  if (req.file) {
    console.log("first===>", req.file);
    try {
      const { fileTypeFromBuffer } = await import("file-type");
      const buffer = req.file.buffer;
      const fileInfo = await fileTypeFromBuffer(buffer);
      console.log("fileInfo==", fileInfo);
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "audio/mpeg", // mp3
        "audio/wav", // wav
        "video/mp4", // mp4
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
        "application/zip", // zip
        "video/webm", // webm
      ];

      if (!fileInfo || !allowedMimeTypes.includes(fileInfo.mime)) {
        return res.status(400).json({
          status: 2,
          message:
            "Invalid file content. The file does not match its extension.",
        });
      }

      // console.log("File filter:", {
      //   fieldname: req.file.fieldname,
      //   originalname: req.file.originalname,
      //   encoding: req.file.encoding,
      //   mimetype: req.file.mimetype,
      //   size: req.file.size,
      //   buffer: req.file.buffer,
      // });

      // If the file is a zip, check its contents
      if (fileInfo.mime === "application/zip") {
        const allowedExtensions = [
          ".mp3",
          ".wav",
          ".mp4",
          ".jpg",
          ".jpeg",
          ".png",
          ".xlsx",
          ".webm",
        ];

        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();

        for (const entry of zipEntries) {
          const ext = path.extname(entry.entryName).toLowerCase();
          if (!allowedExtensions.includes(ext)) {
            return res.status(400).json({
              status: 2,
              message: `Invalid file inside zip: ${
                entry.entryName
              }. Only files with the following extensions are allowed: ${allowedExtensions.join(
                ", "
              )}`,
            });
          }
        }
      }
    } catch (error) {
      return res.status(400).json({
        status: 2,
        message: "Error processing the file.",
      });
    }
  } else {
    console.log("No file uploaded");
  }
  next();
};

// Middleware to validate file
const FileValidation = (fileType) => {
  return (req, res, next) => {
    const maxSize = 30 * 1024 * 1024; // 30 MB
    let allowedExtensions = [];

    switch (fileType) {
      case "file":
        allowedExtensions = [".jpg", ".jpeg", ".png", ".xlsx", ".zip"];
        break;
      case "audio":
        allowedExtensions = [".mp3", ".wav", ".webm"];
        break;
      case "video":
        allowedExtensions = [".mp4"];
        break;
      default:
        return res.status(400).json({
          status: 2,
          message: "Invalid file type.",
        });
    }

    const storage = multer.memoryStorage();

    const fileFilter = (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();

      if (allowedExtensions.includes(ext)) {
        console.log(
          "allowedExtensions.includes(ext):-",
          allowedExtensions.includes(ext)
        );
        cb(null, true);
      } else {
        cb(
          new Error(
            `Only files with the following extensions are allowed: ${allowedExtensions.join(
              ", "
            )}`
          ),
          false
        );
      }
    };

    const upload = multer({
      storage: storage,
      limits: { fileSize: maxSize },
      fileFilter: fileFilter,
    }).single(fileType); // Use fileType directly

    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: 2,
          message: err.message,
        });
      }
      await getFileDetails(req, res, next);
    });
  };
};

module.exports = {
  FileValidation,
};
