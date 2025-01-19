import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps'; // React Native Map
import axios from 'axios'; // For API calls
import LoadingSpinner from '../../ui/LoadingSpinner'; // Custom loading spinner component
import SampleForm from '../SampleForm'; // Custom form component for entering sample data
import DataExport from './DataExport'; // Export component for CSV/Excel
import DataUpload from './DataUpload'; // Component for bulk data upload
import FilterOptions from '../FilterOptions'; // Component for filtering data by criteria

const FieldResearchKit = () => {
  const [fieldData, setFieldData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapView, setMapView] = useState({
    latitude: -1.286389, // Default latitude for Uganda
    longitude: 36.817223, // Default longitude for Uganda
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    fetchFieldData();
  }, []);

  const fetchFieldData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/field-data'); // Replace with your API endpoint
      setFieldData(response.data);
      ToastAndroid.show('Field data loaded successfully.', ToastAndroid.SHORT);
    } catch (err) {
      setError(err.message);
      ToastAndroid.show(`Error fetching data: ${err.message}`, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSample = async (newSample) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/field-data', newSample); // Replace with your API endpoint
      setFieldData([...fieldData, response.data]);
      ToastAndroid.show('New sample data saved successfully.', ToastAndroid.SHORT);
    } catch (err) {
      setError(err.message);
      ToastAndroid.show(`Error saving sample data: ${err.message}`, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (data) => {
    setSelectedMarker(data);
  };

  const handleClosePopup = () => {
    setSelectedMarker(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Field Research Kit</Text>
        <Text style={styles.description}>
          Comprehensive tool for collecting and managing data during field research, including sample management and GPS mapping.
        </Text>
      </View>

      {loading && <LoadingSpinner />}
      {error && <Text style={styles.error}>{error}</Text>}

      <SampleForm onSubmit={handleNewSample} /> {/* Sample form for data entry */}
      <DataUpload onUpload={fetchFieldData} /> {/* Component for bulk data upload */}
      <DataExport data={fieldData} /> {/* Component for data export */}
      <FilterOptions onFilter={fetchFieldData} /> {/* Component for filtering data */}

      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Map View</Text>
        <MapView
          style={styles.map}
          initialRegion={mapView}
          onRegionChangeComplete={setMapView}
        >
          {fieldData.map(item => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
            >
              <Callout onPress={() => handleMarkerClick(item)}>
                <Text>{item.title}</Text>
                <Text>{item.description}</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      {selectedMarker && (
        <View style={styles.popup}>
          <Text>{selectedMarker.title}</Text>
          <Text>{selectedMarker.description}</Text>
          <Button title="Close" onPress={handleClosePopup} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContainer: {
    marginTop: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 400,
  },
  popup: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 10,
  },
});

export default FieldResearchKit;
