import React, { useState, useEffect } from 'react';
import {
  Box, VStack, HStack, Text, Input, Button, ScrollView,
  Select, Switch, useColorModeValue, Avatar, Modal,
  FormControl, useColorMode,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useProfile, useUpdateProfile } from '../../features/profile/useProfile';
import { useAuthStore } from '../../features/auth/authStore';
import api from '../../shared/api/axios';

type ProfileFormData = {
  name: string;
  slogan: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  gender: string;
  fitnessLevel: string;
  workoutPlace: string;
  aiStyle: string;
  language: string;
};

type PasswordFormData = {
  oldPassword: string;
  newPassword: string;
};

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const { logout } = useAuthStore();
  const { colorMode, toggleColorMode } = useColorMode();

  const [saved, setSaved] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [pwError, setPwError] = useState('');

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Profile form
  const { control, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: '', slogan: '', age: '', weight: '', height: '',
      goal: '', gender: '', fitnessLevel: '', workoutPlace: '',
      aiStyle: 'NORMAL', language: 'ru',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        slogan: profile.slogan || '',
        age: profile.age?.toString() || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
        goal: profile.goal || '',
        gender: profile.gender || '',
        fitnessLevel: profile.fitnessLevel || '',
        workoutPlace: profile.workoutPlace || '',
        aiStyle: profile.aiStyle || 'NORMAL',
        language: profile.language || 'ru',
      });
    }
  }, [profile, reset]);

  const onSave = async (data: ProfileFormData) => {
    await updateMutation.mutateAsync({
      name: data.name || undefined,
      slogan: data.slogan || undefined,
      age: data.age ? parseInt(data.age) : undefined,
      weight: data.weight ? parseFloat(data.weight) : undefined,
      height: data.height ? parseFloat(data.height) : undefined,
      goal: data.goal || undefined,
      gender: (data.gender as any) || undefined,
      fitnessLevel: (data.fitnessLevel as any) || undefined,
      workoutPlace: (data.workoutPlace as any) || undefined,
      aiStyle: (data.aiStyle as any) || undefined,
      language: data.language || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Password form
  const {
    control: pwControl,
    handleSubmit: handlePwSubmit,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm<PasswordFormData>({
    defaultValues: { oldPassword: '', newPassword: '' },
  });

  const onChangePassword = async (data: PasswordFormData) => {
    setPwError('');
    try {
      await api.post('/api/auth/change-password', {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      setPwModal(false);
      resetPw();
    } catch (err: any) {
      setPwError(err.response?.data?.error || 'Ошибка смены пароля');
    }
  };

  if (isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text>Загрузка...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg={bg} safeArea>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Box px={4} py={4}>
          {/* Avatar & slogan */}
          <VStack alignItems="center" mb={6}>
            <Avatar size="xl" bg="primary.500" mb={3}>
              {profile?.name?.charAt(0)?.toUpperCase() || '?'}
            </Avatar>
            <Text fontSize="xl" fontWeight="bold">{profile?.name || 'Пользователь'}</Text>
            <Controller
              control={control}
              name="slogan"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ваш слоган..."
                  textAlign="center"
                  variant="unstyled"
                  fontSize="sm"
                  color="gray.500"
                  mt={1}
                />
              )}
            />
          </VStack>

          {/* Personal info */}
          <Box bg={cardBg} borderRadius="xl" p={4} mb={4} shadow={1}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Личные данные</Text>

            <VStack space={4}>
              <FormControl>
                <FormControl.Label>Имя</FormControl.Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <Input value={value} onChangeText={onChange} />
                  )}
                />
              </FormControl>

              <HStack space={3}>
                <FormControl flex={1}>
                  <FormControl.Label>Возраст</FormControl.Label>
                  <Controller
                    control={control}
                    name="age"
                    render={({ field: { onChange, value } }) => (
                      <Input value={value} onChangeText={onChange} keyboardType="numeric" />
                    )}
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormControl.Label>Пол</FormControl.Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                      <Select selectedValue={value} onValueChange={onChange}>
                        <Select.Item label="Мужской" value="MALE" />
                        <Select.Item label="Женский" value="FEMALE" />
                        <Select.Item label="Другой" value="OTHER" />
                      </Select>
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack space={3}>
                <FormControl flex={1}>
                  <FormControl.Label>Вес (кг)</FormControl.Label>
                  <Controller
                    control={control}
                    name="weight"
                    render={({ field: { onChange, value } }) => (
                      <Input value={value} onChangeText={onChange} keyboardType="decimal-pad" />
                    )}
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormControl.Label>Рост (см)</FormControl.Label>
                  <Controller
                    control={control}
                    name="height"
                    render={({ field: { onChange, value } }) => (
                      <Input value={value} onChangeText={onChange} keyboardType="numeric" />
                    )}
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormControl.Label>Уровень</FormControl.Label>
                <Controller
                  control={control}
                  name="fitnessLevel"
                  render={({ field: { onChange, value } }) => (
                    <Select selectedValue={value} onValueChange={onChange}>
                      <Select.Item label="Начинающий" value="BEGINNER" />
                      <Select.Item label="Средний" value="INTERMEDIATE" />
                      <Select.Item label="Продвинутый" value="ADVANCED" />
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Место тренировок</FormControl.Label>
                <Controller
                  control={control}
                  name="workoutPlace"
                  render={({ field: { onChange, value } }) => (
                    <Select selectedValue={value} onValueChange={onChange}>
                      <Select.Item label="Зал" value="GYM" />
                      <Select.Item label="Дома" value="HOME" />
                      <Select.Item label="На улице" value="OUTDOOR" />
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Цель</FormControl.Label>
                <Controller
                  control={control}
                  name="goal"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      placeholder="Например: Похудеть на 10 кг к лету"
                      multiline
                      numberOfLines={2}
                    />
                  )}
                />
              </FormControl>
            </VStack>
          </Box>

          {/* AI & preferences */}
          <Box bg={cardBg} borderRadius="xl" p={4} mb={4} shadow={1}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Настройки ИИ</Text>

            <VStack space={4}>
              <FormControl>
                <FormControl.Label>Стиль общения ИИ</FormControl.Label>
                <Controller
                  control={control}
                  name="aiStyle"
                  render={({ field: { onChange, value } }) => (
                    <Select selectedValue={value} onValueChange={onChange}>
                      <Select.Item label="Строгий" value="STRICT" />
                      <Select.Item label="Обычный" value="NORMAL" />
                      <Select.Item label="Шуточный" value="FUN" />
                    </Select>
                  )}
                />
              </FormControl>

              <HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="500">Тёмная тема</Text>
                <Switch
                  isChecked={colorMode === 'dark'}
                  onToggle={toggleColorMode}
                  colorScheme="primary"
                  size="sm"
                />
              </HStack>

              <FormControl>
                <FormControl.Label>Язык</FormControl.Label>
                <Controller
                  control={control}
                  name="language"
                  render={({ field: { onChange, value } }) => (
                    <Select selectedValue={value} onValueChange={onChange}>
                      <Select.Item label="Русский" value="ru" />
                      <Select.Item label="English" value="en" />
                    </Select>
                  )}
                />
              </FormControl>
            </VStack>
          </Box>

          {/* Save button */}
          <Button
            onPress={handleSubmit(onSave)}
            isLoading={updateMutation.isPending}
            isLoadingText="Сохранение..."
            size="lg"
            borderRadius="xl"
            mb={3}
            colorScheme={saved ? 'green' : 'primary'}
          >
            {saved ? (
              <HStack space={2} alignItems="center">
                <Ionicons name="checkmark-circle" size={18} color="white" />
                <Text color="white" fontWeight="600">Сохранено!</Text>
              </HStack>
            ) : 'Сохранить изменения'}
          </Button>

          {/* Other actions */}
          <VStack space={2} mb={6}>
            <Button
              variant="outline"
              borderRadius="xl"
              onPress={() => setPwModal(true)}
              leftIcon={<Ionicons name="lock-closed-outline" size={16} color="#870BF4" />}
            >
              Сменить пароль
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              borderRadius="xl"
              onPress={logout}
              leftIcon={<Ionicons name="log-out-outline" size={16} color="#ef4444" />}
            >
              Выйти
            </Button>
          </VStack>
        </Box>
      </ScrollView>

      {/* Change password modal */}
      <Modal isOpen={pwModal} onClose={() => { setPwModal(false); resetPw(); setPwError(''); }}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Сменить пароль</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              {pwError && <Text color="red.500" fontSize="sm">{pwError}</Text>}

              <FormControl isInvalid={!!pwErrors.oldPassword}>
                <FormControl.Label>Текущий пароль</FormControl.Label>
                <Controller
                  control={pwControl}
                  name="oldPassword"
                  rules={{ required: 'Введите текущий пароль' }}
                  render={({ field: { onChange, value } }) => (
                    <Input value={value} onChangeText={onChange} type="password" />
                  )}
                />
                <FormControl.ErrorMessage>{pwErrors.oldPassword?.message}</FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!pwErrors.newPassword}>
                <FormControl.Label>Новый пароль</FormControl.Label>
                <Controller
                  control={pwControl}
                  name="newPassword"
                  rules={{
                    required: 'Введите новый пароль',
                    minLength: { value: 8, message: 'Минимум 8 символов' },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input value={value} onChangeText={onChange} type="password" />
                  )}
                />
                <FormControl.ErrorMessage>{pwErrors.newPassword?.message}</FormControl.ErrorMessage>
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => { setPwModal(false); resetPw(); setPwError(''); }}>Отмена</Button>
              <Button onPress={handlePwSubmit(onChangePassword)}>Сменить</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
