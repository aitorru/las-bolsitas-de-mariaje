import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { Category } from "../../utils/types/types";

export const metadata: Metadata = {
  title: "Contacto",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const categories = await getCategories();
  return <ContactClient categories={categories} />;
}

async function getCategories(): Promise<Category[]> {
  const db = (await import("../../utils/db/webDB")).default;
  const { collection, getDocs } = await import("firebase/firestore/lite");
  const itemsColletion = collection(db, "categorias");
  const snapshot = await getDocs(itemsColletion);
  const categories: Category[] = [];
  snapshot.forEach((doc) => {
    categories.push({
      id: doc.id,
      nombre: doc.data().nombre,
    });
  });
  return categories;
}
