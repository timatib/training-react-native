import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import api from '../../shared/api/axios';

export function useTranscribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } catch {
      // ignore permission or device errors
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
    } catch {
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
