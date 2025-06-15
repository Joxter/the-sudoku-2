import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function NewGame() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>New Game</Text>
      <Button 
        title="Start Game" 
        onPress={() => router.push('/game')}
      />
    </View>
  );
}