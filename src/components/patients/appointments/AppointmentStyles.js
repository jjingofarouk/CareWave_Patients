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

const { width } = Dimensions.get('window');
// Additional styles for new components
export const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#F5F7FA',
    },
    header: {
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      backgroundColor: '#004C54',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 15,
    },
    filterButton: {
      padding: 8,
    },
  
    // Statistics styles
    statisticsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 15,
      backgroundColor: '#fff',
      marginTop: -20,
      marginHorizontal: 20,
      borderRadius: 15,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#004C54',
    },
    statLabel: {
      fontSize: 12,
      color: '#666',
    },
  
    // Calendar styles
    calendarContainer: {
      marginTop: 20,
      padding: 15,
    },
    calendar: {
      borderRadius: 15,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  
    // Section header styles
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#004C54',
    },
    seeAllText: {
      color: '#004C54',
      fontSize: 14,
    },
  
    // Appointment card styles
    appointmentCard: {
      backgroundColor: '#fff',
      padding: 15,
      marginHorizontal: 20,
      marginBottom: 15,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    appointmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    appointmentTime: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#004C54',
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    patientInfo: {
      marginBottom: 10,
    },
    patientName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
    appointmentReason: {
      fontSize: 14,
      color: '#666',
    },
    appointmentFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 15,
    },
    actionButton: {
      padding: 5,
    },
  
    // Quick actions bar styles
    quickActionsBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 15,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    quickActionButton: {
      alignItems: 'center',
    },
    quickActionText: {
      marginTop: 5,
      fontSize: 12,
      color: '#004C54',
    },
  
    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#004C54',
      marginBottom: 20,
    },
  
    // Form input styles
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
      fontSize: 16,
    },
    notesInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    rowContainer: {
      marginBottom: 15,
    },
  
    // Button styles
    typeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      marginRight: 10,
    },
    selectedTypeButton: {
      backgroundColor: '#004C54',
    },
    typeButtonText: {
      color: '#333',
    },
    priorityButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      marginRight: 10,
    },
    selectedPriorityButton: {
      backgroundColor: '#004C54',
    },
    priorityButtonText: {
      color: '#333',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      padding: 12,
      borderRadius: 10,
      minWidth: 100,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#f44336',
    },
    createButton: {
      backgroundColor: '#4CAF50',
    },
    closeButton: {
      backgroundColor: '#004C54',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  
    // Details section styles
    detailsSection: {
      marginBottom: 20,
    },
    detailsLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#004C54',
      marginTop: 10,
    },
    detailsText: {
      fontSize: 16,
      color: '#333',
      marginLeft: 10,
      marginTop: 5,
    },
  
    // Search styles
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      margin: 20,
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
    },
    statisticsBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      marginVertical: 8,
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 14,
      color: '#555',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    // Filter styles
    filterSection: {
      marginBottom: 20,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#004C54',
      marginBottom: 10,
    },
    filterChip: {
      padding: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    filterChipSelected: {
      backgroundColor: '#004C54',
      borderColor: '#004C54',
    },
    filterChipText: {
      color: '#333',
    },
    filterChipTextSelected: {
      color: '#fff',
    },
    clearButton: {
      backgroundColor: '#666',
    },
    applyButton: {
      backgroundColor: '#004C54',
    },
  
    // Appointment container styles
    appointmentsContainer: {
      flex: 1,
      padding: 10,
    },
  
    // ... existing styles ...
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#004C54',
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
      fontSize: 16,
    },
    notesInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    rowContainer: {
      marginBottom: 15,
    },
    typeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      marginRight: 10,
    },
    selectedTypeButton: {
      backgroundColor: '#004C54',
    },
    typeButtonText: {
      color: '#333',
    },
    priorityButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      marginRight: 10,
    },
    selectedPriorityButton: {
      backgroundColor: '#004C54',
    },
    priorityButtonText: {
      color: '#333',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      padding: 12,
      borderRadius: 10,
      minWidth: 100,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#f44336',
    },
    createButton: {
      backgroundColor: '#4CAF50',
    },
    closeButton: {
      backgroundColor: '#004C54',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    detailsSection: {
      marginBottom: 20,
    },
    detailsLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#004C54',
      marginTop: 10,
    },
    detailsText: {
      fontSize: 16,
      color: '#333',
      marginLeft: 10,
      marginTop: 5,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      margin: 20,
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
    },
    filterSection: {
      marginBottom: 20,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#004C54',
      marginBottom: 10,
    },
    filterChip: {
      padding: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    filterChipSelected: {
      backgroundColor: '#004C54',
      borderColor: '#004C54',
    },
    filterChipText: {
      color: '#333',
    },
    filterChipTextSelected: {
      color: '#fff',
    },
    clearButton: {
      backgroundColor: '#666',
    },
    applyButton: {
      backgroundColor: '#004C54',
    }
  });