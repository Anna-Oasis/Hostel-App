import { View, Text, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import useUserStore from '@/stores/userStore';
import { getToken, verifyToken } from '@/utils/authUtils';
import { router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePickerField from './form/DatePickerField';
import MultiLineText from './form/MultiLineText';
import SelectField from './form/SelectField';
import { Button, ButtonText } from './ui/button';
import { getRCList, RCLeaveFormPayload, RCListResponse, submitRCLeaveForm, submitLeave } from '@/utils/rc/rcApi';

const RcLeaveForm = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const [alterrc, setAlterrc] = useState<RCListResponse | null>(null);
    // const hasInitialized = useRef(false);

    useEffect(() => {
        // if (hasInitialized.current || user !== null) return;

        // hasInitialized.current = true;


        const initializeUser = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    router.replace('/Login');
                    return;
                }

                const verifiedUser = await verifyToken(token);
                if (verifiedUser) {
                    setUser(verifiedUser);
                }
                console.log('User initialized:', verifiedUser);
                
            } catch (error) {
                console.error('Failed to verify user:', error);
            }
        };

        const fetchRCList = async () => {
            try {
                const result = await getRCList();
                if (result.success) {
                    setAlterrc(result);
                } else {
                    console.error('Failed to fetch RC list:', result.message);
                }
            } catch (error) {
                console.error('Error fetching RC list:', error);
            }
        };

        initializeUser();
        fetchRCList();
    }, []);

    return (
        <View>
            <Formik
                initialValues={{
                    arrival: '',
                    leaving: '',
                    reason: '',
                    alternate: '',
                }}
                validationSchema={Yup.object({
                    arrival: Yup.string().required('Arrival date is required'),
                    leaving: Yup.string().required('Leaving date is required'),
                    reason: Yup.string().required('Reason is required'),
                    alternate: Yup.string().required('Alternate RC is required'),
                })}
                onSubmit={(values) => {
                    console.log('RC Leave Form Submitted', values);
                    const payload: RCLeaveFormPayload = {
                        rc_id: user ? Number(user.id) : 0,
                        arrival: values.arrival,
                        leaving: values.leaving,
                        reason: values.reason,
                        alternate: Number(values.alternate),
                    };
                    console.log('Payload:', payload);
                    submitLeave(payload);
                }}
            >
                {({ handleSubmit }) => (
                    <View className="space-y-4 p-4">
                        <Text className="text-2xl font-bold mb-4">RC Leave Form</Text>

                        <Text className="text-lg">Arrival Date:</Text>
                        <DatePickerField
                            value="arrival"
                            placeholder="YYYY-MM-DD"
                            minimumDate={new Date()}
                        />

                        <Text className="text-lg">Leaving Date:</Text>
                        <DatePickerField
                            value="leaving"
                            placeholder="YYYY-MM-DD"
                            minimumDate={new Date()}
                        />

                        <Text className="text-lg">Reason for Leave:</Text>
                        <MultiLineText
                            value="reason"
                            placeholder="Enter reason for leave"
                        />

                        <Text className="text-lg">Alternate RC ID:</Text>
                        <SelectField
                            label="Select Alternate RC"
                            value="alternate"
                            options={
                                alterrc
                                    ? alterrc.data
                                        .filter((rc) => rc.userId != Number(user?.id)) // exclude current user
                                        .map((rc) => ({
                                            label: rc.name,
                                            value: rc.id.toString(),
                                        }))
                                    : []
                            }
                        />
                        <Button onPress={() => handleSubmit()} className="mt-4">
                            <ButtonText>Submit</ButtonText>
                        </Button>
                    </View>
                )}
            </Formik>
        </View>
    );
};

export default RcLeaveForm;
