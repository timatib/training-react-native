import React from 'react';
import { extendTheme, ChevronDownIcon } from 'native-base';

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
      defaultProps: { colorScheme: 'primary', borderRadius: 'xl' },
    },
    Text: {
      baseStyle: {
        _dark: { color: 'gray.100' },
      },
    },
    Input: {
      defaultProps: { borderRadius: 'lg' },
      baseStyle: {
        _dark: {
          bg: 'gray.800',
          borderColor: 'gray.600',
          color: 'gray.100',
          placeholderTextColor: 'gray.500',
        },
      },
    },
    Select: {
      defaultProps: {
        dropdownIcon: React.createElement(ChevronDownIcon, { size: '4', marginRight: '4px' }),
      },
      baseStyle: {
        _dark: {
          bg: 'gray.800',
          borderColor: 'gray.600',
          color: 'gray.100',
        },
      },
    },
    FormControlLabel: {
      baseStyle: {
        _dark: {
          _text: { color: 'gray.300' },
        },
      },
    },
    ModalContent: {
      baseStyle: {
        _dark: { bg: 'gray.800' },
      },
    },
    ModalHeader: {
      baseStyle: {
        _dark: {
          bg: 'gray.800',
          borderBottomColor: 'gray.700',
          _text: { color: 'gray.100' },
        },
      },
    },
    ModalBody: {
      baseStyle: {
        _dark: { bg: 'gray.800' },
      },
    },
    ModalFooter: {
      baseStyle: {
        _dark: {
          bg: 'gray.800',
          borderTopColor: 'gray.700',
        },
      },
    },
  },
  fontConfig: {
    body: 'System',
    heading: 'System',
    mono: 'Courier New',
  },
});
