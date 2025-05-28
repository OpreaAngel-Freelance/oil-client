export const APP_NAME = 'Oil Management System'

export const QUERY_KEYS = {
  OILS: 'oils',
} as const

export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
} as const

export const ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
} as const

export const OIL_TYPES_LABELS = {
  PETROL: 'Petrol',
  DIESEL: 'Diesel',
  CRUDE: 'Crude',
} as const