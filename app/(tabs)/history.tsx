import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function History() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>History</Text>
      <Button 
        title="Continue Last Game" 
        onPress={() => router.push('/game')}
      />
    </View>
  );
}