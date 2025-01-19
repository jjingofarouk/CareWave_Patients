import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, Picker, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons

const ObstetricsCalculators = () => {
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState({});
  const [activeCalculator, setActiveCalculator] = useState(null);

  const handleInputChange = (name, value) => {
    setInputs({ ...inputs, [name]: value });
  };

  const calculateResult = (calculator) => {
    switch (calculator) {
      case 'pph':
        postpartumHemorrhageRiskScore();
        break;
      case 'preeclampsia':
        preeclampsiaRiskAssessment();
        break;
      case 'obstetricHemorrhage':
        obstetricHemorrhageRiskAssessment();
        break;
      case 'bmi':
        maternalBmiCalculator();
        break;
      case 'dueDate':
        nagelesRuleForDueDate();
        break;
      case 'gestationalAge':
        calculateGestationalAge();
        break;
      case 'apgar':
        calculateApgarScore();
        break;
    }
    setActiveCalculator(calculator);
  };

  const postpartumHemorrhageRiskScore = () => {
    const { age, parity, previousPPH, anemia, multipleGestation } = inputs;
    let riskScore = 0;
    riskScore += parseInt(age) > 35 ? 2 : 0;
    riskScore += parseInt(parity) > 3 ? 2 : 0;
    riskScore += previousPPH ? 3 : 0;
    riskScore += anemia ? 2 : 0;
    riskScore += multipleGestation ? 3 : 0;
    setResults({ ...results, pph: riskScore });
  };

  const preeclampsiaRiskAssessment = () => {
    const { maternalAge, bmi, previousPreeclampsia, multipleGestation, chronicHypertension, preExistingDiabetes } = inputs;
    let risk = 0;
    risk += parseInt(maternalAge) > 40 ? 2 : 0;
    risk += parseFloat(bmi) > 30 ? 2 : 0;
    risk += previousPreeclampsia ? 4 : 0;
    risk += multipleGestation ? 3 : 0;
    risk += chronicHypertension ? 3 : 0;
    risk += preExistingDiabetes ? 2 : 0;
    setResults({ ...results, preeclampsia: risk });
  };

  const obstetricHemorrhageRiskAssessment = () => {
    const { anemia, previousHemorrhage, macrosomia, placentaPrevia, multipleGestation } = inputs;
    let risk = 0;
    risk += anemia ? 2 : 0;
    risk += previousHemorrhage ? 3 : 0;
    risk += macrosomia ? 2 : 0;
    risk += placentaPrevia ? 4 : 0;
    risk += multipleGestation ? 3 : 0;
    setResults({ ...results, obstetricHemorrhage: risk });
  };

  const maternalBmiCalculator = () => {
    const { weight, height } = inputs;
    const bmi = (parseFloat(weight) / (parseFloat(height) * parseFloat(height))).toFixed(2);
    setResults({ ...results, bmi });
  };

  const nagelesRuleForDueDate = () => {
    const { lastMenstrualPeriod } = inputs;
    const lmpDate = new Date(lastMenstrualPeriod);
    const dueDate = new Date(lmpDate.setDate(lmpDate.getDate() + 280));
    setResults({ ...results, dueDate: dueDate.toDateString() });
  };

  const calculateGestationalAge = () => {
    const { lastMenstrualPeriod } = inputs;
    const lmpDate = new Date(lastMenstrualPeriod);
    const today = new Date();
    const gestationalAgeDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
    const gestationalAgeWeeks = Math.floor(gestationalAgeDays / 7);
    const remainingDays = gestationalAgeDays % 7;
    setResults({ ...results, gestationalAge: `${gestationalAgeWeeks} weeks and ${remainingDays} days` });
  };

  const calculateApgarScore = () => {
    const { heartRate, respiration, muscleTone, reflexResponse, color } = inputs;
    let score = 0;
    score += parseInt(heartRate) > 100 ? 2 : parseInt(heartRate) > 0 ? 1 : 0;
    score += respiration === 'good crying' ? 2 : respiration === 'slow or irregular' ? 1 : 0;
    score += muscleTone === 'active' ? 2 : muscleTone === 'some flexion' ? 1 : 0;
    score += reflexResponse === 'vigorous cry' ? 2 : reflexResponse === 'grimace' ? 1 : 0;
    score += color === 'completely pink' ? 2 : color === 'blue extremities' ? 1 : 0;
    setResults({ ...results, apgar: score });
  };

  const calculators = [
    { id: 'pph', title: 'Postpartum Hemorrhage Risk', icon: 'tint' },
    { id: 'preeclampsia', title: 'Preeclampsia Risk', icon: 'heartbeat' },
    { id: 'obstetricHemorrhage', title: 'Obstetric Hemorrhage Risk', icon: 'heart' },
    { id: 'bmi', title: 'Maternal BMI', icon: 'balance-scale' },
    { id: 'dueDate', title: "Due Date (Nagele's Rule)", icon: 'calendar' },
    { id: 'gestationalAge', title: 'Gestational Age', icon: 'calendar-check' },
    { id: 'apgar', title: 'APGAR Score', icon: 'baby' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Obstetrics Calculators</Text>
      <View style={styles.calculatorGrid}>
        {calculators.map((calc) => (
          <View key={calc.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{calc.title}</Text>
              <Icon name={calc.icon} size={24} color="#000" />
            </View>
            <View style={styles.cardContent}>{renderInputs(calc.id)}</View>
            <Button title="Calculate" onPress={() => calculateResult(calc.id)} />
            {activeCalculator === calc.id && results[calc.id] !== undefined && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>{renderResult(calc.id)}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  function renderInputs(calculatorId) {
    switch (calculatorId) {
      case 'pph':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange('age', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Parity"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange('parity', value)}
            />
            <View style={styles.switchContainer}>
              <Switch
                value={inputs.previousPPH}
                onValueChange={(value) => handleInputChange('previousPPH', value)}
              />
              <Text>Previous PPH</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={inputs.anemia}
                onValueChange={(value) => handleInputChange('anemia', value)}
              />
              <Text>Anemia</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={inputs.multipleGestation}
                onValueChange={(value) => handleInputChange('multipleGestation', value)}
              />
              <Text>Multiple Gestation</Text>
            </View>
          </>
        );
      case 'bmi':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange('weight', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Height (m)"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange('height', value)}
            />
          </>
        );
      case 'dueDate':
      case 'gestationalAge':
        return (
          <TextInput
            style={styles.input}
            placeholder="Last Menstrual Period"
            keyboardType="default"
            onChangeText={(value) => handleInputChange('lastMenstrualPeriod', value)}
          />
        );
      case 'apgar':
        return (
          <>
            <Picker
              selectedValue={inputs.heartRate}
              onValueChange={(itemValue) => handleInputChange('heartRate', itemValue)}
            >
              <Picker.Item label="Heart Rate" value="" />
              <Picker.Item label="Good (>100)" value="good" />
              <Picker.Item label="Slow (<100)" value="slow" />
            </Picker>
            {/* Continue for other apgar inputs */}
          </>
        );
      default:
        return null;
    }
  }

  function renderResult(calculatorId) {
    switch (calculatorId) {
      case 'pph':
        return `Risk Score: ${results.pph}`;
      case 'bmi':
        return `BMI: ${results.bmi}`;
      case 'dueDate':
        return `Due Date: ${results.dueDate}`;
      case 'gestationalAge':
        return `Gestational Age: ${results.gestationalAge}`;
      case 'apgar':
        return `APGAR Score: ${results.apgar}`;
      default:
        return '';
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  calculatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContent: {
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultContainer: {
    marginTop: 16,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ObstetricsCalculators;
