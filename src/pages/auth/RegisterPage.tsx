import React from 'react';
import {
  Box, VStack, HStack, Text, Input, Button, Pressable,
  FormControl, ScrollView, KeyboardAvoidingView, useColorModeValue,
} from 'native-base';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../app/navigation/AuthNavigator';
import { useRegister } from '../../features/auth/useRegister';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterPage() {
  const navigation = useNavigation<Nav>();
  const { handleRegister, isLoading, error } = useRegister();

  const bg = useColorModeValue('white', 'gray.900');
  const primaryTextColor = useColorModeValue('primary.600', 'primary.300');

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data: FormData) => {
    handleRegister(data.name, data.email, data.password);
  };

  return (
    <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView flex={1} bg={bg} keyboardShouldPersistTaps="handled">
        <Box flex={1} px={6} pt={12} pb={8}>
          <VStack alignItems="center" mb={8}>
            <Ionicons name="hardware-chip-outline" size={56} color="#870BF4" style={{ marginBottom: 8 }} />
            <Text fontSize="2xl" fontWeight="bold" color={primaryTextColor}>Создать аккаунт</Text>
            <Text fontSize="sm" color="gray.500" mt={1}>Начните своё фитнес-путешествие</Text>
          </VStack>

          {error && (
            <Box bg="red.50" borderRadius="lg" p={3} mb={4} borderLeftWidth={4} borderLeftColor="red.500">
              <Text color="red.600" fontSize="sm">{error}</Text>
            </Box>
          )}

          <VStack space={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormControl.Label>Имя</FormControl.Label>
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Введите имя' }}
                render={({ field: { onChange, value } }) => (
                  <Input value={value} onChangeText={onChange} placeholder="Ваше имя" size="lg" />
                )}
              />
              <FormControl.ErrorMessage>{errors.name?.message}</FormControl.ErrorMessage>
            </FormControl>

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
                  <Input value={value} onChangeText={onChange} placeholder="Минимум 8 символов" type="password" size="lg" />
                )}
              />
              <FormControl.ErrorMessage>{errors.password?.message}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormControl.Label>Подтвердите пароль</FormControl.Label>
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: 'Повторите пароль',
                  validate: (val) => val === watch('password') || 'Пароли не совпадают',
                }}
                render={({ field: { onChange, value } }) => (
                  <Input value={value} onChangeText={onChange} placeholder="Повторите пароль" type="password" size="lg" />
                )}
              />
              <FormControl.ErrorMessage>{errors.confirmPassword?.message}</FormControl.ErrorMessage>
            </FormControl>

            <Button onPress={handleSubmit(onSubmit)} isLoading={isLoading} isLoadingText="Регистрация..." size="lg" mt={2} borderRadius="xl">
              Зарегистрироваться
            </Button>
          </VStack>

          <HStack justifyContent="center" mt={6} space={1}>
            <Text color="gray.500">Уже есть аккаунт?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text color={primaryTextColor} fontWeight="600">Войти</Text>
            </Pressable>
          </HStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
