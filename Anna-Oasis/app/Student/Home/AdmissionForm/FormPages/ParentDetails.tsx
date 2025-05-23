import React from "react";
import TextField from "@/components/form/TextField";

const ParentDetails = () => (
  <>
    <TextField label="Father's Name" value="fatherName" placeholder="Father's name" />
    <TextField label="Father's Contact (Local)" value="fatherContactLocal" placeholder="Local contact" />
    <TextField label="Father's Contact (Foreign)" value="fatherContactForeign" placeholder="Foreign contact" />
    <TextField label="Mother's Name" value="motherName" placeholder="Mother's name" />
    <TextField label="Mother's Contact (Local)" value="motherContactLocal" placeholder="Local contact" />
    <TextField label="Landline" value="landline" placeholder="Landline number" />
    <TextField label="Parent Email" value="parentEmail" placeholder="Email" />
    <TextField label="Occupation" value="occupation" placeholder="Occupation" />
    <TextField label="Residential Address" value="residentialAddress" placeholder="Address" />
    <TextField label="PIN" value="pin" placeholder="PIN code" />
  </>
);

export default ParentDetails;