import React from "react";
import { Text } from "@/components/ui/text";

interface LabelProps {
  text: string;
}

function Label({ text }: LabelProps) {
  return (
    <>
     
        <Text bold className="text-lg py-2">
          {text}
        </Text>
      
    </>
  );
}

export default Label;
