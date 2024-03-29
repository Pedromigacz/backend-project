const express = require("express");
const router = express.Router();
const parser = require("../utils/cloudinary.js");

const {
  getPrivateService,
  postService,
  putScervice,
  deleteService,
  findServices,
  findServicesUser,
} = require("../controllers/services.js");

const {
  verifyAndFindUser,
  verifyAdminPrivilige,
} = require("../middlewares/auth.js");

router.route("/:serviceId").get(verifyAndFindUser, getPrivateService);

router
  .route("/")
  .post(
    verifyAndFindUser,
    verifyAdminPrivilige,
    parser.array("images"),
    postService
  );

router
  .route("/:serviceId")
  .put(
    verifyAndFindUser,
    verifyAdminPrivilige,
    parser.array("images"),
    putScervice
  );

router
  .route("/:serviceId")
  .delete(verifyAndFindUser, verifyAdminPrivilige, deleteService);

router
  .route("/getServices")
  .post(verifyAndFindUser, verifyAdminPrivilige, findServices);

router.route("/getServicesUser").post(verifyAndFindUser, findServicesUser);

module.exports = router;
