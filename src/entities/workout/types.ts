import { WorkoutPlace } from '../user/types';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  icon?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  title: string;
  date: string;
  place: WorkoutPlace;
  exercises: Exercise[];
  completed: boolean;
  createdAt: string;
}
