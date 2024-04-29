const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  SignUpUser,
  logInUser,
  SignInViaExcel,
  SignUpViaExcel,
} = require("../controllers/user.controllers");
const {
  ValidateBody,
  schemas,
} = require("../validationSchema/auth.validation");

const router = express.Router();

router.post("/sign-up", ValidateBody(schemas.signUpSchema), SignUpUser);
router.post("/sign-in", ValidateBody(schemas.logInSchema), logInUser);
router.post("/sign-in-via-excel", upload.single("file"), SignInViaExcel);
router.post("/sign-up-via-excel", upload.single("file"), SignUpViaExcel);

module.exports = router;
