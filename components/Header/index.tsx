import Image from "next/image";
import Logo from "../../public/logo.png";

export default function Header() {
  return (
    <div className="h-fit w-full py-2 shadow">
      <div className="container md:mx-auto flex flex-row justify-around h-full content-center items-center">
        <Image
          alt="Logo de la pagina"
          src={Logo}
          placeholder={"blur"}
          height={120}
          width={120}
        />
        <div className="hidden md:block">
          <ul className="flex flex-row gap-3 content-center font-bold underline flex-wrap items-center justify-center">
            <li>Bolsas</li>
            <li>Delantal</li>
            <li>Delantal</li>
            <li>Delantal</li>
            <li>Delantal</li>
            <li>Delantal</li>
          </ul>
        </div>
        <a className="text-4xl text-center font-bold h-full py-3 px-10 bg-sky-500 rounded-xl">
          Comprar
        </a>
      </div>
    </div>
  );
}
