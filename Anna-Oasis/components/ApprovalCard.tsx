import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from "@/components/ui/badge"
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Icon, CloseIcon, CopyIcon } from "@/components/ui/icon"

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
    <View className="border border-primary-400 rounded-lg m-2 p-4 bg-black/10">
      <Text className="text-black font-semibold text-2xl mb-2">{props.title}</Text>

      <View className="flex-row items-center">
        <Text className="text-base font-medium w-[70%]">{props.subTitle}</Text>

        {props.badge && (
          <Animated.View
            style={{
              opacity: props.badge === badgeStatus.Pending ? floatBadge : 1,
            }}
          >
            <Badge
              size="md"
              variant="solid"
              action={
                props.badge === badgeStatus.Approved
                  ? 'success'
                  : props.badge === badgeStatus.Rejected
                  ? 'error'
                  : 'muted'
              }
              className={props.badge === badgeStatus.Pending ? "bg-orange-500" : 
                                          props.badge === badgeStatus.Approved ? "bg-green-500" : "bg-red-500"}
            >
              <BadgeText className="px-auto text-white">{props.badge}</BadgeText>
            </Badge>
          </Animated.View>
        )}

      </View>

      <View className="items-center mt-4">
        <Button
            onPress={() => setViewDetails(true)}
        >
          <ButtonText >View more</ButtonText>
        </Button>
      </View>

      <Modal
        isOpen={viewDetails}
        onClose={() => setViewDetails(false)}
      >
        <ModalBackdrop/>
        <ModalContent>
          <ModalHeader className='border-b-2'>
            <Text className="text-2xl font-bold mb-2">Details</Text>
            <ModalCloseButton>
                          <ModalCloseButton>
              <Icon as={CloseIcon} className="mb-2" size='xl' />
            </ModalCloseButton>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody className='mt-6'>
            <Text >JSON file</Text>
          </ModalBody>
          <ModalFooter className="flex-row justify-evenly mt-6">
            {props.onApprove && (
                <Button
                  onPress={() => {
                    setViewDetails(false);
                    props.onApprove?.();
                  }}
                  className="bg-green-600 w-[90px] h-10 rounded-lg justify-center"
                >
                  <ButtonText className="text-white text-center">Approve</ButtonText>
                </Button>
              )}

              {props.onDecline && (
                <Button
                  onPress={() => {
                    setViewDetails(false);
                    props.onDecline?.();
                  }}
                  className="bg-red-600 w-[90px] h-10 rounded-lg justify-center"
                >
                  <ButtonText className="text-white text-center">Decline</ButtonText>
                </Button>
              )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default ApprovalCard;
