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
  { label: "Admission Fee (One Time)", amount: "₹7,000" },
  { label: "Caution Deposit (Refundable, One Time)", amount: "₹15,000" },
  {
    label: "Room Rent & Maintenance Charges (including cloth washing) (per semester)",
    amount: "₹65,000",
  },
  { label: "Mess Charges (per semester)", amount: "₹53,000" },
];

const HOSTEL_TOTALS = [
  {
    label: "Total for new admission (One Time + Room Rent + Mess)",
    amount: "₹1,40,000",
  },
  {
    label: "Total for Every Subsequent Semester (Room Rent + Mess)",
    amount: "₹1,18,000",
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
      <View className="mb-4 bg-gray-100 rounded-lg p-4">
        {/* <Image
          source={QR_IMAGE}
          style={{ width: 300, height: 400, marginBottom: 8, borderRadius: 12 }}
          resizeMode="contain"
        /> */}
        {/* <Text className="mb-2 text-center">
          Please scan the QR code above or use the UPI ID to pay the total
          hostel fees via Google Pay (GPay).
        </Text> */}
        <Text className="text-lg font-semibold mb-2 text-center">
          Mode of Payment
        </Text>
        <Text className="text-lg text-center">ONLINE TRANSFER ONLY (NEFT/IMPS/UPI)</Text>
        <Table className="w-full">
          <TableBody>
            <TableRow>
              <TableHead>Account Number</TableHead>
              <TableHead>31829442846</TableHead>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableHead>Name of the Bank</TableHead>
              <TableHead>State Bank of India (SBI)</TableHead>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableHead>Branch Code</TableHead>
              <TableHead>06463</TableHead>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableHead>IFSC Code</TableHead>
              <TableHead>SBIN0006463</TableHead>
            </TableRow>
          </TableBody>
          <TableBody>
            <TableRow>
              <TableHead>MICR Code</TableHead>
              <TableHead>600002039</TableHead>
            </TableRow>
          </TableBody>
           <TableBody>
            <TableRow>
              <TableHead>Bank Address</TableHead>
              <TableHead>State Bank of India,<br />
                          Anna University Branch, <br />
                          Chennai- 25, Tamilnadu, India
              </TableHead>
            </TableRow>
          </TableBody>
           <TableBody>
            <TableRow>
              <TableHead>Account Name & Address</TableHead>
              <TableHead>The Executive Warden,<br />
                        International Hostels, Anna University,<br />
                        Chennai - 25, Tamilnadu, India
              </TableHead>
            </TableRow>
          </TableBody>
        </Table>
      </View>
      <View className="self-center flex gap-2 m-2">
        <Text className="font-extrabold text-xl">HOSTEL OFFICE CONTACT DETAILS</Text>
        <Text className="font-semibold text-lg">Landline No.: 044-2235 9826 / 9827</Text>
        <Text className="font-semibold text-lg">Email Id: annaihhostels@gmail.com</Text>
      </View>
      <View className="mb-4">
        <Text className="mb-1 font-medium text-center">
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
