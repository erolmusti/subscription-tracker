import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { Calendar } from 'lucide-react-native';

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onSelect: (date: Date) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function DatePickerField({
  label,
  value,
  onSelect,
  placeholder = 'Tarih seç',
  required = false,
  error
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onSelect(date);
    setIsOpen(false);
  };

  // Simple calendar component for web compatibility
  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    const days = [];
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    const navigateMonth = (direction: number) => {
      const newDate = new Date(selectedDate);
      newDate.setMonth(currentMonth + direction);
      setSelectedDate(newDate);
    };

    return (
      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekDays}>
          {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(day => (
            <Text key={day} style={styles.weekDay}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                !day && styles.emptyDay,
                day && day.toDateString() === selectedDate.toDateString() && styles.selectedDay,
                day && day.toDateString() === today.toDateString() && styles.todayDay
              ]}
              onPress={() => day && handleDateSelect(day)}
              disabled={!day}
            >
              <Text style={[
                styles.dayText,
                day && day.toDateString() === selectedDate.toDateString() && styles.selectedDayText,
                day && day.toDateString() === today.toDateString() && styles.todayDayText
              ]}>
                {day ? day.getDate() : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.dateInput,
          error && styles.dateInputError
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dateText,
          !value && styles.placeholderText
        ]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Calendar size={20} color="#6b7280" />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            {renderCalendar()}
            <View style={styles.calendarActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleDateSelect(selectedDate)}
              >
                <Text style={styles.confirmButtonText}>Onayla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    minHeight: 52,
  },
  dateInputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 4,
    fontWeight: '500',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  calendar: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyDay: {
    // Empty style for spacing
  },
  selectedDay: {
    backgroundColor: '#6366f1',
  },
  todayDay: {
    backgroundColor: '#e5e7eb',
  },
  dayText: {
    fontSize: 16,
    color: '#1f2937',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  todayDayText: {
    fontWeight: '600',
  },
  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#6366f1',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});