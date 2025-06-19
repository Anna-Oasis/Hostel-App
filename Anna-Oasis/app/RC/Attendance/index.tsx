import { Button, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableData, TableFooter } from "@/components/ui/table";
import { View, Text, ScrollView } from "react-native";
import { markPresent, sampleStudents } from "@/utils/RcAttendenceUtils";

export default function AttendancePage() {
  return (
    <ScrollView>
      <View className="flex-1 justify-center items-center m-4 rounded-2xl">
        <Text className="text-2xl m-2 font-bold">RC Name Attendance</Text>
        <ScrollView horizontal>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {["Roll No", "Name", "Floor", "Block", "Present"].map((item, index) => (
                    <>
                      <TableHead 
                        className={`w-[150px] overflow-scroll ${index !== 4 && 'border-r'} text-center`}
                        key={index}>
                        {item}
                      </TableHead>
                    </>
                  ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {sampleStudents.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.entries(item).slice(0, -1).map(([key, value], colIndex) => (
                    <TableData
                      key={colIndex}
                      className="w-[150px] overflow-scroll border-r text-center font-light"
                    >
                      {value?.toString()}
                    </TableData>
                  ))}
                  <TableData className="w-[150px] overflow-scroll  text-center">
                    <Checkbox 
                        value=""
                        size="md" 
                        isInvalid={false} 
                        isDisabled={false}
                        onChange={() => markPresent(rowIndex)}
                    >
                      <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon}/>
                      </CheckboxIndicator>
                    </Checkbox>
                </TableData>
                </TableRow>
              ))}
        
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableData>
                  <Button onPress={() => console.log(sampleStudents)}>
                    <ButtonText>
                      Submit
                    </ButtonText>
                  </Button>
                </TableData>
              </TableRow>
            </TableFooter>
          </Table>

        </ScrollView>
      </View>
    </ScrollView>

  );
}