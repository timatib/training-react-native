import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, ActivityIndicator, LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'In React 18, SSRProvider is not necessary',
]);
import { AppProviders } from './src/app/providers/AppProviders';
import { RootNavigator } from './src/app/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <AppProviders>
      <StatusBar style="auto" />
      <RootNavigator />
    </AppProviders>
  );
}
