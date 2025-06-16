import { View, Text } from 'react-native';
import { Colors, CommonStyles, Spacing, FontSizes } from '../../constants/Styles';

export default function Settings() {
  return (
    <View style={[CommonStyles.container, CommonStyles.screenContainer]}>
      <Text style={{ 
        fontSize: FontSizes.xxlarge, 
        marginBottom: Spacing.xl, 
        color: Colors.black,
        fontWeight: 'bold'
      }}>
        Settings
      </Text>
      
      <Text style={{ 
        fontSize: FontSizes.medium, 
        color: Colors.gray,
        textAlign: 'center'
      }}>
        Settings coming soon...
      </Text>
    </View>
  );
}