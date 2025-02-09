const express = require("express");
const router = express.Router();
const {
    getAllReAdmissions,
    getReAdmissionById,
    createReAdmission,
    updateReAdmissionById,
    deleteReAdmissionById
} = require("../Controller/reAdmissionController");


router.route("/").get(getAllReAdmissions).post(createReAdmission);
router.route("/:id").get(getReAdmissionById).put(updateReAdmissionById).delete(deleteReAdmissionById);

module.exports = router;