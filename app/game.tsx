import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Game() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Game</Text>
      <Button 
        title="Show Win Modal" 
        onPress={() => router.push('/win-modal')}
      />
      <View style={{ marginTop: 20 }}>
        <Button 
          title="Back to New Game" 
          onPress={() => router.push('/(tabs)/new-game')}
        />
      </View>
    </View>
  );
}