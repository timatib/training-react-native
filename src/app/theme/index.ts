import { extendTheme } from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#1e40af',
      600: '#1d4ed8',
      700: '#1e3a8a',
      800: '#1e3a8a',
      900: '#1e1b4b',
    },
    neon: {
      green: '#39FF14',
      blue: '#00FFFF',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'primary' },
    },
    Input: {
      defaultProps: { borderRadius: 'lg' },
    },
  },
  fontConfig: {
    body: 'System',
    heading: 'System',
    mono: 'Courier New',
  },
});
