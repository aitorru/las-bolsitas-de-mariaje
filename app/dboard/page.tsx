import type { Metadata } from "next";
import DashboardClient from "../../components/UploadBoard/DashboardClient";
import { Carousel, Category, Highlight, Item } from "../../utils/types/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Board",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DBoardPage() {
  const [categories, items, highlights, carousel] = await Promise.all([
    getCategories(),
    getItems(),
    getHighlight(),
    getCarousel(),
  ]);

  return (
    <DashboardClient
      categories={categories}
      items={items}
      highlights={highlights}
      carousel={carousel}
    />
  );
}

async function getHighlight(): Promise<Highlight[]> {
  const db = (await import("../../utils/db/webDB")).default;
  const { collection, getDocs, query, orderBy } = await import(
    "firebase/firestore/lite"
  );
  const itemsColletion = collection(db, "highlight");
  const q = query(itemsColletion, orderBy("pos"));
  const snapshot = await getDocs(q);
  const highlights: Highlight[] = [];
  snapshot.forEach((doc) => {
    highlights.push({
      id: doc.id,
      refID: doc.data().refID,
      pos: doc.data().pos,
    });
  });
  return highlights;
}

async function getCategories(): Promise<Category[]> {
  const db = (await import("../../utils/db/webDB")).default;
  const { collection, getDocs, query, orderBy } = await import(
    "firebase/firestore/lite"
  );
  const itemsColletion = collection(db, "categorias");
  const q = query(itemsColletion, orderBy("nombre"));
  const snapshot = await getDocs(q);
  const categories: Category[] = [];
  snapshot.forEach((doc) => {
    categories.push({
      id: doc.id,
      nombre: doc.data().nombre,
    });
  });
  return categories;
}

async function getItems(): Promise<Item[]> {
  const db = (await import("../../utils/db/webDB")).default;
  const { collection, getDocs, query, orderBy } = await import(
    "firebase/firestore/lite"
  );
  const itemsColletion = collection(db, "articulos");
  const q = query(itemsColletion, orderBy("categoria"));
  const snapshot = await getDocs(q);
  const items: Item[] = [];
  snapshot.forEach((doc) => {
    items.push({
      nombre: doc.data().nombre,
      image: doc.data().image,
      imageUrl: doc.data().imageUrl || "",
      categoria: doc.data().categoria,
      precio: doc.data().precio,
      descripcion: doc.data().descripcion || "",
      id: doc.id,
      blur: doc.data().blur || "",
    });
  });
  return items;
}

async function getCarousel(): Promise<Carousel[]> {
  const db = (await import("../../utils/db/webDB")).default;
  const { collection, getDocs, query, orderBy } = await import(
    "firebase/firestore/lite"
  );
  const itemsColletion = collection(db, "carousel");
  const q = query(itemsColletion, orderBy("pos"));
  const snapshot = await getDocs(q);
  const carousel: Carousel[] = [];
  snapshot.forEach((doc) => {
    carousel.push({
      id: doc.id,
      pos: doc.data().pos,
      image: doc.data().image,
      imageUrl: doc.data().imageUrl || "",
      blur: doc.data().imageUrl || "",
    });
  });
  return carousel;
}
