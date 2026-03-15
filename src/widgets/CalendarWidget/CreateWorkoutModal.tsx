import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Modal, VStack, HStack, Text, Input, Button, Select, CheckIcon,
  FormControl, Box, ScrollView, Pressable, useColorModeValue,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import api from '../../shared/api/axios';

type WorkoutPlace = 'GYM' | 'HOME' | 'OUTDOOR';

interface ExerciseField {
  name: string;
  sets: string;
  reps: string;
}

interface FormValues {
  title: string;
  date: string;
  place: WorkoutPlace;
  exercises: ExerciseField[];
}

interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string;
  defaultPlace?: WorkoutPlace;
}

const PLACE_LABELS: Record<WorkoutPlace, string> = {
  GYM: 'Зал (GYM)',
  HOME: 'Дома (HOME)',
  OUTDOOR: 'На улице (OUTDOOR)',
};

export function CreateWorkoutModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
  defaultPlace = 'GYM',
}: CreateWorkoutModalProps) {
  const exerciseBg = useColorModeValue('gray.50', 'gray.700');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      date: initialDate || new Date().toISOString().slice(0, 10),
      place: defaultPlace,
      exercises: [{ name: '', sets: '3', reps: '10' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'exercises' });

  const onSubmit = async (values: FormValues) => {
    const exercises = values.exercises
      .filter((e) => e.name.trim() !== '')
      .map((e) => ({
        name: e.name.trim(),
        sets: parseInt(e.sets) || 3,
        reps: parseInt(e.reps) || 10,
      }));

    await api.post('/api/workouts', {
      title: values.title.trim(),
      date: new Date(values.date + 'T12:00:00').toISOString(),
      place: values.place,
      exercises,
    });

    reset();
    onSuccess();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <Modal.Content maxH="90%" borderRadius="2xl" mx={4}>
        <Modal.Header borderBottomWidth={1}>
          <Text fontSize="lg" fontWeight="bold">Новая тренировка</Text>
        </Modal.Header>

        <Modal.Body>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack space={4} pb={4}>

              {/* Title */}
              <FormControl isRequired isInvalid={!!errors.title}>
                <FormControl.Label>Название</FormControl.Label>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: 'Введите название тренировки' }}
                  render={({ field }) => (
                    <Input
                      placeholder="Силовая тренировка"
                      value={field.value}
                      onChangeText={field.onChange}
                      borderRadius="xl"
                    />
                  )}
                />
                {errors.title && (
                  <FormControl.ErrorMessage>{errors.title.message}</FormControl.ErrorMessage>
                )}
              </FormControl>

              {/* Date */}
              <FormControl isRequired isInvalid={!!errors.date}>
                <FormControl.Label>Дата (ГГГГ-ММ-ДД)</FormControl.Label>
                <Controller
                  control={control}
                  name="date"
                  rules={{
                    required: 'Введите дату',
                    pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Формат: ГГГГ-ММ-ДД' },
                  }}
                  render={({ field }) => (
                    <Input
                      placeholder="2026-03-20"
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType="numbers-and-punctuation"
                      borderRadius="xl"
                    />
                  )}
                />
                {errors.date && (
                  <FormControl.ErrorMessage>{errors.date.message}</FormControl.ErrorMessage>
                )}
              </FormControl>

              {/* Place */}
              <FormControl isRequired>
                <FormControl.Label>Место</FormControl.Label>
                <Controller
                  control={control}
                  name="place"
                  render={({ field }) => (
                    <Select
                      selectedValue={field.value}
                      onValueChange={field.onChange}
                      borderRadius="xl"
                      _selectedItem={{ endIcon: <CheckIcon size="3" /> }}
                    >
                      {(Object.keys(PLACE_LABELS) as WorkoutPlace[]).map((key) => (
                        <Select.Item key={key} label={PLACE_LABELS[key]} value={key} />
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              {/* Exercises */}
              <VStack space={3}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold" fontSize="md">Упражнения</Text>
                  <Pressable
                    onPress={() => append({ name: '', sets: '3', reps: '10' })}
                    flexDirection="row"
                    alignItems="center"
                    style={{ gap: 4 }}
                  >
                    <Ionicons name="add-circle-outline" size={18} color="#870BF4" />
                    <Text fontSize="sm" color="primary.600">Добавить</Text>
                  </Pressable>
                </HStack>

                {fields.map((field, index) => (
                  <Box key={field.id} bg={exerciseBg} borderRadius="xl" p={3}>
                    <HStack justifyContent="space-between" alignItems="center" mb={2}>
                      <Text fontSize="xs" color="gray.500" fontWeight="500">
                        Упражнение {index + 1}
                      </Text>
                      {fields.length > 1 && (
                        <Pressable onPress={() => remove(index)}>
                          <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
                        </Pressable>
                      )}
                    </HStack>

                    <Controller
                      control={control}
                      name={`exercises.${index}.name`}
                      render={({ field: f }) => (
                        <Input
                          placeholder="Название упражнения"
                          value={f.value}
                          onChangeText={f.onChange}
                          mb={2}
                          borderRadius="lg"
                          fontSize="sm"
                        />
                      )}
                    />

                    <HStack space={2}>
                      <Controller
                        control={control}
                        name={`exercises.${index}.sets`}
                        render={({ field: f }) => (
                          <Input
                            flex={1}
                            placeholder="Подходы"
                            value={f.value}
                            onChangeText={f.onChange}
                            keyboardType="numeric"
                            borderRadius="lg"
                            fontSize="sm"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`exercises.${index}.reps`}
                        render={({ field: f }) => (
                          <Input
                            flex={1}
                            placeholder="Повторения"
                            value={f.value}
                            onChangeText={f.onChange}
                            keyboardType="numeric"
                            borderRadius="lg"
                            fontSize="sm"
                          />
                        )}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>

            </VStack>
          </ScrollView>
        </Modal.Body>

        <Modal.Footer borderTopWidth={1}>
          <HStack space={3} flex={1}>
            <Button
              flex={1}
              variant="outline"
              borderRadius="xl"
              onPress={handleClose}
            >
              Отмена
            </Button>
            <Button
              flex={1}
              borderRadius="xl"
              colorScheme="primary"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Сохранить
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
