import { Text } from "./ui/text";

interface HelperTextProps {
  children: React.ReactNode;
  className?: string;
}

const HelperText = ({ children, className = "" }: HelperTextProps) => (
  <Text className={`text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1 my-2 ${className}`}>
    {children}
  </Text>
);

export default HelperText;
