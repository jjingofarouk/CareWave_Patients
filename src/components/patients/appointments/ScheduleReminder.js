  // New function to handle reminders
  export const scheduleReminder = (appointment) => {
    // Simulate scheduling a reminder
    const reminder = {
      id: Date.now(),
      appointmentId: appointment.id,
      type: 'appointment',
      message: `Reminder: Appointment with ${appointment.patientName} at ${appointment.time}`,
      scheduledFor: new Date(`${appointment.date}T${appointment.time}`).getTime() - 30 * 60000 // 30 minutes before
    };

    setNotifications(prev => [...prev, reminder]);
  };

  // New Modal Components
