import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  FlatList,
  Switch,
  KeyboardAvoidingView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AppointmentStyles';

  
  export const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Appointments</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.values(APPOINTMENT_STATUS).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    filterOptions.status === status && styles.filterChipSelected,
                    { backgroundColor: filterOptions.status === status ? STATUS_COLORS[status] : '#fff' }
                  ]}
                  onPress={() => setFilterOptions(prev => ({
                    ...prev,
                    status: prev.status === status ? null : status
                  }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterOptions.status === status && styles.filterChipTextSelected
                  ]}>{status}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.values(APPOINTMENT_TYPES).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    filterOptions.type === type && styles.filterChipSelected
                  ]}
                  onPress={() => setFilterOptions(prev => ({
                    ...prev,
                    type: prev.type === type ? null : type
                  }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterOptions.type === type && styles.filterChipTextSelected
                  ]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Priority</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.values(PRIORITY_LEVELS).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterChip,
                    filterOptions.priority === priority && styles.filterChipSelected
                  ]}
                  onPress={() => setFilterOptions(prev => ({
                    ...prev,
                    priority: prev.priority === priority ? null : priority
                  }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterOptions.priority === priority && styles.filterChipTextSelected
                  ]}>{priority}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={() => setFilterOptions({
                status: null,
                type: null,
                priority: null
              })}
            >
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={() => {
                fetchAppointments({ filters: filterOptions });
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
