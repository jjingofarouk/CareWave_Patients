import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

// Data Arrays
const healthTips = [
  "Encourage preventive care for all patients.",
  "Promote physical activity and healthy eating.",
  "Stay current with medical research and trends.",
  "Educate patients about managing chronic conditions.",
  "Recommend regular health check-ups.",
  "Advocate for mental health and stress management.",
  "Encourage hydration and a healthy diet.",
  "Remind patients to adhere to prescribed medications.",
];

const notifications = [
  "New patient consultation request received.",
  "Reminder: Review lab results for Jane Doe.",
  "Your weekly team meeting starts at 3 PM.",
];

const upcomingAppointments = [
  { date: '2024-10-20', time: '9:00 AM', patient: 'Alice Johnson' },
  { date: '2024-10-21', time: '1:00 PM', patient: 'Mark Spencer' },
];

const tasks = [
  { title: 'Review lab results for Alice', due: 'Today' },
  { title: 'Prepare for patient follow-up', due: 'Tomorrow' },
];

// DoctorHome Component
const DoctorHome = () => {
  const [medicalTip, setMedicalTip] = useState('');

  // Select a random medical tip on component mount
  useEffect(() => {
    setMedicalTip(healthTips[Math.floor(Math.random() * healthTips.length)]);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        {notifications.length ? (
          notifications.map((notification, index) => (
            <Text key={index} style={styles.notificationItem}>
              {notification}
            </Text>
          ))
        ) : (
          <Text>No new notifications.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Appointments</Text>
        {upcomingAppointments.length ? (
          upcomingAppointments.map((appointment, index) => (
            <Text key={index} style={styles.appointmentItem}>
              {appointment.patient} - {appointment.date} at {appointment.time}
            </Text>
          ))
        ) : (
          <Text>No upcoming appointments.</Text>
        )}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View All Appointments</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tasks & Reminders</Text>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <Text style={styles.taskText}>
              {task.title} - <Text style={styles.dueText}>{task.due}</Text>
            </Text>
          </View>
        ))}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add New Task</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Management</Text>
        <Text>Track, update, and manage patient records.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Patients</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health Analytics</Text>
        <Text>Track patient trends, outcomes, and practice metrics.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Analytics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Billing & Invoices</Text>
        <Text>Manage payments, track invoices, and process claims.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage Billing</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004C54',
    marginBottom: 10,
  },
  notificationItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  appointmentItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskText: {
    fontSize: 14,
    color: '#333',
  },
  dueText: {
    color: '#FF7043',
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default DoctorHome;
