import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import api from '../../shared/api/axios';

// AAC/M4A — совместим с iOS и Android, принимается Whisper
const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

export function useTranscribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert(
          'Нет доступа к микрофону',
          'Разрешите доступ к микрофону в настройках устройства, чтобы использовать голосовой ввод.'
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } catch (err: any) {
      Alert.alert('Ошибка записи', err?.message || 'Не удалось запустить запись');
    }
  }, []);

  const stopAndTranscribe = useCallback(async (language = 'ru'): Promise<string> => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const recording = recordingRef.current;
    if (!recording) return '';
    recordingRef.current = null;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch {
      return '';
    }

    const uri = recording.getURI();
    if (!uri) return '';

    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', { uri, name: 'audio.m4a', type: 'audio/m4a' } as any);

      const { data } = await api.post(
        `/api/chat/transcribe?language=${language}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data.text || '';
    } catch (err: any) {
      Alert.alert('Ошибка распознавания', err?.response?.data?.error || 'Не удалось распознать речь');
      return '';
    } finally {
      setIsTranscribing(false);
      setRecordingDuration(0);
    }
  }, []);

  const cancelRecording = useCallback(async () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const recording = recordingRef.current;
    if (recording) {
      recordingRef.current = null;
      try {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      } catch {
        // ignore
      }
    }
    setRecordingDuration(0);
  }, []);

  return {
    isRecording,
    isTranscribing,
    recordingDuration,
    startRecording,
    stopAndTranscribe,
    cancelRecording,
  };
}
