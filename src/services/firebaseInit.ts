// src/services/firebaseInit.ts
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

/**
 * Inserts sample reservation documents with field names matching the Dashboard expectations.
 * Run this once (e.g., from a dev page) to populate test data.
 */
export async function initTestData() {
  try {
    const reservasRef = collection(db, "reservas");

    const reservasDePrueba = [
      {
        cliente: "Carlos Mendoza",
        email: "carlos.m@gmail.com",
        telefono: "72412345",
        fecha: "2026-06-20",
        hora: "14:30",
        personas: 3,
        estado: "pendiente",
      },
      {
        cliente: "Ana Choque Ramos",
        email: "ana.ramos@outlook.com",
        telefono: "67289101",
        fecha: "2026-06-22",
        hora: "10:00",
        personas: 2,
        estado: "confirmado",
      },
      {
        cliente: "John Doe (Turista)",
        email: "johndoe@travel.com",
        telefono: "+14155552671",
        fecha: "2026-07-05",
        hora: "09:00",
        personas: 1,
        estado: "pendiente",
      },
    ];

    for (const reserva of reservasDePrueba) {
      await addDoc(reservasRef, reserva);
    }

    console.log("✅ Test reservation data inserted successfully.");
  } catch (error) {
    console.error("❌ Error inserting test reservation data:", error);
  }
}
