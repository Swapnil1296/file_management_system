const express = require("express");
const { SignUpUser, logInUser } = require("../controllers/user.controllers");
const {
  ValidateBody,
  schemas,
} = require("../validationSchema/auth.validation");

const router = express.Router();

router.post("/sign-up", ValidateBody(schemas.signUpSchema), SignUpUser);
router.post("/sign-in", ValidateBody(schemas.logInSchema), logInUser);

module.exports = router;
