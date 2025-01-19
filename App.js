import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from './src/components/navigation/CustomHeader';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import store from './store';
import { client } from './apollo';

// Import all Screens
import WelcomeScreen from './animations/WelcomeScreen';
import SignUp from './src/components/auth/SignUp';
import Login from './src/components/auth/Login';
import ProfileSettings from './src/components/auth/ProfileSettings';
import DrawerNavigator from './src/components/navigation/DrawerNavigator';
import VitalSigns from './src/components/doctor/VitalSigns';
import PrescriptionHistory from './src/components/patients/records/PrescriptionHistory';
import VisitHistory from './src/components/patients/records/VisitHistory';
import TelemedicineSessions from './src/components/patients/records/TelemedicineSessions';
import MedicalDocuments from './src/components/patients/records/MedicalDocuments';
import ConsentAndLegalDocs from './src/components/patients/records/ConsentAndLegalDocs';
import PsychologicalAssessments from './src/components/patients/records/PsychologicalAssessments';
import MedicalHistory from './src/components/patients/records/MedicalHistory';
import PersonalInformation from './src/components/patients/records/PersonalInformation';
import Allergies from './src/components/patients/records/Allergies';
import Chat from './src/components/patients/consultations/Chat';
import SecondOpinions from './src/components/patients/consultations/SecondOpinions';
import Labs from './src/components/patients/records/Labs';
import MedicationsContent from './src/components/patients/consultations/Medications';
import Checker from './src/components/patients/symptomchecker/Checker';
import Vaccination from './src/components/patients/records/Vaccination';
import Rads from './src/components/patients/records/Rad';
import Video from './src/components/patients/consultations/Video';
import Wellness from './src/components/patients/consultations/Wellness';
import DoctorPatientNotes from './src/components/patients/consultations/Notes';

const Stack = createStackNavigator();

// Create a screen wrapper component
const ScreenWrapper = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.safeArea]}>
      <StatusBar style="light" backgroundColor="#004C54" />
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

// Modify the screenOptions to use CustomHeader
const screenOptions = ({ navigation, route }) => ({
  header: (props) => <CustomHeader {...props} />,
  headerStyle: { backgroundColor: '#004C54' },
  headerTitleStyle: { color: '#fff' },
  headerTintColor: '#fff',
  headerBackTitleVisible: false,
});

const App = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
            {/* Authentication Screens */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            
            {/* Personal Information Screens */}
            <Stack.Screen 
              name="Personal Information" 
              component={PersonalInformation} 
            />
            <Stack.Screen 
              name="View Medical History" 
              component={MedicalHistory} 
            />
            <Stack.Screen 
              name="Your Vital Signs" 
              component={VitalSigns} 
            />
            <Stack.Screen 
              name="Allergy Information" 
              component={Allergies} 
            />
            <Stack.Screen 
              name="Visit History" 
              component={VisitHistory} 
            />
            <Stack.Screen 
              name="Lab Tests & Results" 
              component={Labs} 
            />
            <Stack.Screen 
              name="Lifestyle & Wellness" 
              component={Wellness} 
            />
            <Stack.Screen 
              name="View Medications" 
              component={MedicationsContent} 
            />

            {/* Telemedicine and Appointments Screens */}
            <Stack.Screen 
              name="Telemedicine Sessions" 
              component={TelemedicineSessions} 
            />
            <Stack.Screen 
              name="Medical Documents" 
              component={MedicalDocuments} 
            />
            <Stack.Screen 
              name="Consent and Legal Documents" 
              component={ConsentAndLegalDocs} 
            />
            <Stack.Screen 
              name="Prescription History" 
              component={PrescriptionHistory} 
            />
            <Stack.Screen 
              name="Psychological Assessments" 
              component={PsychologicalAssessments} 
            />
            <Stack.Screen 
              name="Chat with Doctor" 
              component={Chat} 
            />
            <Stack.Screen 
              name="Start Video Call" 
              component={Video} 
            />
            <Stack.Screen 
              name="Second Opinions" 
              component={SecondOpinions} 
            />
            <Stack.Screen 
              name="Your Consultation Notes" 
              component={DoctorPatientNotes} 
            />

            {/* Health and Vaccination Screens */}
            <Stack.Screen 
              name="Vaccination Records" 
              component={Vaccination} 
            />
            <Stack.Screen 
              name="Health Checker" 
              component={Checker} 
            />
            <Stack.Screen 
              name="Radiology Records" 
              component={Rads} 
            />
            
            {/* Appointment Management Screens */}



            {/* Main App Flow */}
            <Stack.Screen
              name="Main"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            {/* Profile Settings */}
            <Stack.Screen 
              name="ProfileSettings" 
              component={ProfileSettings} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#004C54',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004C54',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#FF7043',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderColor: '#FF7043',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#FF7043',
  },
});

export default App;