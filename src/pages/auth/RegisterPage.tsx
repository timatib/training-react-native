import React, { useState } from 'react';
import {
  Box, VStack, HStack, Text, Input, Button, Pressable,
  FormControl, ScrollView, KeyboardAvoidingView, useColorModeValue,
} from 'native-base';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../app/navigation/AuthNavigator';
import { useRegister } from '../../features/auth/useRegister';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterPage() {
  const navigation = useNavigation<Nav>();
  const { handleRegister, isLoading, error } = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const bg = useColorModeValue('white', 'gray.900');

  const validate = () => {
    if (!name.trim()) return 'Введите имя';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Неверный формат email';
    if (password.length < 8) return 'Пароль не менее 8 символов';
    if (password !== confirmPassword) return 'Пароли не совпадают';
    return null;
  };

  const onSubmit = () => {
    const validErr = validate();
    if (validErr) { setLocalError(validErr); return; }
    setLocalError(null);
    handleRegister(name, email, password);
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView flex={1} bg={bg} keyboardShouldPersistTaps="handled">
        <Box flex={1} px={6} pt={12} pb={8}>
          <VStack alignItems="center" mb={8}>
            <Ionicons name="hardware-chip-outline" size={56} color="#1e40af" style={{ marginBottom: 8 }} />
            <Text fontSize="2xl" fontWeight="bold" color="primary.600">Создать аккаунт</Text>
            <Text fontSize="sm" color="gray.500" mt={1}>Начните своё фитнес-путешествие</Text>
          </VStack>

          {displayError && (
            <Box bg="red.50" borderRadius="lg" p={3} mb={4} borderLeftWidth={4} borderLeftColor="red.500">
              <Text color="red.600" fontSize="sm">{displayError}</Text>
            </Box>
          )}

          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Имя</FormControl.Label>
              <Input value={name} onChangeText={setName} placeholder="Ваше имя" size="lg" />
            </FormControl>

            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                size="lg"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Пароль</FormControl.Label>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Минимум 8 символов"
                type="password"
                size="lg"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Подтвердите пароль</FormControl.Label>
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Повторите пароль"
                type="password"
                size="lg"
              />
            </FormControl>

            <Button onPress={onSubmit} isLoading={isLoading} isLoadingText="Регистрация..." size="lg" mt={2} borderRadius="xl">
              Зарегистрироваться
            </Button>
          </VStack>

          <HStack justifyContent="center" mt={6} space={1}>
            <Text color="gray.500">Уже есть аккаунт?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text color="primary.500" fontWeight="600">Войти</Text>
            </Pressable>
          </HStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
