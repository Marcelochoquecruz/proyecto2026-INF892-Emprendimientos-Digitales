// src/services/firebaseSeedUser.ts
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Creates the admin user (Don Marcelino) in Firebase Auth and stores a profile
 * document in the "usuarios" collection. If the user already exists, log a
 * friendly message.
 */
export async function seedAdminUser(): Promise<void> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "marcelino.choque@potosimineral.com",
      "Potosi2026!"
    );
    const uid = userCredential.user.uid;
    // Save profile in Firestore under collection "usuarios"
    await setDoc(doc(db, "usuarios", uid), {
      uid,
      nombreCompleto: "Marcelino Choque V.",
      rol: "admin",
    });
    console.log("✅ Admin user seeded successfully.");
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      console.log("⚠️ Admin user already initialized.");
    } else {
      console.error("❌ Error seeding admin user:", error);
    }
  }
}
