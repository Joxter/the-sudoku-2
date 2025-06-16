import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { GameButton } from '../../components/GameButton';
import { Colors, CommonStyles, Spacing, FontSizes } from '../../constants/Styles';

export default function NewGame() {
  const router = useRouter();

  return (
    <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
      <Text style={{ 
        fontSize: FontSizes.xxlarge, 
        marginBottom: Spacing.xl, 
        color: Colors.black,
        fontWeight: 'bold'
      }}>
        New Game
      </Text>
      
      <View style={{ gap: Spacing.md }}>
        <GameButton 
          title="4x4 Easy" 
          onPress={() => router.push('/game')}
        />
        <GameButton 
          title="6x6 Medium" 
          onPress={() => router.push('/game')}
          variant="secondary"
        />
        <GameButton 
          title="9x9 Hard" 
          onPress={() => router.push('/game')}
          variant="outline"
        />
      </View>
    </View>
  );
}