import { Button, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableData, TableFooter } from "@/components/ui/table";
import { View, Text, ScrollView } from "react-native";
import { handelRCAttendance, markPresent, sampleStudents } from "@/utils/RcAttendenceUtils";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { useState } from "react";


export default function AttendancePage() {

  const[floor, setFloor] = useState("")
  const floors = ["1", "2", "3"]

  return (
    <ScrollView>
      <View className="flex-1 justify-center items-center p-2">
        <Text className="text-2xl m-2 mt-6 font-bold">RC Name Attendance</Text>
        <View className="flex flex-row gap-4 items-center mt-6">
            <Text className="text-lg">Select Floor</Text>
            <Select  className="w-[150px]" onValueChange={(value) => setFloor(value)}>
              <SelectTrigger>
                <SelectInput placeholder="Select Floor" className="flex-1 my-3 py-2"/>
                <SelectIcon as={ChevronDownIcon}/>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop/>
                <SelectContent>
                  <SelectDragIndicatorWrapper className="m-4">
                    <SelectDragIndicator/>
                  </SelectDragIndicatorWrapper>
                  {floors.map((item, index) => (
                    <SelectItem key={index} label={item} value={item}/>
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
        </View>
        {floor.trim() !== "" ?
          <ScrollView horizontal>
            <View className="bg-white rounded-2xl border border-1 border-black m-2 mt-12">
              <Table className="w-full mt-10 p-2">
                <TableHeader>
                  <TableRow>
                    {["Present","Roll No", "Name", "Block"].map((item, index) => (
                        <>
                          <TableHead 
                            className={`w-[150px] overflow-scroll ${index == 0 && 'border-l'}  border-r border-y text-center`}
                            key={index}>
                            {item}
                          </TableHead>
                        </>
                      ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sampleStudents.map((item, rowIndex) => (
                    item.floor == parseInt(floor) &&
                    <TableRow key={rowIndex}>
                      <TableData className="w-[150px] overflow-scroll border-x text-center">
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
                      {Object.entries(item).slice(0, -1).map(([key, value], colIndex) => (
                        key !== "floor" && 
                        <TableData
                          key={colIndex}
                          className="w-[150px] overflow-scroll border-r text-center font-light"
                        >
                          {value?.toString()}
                        </TableData>
                      ))}
                    </TableRow>
                  ))}
            
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableData>
                      <Button onPress={() => handelRCAttendance(parseInt(floor))}>
                        <ButtonText>
                          Submit
                        </ButtonText>
                      </Button>
                    </TableData>
                  </TableRow>
                </TableFooter>
              </Table>
            </View>

          </ScrollView>
          :
          <View className="mt-52">
            <Text className="text-3xl">Select floor for attendance</Text>
          </View>
        }
      </View>
    </ScrollView>

  );
}