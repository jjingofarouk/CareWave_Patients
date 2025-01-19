
 
 
 
 export const fetchAppointments = async (searchParams = {}) => {
    setLoading(true);
    try {
      // Simulate API call with search and filters
      const data = [
        {
          id: 1,
          date: '2024-12-25',
          time: '10:00',
          duration: 30,
          type: APPOINTMENT_TYPES.REGULAR,
          reason: 'Consultation',
          patient: 'John Doe',
          status: APPOINTMENT_STATUS.PENDING,
          patientDetails: {
            age: 45,
            lastVisit: '2024-11-15',
            medicalHistory: ['Hypertension', 'Diabetes'],
            insuranceProvider: 'BlueCross',
            contactNumber: '+1234567890',
            email: 'john.doe@email.com',
            emergencyContact: {
              name: 'Jane Doe',
              relation: 'Spouse',
              phone: '+1987654321'
            },
            allergies: ['Penicillin'],
            medications: ['Metformin', 'Lisinopril']
          },
          notes: '',
          priority: PRIORITY_LEVELS.MEDIUM,
          reminderSent: false,
          paymentStatus: 'pending',
          attachments: []
        },
        // Add more mock appointments here
      ];

      // Apply search and filters
      let filteredData = data;
      if (searchParams.query) {
        filteredData = filteredData.filter(app =>
          app.patient.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          app.reason.toLowerCase().includes(searchParams.query.toLowerCase())
        );
      }

      if (searchParams.filters) {
        const { status, type, priority } = searchParams.filters;
        if (status) {
          filteredData = filteredData.filter(app => app.status === status);
        }
        if (type) {
          filteredData = filteredData.filter(app => app.type === type);
        }
        if (priority) {
          filteredData = filteredData.filter(app => app.priority === priority);
        }
      }

      setAppointments(filteredData);
      updateStatistics(filteredData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to fetch appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };