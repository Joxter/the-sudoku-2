import { View, Text, Button, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';

export default function Game() {
  const router = useRouter();
  const [showWinPopup, setShowWinPopup] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (showWinPopup) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showWinPopup]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Game</Text>
      <Button 
        title="Show Win Popup" 
        onPress={() => setShowWinPopup(true)}
      />
      <View style={{ marginTop: 20 }}>
        <Button 
          title="Back to New Game" 
          onPress={() => router.push('/(tabs)/new-game')}
        />
      </View>

      {showWinPopup && (
        <>
          <Animated.View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: fadeAnim,
          }} />
          <Animated.View style={{
            position: 'absolute',
            top: '30%',
            left: '10%',
            right: '10%',
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            alignItems: 'center',
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}>
            <Text style={{ fontSize: 20, marginBottom: 15 }}>🎉 You Win! 🎉</Text>
            <Button 
              title="New Game" 
              onPress={() => {
                setShowWinPopup(false);
                router.push('/(tabs)/new-game');
              }}
            />
            <View style={{ marginTop: 10 }}>
              <Button 
                title="Close" 
                onPress={() => setShowWinPopup(false)}
              />
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}