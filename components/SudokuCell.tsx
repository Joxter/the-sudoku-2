import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing } from '../constants/Styles';

interface SudokuCellProps {
  value: number | null;
  isSelected: boolean;
  isFixed: boolean;
  onPress: () => void;
}

export function SudokuCell({ value, isSelected, isFixed, onPress }: SudokuCellProps) {
  return (
    <TouchableOpacity
      style={[
        styles.cell,
        isSelected && styles.selectedCell,
        isFixed && styles.fixedCell,
      ]}
      onPress={onPress}
      disabled={isFixed}
    >
      <Text
        style={[
          styles.cellText,
          isFixed && styles.fixedText,
          !value && styles.emptyText,
        ]}
      >
        {value || ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  selectedCell: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  fixedCell: {
    backgroundColor: Colors.lightGray,
  },
  cellText: {
    fontSize: FontSizes.medium,
    fontWeight: '500',
    color: Colors.black,
  },
  fixedText: {
    fontWeight: '700',
    color: Colors.black,
  },
  emptyText: {
    color: Colors.gray,
  },
});