import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorModeValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

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
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarPage}
        options={{
          tabBarLabel: 'Календарь',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionPage}
        options={{
          tabBarLabel: 'Питание',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressPage}
        options={{
          tabBarLabel: 'Прогресс',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
