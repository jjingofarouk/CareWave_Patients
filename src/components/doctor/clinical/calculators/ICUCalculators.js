import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

// APACHE II Score Calculator
const ApacheIICalculator = () => {
    const [scores, setScores] = useState({
        age: '',
        temperature: '',
        heartRate: '',
        respiratoryRate: '',
        systolicBP: '',
        oxygen: '',
        arterialPH: '',
        sodium: '',
        potassium: '',
        creatinine: '',
        hematocrit: '',
        whiteBloodCellCount: '',
        glasgowComaScore: '',
    });

    const [totalScore, setTotalScore] = useState(null);

    const calculateAPACHEII = () => {
        let score = 0;
        score += scores.age > 44 ? 1 : 0;
        score += scores.temperature < 30 || scores.temperature > 39 ? 1 : 0;
        score += scores.heartRate > 180 ? 1 : 0;
        score += scores.respiratoryRate > 30 ? 1 : 0;
        score += scores.systolicBP < 70 ? 1 : 0;
        score += scores.oxygen < 60 ? 1 : 0;
        score += scores.arterialPH < 7.2 || scores.arterialPH > 7.5 ? 1 : 0;
        score += scores.sodium < 130 || scores.sodium > 150 ? 1 : 0;
        score += scores.potassium < 3 || scores.potassium > 6 ? 1 : 0;
        score += scores.creatinine > 1.2 ? 1 : 0;
        score += scores.hematocrit < 30 ? 1 : 0;
        score += scores.whiteBloodCellCount < 4000 || scores.whiteBloodCellCount > 12000 ? 1 : 0;
        score += parseInt(scores.glasgowComaScore) < 13 ? 1 : 0;

        setTotalScore(score);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>APACHE II Score Calculator</Text>
            <View style={styles.cardContent}>
                {Object.keys(scores).map((key) => (
                    <View key={key} style={styles.inputWrapper}>
                        <Text style={styles.label}>
                            {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={scores[key]}
                            onChangeText={(text) => setScores({ ...scores, [key]: text })}
                        />
                    </View>
                ))}
                <Button title="Calculate Score" onPress={calculateAPACHEII} />
                <Text style={styles.result}>Total APACHE II Score: {totalScore}</Text>
            </View>
        </View>
    );
};

// SOFA Score Calculator
const SOFACalculator = () => {
    const [scores, setScores] = useState({
        respiratory: '',
        coagulation: '',
        liver: '',
        cardiovascular: '',
        neurological: '',
        renal: '',
    });

    const [totalScore, setTotalScore] = useState(null);

    const calculateSOFA = () => {
        const total = Object.values(scores).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
        setTotalScore(total);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>SOFA Score Calculator</Text>
            <View style={styles.cardContent}>
                {Object.keys(scores).map((key) => (
                    <View key={key} style={styles.inputWrapper}>
                        <Text style={styles.label}>
                            {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={scores[key]}
                            onChangeText={(text) => setScores({ ...scores, [key]: text })}
                        />
                    </View>
                ))}
                <Button title="Calculate Score" onPress={calculateSOFA} />
                <Text style={styles.result}>Total SOFA Score: {totalScore}</Text>
            </View>
        </View>
    );
};

// QSOFA Score Calculator
const QSOFACalculator = () => {
    const [scores, setScores] = useState({
        respiratoryRate: '',
        systolicBP: '',
        alteredMentalStatus: false,
    });

    const [totalScore, setTotalScore] = useState(null);

    const calculateQSOFA = () => {
        let score = 0;
        score += scores.respiratoryRate > 22 ? 1 : 0;
        score += scores.systolicBP < 100 ? 1 : 0;
        score += scores.alteredMentalStatus ? 1 : 0;

        setTotalScore(score);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardHeader}>QSOFA Score Calculator</Text>
            <View style={styles.cardContent}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Respiratory Rate</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={scores.respiratoryRate}
                        onChangeText={(text) => setScores({ ...scores, respiratoryRate: text })}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Systolic BP</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={scores.systolicBP}
                        onChangeText={(text) => setScores({ ...scores, systolicBP: text })}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Altered Mental Status</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={scores.alteredMentalStatus ? '1' : '0'}
                        onChangeText={(text) => setScores({ ...scores, alteredMentalStatus: text === '1' })}
                    />
                </View>
                <Button title="Calculate Score" onPress={calculateQSOFA} />
                <Text style={styles.result}>Total QSOFA Score: {totalScore}</Text>
            </View>
        </View>
    );
};

// Main ICU component
const ICU = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Intensive Care Unit Calculators</Text>
            <ApacheIICalculator />
            <SOFACalculator />
            <QSOFACalculator />
            {/* Additional calculators can be added here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f7fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    cardHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    cardContent: {
        flexDirection: 'column',
    },
    inputWrapper: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        paddingLeft: 8,
    },
    result: {
        fontSize: 18,
        marginTop: 12,
        fontWeight: 'bold',
    },
});

export default ICU;
