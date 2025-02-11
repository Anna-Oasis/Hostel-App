import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';

export default function Login() {

  return (
    <Button onPress={()=> router.push('/Student/Home')}>
        <ButtonText>Login as Student</ButtonText>
    </Button>
  );
}