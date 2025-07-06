import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Badge, BadgeText } from "@/components/ui/badge";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Icon, CloseIcon } from "@/components/ui/icon";

/**
 * Status options for the approval badge
 * @enum {string}
 */
export enum badgeStatus {
  /** Request is pending approval */
  Pending = "pending",
  /** Request has been approved */
  Approved = "approved",
  /** Request has been rejected */
  Rejected = "rejected",
}

/**
 * Props for the ApprovalCard component
 * @typedef {Object} approvalCardProps
 */
type approvalCardProps = {
  /** Main title displayed at the top of the card */
  title: string;
  /** Subtitle or description displayed below the title */
  subTitle: string;
  /** Callback function triggered when the approve button is clicked */
  onApprove?: () => void;
  /** Callback function triggered when the decline button is clicked */
  onDecline?: () => void;
  /** Status badge to display on the card (pending, approved, or rejected) */
  badge?: badgeStatus;
  /** JSON object containing data to be displayed in the details modal */
  data?: Record<string, any>;
  /** Optional custom title for the approve button */
  ApproveButtonTitle?: string;
};

/**
 * Format a key string to a more readable format
 * (e.g., "parentGuardianSignatureUrl" -> "Parent Guardian Signature Url")
 */
function formatKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const imageKeys = [
  "passportPhotoUrl",
  "studentSignatureUrl",
  "parentGuardianSignatureUrl",
  "categoryProofUrl",
  "admissionSlipUrl",
  "transactionPhotoUrl",
];

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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

  const openImageModal = (imageUri: string) => {
    console.log("Opening image modal with URI:", imageUri);
    setSelectedImage(imageUri);
    setImageError(false);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageError(false);
  };

  return (
    <View className="m-2">
      <View
        className="rounded-2xl bg-white p-4 shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <View className="flex flex-row items-start">
          <Text className="text-black font-semibold text-2xl mb-2 w-[75%]">
            {props.title}
          </Text>

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
                    ? "success"
                    : props.badge === badgeStatus.Rejected
                    ? "error"
                    : "muted"
                }
                className={`px-4 py-1 rounded-full ${
                  props.badge === badgeStatus.Pending
                    ? "bg-[#022B60]"
                    : props.badge === badgeStatus.Approved
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                <BadgeText className="text-white">{props.badge}</BadgeText>
              </Badge>
            </Animated.View>
          )}
        </View>

        <Text className="text-base font-medium text-black italic">
          {props.subTitle}
        </Text>

        <View className="items-end mt-4">
          <Button onPress={() => setViewDetails(true)}>
            <ButtonText className="text-white">View more</ButtonText>
          </Button>
        </View>
      </View>

      <Modal isOpen={viewDetails} onClose={() => setViewDetails(false)}>
        <ModalBackdrop />
        <ModalContent
          style={{ maxHeight: Dimensions.get("window").height * 0.8 }}
        >
          <ModalHeader className="border-b-2">
            <Text className="text-2xl font-bold mb-2 text-black">Details</Text>
            <ModalCloseButton>
              <Icon as={CloseIcon} className="mb-2" size="xl" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody className="mt-6">
            {props.data && (
              <View>
                {(() => {
                  const entries = Object.entries(props.data);

                  // Check if both rollNo and passportPhotoUrl exist
                  const hasRollNo = entries.some(([key]) => key === "rollNo");
                  const hasPassportPhoto = entries.some(
                    ([key]) => key === "passportPhotoUrl"
                  );
                  const rollNoEntry = entries.find(([key]) => key === "rollNo");
                  const passportPhotoEntry = entries.find(
                    ([key]) => key === "passportPhotoUrl"
                  );

                  // Priority keys to exclude from regular sorting when shown together
                  const excludeKeys: string[] = [];
                  if (entries.some(([key]) => key === "user_id")) {
                    excludeKeys.push("user_id");
                  }
                  if (hasRollNo && hasPassportPhoto) {
                    excludeKeys.push("rollNo", "passportPhotoUrl");
                  } else {
                    // If not both present, show them as priority fields
                    const priorityKeys = ["rollNo", "passportPhotoUrl"];
                    excludeKeys.push(...priorityKeys);
                  }

                  // Remaining entries (excluding handled keys)
                  const remainingEntries = entries.filter(
                    ([key]) => !excludeKeys.includes(key)
                  );
                  const nonNullEntries = remainingEntries.filter(
                    ([key, value]) =>
                      value !== null && value !== undefined && value !== ""
                  );
                  const nullEntries = remainingEntries.filter(
                    ([key, value]) =>
                      value === null || value === undefined || value === ""
                  );

                  return (
                    <View>
                      {/* Display rollNo and passportPhotoUrl side by side if both exist */}
                      {hasRollNo && hasPassportPhoto && (
                        <View className="flex-row bg-[#022B60] rounded-lg p-3 mb-3">
                          <View className="flex-1 mr-2">
                            <Text className="text-base font-semibold text-white mb-1">
                              {formatKey("rollNo")}
                            </Text>
                            <Text className="text-base font-normal text-white">
                              {rollNoEntry?.[1] || "Not assigned yet"}
                            </Text>
                          </View>
                          <View className="flex-1 ml-2">
                            {passportPhotoEntry?.[1] ? (
                              <TouchableOpacity
                                onPress={() =>
                                  openImageModal(
                                    passportPhotoEntry[1] as string
                                  )
                                }
                              >
                                <Image
                                  source={{
                                    uri: passportPhotoEntry[1] as string,
                                  }}
                                  style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 8,
                                    backgroundColor: "#eee",
                                  }}
                                  resizeMode="contain"
                                />
                              </TouchableOpacity>
                            ) : (
                              <Text className="text-base font-normal text-white italic">
                                Not assigned yet
                              </Text>
                            )}
                          </View>
                        </View>
                      )}

                      {/* Display other priority fields if not shown above */}
                      {(!hasRollNo || !hasPassportPhoto) && (
                        <>
                          {entries
                            .filter(([key]) =>
                              ["rollNo", "passportPhotoUrl"].includes(key)
                            )
                            .map(([key, value]) => (
                              <View
                                key={key}
                                className="bg-[#022B60] rounded-lg px-3 py-2 mb-3"
                              >
                                <Text className="text-base font-semibold text-white">
                                  {formatKey(key)}
                                </Text>
                                {value === null ||
                                value === undefined ||
                                value === "" ? (
                                  <Text className="text-base font-normal text-white mt-1 italic">
                                    Not assigned yet
                                  </Text>
                                ) : imageKeys.includes(key) &&
                                  typeof value === "string" ? (
                                  <TouchableOpacity
                                    onPress={() => openImageModal(value)}
                                  >
                                    <Image
                                      source={{ uri: value }}
                                      style={{
                                        width: 180,
                                        height: 180,
                                        borderRadius: 8,
                                        marginTop: 8,
                                        backgroundColor: "#eee",
                                      }}
                                      resizeMode="contain"
                                    />
                                  </TouchableOpacity>
                                ) : (
                                  <Text className="text-base font-normal text-white mt-1">
                                    {typeof value === "string"
                                      ? value
                                      : JSON.stringify(value)}
                                  </Text>
                                )}
                              </View>
                            ))}
                        </>
                      )}

                      {/* Display remaining entries */}
                      {[...nonNullEntries, ...nullEntries].map(
                        ([key, value]) => (
                          <View
                            key={key}
                            className="bg-[#022B60] rounded-lg px-3 py-2 mt-3"
                          >
                            <Text className="text-base font-semibold text-white">
                              {formatKey(key)}
                            </Text>
                            {value === null ||
                            value === undefined ||
                            value === "" ? (
                              <Text className="text-base font-normal text-white mt-1 italic">
                                Not assigned yet
                              </Text>
                            ) : imageKeys.includes(key) &&
                              typeof value === "string" ? (
                              <TouchableOpacity
                                onPress={() => openImageModal(value)}
                              >
                                <Image
                                  source={{ uri: value }}
                                  style={{
                                    width: 180,
                                    height: 180,
                                    borderRadius: 8,
                                    marginTop: 8,
                                    backgroundColor: "#eee",
                                  }}
                                  resizeMode="contain"
                                />
                              </TouchableOpacity>
                            ) : (
                              <Text
                                className="text-base font-normal text-white mt-1"
                                numberOfLines={4}
                                ellipsizeMode="tail"
                              >
                                {typeof value === "string"
                                  ? value
                                  : JSON.stringify(value)}
                              </Text>
                            )}
                          </View>
                        )
                      )}
                    </View>
                  );
                })()}
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
                className="bg-[#022B60] min-w-[95px] px-3 h-10 justify-center rounded-lg"
              >
                <ButtonText className="text-white text-center">
                  {props.ApproveButtonTitle || "Approve"}
                </ButtonText>
              </Button>
            )}
            {props.onDecline && (
              <Button
                onPress={() => {
                  setViewDetails(false);
                  props.onDecline?.();
                }}
                className="bg-white border-[#022B60] border-2 w-[90px] h-10 rounded-lg justify-center"
              >
                <ButtonText className="text-[#022B60] text-center">
                  Decline
                </ButtonText>
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Image Modal */}
      <Modal isOpen={!!selectedImage} onClose={closeImageModal}>
        <ModalBackdrop />
        <ModalContent
          style={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        margin: 0,
        backgroundColor: "black",
          }}
        >
          <View className="flex-1 bg-black">
        <View
          className="absolute top-[50px] right-5 z-50 bg-black/50 rounded-2xl p-2"
        >
          <TouchableOpacity onPress={closeImageModal}>
            <Text className="text-white text-2xl font-bold">×</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center bg-black">
          {selectedImage && (
            <Image
          source={{ uri: selectedImage }}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
          resizeMode="contain"
          onLoad={() => console.log("Image loaded successfully")}
          onError={(error) => {
            console.log("Image load error:", error);
            setImageError(true);
          }}
            />
          )}
          {imageError && (
            <View className="absolute justify-center items-center">
          <Text className="text-white text-center text-lg">
            Failed to load image
          </Text>
          <Text className="text-white text-center text-base mt-2">
            URI: {selectedImage}
          </Text>
            </View>
          )}
        </View>
          </View>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default ApprovalCard;
