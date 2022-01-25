import Image from "next/image";
import Logo from "../../public/logo.png";

export default function Header() {
  return (
    <div className="container mx-auto h-16">
      <div className="grid md:grid-cols-3 h-full justify-center content-center">
        <Image
          alt="Logo de la pagina"
          src={Logo}
          layout={"fixed"}
          width={"100%"}
        />
        <h1 className="text-4xl text-center font-bold h-full">
          Las bolsitas de mariaje
        </h1>
        <div></div>
      </div>
    </div>
  );
}
