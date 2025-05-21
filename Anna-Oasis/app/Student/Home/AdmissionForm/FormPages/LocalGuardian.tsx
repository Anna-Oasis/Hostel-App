import React from "react";
import TextField from "@/components/form/TextField";

const LocalGuardian = () => (
  <>
    <TextField label="Guardian Name" value="guardianName" placeholder="Name" />
    <TextField label="Guardian Occupation" value="guardianOccupation" placeholder="Occupation" />
    <TextField label="Guardian Residential Address" value="guardianResidentialAddress" placeholder="Address" />
    <TextField label="Guardian PIN" value="guardianPin" placeholder="PIN" />
    <TextField label="Guardian Mobile" value="guardianMobile" placeholder="Mobile" />
    <TextField label="Guardian Landline" value="guardianLandline" placeholder="Landline" />
    <TextField label="Guardian Email" value="guardianEmail" placeholder="Email" />
  </>
);

export default LocalGuardian;
