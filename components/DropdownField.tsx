import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownFieldProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function DropdownField({
  label,
  value,
  onSelect,
  options,
  placeholder = 'Bir seçenek seçin',
  required = false,
  error
}: DropdownFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.dropdown,
          error && styles.dropdownError,
          isOpen && styles.dropdownOpen
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownText,
          !selectedOption && styles.placeholderText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown 
          size={20} 
          color="#6b7280" 
          style={[styles.chevron, isOpen && styles.chevronOpen]} 
        />
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
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    item.value === value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Check size={18} color="#6366f1" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              )}
            />
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
  dropdown: {
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
  dropdownError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  dropdownOpen: {
    borderColor: '#6366f1',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  chevron: {
    marginLeft: 8,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
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
    maxHeight: 300,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedOption: {
    backgroundColor: '#eef2ff',
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  selectedOptionText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 4,
    fontWeight: '500',
  },
});