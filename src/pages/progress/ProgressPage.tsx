import React, { useState } from 'react';
import {
  Box, VStack, HStack, Text, ScrollView, Button, Modal, Input,
  useColorModeValue, Pressable,
} from 'native-base';
import { useProgressLogs, useAddProgress } from '../../features/progress/useProgress';
import { useStreak } from '../../features/streak/useStreak';

function TreeVisual({ waterDrops }: { waterDrops: number }) {
  let tree = '🌱';
  if (waterDrops >= 21) tree = '🌳';
  else if (waterDrops >= 8) tree = '🌿';

  return (
    <Box alignItems="center">
      <Text fontSize="5xl">{tree}</Text>
      <Text fontSize="xs" color="gray.500" mt={1}>
        {waterDrops} 💧 капель
      </Text>
    </Box>
  );
}

export function ProgressPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const { data: logs = [], isLoading } = useProgressLogs();
  const { data: streak } = useStreak();
  const addMutation = useAddProgress();

  const bg = useColorModeValue('gray.50', 'gray.900');

  const handleAddProgress = async () => {
    if (noteInput.trim().length < 10) return;
    await addMutation.mutateAsync(noteInput.trim());
    setNoteInput('');
    setModalOpen(false);
  };

  return (
    <Box flex={1} bg={bg} safeArea>
      <ScrollView>
        <Box px={4} py={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Прогресс</Text>

          {/* Streak card */}
          <Box bg="primary.500" borderRadius="2xl" p={5} mb={4} shadow={3}>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Text color="white" opacity={0.8} fontSize="sm">Серия тренировок</Text>
                <HStack alignItems="baseline" space={1} mt={1}>
                  <Text color="white" fontSize="4xl" fontWeight="bold">
                    {streak?.currentDays || 0}
                  </Text>
                  <Text color="white" opacity={0.8} fontSize="lg">дней</Text>
                </HStack>
                <Text color="white" opacity={0.6} fontSize="xs" mt={1}>
                  Рекорд: {streak?.maxDays || 0} дней
                </Text>
                {(streak?.currentDays || 0) >= 7 && (
                  <Box bg="white" borderRadius="full" px={3} py={1} mt={2} alignSelf="flex-start">
                    <Text color="primary.600" fontSize="xs" fontWeight="bold">🏆 7 дней!</Text>
                  </Box>
                )}
              </VStack>
              <TreeVisual waterDrops={streak?.waterDrops || 0} />
            </HStack>
          </Box>

          {/* Add progress button */}
          <Pressable onPress={() => setModalOpen(true)} mb={4}>
            <Box
              bg="white"
              borderRadius="xl"
              p={4}
              borderWidth={2}
              borderColor="primary.200"
              borderStyle="dashed"
              alignItems="center"
            >
              <Text fontSize="2xl" mb={1}>📝</Text>
              <Text color="primary.500" fontWeight="600">Записать прогресс</Text>
              <Text fontSize="sm" color="gray.400">ИИ проанализирует и даст обратную связь</Text>
            </Box>
          </Pressable>

          {/* Logs */}
          <Text fontSize="lg" fontWeight="bold" mb={3}>История</Text>

          {isLoading ? (
            <Text color="gray.400">Загрузка...</Text>
          ) : logs.length === 0 ? (
            <Box bg="white" borderRadius="xl" p={6} alignItems="center">
              <Text fontSize="3xl" mb={2}>📊</Text>
              <Text color="gray.400">Записей пока нет</Text>
              <Text fontSize="sm" color="gray.300">Добавьте первую запись о прогрессе</Text>
            </Box>
          ) : (
            <VStack space={3}>
              {logs.map((log) => (
                <Box key={log.id} bg="white" borderRadius="xl" p={4} shadow={1}>
                  <Text fontSize="xs" color="gray.400" mb={2}>
                    {new Date(log.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </Text>
                  <Text fontWeight="600" mb={2}>{log.note}</Text>
                  {log.aiResponse && (
                    <Box bg="primary.50" borderRadius="lg" p={3} borderLeftWidth={3} borderLeftColor="primary.400">
                      <Text fontSize="xs" color="primary.600" fontWeight="600" mb={1}>🤖 Макс:</Text>
                      <Text fontSize="sm" color="gray.700">{log.aiResponse}</Text>
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </ScrollView>

      {/* Add progress modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>📝 Записать прогресс</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Text fontSize="sm" color="gray.500">
                Опишите свой прогресс (минимум 10 символов). ИИ проанализирует и даст обратную связь.
              </Text>
              <Input
                value={noteInput}
                onChangeText={setNoteInput}
                placeholder="Сделал 3 тренировки на этой неделе, похудел на 0.5кг..."
                multiline
                numberOfLines={4}
                size="lg"
                minH={100}
                textAlignVertical="top"
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setModalOpen(false)}>Отмена</Button>
              <Button
                onPress={handleAddProgress}
                isLoading={addMutation.isPending}
                isLoadingText="Анализирую..."
                isDisabled={noteInput.trim().length < 10}
              >
                Сохранить
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
