import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import PatientHome from '../dashboard/PatientHome';
import ManageAppointments from '../patients/appointments/ManageAppointments';
import StartConsultation from '../patients/consultations/StartConsultation';
import Records from '../patients/records/Records';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#009688',
        tabBarInactiveTintColor: '#002432',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={PatientHome}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home-outline" color="#002432" size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={ManageAppointments}
        options={{
          tabBarLabel: 'Appointments',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="calendar-outline" color="#002432" size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Consultation"
        component={StartConsultation}
        options={{
          tabBarLabel: 'Consultations',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="stethoscope" color="#002432" size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Records"
        component={Records}
        options={{
          tabBarLabel: 'Health Records',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="clipboard-outline" color="#002432" size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
