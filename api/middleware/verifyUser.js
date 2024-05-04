const { reject } = require("bluebird");
const db = require("../config/dbConfig");

const verifyUser = async (email, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await db.query("select * from user_login where email=$1", [
        email,
      ]);

      if (res.rows[0].id === userId) {
        resolve({ status: "success", message: "User Exists" });
      }
    } catch (error) {
      console.log("error in middleware===>", error);
      reject(error);
    }
  });
};
module.exports = verifyUser;
