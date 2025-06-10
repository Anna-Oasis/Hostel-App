import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export enum badgeStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

type approvalCardProps = {
  title: string,
  subTitle: string,
  onApprove?: () => void,
  onDecline?: () => void,
  badge?: badgeStatus,
}

const ApprovalCard = (props: approvalCardProps) => {
  const floatBadge = useRef(new Animated.Value(0.3)).current;
  const [viewDetails, setViewDetails] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatBadge, {
          useNativeDriver: true,
          toValue: 1,
          duration: 1000,
        }),
        Animated.timing(floatBadge, {
          useNativeDriver: true,
          toValue: 0.3,
          duration: 1000,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="border border-primary-400 rounded-lg m-2 p-4 bg-secondary-800">
      <Text className="text-black font-semibold text-2xl mb-2">{props.title}</Text>

      <View className="flex-row items-center">
        <Text className="text-base font-medium w-[70%]">{props.subTitle}</Text>

        {props.badge && (
          <Animated.View
            style={{
              opacity: props.badge === badgeStatus.Pending ? floatBadge : 1,
              backgroundColor:
                props.badge === badgeStatus.Approved
                  ? '#34eb46'
                  : props.badge === badgeStatus.Rejected
                  ? '#eb4f34'
                  : '#eb7134',
            }}
            className="w-[80px] h-[24px] rounded-full justify-center items-center"
          >
            <Text className="text-white text-sm capitalize">{props.badge}</Text>
          </Animated.View>
        )}
      </View>

      <View className="items-center mt-4">
        <TouchableOpacity onPress={() => setViewDetails(true)}>
            <Text
                className='bg-info-500 p-2 rounded-md text-white'
            >View Details</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={viewDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setViewDetails(false)}
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white w-[90%] p-4 rounded-xl shadow-lg">
            <TouchableOpacity className="self-end mb-2" onPress={() => setViewDetails(false)}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>

            <Text className="text-lg font-bold mb-2">Details</Text>
            <Text className="text-base text-gray-700">JSON content</Text>

            <View className="flex-row justify-evenly mt-6">
              {props.onApprove && (
                <TouchableOpacity
                  onPress={() => {
                    setViewDetails(false);
                    props.onApprove?.();
                  }}
                  className="bg-green-600 w-[90px] h-10 rounded-lg justify-center"
                >
                  <Text className="text-white text-center">Approve</Text>
                </TouchableOpacity>
              )}

              {props.onDecline && (
                <TouchableOpacity
                  onPress={() => {
                    setViewDetails(false);
                    props.onDecline?.();
                  }}
                  className="bg-red-600 w-[90px] h-10 rounded-lg justify-center"
                >
                  <Text className="text-white text-center">Decline</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ApprovalCard;
