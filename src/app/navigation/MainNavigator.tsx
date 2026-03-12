import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorModeValue } from 'native-base';
import { Text } from 'react-native';

import { ChatPage } from '../../pages/chat/ChatPage';
import { CalendarPage } from '../../pages/calendar/CalendarPage';
import { NutritionPage } from '../../pages/nutrition/NutritionPage';
import { ProgressPage } from '../../pages/progress/ProgressPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';

export type MainTabParamList = {
  Chat: undefined;
  Calendar: undefined;
  Nutrition: undefined;
  Progress: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export function MainNavigator() {
  const bgColor = useColorModeValue('#ffffff', '#1a1a2e');
  const activeColor = '#1e40af';
  const inactiveColor = '#9ca3af';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatPage}
        options={{
          tabBarLabel: 'Чат',
          tabBarIcon: () => <TabIcon emoji="💬" />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarPage}
        options={{
          tabBarLabel: 'Календарь',
          tabBarIcon: () => <TabIcon emoji="🗓" />,
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionPage}
        options={{
          tabBarLabel: 'Питание',
          tabBarIcon: () => <TabIcon emoji="🥗" />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressPage}
        options={{
          tabBarLabel: 'Прогресс',
          tabBarIcon: () => <TabIcon emoji="📊" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: () => <TabIcon emoji="👤" />,
        }}
      />
    </Tab.Navigator>
  );
}
