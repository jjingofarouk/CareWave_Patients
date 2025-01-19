import React, { useState } from 'react';
import { View, Text, Picker, StyleSheet, Button } from 'react-native';
import PatientDataCollectionApp from './PatientDataCollectionApp';
import FieldResearchKit from './FieldResearchKit';
import ClinicalTrialProtocolGenerator from './ClinicalTrialProtocolGenerator';
import QualitativeDataAnalysisSuite from './QualitativeDataAnalysisSuite';
import ClinicalTrials from './ClinicalTrials';

const ResearchTools = () => {
  const [selectedTool, setSelectedTool] = useState("");

  const tools = [
    { id: "clinicalTrials", Component: ClinicalTrials, name: "Clinical Trials" },
    { id: "clinicalTrialProtocolGenerator", Component: ClinicalTrialProtocolGenerator, name: "Clinical Trial Protocol Generator" },
    { id: "patientDataCollectionApp", Component: PatientDataCollectionApp, name: "Patient Data Collection App" },
    { id: "fieldResearchKit", Component: FieldResearchKit, name: "Field Research Kit" },
    { id: "qualitativeDataAnalysisSuite", Component: QualitativeDataAnalysisSuite, name: "Qualitative Data Analysis Suite" },
  ];

  const handleToolSelect = (itemValue) => {
    setSelectedTool(itemValue);
  };

  const renderTool = () => {
    const selectedToolData = tools.find(tool => tool.id === selectedTool);
    return selectedToolData ? <selectedToolData.Component /> : <Text>Please select a tool to display.</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Research Tool</Text>
      
      <Picker
        selectedValue={selectedTool}
        onValueChange={handleToolSelect}
        style={styles.picker}
      >
        <Picker.Item label="-- Select Tool --" value="" />
        {tools.map(tool => (
          <Picker.Item key={tool.id} label={tool.name} value={tool.id} />
        ))}
      </Picker>

      <View style={styles.toolComponent}>
        {renderTool()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  toolComponent: {
    marginTop: 20,
  },
});

export default ResearchTools;
