export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type FitnessLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type AiStyle = 'STRICT' | 'NORMAL' | 'FUN';
export type WorkoutPlace = 'GYM' | 'HOME' | 'OUTDOOR';
export type Theme = 'LIGHT' | 'DARK';
export type SubType = 'TRIAL' | 'FREE' | 'PRO';

export interface Subscription {
  type: SubType;
  tokensUsed: number;
  tokensLimit: number;
  expiresAt?: string;
}

export interface Streak {
  currentDays: number;
  maxDays: number;
  waterDrops: number;
  lastDate?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  slogan?: string;
  gender?: Gender;
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: FitnessLevel;
  goal?: string;
  aiStyle: AiStyle;
  theme: Theme;
  language: string;
  workoutPlace?: WorkoutPlace;
  subscription?: Subscription;
  streaks?: Streak[];
}
