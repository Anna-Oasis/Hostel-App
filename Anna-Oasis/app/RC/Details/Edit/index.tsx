import api from '@/api';
import DatePickerField from '@/components/form/DatePickerField';
import ImagePickerField from '@/components/form/ImagePickerField';
import PhoneInputField from '@/components/form/PhoneInputField';
import SelectField from '@/components/form/SelectField';
import TextField from '@/components/form/TextField';
import { Button, ButtonText } from '@/components/ui/button';
import { bloodGroups } from '@/constants/details';
import { initialValues } from '@/constants/rcDetails';
import rcDetailsValidation from '@/constants/validations/rcDetailsValidation';
import useUserStore from '@/stores/userStore';
import { fetchdata, handleEnterDetails, updateDetails } from '@/utils/rc/rcDetails';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert } from 'react-native';

const RCDetailsEditPage = () => {
    const details = useUserStore((state) => state.details);
    const setDetails = useUserStore((state) => state.setDetails)
    const [submit, setSubmit] = useState<boolean>(false)
    

    return (
        <Formik
            initialValues={details ? { ...initialValues, ...details } : initialValues}
            validationSchema={rcDetailsValidation}
            onSubmit={async (values) => {
                 const formData = new FormData();

                formData.append("name", values.name);
                formData.append("dept", values.dept);
                formData.append("registerNo", values.registerNo);
                formData.append("dob", values.dob);
                formData.append("mobile", values.mobile);
                formData.append("email", values.email);
                formData.append("guardianName", values.guardianName);
                formData.append("residentialAddress", values.residentialAddress);
                formData.append("bloodGroup", values.bloodGroup);
                formData.append("medicalHistory", values.medicalHistory);

                const imageFields = [
                { key: "passportPhotoUrl", name: "passportPhoto" },
                { key: "rcSignatureUrl", name: "rcSignature" },
                ] as const;

                for (const field of imageFields) {
                    const uri = values[field.key];
                    if (uri) {
                        const filename = uri.split("/").pop() || "image.jpg";
                        const match = /\.(\w+)$/.exec(filename);
                        const type = match ? `image/${match[1]}` : "image";

                        formData.append(field.name, {
                        uri,
                        name: filename,
                        type,
                        } as any);
                    }
                }

                if (details) {
                    setSubmit(true)
                    await updateDetails(formData);
                    await fetchdata(setDetails)
                    setSubmit(false)
                }
                else{
                    setSubmit(true)
                    await handleEnterDetails(formData)
                    await fetchdata(setDetails)
                    setSubmit(false)
                }

            }}
        >
            {({ handleSubmit}) => (
                <ScrollView  contentContainerStyle={{
                    padding: 20,
                    gap: 12,
                    flexDirection: "column",
                }}>
                    <View>
                        <Text className='text-center text-2xl m-2 font-medium'>{details ? 'Edit Details' : 'Fill Details'}</Text>
                        <TextField value='name' label='Name' placeholder='Enter name'/>
                        <TextField value='dept' label='Department' placeholder='Department'/>
                        <TextField value='registerNo' label='Register Number' placeholder='Register No'/>
                        <DatePickerField label='Date of Birth' value='dob' placeholder="YYYY-MM-DD"/>
                        <PhoneInputField label='Mobile' value='mobile'/>
                        <TextField value='email' label='Email' placeholder='Email'/>
                        <TextField value='guardianName' label='Guardian Name' placeholder='Gaurdian Name'/>
                        <TextField value='residentialAddress' label='Residential Address' placeholder='Address'/>
                        <SelectField label='Blood Group' value='bloodGroup' options={bloodGroups}/>
                        <TextField
                            label="Medical History (Type NIL if none)"
                            value="medicalHistory"
                            placeholder="Optional"
                        />

                        <ImagePickerField label='Passport Photo' value='passportPhotoUrl' placeholder='upload'/>
                        <ImagePickerField label='Signature' value='rcSignatureUrl' placeholder='upload'/>

                        <Button onPress={() => {
                                handleSubmit();
                        }}>
                            <ButtonText>{submit ? 'Loading...' : details ? 'Edit Details' : 'Fill Details'}</ButtonText>
                        </Button>
                    </View>
                    
                </ScrollView>
            )}
        </Formik>
    );
};


export default RCDetailsEditPage;
