import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Example: FontAwesome icon set

const CME = () => {
  const [caseStudies, setCaseStudies] = useState([
    { 
      id: 1, 
      title: "Esophageal Carcinoma",
      description: "Detailed case study on esophageal carcinoma...",
      tags: ["Oncology", "Surgery"],
      content: `
        <h3>Esophageal Carcinoma Overview</h3>
        <p>Esophageal carcinoma is a type of cancer that occurs in the esophagus.</p>
        <h4>Symptoms:</h4>
        <ul>
          <li>Difficulties swallowing</li>
          <li>Weight loss</li>
          <li>Chest pain</li>
        </ul>
        <h4>Treatment Options:</h4>
        <p>Treatment may include surgery, radiation therapy, and chemotherapy.</p>
      `,
      discussion: [],
    },
    { 
      id: 2, 
      title: "Chronic Osteomyelitis",
      description: "In-depth overview of chronic osteomyelitis...",
      tags: ["Orthopedics", "Infections"],
      content: `
        <h3>Chronic Osteomyelitis Overview</h3>
        <p>Chronic osteomyelitis is a persistent infection of the bone.</p>
        <h4>Causes:</h4>
        <ul>
          <li>Direct infection from trauma</li>
          <li>Spread from nearby infections</li>
        </ul>
        <h4>Management:</h4>
        <p>Management may involve antibiotics and surgical intervention.</p>
      `,
      discussion: [],
    },
  ]);
  
  const [selectedCase, setSelectedCase] = useState(null);
  const [newComment, setNewComment] = useState('');

  const handleSelectCase = (id) => {
    const caseStudy = caseStudies.find(c => c.id === id);
    setSelectedCase(caseStudy);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const updatedCases = caseStudies.map(c => {
        if (c.id === selectedCase.id) {
          return {
            ...c,
            discussion: [...c.discussion, { id: Date.now(), text: newComment }]
          };
        }
        return c;
      });
      setCaseStudies(updatedCases);
      setSelectedCase({
        ...selectedCase,
        discussion: [...selectedCase.discussion, { id: Date.now(), text: newComment }]
      });
      setNewComment('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Continuing Medical Education</Text>
      <ScrollView style={styles.caseList}>
        {caseStudies.map(caseStudy => (
          <TouchableOpacity
            key={caseStudy.id}
            onPress={() => handleSelectCase(caseStudy.id)}
            style={[styles.caseButton, selectedCase && selectedCase.id === caseStudy.id ? styles.selectedCase : null]}
          >
            <Icon name="file-text" style={styles.icon} />
            <Text style={styles.caseTitle}>{caseStudy.title}</Text>
            <Text style={styles.tags}>{caseStudy.tags.join(', ')}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedCase && (
        <View style={styles.selectedCaseContent}>
          <Text style={styles.caseTitle}>{selectedCase.title}</Text>
          <Text style={styles.caseDescription}>{selectedCase.description}</Text>
          <TouchableOpacity style={styles.saveButton}>
            <Icon name="save" style={styles.icon} />
            <Text style={styles.saveButtonText}>Save for Later</Text>
          </TouchableOpacity>

          <ScrollView style={styles.caseContent}>
            <Text style={styles.contentText}>{selectedCase.content}</Text>
          </ScrollView>

          <Text style={styles.discussionHeader}>Discussion</Text>
          <ScrollView style={styles.discussionList}>
            {selectedCase.discussion.map(comment => (
              <View key={comment.id} style={styles.comment}>
                <Text>{comment.text}</Text>
              </View>
            ))}
          </ScrollView>

          <TextInput
            style={styles.textArea}
            placeholder="Add to the discussion..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
            <Icon name="pencil" style={styles.icon} />
            <Text style={styles.addCommentText}>Add Comment</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  caseList: {
    marginBottom: 16,
  },
  caseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  selectedCase: {
    backgroundColor: '#d3f7ff',
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  tags: {
    fontSize: 12,
    color: '#888',
  },
  icon: {
    marginRight: 10,
    fontSize: 20,
  },
  selectedCaseContent: {
    flex: 1,
  },
  caseDescription: {
    fontSize: 14,
    marginVertical: 8,
    color: '#555',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  caseContent: {
    marginBottom: 16,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
  },
  discussionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  discussionList: {
    marginBottom: 16,
  },
  comment: {
    backgroundColor: '#e9ecef',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
  },
  addCommentText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default CME;
