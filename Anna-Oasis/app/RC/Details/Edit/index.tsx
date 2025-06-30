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
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

const RCDetailsEditPage = () => {
    const details = useUserStore((state) => state.details);
    

    return (
        <Formik
            initialValues={details ? { ...initialValues, ...details } : initialValues}
            validationSchema={rcDetailsValidation}
            onSubmit={(values) => {
                 const formData = new FormData();

                formData.append("name", values.name);
                formData.append("dept", values.dept);
                formData.append("register_no", values.register_no);
                formData.append("dob", values.dob);
                formData.append("mobile", values.mobile);
                formData.append("email", values.email);
                formData.append("guardian_name", values.guardian_name);
                formData.append("residential_address", values.residential_address);
                formData.append("blood_group", values.blood_group);
                formData.append("medical_history", values.medical_history);

                const imageFields = [
                { key: "passportPhotoUrl", name: "passportPhotoUrl" },
                { key: "rcSignatureUrl", name: "rcSignatureUrl" },
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

                console.log(formData)

            }}
        >
            {({ handleSubmit}) => (
                <ScrollView  contentContainerStyle={{
                    padding: 20,
                    gap: 12,
                    flexDirection: "column",
                }}>
                    <View>
                        <Text className='text-center text-2xl m-2 font-medium'>Edit Details</Text>
                        <TextField value='name' label='Name' placeholder='Enter name'/>
                        <TextField value='dept' label='Department' placeholder='Department'/>
                        <TextField value='register_no' label='Register Number' placeholder='Register No'/>
                        <DatePickerField label='Date of Birth' value='dob' placeholder="YYYY-MM-DD"/>
                        <PhoneInputField label='Mobile' value='mobile'/>
                        <TextField value='email' label='Email' placeholder='Email'/>
                        <TextField value='guardian_name' label='Guardian Name' placeholder='Gaurdian Name'/>
                        <TextField value='residential_address' label='Residential Address' placeholder='Address'/>
                        <SelectField label='Blood Group' value='blood_groups' options={bloodGroups}/>
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
                            <ButtonText>Edit Details</ButtonText>
                        </Button>
                    </View>
                    
                </ScrollView>
            )}
        </Formik>
    );
};


export default RCDetailsEditPage;
