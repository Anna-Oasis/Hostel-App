import React from "react";
import TextField from "@/components/form/TextField";

const ParentDetails = () => (
  <>
    {/* Father Details */}
    <TextField label="Father's Name" value="fatherName" placeholder="Father's name" />
    <TextField label="Father's Occupation" value="fatherOccupation" placeholder="Father's occupation" />
    <TextField label="Father's Mobile (with country code)" value="fatherMobile" placeholder="Eg: +917676767676" />
    <TextField label="Father's Email" value="fatherEmail" placeholder="Father's email" />
    <TextField label="Father's Country" value="fatherCountry" placeholder="Father's country" />

    {/* Mother Details */}
    <TextField label="Mother's Name" value="motherName" placeholder="Mother's name" />
    <TextField label="Mother's Occupation" value="motherOccupation" placeholder="Mother's occupation" />
    <TextField label="Mother's Mobile (with country code)" value="motherMobile" placeholder="Eg: +917676767676" />
    <TextField label="Mother's Email" value="motherEmail" placeholder="Mother's email" />
    <TextField label="Mother's Country" value="motherCountry" placeholder="Mother's country" />

    {/* Residential Address (India) */}
    <TextField label="Indian House No" value="resIndiaHouseNo" placeholder="House No" />
    <TextField label="Indian Street" value="resIndiaStreet" placeholder="Street" />
    <TextField label="Indian City" value="resIndiaCity" placeholder="City" />
    <TextField label="Indian State" value="resIndiaState" placeholder="State" />
    <TextField label="Indian Postal Code" value="resIndiaPostalCode" placeholder="Postal Code" />

    {/* Residential Address (Foreign) */}
    <TextField label="Foreign House No" value="resForeignHouseNo" placeholder="House No" />
    <TextField label="Foreign Street" value="resForeignStreet" placeholder="Street" />
    <TextField label="Foreign City" value="resForeignCity" placeholder="City" />
    <TextField label="Foreign State" value="resForeignState" placeholder="State" />
    <TextField label="Foreign Country" value="resForeignCountry" placeholder="Country" />
    <TextField label="Foreign Postal Code" value="resForeignPostalCode" placeholder="Postal Code" />
  </>
);

export default ParentDetails;