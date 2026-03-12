export type MessageRole = 'USER' | 'ASSISTANT';
export type MessageType = 'TEXT' | 'VOICE' | 'WORKOUT_CARD';

export interface WorkoutCardMetadata {
  workoutCards: WorkoutCard[];
}

export interface WorkoutCard {
  type: 'workout_card';
  exercise: string;
  sets: number;
  reps: number;
  icon: string;
}

export interface Message {
  id: string;
  userId: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  audioUrl?: string;
  metadata?: WorkoutCardMetadata | null;
  createdAt: string;
}
