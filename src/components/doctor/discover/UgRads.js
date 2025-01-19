import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Modal, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import debounce from 'lodash/debounce';
import { radCases } from './radCases'; // Your data file

const UgRads = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2);
    const [selectedCase, setSelectedCase] = useState(null);
    const [filteredCases, setFilteredCases] = useState(radCases);

    // Debounced search function
    const handleSearch = debounce((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, 300);

    useEffect(() => {
        const results = radCases.filter((caseItem) =>
            caseItem.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCases(results);
    }, [searchTerm]);

    const totalCases = filteredCases.length;

    const viewCaseDetail = (caseItem) => {
        setSelectedCase(caseItem);
    };

    const closeModal = () => {
        setSelectedCase(null);
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search cases..."
                    onChangeText={handleSearch}
                    value={searchTerm}
                />
            </View>

            {/* Cases List */}
            <ScrollView style={styles.casesContainer}>
                {totalCases === 0 ? (
                    <Text style={styles.noCases}>No cases found.</Text>
                ) : (
                    filteredCases
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((caseItem) => (
                            <TouchableOpacity
                                key={caseItem.id}
                                style={styles.caseCard}
                                onPress={() => viewCaseDetail(caseItem)}
                            >
                                <View style={styles.caseImageContainer}>
                                    <Image
                                        source={{ uri: Array.isArray(caseItem.imageUrl) ? caseItem.imageUrl[0] : caseItem.imageUrl }}
                                        style={styles.caseImage}
                                    />
                                </View>
                                <View style={styles.caseDetails}>
                                    <Text style={styles.caseTitle}>{caseItem.title}</Text>
                                    <Text style={styles.caseDescription}>{caseItem.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                )}
            </ScrollView>

            {/* Pagination */}
            {totalCases > itemsPerPage && (
                <View style={styles.pagination}>
                    <TouchableOpacity onPress={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        <Text style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}>Prev</Text>
                    </TouchableOpacity>
                    <Text style={styles.pageNumber}>{currentPage}</Text>
                    <TouchableOpacity onPress={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(totalCases / itemsPerPage)}>
                        <Text style={[styles.paginationButton, currentPage === Math.ceil(totalCases / itemsPerPage) && styles.disabledButton]}>Next</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal for Case Details */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={!!selectedCase}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{selectedCase?.title || ''}</Text>
                    </View>
                    <ScrollView style={styles.modalBody}>
                        <View style={styles.caseImageContainer}>
                            <Image
                                source={{ uri: selectedCase?.imageUrl }}
                                style={styles.caseImage}
                            />
                        </View>
                        <Text style={styles.caseDescription}>{selectedCase?.description || ''}</Text>
                    </ScrollView>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F7FA',
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
    },
    casesContainer: {
        marginBottom: 16,
    },
    caseCard: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    caseImageContainer: {
        width: 100,
        height: 100,
        marginRight: 16,
    },
    caseImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    caseDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    caseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    caseDescription: {
        fontSize: 14,
        color: '#555',
    },
    noCases: {
        textAlign: 'center',
        color: '#888',
    },
    pagination: {
        marginTop: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationButton: {
        fontSize: 18,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#009688',
        color: '#fff',
        borderRadius: 8,
        marginHorizontal: 10,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    pageNumber: {
        fontSize: 18,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    modalContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    modalHeader: {
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    modalBody: {
        marginBottom: 16,
    },
    closeButton: {
        backgroundColor: '#FF7043',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default UgRads;