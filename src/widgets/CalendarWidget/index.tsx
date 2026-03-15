import React from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { useColorModeValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import { WorkoutPlan } from '../../entities/workout/types';

// ─── Locales ────────────────────────────────────────────────────────────────

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ],
  monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};

LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};

LocaleConfig.defaultLocale = 'ru';

// ─── Component ───────────────────────────────────────────────────────────────

interface CalendarWidgetProps {
  workouts: WorkoutPlan[];
  onDayPress?: (date: Date, dayWorkouts: WorkoutPlan[]) => void;
  selectedDate?: Date | null;
}

const STATUS_COLORS = {
  planned: '#3b82f6',
  completed: '#10b981',
  missed: '#ef4444',
};

export function CalendarWidget({ workouts, onDayPress, selectedDate }: CalendarWidgetProps) {
  const today = new Date();
  const { i18n } = useTranslation();

  // Sync calendar locale with app language
  LocaleConfig.defaultLocale = i18n.language === 'en' ? 'en' : 'ru';

  const bgColor = useColorModeValue('#ffffff', '#1f2937');
  const textColor = useColorModeValue('#374151', '#e5e7eb');
  const monthTextColor = useColorModeValue('#111827', '#f9fafb');

  const getWorkoutsForDate = (dateStr: string): WorkoutPlan[] => {
    return workouts.filter((w) => {
      const d = new Date(w.date);
      return d.toISOString().slice(0, 10) === dateStr;
    });
  };

  const getDayStatus = (dateStr: string): 'planned' | 'completed' | 'missed' | null => {
    const dayWorkouts = getWorkoutsForDate(dateStr);
    if (dayWorkouts.length === 0) return null;

    const date = new Date(dateStr);
    const isPast = date < today;

    if (dayWorkouts.every((w) => w.completed)) return 'completed';
    if (isPast && !dayWorkouts.every((w) => w.completed)) return 'missed';
    return 'planned';
  };

  // Build markedDates
  const markedDates: Record<string, any> = {};

  workouts.forEach((w) => {
    const dateStr = new Date(w.date).toISOString().slice(0, 10);
    const status = getDayStatus(dateStr);
    if (!status) return;

    markedDates[dateStr] = {
      ...(markedDates[dateStr] || {}),
      dots: [{ key: status, color: STATUS_COLORS[status] }],
    };
  });

  if (selectedDate) {
    const selStr = selectedDate.toISOString().slice(0, 10);
    markedDates[selStr] = {
      ...(markedDates[selStr] || {}),
      selected: true,
      selectedColor: '#870BF4',
    };
  }

  const handleDayPress = (day: DateData) => {
    const date = new Date(day.dateString + 'T12:00:00');
    const dayWorkouts = getWorkoutsForDate(day.dateString);
    onDayPress?.(date, dayWorkouts);
  };

  return (
    <Calendar
      key={i18n.language}
      markingType="multi-dot"
      markedDates={markedDates}
      onDayPress={handleDayPress}
      firstDay={1}
      enableSwipeMonths
      theme={{
        backgroundColor: bgColor,
        calendarBackground: bgColor,
        textSectionTitleColor: '#9ca3af',
        selectedDayBackgroundColor: '#870BF4',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#870BF4',
        todayBackgroundColor: 'transparent',
        dayTextColor: textColor,
        textDisabledColor: '#9ca3af',
        dotColor: '#870BF4',
        selectedDotColor: '#ffffff',
        arrowColor: '#870BF4',
        monthTextColor: monthTextColor,
        indicatorColor: '#870BF4',
        textDayFontSize: 14,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 12,
        textMonthFontWeight: 'bold',
      }}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    />
  );
}
