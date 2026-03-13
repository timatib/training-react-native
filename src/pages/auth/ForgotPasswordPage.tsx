import React, { useState } from 'react';
import {
  Box, VStack, Text, Input, Button, Pressable, FormControl,
  KeyboardAvoidingView, useColorModeValue,
} from 'native-base';
import { Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import api from '../../shared/api/axios';

type FormData = { email: string };

export function ForgotPasswordPage() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const bg = useColorModeValue('white', 'gray.900');

  const { control, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await api.post('/api/auth/forgot-password', { email: data.email });
      setSuccess(true);
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Ошибка отправки');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView flex={1} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Box flex={1} bg={bg} px={6} pt={16}>
        <Pressable onPress={() => navigation.goBack()} mb={8}>
          <Text color="primary.500" fontSize="md">← Назад</Text>
        </Pressable>

        <VStack space={6}>
          <VStack>
            <Text fontSize="2xl" fontWeight="bold">Восстановление пароля</Text>
            <Text fontSize="sm" color="gray.500" mt={1}>
              Введите email для получения временного пароля
            </Text>
          </VStack>

          {success ? (
            <Box bg="green.50" borderRadius="lg" p={4} borderLeftWidth={4} borderLeftColor="green.500">
              <Text color="green.700" fontWeight="600">Готово!</Text>
              <Text color="green.600" mt={1}>
                Временный пароль отправлен на {getValues('email')}
              </Text>
            </Box>
          ) : (
            <>
              {serverError && (
                <Box bg="red.50" borderRadius="lg" p={3} borderLeftWidth={4} borderLeftColor="red.500">
                  <Text color="red.600" fontSize="sm">{serverError}</Text>
                </Box>
              )}

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

              <Button onPress={handleSubmit(onSubmit)} isLoading={isLoading} isLoadingText="Отправка..." size="lg" borderRadius="xl">
                Отправить
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  );
}
