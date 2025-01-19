import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Alert,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { gql, useQuery, useMutation } from '@apollo/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

// GraphQL Queries & Mutations (expanded)
const GET_RAD_RESULTS = gql`
  query GetRadResults($userId: ID!) {
    radResults(userId: $userId) {
      id
      imagingType
      description
      date
      fileUrl
      thumbnailUrl
      aiAnalysis
      doctorNotes
      relatedConditions
      followUpDate
      shareStatus
      radiationDose
    }
  }
`;

const UPLOAD_RAD_RESULT = gql`
  mutation UploadRadResult($userId: ID!, $imagingType: String!, $description: String!, $date: String!, $file: Upload!, $aiAnalysisRequested: Boolean!) {
    uploadRadResult(userId: $userId, imagingType: $imagingType, description: $description, date: $date, file: $file, aiAnalysisRequested: $aiAnalysisRequested) {
      id
      imagingType
      description
      date
      fileUrl
      thumbnailUrl
      aiAnalysis
      radiationDose
    }
  }
`;

const UPDATE_RAD_RESULT = gql`
  mutation UpdateRadResult($radResultId: ID!, $imagingType: String!, $description: String!, $date: String!, $doctorNotes: String, $followUpDate: String) {
    updateRadResult(radResultId: $radResultId, imagingType: $imagingType, description: $description, date: $date, doctorNotes: $doctorNotes, followUpDate: $followUpDate) {
      id
      imagingType
      description
      date
      doctorNotes
      followUpDate
    }
  }
`;

const DELETE_RAD_RESULT = gql`
  mutation DeleteRadResult($radResultId: ID!) {
    deleteRadResult(radResultId: $radResultId) {
      id
    }
  }
`;

const SHARE_RAD_RESULT = gql`
  mutation ShareRadResult($radResultId: ID!, $recipientEmail: String!) {
    shareRadResult(radResultId: $radResultId, recipientEmail: $recipientEmail) {
      id
      shareStatus
    }
  }
`;

const REQUEST_AI_ANALYSIS = gql`
  mutation RequestAIAnalysis($radResultId: ID!) {
    requestAIAnalysis(radResultId: $radResultId) {
      id
      aiAnalysis
    }
  }
`;

const Rad = () => {
  const userId = "user-123"; // Replace with actual userId from context
  const { data = { radResults: [] }, loading, error, refetch } = useQuery(GET_RAD_RESULTS, { variables: { userId } });
  const [uploadRadResult] = useMutation(UPLOAD_RAD_RESULT);
  const [updateRadResult] = useMutation(UPDATE_RAD_RESULT);
  const [deleteRadResult] = useMutation(DELETE_RAD_RESULT);
  const [shareRadResult] = useMutation(SHARE_RAD_RESULT);
  const [requestAIAnalysis] = useMutation(REQUEST_AI_ANALYSIS);

  const [newRadResult, setNewRadResult] = useState({ imagingType: '', description: '', date: new Date(), file: null, aiAnalysisRequested: false });
  const [editRadResult, setEditRadResult] = useState(null);
  const [compareResults, setCompareResults] = useState([]);
  const [shareDialogVisible, setShareDialogVisible] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [currentSharedResult, setCurrentSharedResult] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);
  const [timelineView, setTimelineView] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [compareModalVisible, setCompareModalVisible] = useState(false);

  const imagingOptions = [
    'X-ray', 'MRI', 'CT Scan', 'Ultrasound Scan', 'Mammogram', 'PET Scan', 'Echocardiogram', 'Bone Density Scan', 'Angiography'
  ];

  useEffect(() => {
    const checkFollowUps = () => {
      const today = new Date();
      data.radResults.forEach(result => {
        if (result.followUpDate) {
          const followUpDate = new Date(result.followUpDate);
          if (followUpDate <= today) {
            Alert.alert(
              'Follow-up Required',
              `Follow-up required for ${result.imagingType} dated ${result.date}`
            );
          }
        }
      });
    };
    checkFollowUps();
  }, [data.radResults]);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      setNewRadResult({ ...newRadResult, file: result[0] });
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleRadResultSubmit = async () => {
    if (newRadResult.file) {
      try {
        await uploadRadResult({
          variables: {
            userId,
            imagingType: newRadResult.imagingType,
            description: newRadResult.description,
            date: newRadResult.date.toISOString(),
            file: newRadResult.file,
            aiAnalysisRequested: newRadResult.aiAnalysisRequested
          }
        });
        setNewRadResult({ imagingType: '', description: '', date: new Date(), file: null, aiAnalysisRequested: false });
        refetch();
        Alert.alert('Success', 'Imaging result uploaded successfully!');
      } catch (error) {
        console.error("Error uploading imaging result", error);
        Alert.alert('Error', 'Failed to upload imaging result. Please try again.');
      }
    }
  };

  const handleRadResultUpdate = async (radResultId) => {
    try {
      await updateRadResult({
        variables: {
          radResultId,
          imagingType: editRadResult.imagingType,
          description: editRadResult.description,
          date: editRadResult.date,
          doctorNotes: editRadResult.doctorNotes,
          followUpDate: editRadResult.followUpDate
        }
      });
      setEditRadResult(null);
      setEditModalVisible(false);
      refetch();
      Alert.alert('Success', 'Imaging result updated successfully!');
    } catch (error) {
      console.error("Error updating imaging result", error);
      Alert.alert('Error', 'Failed to update imaging result. Please try again.');
    }
  };

  const handleRadResultDelete = async (radResultId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this imaging result?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRadResult({ variables: { radResultId } });
              refetch();
              Alert.alert('Success', 'Imaging result deleted successfully!');
            } catch (error) {
              console.error("Error deleting imaging result", error);
              Alert.alert('Error', 'Failed to delete imaging result. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await shareRadResult({
        variables: {
          radResultId: currentSharedResult.id,
          recipientEmail: shareEmail
        }
      });
      setShareDialogVisible(false);
      setShareEmail('');
      setCurrentSharedResult(null);
      Alert.alert('Success', 'Imaging result shared successfully!');
    } catch (error) {
      console.error("Error sharing imaging result", error);
      Alert.alert('Error', 'Failed to share imaging result. Please try again.');
    }
  };

  const handleRequestAIAnalysis = async (radResultId) => {
    try {
      await requestAIAnalysis({ variables: { radResultId } });
      refetch();
      Alert.alert('Success', 'AI analysis requested successfully!');
    } catch (error) {
      console.error("Error requesting AI analysis", error);
      Alert.alert('Error', 'Failed to request AI analysis. Please try again.');
    }
  };

  const renderTimelineView = () => {
    const timelineData = data.radResults
      .map(result => ({
        date: new Date(result.date),
        value: imagingOptions.indexOf(result.imagingType),
        imagingType: result.imagingType
      }))
      .sort((a, b) => a.date - b.date);

    return (
      <LineChart
        data={{
          labels: timelineData.map(d => d.date.toLocaleDateString()),
          datasets: [{
            data: timelineData.map(d => d.value)
          }]
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    );
  };

  const RadResultCard = ({ rad }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{rad.imagingType}</Text>
      <Text style={styles.cardText}>Description: {rad.description}</Text>
      <Text style={styles.cardText}>Date: {new Date(rad.date).toLocaleDateString()}</Text>
      
      {rad.thumbnailUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: rad.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="contain"
          />
        </View>
      )}
      
      {rad.aiAnalysis && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Analysis:</Text>
          <Text style={styles.cardText}>{rad.aiAnalysis}</Text>
        </View>
      )}
      
      {rad.doctorNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doctor's Notes:</Text>
          <Text style={styles.cardText}>{rad.doctorNotes}</Text>
        </View>
      )}
      
      {rad.followUpDate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow-up Date:</Text>
          <Text style={styles.cardText}>{new Date(rad.followUpDate).toLocaleDateString()}</Text>
        </View>
      )}
      
      {rad.radiationDose && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Radiation Dose:</Text>
          <Text style={styles.cardText}>{rad.radiationDose}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setEditRadResult(rad);
            setEditModalVisible(true);
          }}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleRadResultDelete(rad.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>

        {rad.fileUrl && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Handle file viewing based on your app's requirements
              Alert.alert('View File', 'File viewing functionality to be implemented');
            }}
          >
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setCurrentSharedResult(rad);
            setShareDialogVisible(true);
          }}
        >
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, compareResults.includes(rad.id) && styles.selectedButton]}
          onPress={() => {
            if (compareResults.includes(rad.id)) {
              setCompareResults(compareResults.filter(id => id !== rad.id));
            } else {
              setCompareResults([...compareResults, rad.id]);
            }
          }}
        >
          <Text style={styles.actionButtonText}>Compare</Text>
        </TouchableOpacity>

        {!rad.aiAnalysis && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRequestAIAnalysis(rad.id)}
          >
            <Text style={styles.actionButtonText}>AI Analysis</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Advanced Medical Imaging Management System</Text>

        {/* Upload New Imaging Result */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload New Imaging Result</Text>
          
          <Picker
            selectedValue={newRadResult.imagingType}
            onValueChange={(value) => setNewRadResult({ ...newRadResult, imagingType: value })}
            style={styles.picker}
          >
            <Picker.Item label="Select imaging type" value="" />
            {imagingOptions.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newRadResult.description}
            onChangeText={(text) => setNewRadResult({ ...newRadResult, description: text })}
          />

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            >
            <Text style={styles.dateButtonText}>
              {newRadResult.date ? newRadResult.date.toLocaleDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={handleFileSelect}>
            <Text style={styles.uploadButtonText}>Select File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aiButton, newRadResult.aiAnalysisRequested && styles.aiButtonSelected]}
            onPress={() => setNewRadResult({ ...newRadResult, aiAnalysisRequested: !newRadResult.aiAnalysisRequested })}
          >
            <Text style={styles.aiButtonText}>Request AI Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, !newRadResult.file && styles.submitButtonDisabled]}
            onPress={handleRadResultSubmit}
            disabled={!newRadResult.file}
          >
            <Text style={styles.submitButtonText}>Upload Imaging Result</Text>
          </TouchableOpacity>
        </View>

        {/* Timeline Toggle */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setTimelineView(!timelineView)}
        >
          <Text style={styles.toggleButtonText}>
            {timelineView ? 'Switch to List View' : 'Switch to Timeline View'}
          </Text>
        </TouchableOpacity>

        {/* Timeline View */}
        {timelineView && renderTimelineView()}

        {/* Display Imaging Records */}
        {!timelineView && (
          <View style={styles.resultsList}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load imaging records.</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : data.radResults.length === 0 ? (
              <Text style={styles.noDataText}>No imaging records found.</Text>
            ) : (
              <View style={styles.cardsContainer}>
                {data.radResults.map((rad) => (
                  <RadResultCard key={rad.id} rad={rad} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Edit Modal */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setEditModalVisible(false);
            setEditRadResult(null);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Imaging Result</Text>

              <Picker
                selectedValue={editRadResult?.imagingType || ''}
                onValueChange={(value) => setEditRadResult({ ...editRadResult, imagingType: value })}
                style={styles.picker}
              >
                {imagingOptions.map((type, index) => (
                  <Picker.Item key={index} label={type} value={type} />
                ))}
              </Picker>

              <TextInput
                style={styles.input}
                placeholder="Description"
                value={editRadResult?.description || ''}
                onChangeText={(text) => setEditRadResult({ ...editRadResult, description: text })}
              />

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEditDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {editRadResult?.date ? new Date(editRadResult.date).toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>

              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Doctor's Notes"
                value={editRadResult?.doctorNotes || ''}
                onChangeText={(text) => setEditRadResult({ ...editRadResult, doctorNotes: text })}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowFollowUpDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {editRadResult?.followUpDate ? new Date(editRadResult.followUpDate).toLocaleDateString() : 'Select Follow-up Date'}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setEditModalVisible(false);
                    setEditRadResult(null);
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={() => handleRadResultUpdate(editRadResult.id)}
                >
                  <Text style={styles.modalButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Share Dialog */}
        <Modal
          visible={shareDialogVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShareDialogVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Share Imaging Result</Text>
              <TextInput
                style={styles.input}
                placeholder="Recipient Email"
                value={shareEmail}
                onChangeText={setShareEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShareDialogVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.shareButton]}
                  onPress={handleShare}
                >
                  <Text style={styles.modalButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Compare Results Modal */}
        <Modal
          visible={compareResults.length > 1}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCompareResults([])}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Compare Imaging Results</Text>
              <ScrollView>
                {compareResults.map(resultId => {
                  const result = data.radResults.find(r => r.id === resultId);
                  return (
                    <View key={resultId} style={styles.compareCard}>
                      <Text style={styles.compareTitle}>{result.imagingType}</Text>
                      <Text style={styles.compareText}>Date: {new Date(result.date).toLocaleDateString()}</Text>
                      {result.thumbnailUrl && (
                        <Image
                          source={{ uri: result.thumbnailUrl }}
                          style={styles.compareThumbnail}
                          resizeMode="contain"
                        />
                      )}
                      <Text style={styles.compareText}>Description: {result.description}</Text>
                      {result.aiAnalysis && (
                        <Text style={styles.compareText}>AI Analysis: {result.aiAnalysis}</Text>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setCompareResults([])}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={newRadResult.date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setNewRadResult({ ...newRadResult, date: selectedDate });
              }
            }}
          />
        )}

        {showEditDatePicker && editRadResult && (
          <DateTimePicker
            value={new Date(editRadResult.date)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEditDatePicker(false);
              if (selectedDate) {
                setEditRadResult({ ...editRadResult, date: selectedDate.toISOString() });
              }
            }}
          />
        )}

        {showFollowUpDatePicker && editRadResult && (
          <DateTimePicker
            value={editRadResult.followUpDate ? new Date(editRadResult.followUpDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFollowUpDatePicker(false);
              if (selectedDate) {
                setEditRadResult({ ...editRadResult, followUpDate: selectedDate.toISOString() });
              }
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  uploadSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  dateButtonText: {
    textAlign: 'center',
    color: '#333',
  },
  uploadButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    textAlign: 'center',
    color: '#333',
  },
  aiButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  aiButtonSelected: {
    backgroundColor: '#b3e0ff',
  },
  aiButtonText: {
    textAlign: 'center',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  resultsList: {
    padding: 16,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  imageContainer: {
    marginVertical: 8,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  section: {
    marginTop: 8,
  },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  selectedButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  updateButton: {
    backgroundColor: '#007AFF',
  },
  shareButton: {
    backgroundColor: '#34C759',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  compareCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  compareTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  compareText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  compareThumbnail: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginVertical: 8,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default Rad;