import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { SudokuGrid } from '../components/SudokuGrid';
import { GameButton } from '../components/GameButton';
import { Colors, CommonStyles, Spacing } from '../constants/Styles';

// Simple 4x4 example puzzle
const createEmptyGrid = (size: number) => 
  Array(size).fill(null).map(() => Array(size).fill(null));

const createFixedCells = (size: number) => 
  Array(size).fill(null).map(() => Array(size).fill(false));

// Simple 4x4 puzzle for demo
const samplePuzzle = [
  [1, null, 3, null],
  [null, 2, null, 4],
  [3, null, 1, null],
  [null, 4, null, 2]
];

const sampleFixed = [
  [true, false, true, false],
  [false, true, false, true],
  [true, false, true, false],
  [false, true, false, true]
];

export default function Game() {
  const router = useRouter();
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [grid, setGrid] = useState(samplePuzzle);
  const [fixedCells] = useState(sampleFixed);
  const [selectedCell, setSelectedCell] = useState<{row: number; col: number} | null>(null);
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

  const handleCellPress = (row: number, col: number) => {
    if (!fixedCells[row][col]) {
      setSelectedCell({row, col});
    }
  };

  const handleNumberInput = (number: number) => {
    if (selectedCell && !fixedCells[selectedCell.row][selectedCell.col]) {
      const newGrid = [...grid];
      newGrid[selectedCell.row][selectedCell.col] = number;
      setGrid(newGrid);
    }
  };

  return (
    <View style={[CommonStyles.container, CommonStyles.centered]}>
      <Text style={{ fontSize: 24, marginBottom: Spacing.lg, color: Colors.black }}>
        Sudoku 4x4
      </Text>
      
      <SudokuGrid
        grid={grid}
        selectedCell={selectedCell}
        fixedCells={fixedCells}
        onCellPress={handleCellPress}
        size={4}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.lg, gap: Spacing.sm }}>
        {[1, 2, 3, 4].map((num) => (
          <GameButton
            key={num}
            title={num.toString()}
            onPress={() => handleNumberInput(num)}
            style={{ minWidth: 60 }}
          />
        ))}
      </View>

      <View style={{ marginTop: Spacing.lg, gap: Spacing.sm }}>
        <GameButton 
          title="Show Win Popup" 
          onPress={() => setShowWinPopup(true)}
          variant="secondary"
        />
        <GameButton 
          title="Back to New Game" 
          onPress={() => router.push('/(tabs)/new-game')}
          variant="outline"
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
            backgroundColor: Colors.white,
            padding: Spacing.lg,
            borderRadius: Spacing.sm,
            ...CommonStyles.shadow,
            alignItems: 'center',
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}>
            <Text style={{ fontSize: 20, marginBottom: Spacing.md, color: Colors.black }}>
              🎉 You Win! 🎉
            </Text>
            <GameButton 
              title="New Game" 
              onPress={() => {
                setShowWinPopup(false);
                router.push('/(tabs)/new-game');
              }}
            />
            <View style={{ marginTop: Spacing.sm }}>
              <GameButton 
                title="Close" 
                onPress={() => setShowWinPopup(false)}
                variant="outline"
              />
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}