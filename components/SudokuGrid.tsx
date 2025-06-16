import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SudokuCell } from './SudokuCell';
import { Colors, Spacing } from '../constants/Styles';

interface SudokuGridProps {
  grid: (number | null)[][];
  selectedCell: { row: number; col: number } | null;
  fixedCells: boolean[][];
  onCellPress: (row: number, col: number) => void;
  size?: number;
}

export function SudokuGrid({ 
  grid, 
  selectedCell, 
  fixedCells, 
  onCellPress, 
  size = 9 
}: SudokuGridProps) {
  const renderRow = (row: (number | null)[], rowIndex: number) => (
    <View key={rowIndex} style={styles.row}>
      {row.map((cell, colIndex) => (
        <SudokuCell
          key={`${rowIndex}-${colIndex}`}
          value={cell}
          isSelected={
            selectedCell?.row === rowIndex && selectedCell?.col === colIndex
          }
          isFixed={fixedCells[rowIndex][colIndex]}
          onPress={() => onCellPress(rowIndex, colIndex)}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.grid, { width: size * 37 + Spacing.sm }]}>
      {grid.map((row, index) => renderRow(row, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
});