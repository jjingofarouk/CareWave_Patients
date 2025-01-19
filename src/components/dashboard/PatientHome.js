import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper'; // For progress bars

const { width: screenWidth } = Dimensions.get('window');

const mockMetrics = [
  {
    label: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    icon: 'heart-pulse',
    gradient: ['#FF6B6B', '#FF8A5B'],
  },
  {
    label: 'Pain Level',
    value: '3/10',
    unit: '',
    icon: 'medical-bag',
    gradient: ['#4ECDC4', '#45B7D1'],
  },
  {
    label: 'Blood Sugar Level',
    value: '90 mg/dL',
    unit: 'mg/dL',
    icon: 'needle',
    gradient: ['#FDAE61', '#D64A16'],
  },
  // Add more metrics here
];

const mockAppointments = [
  {
    id: 1,
    date: '2024-09-15',
    time: '10:30 AM',
    doctor: 'Dr. Muhindo George',
    specialty: 'Cardiology',
    avatar: require('./assets/doctor1.jpg'),
  },
  {
    id: 2,
    date: '2024-09-22',
    time: '2:15 PM',
    doctor: 'Dr. Kisekka Moses',
    specialty: 'Neurology',
    avatar: require('./assets/doctor2.jpg'),
  },
];

const PatientHome = ({ userEmail }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const loopingMetrics = [...mockMetrics, ...mockMetrics];

  useEffect(() => {
    const marked = {};
    mockAppointments.forEach((appt) => {
      marked[appt.date] = {
        marked: true,
        dotColor: '#FF6B6B',
      };
    });
    setMarkedDates(marked);

    // Auto-scroll animation for metrics
    const scrollMetrics = () => {
      if (flatListRef.current) {
        const nextIndex = Math.floor(scrollX._value / (screenWidth * 0.4) + 1);
        flatListRef.current.scrollToIndex({
          index: nextIndex % loopingMetrics.length,
          animated: true,
        });
      }
    };

    const autoScrollInterval = setInterval(scrollMetrics, 3000);

    return () => clearInterval(autoScrollInterval);
  }, []);

  const renderMetricCard = ({ item }) => (
    <LinearGradient
      colors={item.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.metricCard}
    >
      <View style={styles.metricCardContent}>
        <Ionicons name={item.icon} size={24} color="white" style={styles.metricIcon} />
        <View>
          <Text style={styles.metricLabel}>{item.label}</Text>
          <Text style={styles.metricValue}>
            {item.value} {item.unit}
          </Text>
          {/* Example Progress Bar */}
          <ProgressBar progress={0.7} color="#fff" style={styles.progressBar} />
        </View>
      </View>
    </LinearGradient>
  );

  const renderAppointments = () =>
    mockAppointments.map((appt) => (
      <TouchableOpacity key={appt.id} style={styles.appointmentCard}>
        <Image source={appt.avatar} style={styles.doctorAvatar} />
        <View style={styles.appointmentDetails}>
          <Text style={styles.appointmentDoctor}>{appt.doctor}</Text>
          <Text style={styles.appointmentSpecialty}>{appt.specialty}</Text>
          <Text style={styles.appointmentTime}>
            {appt.date} at {appt.time}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#4ECDC4" />
      </TouchableOpacity>
    ));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {/* Gradient Header */}
        <LinearGradient colors={['#4ECDC4', '#45B7D1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Welcome Back, {userEmail}</Text>
              <Text style={styles.subtitle}>Your Health Dashboard</Text>
            </View>
            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Health Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Health Metrics</Text>
          <FlatList
            ref={flatListRef}
            data={loopingMetrics}
            renderItem={renderMetricCard}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={screenWidth * 0.4}
            contentContainerStyle={styles.metricsContainer}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          />
        </View>

        {/* Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: '#4ECDC4',
              todayTextColor: '#FF6B6B',
              arrowColor: '#FF6B6B',
            }}
          />
          <View style={styles.appointmentsContainer}>
            {renderAppointments()}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {[{ icon: 'chatbubble-ellipses', label: 'Chat', color: '#A78ADB' }, { icon: 'document-text', label: 'Records', color: '#FF6B6B' }, { icon: 'videocam', label: 'Consult', color: '#4ECDC4' }].map((action, index) => (
              <TouchableOpacity key={index} style={[styles.quickActionButton, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={24} color="white" />
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#4ECDC4',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  metricCard: {
    width: screenWidth * 0.45,
    borderRadius: 15,
    marginRight: 15,
    padding: 15,
    backgroundColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    marginRight: 10,
  },
  metricLabel: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  metricValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appointmentsContainer: {
    marginTop: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  quickActionLabel: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '600',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentDoctor: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  appointmentSpecialty: {
    color: '#7d7d7d',
    marginVertical: 5,
  },
  appointmentTime: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
});

export default PatientHome;
