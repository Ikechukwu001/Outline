import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function checkIsAdmin(uid) {
  if (!uid) return false;

  const adminRef = doc(db, "admins", uid);
  const adminSnap = await getDoc(adminRef);

  return adminSnap.exists();
}