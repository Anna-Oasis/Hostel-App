import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';

export default function Student() {
  const router = useRouter();

  return (
    <Button onPress={()=> router.push('/student/home')}>
        <ButtonText>Login as Student</ButtonText>
    </Button>
  );
}