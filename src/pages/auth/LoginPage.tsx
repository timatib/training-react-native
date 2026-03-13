import React, { useState } from 'react';
import {
  Box, VStack, HStack, Text, Input, Button, Pressable,
  FormControl, ScrollView, useColorModeValue, KeyboardAvoidingView,
} from 'native-base';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../app/navigation/AuthNavigator';
import { useLogin } from '../../features/auth/useLogin';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

type FormData = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigation = useNavigation<Nav>();
  const { handleLogin, isLoading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const bg = useColorModeValue('white', 'gray.900');
  const primaryTextColor = useColorModeValue('primary.600', 'primary.300');

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: FormData) => {
    handleLogin(data.email, data.password);
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
            <Ionicons name="hardware-chip-outline" size={64} color="#870BF4" style={{ marginBottom: 12 }} />
            <Text fontSize="3xl" fontWeight="bold" color={primaryTextColor}>
              AI Тренер
            </Text>
            <Text fontSize="md" color="gray.500" mt={1}>
              Войдите в свой аккаунт
            </Text>
          </VStack>

          {/* Server error */}
          {error && (
            <Box bg="red.50" borderRadius="lg" p={3} mb={4} borderLeftWidth={4} borderLeftColor="red.500">
              <Text color="red.600" fontSize="sm">{error}</Text>
            </Box>
          )}

          {/* Form */}
          <VStack space={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormControl.Label>Email</FormControl.Label>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Введите email',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Неверный формат email' },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    size="lg"
                  />
                )}
              />
              <FormControl.ErrorMessage>{errors.email?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormControl.Label>Пароль</FormControl.Label>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Введите пароль',
                  minLength: { value: 8, message: 'Минимум 8 символов' },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    placeholder="Минимум 8 символов"
                    type={showPassword ? 'text' : 'password'}
                    size="lg"
                    InputRightElement={
                      <Pressable onPress={() => setShowPassword(!showPassword)} mr={2}>
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color="#9ca3af"
                        />
                      </Pressable>
                    }
                  />
                )}
              />
              <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
            </FormControl>

            <Pressable onPress={() => navigation.navigate('ForgotPassword')} alignSelf="flex-end">
              <Text color={primaryTextColor} fontSize="sm">Забыли пароль?</Text>
            </Pressable>

            <Button
              onPress={handleSubmit(onSubmit)}
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
              <Text color={primaryTextColor} fontWeight="600">Зарегистрироваться</Text>
            </Pressable>
          </HStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
