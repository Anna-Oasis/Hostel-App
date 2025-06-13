import React from "react";
import TextField from "@/components/form/TextField";
import PhoneInputField from "@/components/form/PhoneInputField";
import SelectField from "@/components/form/SelectField";
import countries from "@/constants/countries";
import indianStates from "@/constants/indianStates";

const LocalGuardian = () => (
  <>
    <TextField label="Guardian Name" value="guardianName" placeholder="Name" />
    <TextField label="Relationship" value="guardianRelationship" placeholder="Relationship" />
    <PhoneInputField label="Guardian Mobile" value="guardianMobile" placeholder="Guardian's phone number" />
    <TextField label="Guardian Email" value="guardianEmail" placeholder="Email" />
    <TextField label="Guardian House No" value="guardianHouseNo" placeholder="House No" />
    <TextField label="Guardian Street" value="guardianStreet" placeholder="Street" />
    <TextField label="Guardian City" value="guardianCity" placeholder="City" />
    <SelectField label="Guardian State" value="guardianState" options={indianStates} />
    <SelectField label="Guardian Country" value="guardianCountry" options={countries} />
    <TextField label="Guardian Postal Code" value="guardianPostalCode" placeholder="Postal Code" />
  </>
);

export default LocalGuardian;
