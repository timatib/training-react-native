import React, { useState } from 'react';
import {
  Box, VStack, HStack, Text, Input, Button, Pressable,
  FormControl, ScrollView, useColorModeValue, KeyboardAvoidingView,
} from 'native-base';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../app/navigation/AuthNavigator';
import { useLogin } from '../../features/auth/useLogin';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginPage() {
  const navigation = useNavigation<Nav>();
  const { handleLogin, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const bg = useColorModeValue('white', 'gray.900');

  const onSubmit = () => {
    if (email && password) handleLogin(email, password);
  };

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView flex={1} bg={bg} keyboardShouldPersistTaps="handled">
        <Box flex={1} px={6} pt={16} pb={8}>
          {/* Logo */}
          <VStack alignItems="center" mb={10}>
            <Text fontSize="6xl" mb={3}>🤖</Text>
            <Text fontSize="3xl" fontWeight="bold" color="primary.600">
              AI Тренер
            </Text>
            <Text fontSize="md" color="gray.500" mt={1}>
              Войдите в свой аккаунт
            </Text>
          </VStack>

          {/* Error */}
          {error && (
            <Box bg="red.50" borderRadius="lg" p={3} mb={4} borderLeftWidth={4} borderLeftColor="red.500">
              <Text color="red.600" fontSize="sm">{error}</Text>
            </Box>
          )}

          {/* Form */}
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                size="lg"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Пароль</FormControl.Label>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Минимум 8 символов"
                type={showPassword ? 'text' : 'password'}
                size="lg"
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)} mr={2}>
                    <Text fontSize="sm" color="gray.500">
                      {showPassword ? '🙈' : '👁'}
                    </Text>
                  </Pressable>
                }
              />
            </FormControl>

            <Pressable onPress={() => navigation.navigate('ForgotPassword')} alignSelf="flex-end">
              <Text color="primary.500" fontSize="sm">Забыли пароль?</Text>
            </Pressable>

            <Button
              onPress={onSubmit}
              isLoading={isLoading}
              isLoadingText="Вход..."
              size="lg"
              mt={2}
              borderRadius="xl"
            >
              Войти
            </Button>
          </VStack>

          {/* Register link */}
          <HStack justifyContent="center" mt={8} space={1}>
            <Text color="gray.500">Нет аккаунта?</Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text color="primary.500" fontWeight="600">Зарегистрироваться</Text>
            </Pressable>
          </HStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
