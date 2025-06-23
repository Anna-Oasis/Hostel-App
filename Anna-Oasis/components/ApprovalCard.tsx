import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from "@/components/ui/badge"
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Icon, CloseIcon, CopyIcon } from "@/components/ui/icon"
import { BlurView } from 'expo-blur'

/**
 * Status options for the approval badge
 * @enum {string}
 */
export enum badgeStatus {
  /** Request is pending approval */
  Pending = 'pending',
  /** Request has been approved */
  Approved = 'approved',
  /** Request has been rejected */
  Rejected = 'rejected'
}

/**
 * Props for the ApprovalCard component
 * @typedef {Object} approvalCardProps
 */
type approvalCardProps = {
  /** Main title displayed at the top of the card */
  title: string,
  /** Subtitle or description displayed below the title */
  subTitle: string,
  /** Callback function triggered when the approve button is clicked */
  onApprove?: () => void,
  /** Callback function triggered when the decline button is clicked */
  onDecline?: () => void,
  /** Status badge to display on the card (pending, approved, or rejected) */
  badge?: badgeStatus,
  /** JSON object containing data to be displayed in the details modal */
  data ?: Record<string, any>,
}

/**
 * ApprovalCard Component
 * 
 * A card component that displays approval information with an optional status badge.
 * It provides a "View more" button that opens a modal with detailed information.
 * The modal can include approve/decline action buttons if the respective callbacks are provided.
 * 
 * @param {approvalCardProps} props - The component props
 * @returns {JSX.Element} The rendered ApprovalCard component
 * 
 * @example
 * <ApprovalCard
 *   title="Room Change Request"
 *   subTitle="John Doe wants to change to Room 302"
 *   badge={badgeStatus.Pending}
 *   onApprove={() => handleApprove()}
 *   onDecline={() => handleDecline()}
 *   data={{
 *     "Student": "John Doe",
 *     "Current Room": "201",
 *     "Requested Room": "302",
 *     "Reason": "Roommate incompatibility"
 *   }}
 * />
 */
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
    <View className="m-2">
      <BlurView
        intensity={40}
        tint="dark"
        className="rounded-2xl overflow-hidden"
      >
        <View
          className="rounded-2xl bg-[#81b1ce] p-8"
        >
          <View className="flex flex-row">
            <Text className="text-white font-semibold text-2xl mb-2 w-[80%]">{props.title}</Text>
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

          <Text className="text-base font-medium text-white italic">{props.subTitle}</Text>

          <View className="items-end mt-4">
            <Button
              onPress={() => setViewDetails(true)}
              className='bg-[#0f1056]'
            >
              <ButtonText >View more</ButtonText>
            </Button>
          </View>
        </View>
      </BlurView>

      <Modal
        isOpen={viewDetails}
        onClose={() => setViewDetails(false)}
      >
        <ModalBackdrop/>
        <ModalContent>
          <ModalHeader className='border-b-2'>
            <Text className="text-2xl font-bold mb-2">Details</Text>
            <ModalCloseButton>
              <Icon as={CloseIcon} className="mb-2" size='xl' />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody className='mt-6'>
            {props.data && (
              <View>
                {Object.entries(props.data).map(([key, value]) => (
                  <View key={key} className='flex flex-row space-y-2 gap-1'>
                    <Text className='text-lg font-medium'>{key} : </Text>
                    <Text className='text-lg font-normal'>
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ModalBody>

          <ModalFooter className="flex-row justify-evenly mt-6">
            {props.onApprove && (
                <Button
                  onPress={() => {
                    setViewDetails(false);
                    props.onApprove?.();
                  }}
                  className="bg-green-600 w-[95px] h-10 items-centerrounded-lg justify-center"
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
