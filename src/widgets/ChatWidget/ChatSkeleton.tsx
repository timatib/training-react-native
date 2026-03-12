import React from 'react';
import { Skeleton, VStack, Box } from 'native-base';

export function ChatSkeleton() {
  return (
    <VStack space={3} p={4}>
      <Box alignSelf="flex-start" w="70%">
        <Skeleton h="12" rounded="2xl" startColor="gray.200" />
      </Box>
      <Box alignSelf="flex-end" w="60%">
        <Skeleton h="10" rounded="2xl" startColor="primary.100" />
      </Box>
      <Box alignSelf="flex-start" w="80%">
        <Skeleton h="16" rounded="2xl" startColor="gray.200" />
      </Box>
    </VStack>
  );
}
