const db = require("../config/dbConfig");

module.exports = {
  AddFiles: async (fileInfo) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { originalname, filename, mimetype, size } = fileInfo;
        const result = await db.query(
          "INSERT INTO files (originalname, filename, mimetype, size) VALUES ($1, $2, $3, $4) RETURNING *",
          [originalname, filename, mimetype, size]
        );

        resolve({ data: result.rows[0], status: 200, message: "success" });
      } catch (error) {
        reject(error);
      }
    });
  },
};
