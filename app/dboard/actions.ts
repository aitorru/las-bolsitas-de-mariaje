"use server";

import Jimp from "jimp";
import { revalidatePath } from "next/cache";
import db, { bucket } from "../../utils/db";
import { Item } from "../../utils/types/types";

async function blurAndScaleDown(buffer: Buffer): Promise<string> {
  const image = await Jimp.read(buffer);
  image.resize(image.getWidth() / 5, image.getHeight() / 5);
  image.quality(30);
  image.blur(10);
  return image.getBase64Async(Jimp.MIME_JPEG);
}

export async function uploadItemAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").replace(/\s+/g, " ").trim();
  const category = String(formData.get("category") ?? "");
  const price = String(formData.get("price") ?? "");
  const descripcion = String(formData.get("descripcion") ?? "");
  const imageFile = formData.get("image");

  if (!(imageFile instanceof File)) {
    return { status: 400, message: "Missing image" };
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const filename = imageFile.name;
  const fileRef = bucket.file(filename);
  const [url, blur] = await Promise.all([
    fileRef.getSignedUrl({ action: "read", expires: "03-09-2491" }),
    blurAndScaleDown(buffer),
    fileRef.save(buffer),
  ]);

  await db.collection("articulos").add({
    image: "gs://las-bolsitas-de-mariaje.appspot.com/" + filename,
    imageUrl: url[0],
    blur: blur,
    nombre: name,
    categoria: category,
    precio: price,
    descripcion: descripcion,
  });

  revalidatePath("/");
  revalidatePath(`/c/${encodeURIComponent(category)}`);
  return { status: 200 };
}

export async function modifyItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { status: 400, message: "Missing id" };
  }

  const ref = db.collection("articulos").doc(id);
  const doc = await ref.get();
  const data = doc.data() as Item | undefined;
  if (!data) {
    return { status: 404, message: "Item not found" };
  }

  const name = String(formData.get("name") ?? "");
  const category = String(formData.get("category") ?? "");
  const price = String(formData.get("price") ?? "");
  const descripcion = String(formData.get("descripcion") ?? "");

  if (name && name !== data.nombre) {
    await ref.update({ nombre: name.replace("/", "") });
  }
  if (category && category !== data.categoria) {
    await ref.update({ categoria: category });
  }
  if (price && price !== data.precio) {
    await ref.update({ precio: price });
  }
  if (descripcion && descripcion !== data.descripcion) {
    await ref.update({ descripcion: descripcion });
  }

  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = imageFile.name;
    const fileRef = bucket.file(filename);
    const [url, blur] = await Promise.all([
      fileRef.getSignedUrl({ action: "read", expires: "03-09-2491" }),
      blurAndScaleDown(buffer),
      fileRef.save(buffer),
    ]);

    const sliced = data.image.split("/");
    const oldName = sliced[sliced.length - 1];
    try {
      await bucket.file(oldName).delete();
    } catch (error) {
      console.error(error);
    }

    await ref.update({
      image: "gs://las-bolsitas-de-mariaje.appspot.com/" + filename,
      imageUrl: url[0],
      blur: blur,
    });
  }

  revalidatePath(`/p/${encodeURIComponent(name || data.nombre)}`);
  if (category && category !== data.categoria) {
    revalidatePath(`/c/${encodeURIComponent(category)}`);
    revalidatePath(`/c/${encodeURIComponent(data.categoria)}`);
  }
  revalidatePath("/");
  return { status: 200 };
}

export async function deleteItemAction(id: string) {
  const ref = db.collection("articulos").doc(id);
  const doc = await ref.get();
  const data = doc.data() as Item | undefined;
  if (!data) {
    return { status: 404, message: "Item not found" };
  }

  const sliced = data.image.split("/");
  const oldName = sliced[sliced.length - 1];
  try {
    await bucket.file(oldName).delete();
  } catch (error) {
    console.error(error);
  }
  await ref.delete();

  revalidatePath(`/c/${encodeURIComponent(data.categoria)}`);
  revalidatePath("/");
  return { status: 200 };
}

export async function uploadCategoryAction(name: string) {
  if (!name) {
    return { status: 400, message: "Missing name" };
  }
  await db.collection("categorias").add({ nombre: name });
  revalidatePath("/");
  revalidatePath(`/c/${encodeURIComponent(name)}`);
  return { status: 200 };
}

export async function modifyCategoryAction(originId: string, destination: string) {
  if (!originId || !destination) {
    return { status: 400, message: "Missing data" };
  }
  const ref = db.collection("categorias").doc(originId);
  await ref.update({ nombre: destination });
  revalidatePath("/");
  revalidatePath(`/c/${encodeURIComponent(destination)}`);
  return { status: 200 };
}

export async function deleteCategoryAction(id: string) {
  if (!id) {
    return { status: 400, message: "Missing id" };
  }
  const ref = db.collection("categorias").doc(id);
  await ref.delete();
  revalidatePath("/");
  return { status: 200 };
}

export async function updateHighlightsAction(ids: string[]) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { status: 400, message: "Missing ids" };
  }
  const snapshot = await db.collection("highlight").orderBy("pos").get();
  const updates: { id: string; refID: string }[] = [];
  let index = 0;
  snapshot.forEach((doc) => {
    const nextId = ids[index];
    if (nextId && doc.data().refID !== nextId) {
      updates.push({ id: doc.id, refID: nextId });
    }
    index++;
  });
  await Promise.all(
    updates.map(async (up) => {
      const ref = db.collection("highlight").doc(up.id);
      await ref.update({ refID: up.refID });
    })
  );
  revalidatePath("/");
  return { status: 200 };
}

export async function updateCarouselAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const imageFile = formData.get("image");
  if (!id || !(imageFile instanceof File)) {
    return { status: 400, message: "Missing data" };
  }

  const ref = db.collection("carousel").doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    return { status: 404, message: "Carousel item not found" };
  }
  const data = doc.data() as { image?: string } | undefined;
  const oldImage = data?.image ?? "";

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const filename = imageFile.name;
  const fileRef = bucket.file(filename);
  const [url, blur] = await Promise.all([
    fileRef.getSignedUrl({ action: "read", expires: "03-09-2491" }),
    blurAndScaleDown(buffer),
    fileRef.save(buffer),
  ]);

  if (oldImage) {
    const sliced = oldImage.split("/");
    const oldName = sliced[sliced.length - 1];
    try {
      await bucket.file(oldName).delete();
    } catch (error) {
      console.error(error);
    }
  }

  await ref.update({
    image: "gs://las-bolsitas-de-mariaje.appspot.com/" + filename,
    imageUrl: url[0],
    blur: blur,
  });

  revalidatePath("/");
  return { status: 200 };
}
