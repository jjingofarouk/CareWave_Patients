import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AppointmentStyles';
import BookAppointmentModal from './BookAppointment';
import {  AppointmentDetailsModal, FilterModal } from './AppointmentModals';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  STATUS_COLORS,
  DURATION_OPTIONS,
  CLINIC_HOURS,
  VALIDATION,
  SPECIALTIES,
  CALENDAR_VIEWS,
  SORT_OPTIONS
} from './AppointmentConstants';

const ManageAppointments = () => {
  // State management
  const [selectedDate, setSelectedDate] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [calendarView, setCalendarView] = useState(CALENDAR_VIEWS.MONTH);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DATE_ASC);
  const [filterOptions, setFilterOptions] = useState({
    dateRange: null,
    status: null,
    type: null,
    specialty: null
  });
  const [newBooking, setNewBooking] = useState({
    type: APPOINTMENT_TYPES.GENERAL_CHECKUP,
    specialty: null,
    doctorId: null,
    date: '',
    time: '',
    duration: DURATION_OPTIONS[1], // Default 30 minutes
    notes: '',
    reason: ''
  });

  // Refs for optimization
  const appointmentsRef = useRef(myAppointments);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    appointmentsRef.current = myAppointments;
  }, [myAppointments]);

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async (searchParams = {}) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('your-api-endpoint/patient/appointments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
      });
      const data = await response.json();
      
      let filteredData = data;
      
      // Apply search and filters
      if (searchParams.query) {
        filteredData = filteredData.filter(app =>
          app.doctorName?.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          app.specialty?.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          app.type.toLowerCase().includes(searchParams.query.toLowerCase())
        );
      }

      if (searchParams.filters) {
        const { status, type, specialty, dateRange } = searchParams.filters;
        if (status) filteredData = filteredData.filter(app => app.status === status);
        if (type) filteredData = filteredData.filter(app => app.type === type);
        if (specialty) filteredData = filteredData.filter(app => app.specialty === specialty);
        if (dateRange) {
          filteredData = filteredData.filter(app => {
            const appDate = new Date(app.date);
            return appDate >= dateRange.start && appDate <= dateRange.end;
          });
        }
      }

      // Apply sorting
      filteredData.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return sortOption === SORT_OPTIONS.DATE_ASC ? dateA - dateB : dateB - dateA;
      });

      setMyAppointments(filteredData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to fetch your appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!newBooking.type || !newBooking.date || !newBooking.time || !newBooking.specialty) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate booking time
    const bookingDate = new Date(`${newBooking.date}T${newBooking.time}`);
    const now = new Date();
    const minNoticeDate = new Date(now.getTime() + VALIDATION.MIN_NOTICE_MINUTES * 60000);
    const maxAdvanceDate = new Date(now.getTime() + VALIDATION.MAX_ADVANCE_DAYS * 24 * 60 * 60000);

    if (bookingDate < minNoticeDate) {
      Alert.alert('Error', `Appointments must be booked at least ${VALIDATION.MIN_NOTICE_MINUTES / 60} hours in advance`);
      return;
    }

    if (bookingDate > maxAdvanceDate) {
      Alert.alert('Error', `Appointments cannot be booked more than ${VALIDATION.MAX_ADVANCE_DAYS} days in advance`);
      return;
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('your-api-endpoint/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        },
        body: JSON.stringify(newBooking)
      });

      if (!response.ok) throw new Error('Booking failed');

      const bookedAppointment = await response.json();
      setMyAppointments(prev => [...prev, bookedAppointment]);
      setShowBookingModal(false);
      Alert.alert('Success', 'Appointment booked successfully');

      // Reset booking form
      setNewBooking({
        type: APPOINTMENT_TYPES.GENERAL_CHECKUP,
        specialty: null,
        doctorId: null,
        date: '',
        time: '',
        duration: DURATION_OPTIONS[1],
        notes: '',
        reason: ''
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`your-api-endpoint/appointments/${appointmentId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers here
        }
      });

      setMyAppointments(prev => 
        prev.map(app => 
          app.id === appointmentId 
            ? {...app, status: APPOINTMENT_STATUS.CANCELLED} 
            : app
        )
      );
      setShowAppointmentDetails(false);
      Alert.alert('Success', 'Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      Alert.alert('Error', 'Failed to cancel appointment');
    }
  };

  const handleReschedule = (appointment) => {
    setNewBooking({
      ...appointment,
      date: '',
      time: ''
    });
    setShowAppointmentDetails(false);
    setShowBookingModal(true);
  };

  const renderUpcomingAppointments = () => (
    <View style={styles.upcomingSection}>
      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
      {myAppointments
        .filter(app => 
          app.status !== APPOINTMENT_STATUS.CANCELLED && 
          app.status !== APPOINTMENT_STATUS.COMPLETED &&
          new Date(`${app.date}T${app.time}`) > new Date()
        )
        .map(renderAppointmentCard)}
    </View>
  );

  const renderAppointmentCard = (appointment) => (
    <TouchableOpacity 
      key={appointment.id} 
      style={styles.cardContainer}
      onPress={() => {
        setSelectedAppointment(appointment);
        setShowAppointmentDetails(true);
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{appointment.type}</Text>
        <Text style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[appointment.status] }]}>
          {appointment.status}
        </Text>
      </View>
      <Text style={styles.cardDetails}>Dr. {appointment.doctorName}</Text>
      <Text style={styles.cardDetails}>{appointment.specialty}</Text>
      <Text style={styles.cardDate}>
        {new Date(`${appointment.date}T${appointment.time}`).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchMyAppointments} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setCalendarView(
              calendarView === CALENDAR_VIEWS.MONTH ? CALENDAR_VIEWS.WEEK : CALENDAR_VIEWS.MONTH
            )}>
              <Ionicons 
                name={calendarView === CALENDAR_VIEWS.MONTH ? 'calendar-outline' : 'calendar'} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <Ionicons name="filter" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowBookingModal(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
              }
              searchTimeoutRef.current = setTimeout(() => {
                fetchMyAppointments({ query: text, filters: filterOptions });
              }, 500);
            }}
          />
        </View>

        <Calendar
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: '#2196F3' },
            ...myAppointments.reduce((acc, app) => ({
              ...acc,
              [app.date]: { 
                marked: true, 
                dotColor: STATUS_COLORS[app.status],
                selectedColor: selectedDate === app.date ? '#2196F3' : undefined
              }
            }), {})
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          style={styles.calendar}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          renderUpcomingAppointments()
        )}
      </ScrollView>

      <BookAppointmentModal 
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        newAppointment={newBooking}
        onUpdateAppointment={(field, value) => setNewBooking(prev => ({...prev, [field]: value}))}
        onBookAppointment={handleBookAppointment}
        APPOINTMENT_TYPES={APPOINTMENT_TYPES}
        SPECIALTIES={SPECIALTIES}
        DURATION_OPTIONS={DURATION_OPTIONS}
      />

      <AppointmentDetailsModal 
        visible={showAppointmentDetails}
        onClose={() => setShowAppointmentDetails(false)}
        appointment={selectedAppointment}
        onCancelAppointment={handleCancelAppointment}
        onReschedule={handleReschedule}
      />

      <FilterModal 
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        onUpdateFilters={(field, value) => setFilterOptions(prev => ({
          ...prev,
          [field]: prev[field] === value ? null : value
        }))}
        onApplyFilters={() => {
          fetchMyAppointments({ filters: filterOptions });
          setShowFilterModal(false);
        }}
        onClearFilters={() => setFilterOptions({
          dateRange: null,
          status: null,
          type: null,
          specialty: null
        })}
        APPOINTMENT_STATUS={APPOINTMENT_STATUS}
        APPOINTMENT_TYPES={APPOINTMENT_TYPES}
        STATUS_COLORS={STATUS_COLORS}
      />
    </>
  );
};

export default ManageAppointments;