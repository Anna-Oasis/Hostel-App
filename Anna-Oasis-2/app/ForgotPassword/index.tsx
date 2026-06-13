import React, { useState } from "react";
import { View } from "react-native";
import useLoadingStore from "@/stores/loadingStore";
import { router } from "expo-router";
import EmailSection from "@/components/auth/EmailSectionCard";
import { requestOTP } from "@/utils/authUtils";
import OtpSection from "@/components/auth/OTPCard";

export default function ForgotPassword() {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [email, setEmail] = useState("");
  const [isOTPSent, setIsOTPSent] = useState<boolean>(false)

  const sendOtp = async ({ email }: { email: string }) => {
    try {
      const res = await requestOTP(email);
      if(res){
        setEmail(email)
        setIsOTPSent(res)
      }

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View className="flex-1 justify-center  p-4 bg-gray-50">
      <>
        {isOTPSent ?
          <EmailSection onSendOtp={sendOtp} />
          :
          <OtpSection
            email={email}
            onVerifyOtp={(values) => {
              console.log(values.otp);
            }}
            onResendOtp={() => sendOtp({ email })}
          />
        }
      </>

      //section 2 import from components

      //section 3 import from components
    </View>
  );
}
