const db = require("../config/dbConfig");

module.exports = {
  AddFiles: async (fileInfo) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          originalname,
          filename,
          mimetype,
          size,
          firebaseName,
          user_id,
        } = fileInfo;
        const result = await db.query(
          "INSERT INTO files (originalname, filename, mimetype, size,firebase_link,user_id) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *",
          [originalname, filename, mimetype, size, firebaseName, user_id]
        );

        resolve({ data: result.rows[0], status: 200, message: "success" });
      } catch (error) {
        reject(error);
      }
    });
  },
  GetFileNameToDownload: async (id, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileName = await db.query(
          "SELECT * FROM files WHERE id = $1 and user_id=$2",
          [id, userId]
        );

        if (fileName.rowCount > 0) {
          resolve(fileName.rows[0]);
        } else {
          reject({ message: "Something went wrong" });
        }
      } catch (error) {
        console.log("error GetFileNameToDownload=====>:", error.message);
        reject(error);
      }
    });
  },
  getUserUploadedFiles: async (userId, offset, limit) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.query(
          "SELECT * FROM files WHERE user_id = $1  LIMIT $2 OFFSET $3",
          [userId, limit, offset]
        );
        if (result.rowCount > 0) {
          resolve(result.rows);
        } else {
          resolve({ message: "No files were uploaded" });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  getTotalFileCount: async (userId) => {
    try {
      const result = await db.query(
        "SELECT COUNT(*) FROM files WHERE user_id = $1",
        [userId]
      );
      // Extract the count from the result
      const totalCount = result.rows[0].count;
      return totalCount;
    } catch (error) {
      throw error;
    }
  },
};
