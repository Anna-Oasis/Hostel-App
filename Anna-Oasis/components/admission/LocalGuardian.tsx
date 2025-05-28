import React from "react";
import TextField from "@/components/form/TextField";

const LocalGuardian = () => (
  <>
    <TextField label="Guardian Name" value="guardianName" placeholder="Name" />
    <TextField label="Relationship" value="guardianRelationship" placeholder="Relationship" />
    <TextField label="Guardian Mobile" value="guardianMobile" placeholder="Mobile" />
    <TextField label="Guardian Email" value="guardianEmail" placeholder="Email" />
    <TextField label="Guardian House No" value="guardianHouseNo" placeholder="House No" />
    <TextField label="Guardian Street" value="guardianStreet" placeholder="Street" />
    <TextField label="Guardian City" value="guardianCity" placeholder="City" />
    <TextField label="Guardian State" value="guardianState" placeholder="State" />
    <TextField label="Guardian Country" value="guardianCountry" placeholder="Country" />
    <TextField label="Guardian Postal Code" value="guardianPostalCode" placeholder="Postal Code" />
  </>
);

export default LocalGuardian;
