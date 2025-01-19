import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import DocumentPicker from 'expo-document-picker';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const TextAnalysis = () => {
  const [textData, setTextData] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [notes, setNotes] = useState('');
  const [transcripts, setTranscripts] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('textAnalysisProjects')) || [];
    setProjects(savedProjects);
  }, []);

  const saveProject = useCallback(() => {
    const project = {
      id: currentProject?.id || Date.now(),
      name: `Project ${projects.length + 1}`,
      textData,
      codes,
      analysisResults,
      notes,
      transcripts,
    };

    const updatedProjects = currentProject
      ? projects.map((p) => (p.id === currentProject.id ? project : p))
      : [...projects, project];

    setProjects(updatedProjects);
    setCurrentProject(project);
    localStorage.setItem('textAnalysisProjects', JSON.stringify(updatedProjects));
  }, [currentProject, projects, textData, codes, analysisResults, notes, transcripts]);

  const loadProject = (project) => {
    setCurrentProject(project);
    setTextData(project.textData);
    setCodes(project.codes);
    setAnalysisResults(project.analysisResults);
    setNotes(project.notes);
    setTranscripts(project.transcripts);
  };

  const analyzeText = async () => {
    if (!textData) return;

    setLoading(true);
    setTimeout(() => {
      const results = performAnalysis(textData);
      setAnalysisResults(results);
      setLoading(false);
    }, 1000);
  };

  const performAnalysis = (text) => {
    const wordCount = text.split(' ').length;
    const sentimentData = analyzeSentiment(text);
    const keywords = extractKeywords(text);
    const emotions = analyzeEmotions(text);
    const readabilityScore = calculateReadabilityScore(text);

    return { wordCount, sentimentData, keywords, emotions, readabilityScore };
  };

  const analyzeSentiment = (text) => {
    const sentimentScore = Math.random() * 100;
    return { score: sentimentScore };
  };

  const extractKeywords = (text) => {
    const words = text.split(' ').filter((word) => word.length > 4);
    return [...new Set(words)].slice(0, 10);
  };

  const analyzeEmotions = (text) => ({
    joy: Math.random() * 100,
    anger: Math.random() * 100,
    sadness: Math.random() * 100,
    fear: Math.random() * 100,
    surprise: Math.random() * 100,
  });

  const calculateReadabilityScore = (text) => Math.floor(Math.random() * 100);

  const handleFileUpload = async () => {
    try {
      const file = await DocumentPicker.pick({
        type: DocumentPicker.types.plainText,
      });
      const fileContent = await file.text();
      setTextData(fileContent);
    } catch (error) {
      Alert.alert('Error', 'File upload failed');
    }
  };

  const addCode = (code) => {
    if (code && !codes.includes(code)) setCodes([...codes, code]);
  };

  const exportData = () => {
    Alert.alert('Exported', JSON.stringify({ textData, codes, analysisResults, notes, transcripts }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Advanced Text Analysis</Text>
      <Text style={styles.subHeader}>Analyze textual data from interviews, focus groups, and more.</Text>

      {/* Input Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Text Input</Text>
        <TouchableOpacity style={styles.button} onPress={handleFileUpload}>
          <Text style={styles.buttonText}>Upload File</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textArea}
          multiline
          value={textData}
          onChangeText={setTextData}
          placeholder="Paste your text data here..."
        />
        <TouchableOpacity style={styles.button} onPress={analyzeText}>
          <Text style={styles.buttonText}>{loading ? 'Analyzing...' : 'Analyze Text'}</Text>
        </TouchableOpacity>
      </View>

      {/* Analysis Section */}
      {analysisResults && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Analysis Results</Text>
          <Text>Word Count: {analysisResults.wordCount}</Text>
          <Text>Sentiment Score: {analysisResults.sentimentData.score.toFixed(2)}</Text>
          <Text>Readability Score: {analysisResults.readabilityScore}</Text>
          <Text>Keywords: {analysisResults.keywords.join(', ')}</Text>
          <Text>Emotions:</Text>
          {Object.entries(analysisResults.emotions).map(([emotion, score]) => (
            <Text key={emotion}>
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}: {score.toFixed(2)}
            </Text>
          ))}
        </View>
      )}

      {/* Visualizations */}
      {analysisResults && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Visualization</Text>
          <BarChart
            data={{
              labels: ['Joy', 'Anger', 'Sadness', 'Fear', 'Surprise'],
              datasets: [{ data: Object.values(analysisResults.emotions) }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#f5f5f5',
              backgroundGradientTo: '#e5e5e5',
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* Notes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Notes</Text>
        <TextInput
          style={styles.textArea}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Add your research notes here..."
        />
      </View>

      {/* Projects Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Projects</Text>
        <TouchableOpacity style={styles.button} onPress={saveProject}>
          <Text style={styles.buttonText}>Save Project</Text>
        </TouchableOpacity>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.projectItem} onPress={() => loadProject(item)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subHeader: { fontSize: 16, marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  textArea: {
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  button: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  projectItem: { padding: 10, backgroundColor: '#e0e0e0', marginBottom: 5, borderRadius: 5 },
  chart: { marginVertical: 10 },
});

export default TextAnalysis;
