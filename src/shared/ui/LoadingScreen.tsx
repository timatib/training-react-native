import React from 'react';
import { Box, Spinner, Text, VStack } from 'native-base';

export function LoadingScreen() {
  return (
    <Box flex={1} bg="white" alignItems="center" justifyContent="center">
      <VStack space={4} alignItems="center">
        <Text fontSize="4xl">🤖</Text>
        <Spinner size="lg" color="primary.500" />
        <Text color="gray.500" fontSize="md">
          Загрузка...
        </Text>
      </VStack>
    </Box>
  );
}
