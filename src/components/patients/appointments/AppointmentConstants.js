// AppointmentConstants.js

export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    RESCHEDULED: 'rescheduled'
  };
  
  export const APPOINTMENT_TYPES = {
    GENERAL_CHECKUP: 'General Checkup',
    FOLLOW_UP: 'Follow-up Visit',
    NEW_PATIENT: 'New Patient Visit',
    SPECIALIST: 'Specialist Consultation',
    VACCINATION: 'Vaccination',
    ANNUAL_PHYSICAL: 'Annual Physical',
    LAB_WORK: 'Laboratory Tests',
    PRESCRIPTION_REFILL: 'Prescription Refill'
  };
  
  export const STATUS_COLORS = {
    [APPOINTMENT_STATUS.PENDING]: '#FFA500',     // Orange
    [APPOINTMENT_STATUS.CONFIRMED]: '#4CAF50',   // Green
    [APPOINTMENT_STATUS.CANCELLED]: '#F44336',   // Red
    [APPOINTMENT_STATUS.COMPLETED]: '#9E9E9E',   // Grey
    [APPOINTMENT_STATUS.RESCHEDULED]: '#2196F3'  // Blue
  };
  
  // Standard appointment durations in minutes
  export const DURATION_OPTIONS = [
    15,  // Quick consultation
    30,  // Standard visit
    45,  // Extended consultation
    60   // Comprehensive visit
  ];
  
  // Clinic working hours
  export const CLINIC_HOURS = {
    start: '09:00',
    end: '17:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    slotDuration: 15 // in minutes
  };
  
  // Appointment reminder intervals (in minutes)
  export const REMINDER_INTERVALS = {
    DAY_BEFORE: 24 * 60,
    HOURS_BEFORE: 2 * 60,
    MINUTES_BEFORE: 30
  };
  
  // Constants for validation
  export const VALIDATION = {
    MIN_NOTICE_MINUTES: 60, // Minimum notice required for new appointments
    MAX_ADVANCE_DAYS: 90,   // Maximum days in advance for booking
    MAX_NOTES_LENGTH: 250   // Maximum length for additional notes
  };
  
  // Calendar view options
  export const CALENDAR_VIEWS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month'
  };
  
  // Filter options for appointment list
  export const FILTER_OPTIONS = {
    DATE_RANGE: 'dateRange',
    STATUS: 'status',
    TYPE: 'type',
    DOCTOR: 'doctor'
  };
  
  // Sort options for appointment list
  export const SORT_OPTIONS = {
    DATE_ASC: 'Earliest First',
    DATE_DESC: 'Latest First',
    DOCTOR_NAME: 'Doctor Name'
  };
  
  // Specialties available for booking
  export const SPECIALTIES = {
    FAMILY_MEDICINE: 'Family Medicine',
    PEDIATRICS: 'Pediatrics',
    INTERNAL_MEDICINE: 'Internal Medicine',
    GYNECOLOGY: 'Gynecology',
    DERMATOLOGY: 'Dermatology',
    CARDIOLOGY: 'Cardiology',
    ORTHOPEDICS: 'Orthopedics',
    ENT: 'Ear, Nose & Throat'
  };