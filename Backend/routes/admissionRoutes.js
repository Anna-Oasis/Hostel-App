const express = require("express");
const router = express.Router();
const { 
    getAllAdmissions, 
    getAdmissionById, 
    createAdmission, 
    updateAdmissionById, 
    deleteAdmissionById 
} = require("../Controller/admissionController");

router.route("/")
    .get(getAllAdmissions)
    .post(createAdmission);

router.route("/:id")
    .get(getAdmissionById)
    .put(updateAdmissionById)
    .delete(deleteAdmissionById);

module.exports = router;
