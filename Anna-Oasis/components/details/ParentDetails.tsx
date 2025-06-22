import React from "react";
import TextField from "@/components/form/TextField";
import PhoneInputField from "@/components/form/PhoneInputField";
import SelectField from "@/components/form/SelectField";
import countries from "@/constants/countries";
import indianStates from "@/constants/indianStates";
import { Text } from "../ui/text";

const ParentDetails = () => (
  <>
    {/* Father Details */}
    <Text bold size="2xl" > Parent's details</Text>
    <TextField label="Father's Name" value="fatherName" placeholder="Father's name" />
    <TextField label="Father's Occupation" value="fatherOccupation" placeholder="Father's occupation" />
    <PhoneInputField label="Father's Mobile" value="fatherMobile" placeholder="Father's phone number" />
    <TextField label="Father's Email" value="fatherEmail" placeholder="Father's email" />
    <SelectField label="Father's Country" value="fatherCountry" options={countries} />

    {/* Mother Details */}
    <TextField label="Mother's Name" value="motherName" placeholder="Mother's name" />
    <TextField label="Mother's Occupation" value="motherOccupation" placeholder="Mother's occupation" />
    <PhoneInputField label="Mother's Mobile" value="motherMobile" placeholder="Mother's phone number" />
    <TextField label="Mother's Email" value="motherEmail" placeholder="Mother's email" />
    <SelectField label="Mother's Country" value="motherCountry" options={countries} />

    {/* Residential Address (India) */}
    <TextField label="Indian House No" value="resIndiaHouseNo" placeholder="House No" />
    <TextField label="Indian Street" value="resIndiaStreet" placeholder="Street" />
    <TextField label="Indian City" value="resIndiaCity" placeholder="City" />
    <SelectField label="Indian State" value="resIndiaState" options={indianStates} />
    <TextField label="Indian Postal Code" value="resIndiaPostalCode" placeholder="Postal Code" />

    {/* Residential Address (Foreign) */}
    <TextField label="Foreign House No" value="resForeignHouseNo" placeholder="House No" />
    <TextField label="Foreign Street" value="resForeignStreet" placeholder="Street" />
    <TextField label="Foreign City" value="resForeignCity" placeholder="City" />
    <TextField label="Foreign State" value="resForeignState" placeholder="State" />
    <SelectField label="Foreign Country" value="resForeignCountry" options={countries} />
    <TextField label="Foreign Postal Code" value="resForeignPostalCode" placeholder="Postal Code" />
  </>
);

export default ParentDetails;