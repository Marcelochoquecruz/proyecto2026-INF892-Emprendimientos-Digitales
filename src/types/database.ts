// Types for database entities
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
}

// New type for weekly availability slots
export interface Disponibilidad {
  id: string;
  fecha: string; // YYYY-MM-DD
  turno: 'mañana' | 'tarde';
  horario: string; // e.g., "09:00 - 12:00"
  disponible: boolean;
}

// Updated Reserva interface to match form fields
export interface Reserva {
  id: string;
  cliente: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  personas: number;
  estado: 'confirmado' | 'cancelado';
}

export interface Expedition {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  guide: string;
}

export interface ProductMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
}

