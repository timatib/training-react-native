import React, { useState, useEffect } from 'react';
import {
  Box, VStack, HStack, Text, Input, Button, ScrollView,
  Select, Switch, useColorModeValue, Pressable, Avatar, Modal,
  FormControl, useColorMode,
} from 'native-base';
import { useProfile, useUpdateProfile } from '../../features/profile/useProfile';
import { useAuthStore } from '../../features/auth/authStore';
import { useNavigation } from '@react-navigation/native';
import api from '../../shared/api/axios';

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const { logout } = useAuthStore();
  const { colorMode, toggleColorMode } = useColorMode();

  const [form, setForm] = useState({
    name: '',
    slogan: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    gender: '',
    fitnessLevel: '',
    workoutPlace: '',
    aiStyle: '',
    language: '',
  });
  const [saved, setSaved] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState('');

  const bg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    if (profile) {
      setForm({
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
  }, [profile]);

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      name: form.name || undefined,
      slogan: form.slogan || undefined,
      age: form.age ? parseInt(form.age) : undefined,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      height: form.height ? parseFloat(form.height) : undefined,
      goal: form.goal || undefined,
      gender: (form.gender as any) || undefined,
      fitnessLevel: (form.fitnessLevel as any) || undefined,
      workoutPlace: (form.workoutPlace as any) || undefined,
      aiStyle: (form.aiStyle as any) || undefined,
      language: form.language || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (newPw.length < 8) { setPwError('Пароль не менее 8 символов'); return; }
    try {
      await api.post('/api/auth/change-password', { currentPassword: oldPw, newPassword: newPw });
      setPwModal(false);
      setOldPw(''); setNewPw('');
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
            <Input
              value={form.slogan}
              onChangeText={(v) => setForm((f) => ({ ...f, slogan: v }))}
              placeholder="Ваш слоган..."
              textAlign="center"
              variant="unstyled"
              fontSize="sm"
              color="gray.500"
              mt={1}
            />
          </VStack>

          {/* Personal info */}
          <Box bg="white" borderRadius="xl" p={4} mb={4} shadow={1}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Личные данные</Text>

            <VStack space={4}>
              <FormControl>
                <FormControl.Label>Имя</FormControl.Label>
                <Input value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
              </FormControl>

              <HStack space={3}>
                <FormControl flex={1}>
                  <FormControl.Label>Возраст</FormControl.Label>
                  <Input value={form.age} onChangeText={(v) => setForm((f) => ({ ...f, age: v }))} keyboardType="numeric" />
                </FormControl>
                <FormControl flex={1}>
                  <FormControl.Label>Пол</FormControl.Label>
                  <Select selectedValue={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
                    <Select.Item label="Мужской" value="MALE" />
                    <Select.Item label="Женский" value="FEMALE" />
                    <Select.Item label="Другой" value="OTHER" />
                  </Select>
                </FormControl>
              </HStack>

              <HStack space={3}>
                <FormControl flex={1}>
                  <FormControl.Label>Вес (кг)</FormControl.Label>
                  <Input value={form.weight} onChangeText={(v) => setForm((f) => ({ ...f, weight: v }))} keyboardType="decimal-pad" />
                </FormControl>
                <FormControl flex={1}>
                  <FormControl.Label>Рост (см)</FormControl.Label>
                  <Input value={form.height} onChangeText={(v) => setForm((f) => ({ ...f, height: v }))} keyboardType="numeric" />
                </FormControl>
              </HStack>

              <FormControl>
                <FormControl.Label>Уровень</FormControl.Label>
                <Select selectedValue={form.fitnessLevel} onValueChange={(v) => setForm((f) => ({ ...f, fitnessLevel: v }))}>
                  <Select.Item label="Начинающий" value="BEGINNER" />
                  <Select.Item label="Средний" value="INTERMEDIATE" />
                  <Select.Item label="Продвинутый" value="ADVANCED" />
                </Select>
              </FormControl>

              <FormControl>
                <FormControl.Label>Место тренировок</FormControl.Label>
                <Select selectedValue={form.workoutPlace} onValueChange={(v) => setForm((f) => ({ ...f, workoutPlace: v }))}>
                  <Select.Item label="🏋️ Зал" value="GYM" />
                  <Select.Item label="🏠 Дома" value="HOME" />
                  <Select.Item label="🌳 На улице" value="OUTDOOR" />
                </Select>
              </FormControl>

              <FormControl>
                <FormControl.Label>Цель</FormControl.Label>
                <Input
                  value={form.goal}
                  onChangeText={(v) => setForm((f) => ({ ...f, goal: v }))}
                  placeholder="Например: Похудеть на 10 кг к лету"
                  multiline
                  numberOfLines={2}
                />
              </FormControl>
            </VStack>
          </Box>

          {/* AI & preferences */}
          <Box bg="white" borderRadius="xl" p={4} mb={4} shadow={1}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Настройки ИИ</Text>

            <VStack space={4}>
              <FormControl>
                <FormControl.Label>Стиль общения ИИ</FormControl.Label>
                <Select selectedValue={form.aiStyle} onValueChange={(v) => setForm((f) => ({ ...f, aiStyle: v }))}>
                  <Select.Item label="😤 Строгий" value="STRICT" />
                  <Select.Item label="😊 Обычный" value="NORMAL" />
                  <Select.Item label="😄 Шуточный" value="FUN" />
                </Select>
              </FormControl>

              <HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="500">Тёмная тема</Text>
                <Switch
                  isChecked={colorMode === 'dark'}
                  onToggle={toggleColorMode}
                  colorScheme="primary"
                />
              </HStack>

              <FormControl>
                <FormControl.Label>Язык</FormControl.Label>
                <Select selectedValue={form.language} onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}>
                  <Select.Item label="🇷🇺 Русский" value="ru" />
                  <Select.Item label="🇬🇧 English" value="en" />
                </Select>
              </FormControl>
            </VStack>
          </Box>

          {/* Save button */}
          <Button
            onPress={handleSave}
            isLoading={updateMutation.isPending}
            isLoadingText="Сохранение..."
            size="lg"
            borderRadius="xl"
            mb={3}
            colorScheme={saved ? 'green' : 'primary'}
          >
            {saved ? '✅ Сохранено!' : 'Сохранить изменения'}
          </Button>

          {/* Other actions */}
          <VStack space={2} mb={6}>
            <Button variant="outline" borderRadius="xl" onPress={() => setPwModal(true)}>
              🔑 Сменить пароль
            </Button>
            <Button variant="outline" colorScheme="red" borderRadius="xl" onPress={logout}>
              🚪 Выйти
            </Button>
          </VStack>
        </Box>
      </ScrollView>

      {/* Change password modal */}
      <Modal isOpen={pwModal} onClose={() => setPwModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Сменить пароль</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              {pwError && <Text color="red.500" fontSize="sm">{pwError}</Text>}
              <FormControl>
                <FormControl.Label>Текущий пароль</FormControl.Label>
                <Input value={oldPw} onChangeText={setOldPw} type="password" />
              </FormControl>
              <FormControl>
                <FormControl.Label>Новый пароль</FormControl.Label>
                <Input value={newPw} onChangeText={setNewPw} type="password" />
              </FormControl>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setPwModal(false)}>Отмена</Button>
              <Button onPress={handleChangePassword}>Сменить</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
