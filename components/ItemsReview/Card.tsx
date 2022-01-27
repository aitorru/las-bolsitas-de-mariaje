/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { createRef, useEffect } from "react";
import { app } from "../../utils/db/webDB";
import Link from "next/link";

interface Props {
  nombre: string;
  image: string;
}

const Card: NextPage<Props> = ({ nombre, image }) => {
  const imageTag = createRef<HTMLImageElement>();
  useEffect(() => {
    const storage = getStorage(app);
    const reference = ref(storage, image);
    getDownloadURL(reference).then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.open("GET", url);
      xhr.send();
      imageTag.current?.setAttribute("src", url);
    });
  }, [image, imageTag]);
  return (
    <div className="flex flex-col p-5 border-2 border-sky-500 rounded-xl h-full min-h-fit hover:-translate-y-2 transition-transform">
      <img alt={nombre} ref={imageTag} />
      <h1>{nombre}</h1>
      <Link passHref href={"#"}>
        <a className="py-3 w-4/5 mx-auto text-center bg-sky-500 mt-auto rounded-xl">
          Comprar
        </a>
      </Link>
    </div>
  );
};

export default Card;
