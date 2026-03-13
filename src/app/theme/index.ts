import { extendTheme } from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#F3E7FE',
      100: '#DDBBFC',
      200: '#C88FFA',
      300: '#B263F8',
      400: '#9527F5',
      500: '#870BF4',
      600: '#6F09C8',
      700: '#57079C',
      800: '#3E0570',
      900: '#260344',
      950: '#0E0118',
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
