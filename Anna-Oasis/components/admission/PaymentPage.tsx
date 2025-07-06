import { View, Text, Image } from "react-native";
import { useFormikContext } from "formik";
import TextField from "@/components/form/TextField";
import ImagePickerField from "@/components/form/ImagePickerField";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableData,
} from "@/components/ui/table";

const HOSTEL_FEES = [
  { label: "Admission Fee (One Time)", amount: "₹5,000" },
  { label: "Caution Deposit (Refundable, One Time)", amount: "₹15,000" },
  {
    label: "Room Rent & Maintenance Charges (per semester)",
    amount: "₹43,500",
  },
  {
    label: "Clothes Washing & Drying Charges (per semester)",
    amount: "₹4,500",
  },
  { label: "Total Hostel Charges (per semester)", amount: "₹48,000" },
  { label: "Mess Charges (per semester)", amount: "₹48,300" },
];

const HOSTEL_TOTALS = [
  {
    label: "Total for new admission (One Time + Semester + Mess)",
    amount: "₹1,16,300",
  },
  {
    label: "Total for Every Subsequent Semester (Semester + Mess)",
    amount: "₹96,300",
  },
];

const QR_IMAGE = require("@/assets/images/upi_qr.jpg");

const PaymentPage = () => {
  const { values } = useFormikContext<any>();

  return (
    <View className="mb-8">
      <Text className="text-xl font-bold mb-2 mt-2 text-center">
        Hostel Fee Payment
      </Text>
      <View className="mb-4 bg-gray-100 rounded-lg p-4">
        <Text className="text-lg font-semibold mb-2 text-center">
          Fee Structure
        </Text>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Particulars</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HOSTEL_FEES.map((fee, idx) => (
              <TableRow key={idx}>
                <TableData>{fee.label}</TableData>
                <TableData>{fee.amount}</TableData>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {HOSTEL_TOTALS.map((total, idx) => (
              <TableRow key={idx}>
                <TableHead>{total.label}</TableHead>
                <TableHead>{total.amount}</TableHead>
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </View>
      <View className="items-center mb-4">
        <Image
          source={QR_IMAGE}
          style={{ width: 300, height: 400, marginBottom: 8, borderRadius: 12 }}
          resizeMode="contain"
        />
        <Text className="mb-2 text-center">
          Please scan the QR code above or use the UPI ID to pay the total
          hostel fees via Google Pay (GPay).
        </Text>
      </View>
      <View className="mb-4">
        <Text className="mb-1 font-medium">
          After payment, enter your Transaction ID below to proceed.
        </Text>
        <TextField
          label="Transaction ID"
          value="transactionId"
          placeholder="Enter your Transaction ID"
        />
        <View className="mt-4" />
        <ImagePickerField
          label="Transaction Screenshot"
          value="transactionPhotoUrl"
          placeholder="Upload a screenshot of your payment"
        />
      </View>
    </View>
  );
};

export default PaymentPage;
