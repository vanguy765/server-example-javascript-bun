// Generated enum definitions from database schema
// Source: C:\Users\3900X\Code\vapiordie3\vapiordie3\src\supabase\schema.sql
// Generated on: 2025-06-01T02:30:01.812Z

/**
 * Enum type for call_outcome
 */
export enum CallOutcome {
  SUCCESS = 'success',
  FAILED = 'failed',
  FOLLOW_UP = 'follow_up',
  RESCHEDULED = 'rescheduled',
  NO_ANSWER = 'no_answer',
  BUSY = 'busy',
  CALLBACK_REQUESTED = 'callback_requested',
  HANDOFF = 'handoff',
  TIMED_OUT = 'timed_out',
}

/**
 * Enum type for call_purpose
 */
export enum CallPurpose {
  SALES = 'sales',
  SUPPORT = 'support',
  FEEDBACK = 'feedback',
  OTHER = 'other',
  COMPLAINT = 'complaint',
  SURVEY = 'survey',
  APPOINTMENT = 'appointment',
  BILLING = 'billing',
}

/**
 * Enum type for call_status
 */
export enum CallStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  IN_PROGRESS = 'in_progress',
  MISSED = 'missed',
  RESCHEDULED = 'rescheduled',
  PRIORITY = 'priority',
}

/**
 * Enum type for contact_method
 */
export enum ContactMethod {
  EMAIL = 'email',
  PHONE = 'phone',
  SMS = 'sms',
  MAIL = 'mail',
  CHAT = 'chat',
  IN_PERSON = 'in_person',
  SOCIAL_MEDIA = 'social_media',
  NONE = 'none',
}

/**
 * Enum type for interaction_outcome
 */
export enum InteractionOutcome {
  SUCCESSFUL = 'successful',
  UNSUCCESSFUL = 'unsuccessful',
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  FOLLOW_UP = 'follow_up',
  NO_ANSWER = 'no_answer',
  BUSY = 'busy',
  CALLBACK_REQUESTED = 'callback_requested',
  HANDOFF = 'handoff',
  TIMED_OUT = 'timed_out',
  ORDERED = 'ordered',
}

/**
 * Enum type for interaction_purpose
 */
export enum InteractionPurpose {
  SALES = 'sales',
  SUPPORT = 'support',
  INQUIRY = 'inquiry',
  COMPLAINT = 'complaint',
  FEEDBACK = 'feedback',
  SURVEY = 'survey',
  APPOINTMENT = 'appointment',
  BILLING = 'billing',
  OTHER = 'other',
}

/**
 * Enum type for interaction_status
 */
export enum InteractionStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  MISSED = 'missed',
  RESCHEDULED = 'rescheduled',
  IN_PROGRESS = 'in_progress',
  PRIORITY = 'priority',
}

/**
 * Enum type for order_status
 */
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
  USER_CONFIRMED = 'user_confirmed',
  ACCEPTED = 'accepted',
}

