import { Dimensions, Platform, TextStyle } from 'react-native';
import { Colors } from './Colors';
import { Fonts } from './Fonts';

type FontKeys = keyof typeof Fonts;

interface TextStyleParams {
  fontSize?: TextStyle['fontSize'];
  color?: TextStyle['color'];
  fontFamily?: TextStyle['fontFamily'];
  fontWeight?: TextStyle['fontWeight'];
}

export const GlobalStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.Secondary
  },
  innerContainer: {
    marginHorizontal: 20
  },
  innerBtmContainer: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: Colors.Secondary
  },
  alignBtwContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const
  },
  alignCenterContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const
  },
  text: (size: number, family: FontKeys, color: string, weight: TextStyle['fontWeight']) => {
    const textStyle: TextStyleParams = {
      fontSize: size,
      color: color
    };
    if (Platform.OS === 'android' && family === 'AvenirNext' && weight) {
      const fontKey = `AvenirNext${weight}` as keyof typeof Fonts;
      textStyle.fontFamily = Fonts[fontKey];
    } else {
      textStyle.fontFamily = Fonts[family] as any;
    }
    if (Platform.OS === 'ios' && weight) textStyle.fontWeight = weight;
    return textStyle;
  }
};

/**
 * Creates a text style object with specified size, weight, and color.
 *
 * @param {number} size - The font size in pixels.
 * @param {string} [weight='400'] - The font weight (e.g., '400', '600', 'bold').
 * @param {string} [color='#333'] - The text color in hexadecimal format. Defaults to '#333'.
 * @returns {Object} An object containing the text style properties.
 *
 * @example
 * const style = textStyle(16, '600', '#FF0000');
 * Returns: { fontWeight: '600', fontSize: 16, color: '#FF0000', fontFamily: ... }
 */
export const textStyle = (size: number, weight = '400', color = '#333') => {
  const textStyle: TextStyleParams = {
    fontWeight: weight as TextStyle['fontWeight'],
    fontSize: size,
    color: color
  };
  // Adjust font size for smaller screens
  const { width } = Dimensions.get('window');
  if (width < 400) {
    textStyle.fontSize = size - 2;
  }

  // Set font family for Android
  if (Platform.OS === 'android' && weight) {
    const fontKey = `AvenirNext${weight}` as keyof typeof Fonts;

    textStyle.fontFamily = Fonts[fontKey];
  } else {
    textStyle.fontFamily = Fonts['AvenirNext'];
  }
  return textStyle;
};
