"use client";

import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  Button,
  DotField,
  GlassCard,
  TextField,
} from "../../components/punto";
import { loginAction } from "./actions";

const FirePlace = dynamic(() => import("../../components/Fireplace/index"));

export default function FireClient() {
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLogginIn, setLogginIn] = useState(false);
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLogginIn(true);
    setFailed(false);

    const result = await loginAction(
      nameRef.current?.value || "",
      passwordRef.current?.value || ""
    ).catch(() => ({ success: false, token: undefined, username: undefined }));

    if (result.success && result.token) {
      Cookies.set("token", result.token, { expires: 31556926 });
      Cookies.set("username", result.username || "", { expires: 31556926 });
      setLogginIn(false);
      router.push("/dboard");
      return;
    }
    setLogginIn(false);
    setFailed(true);
  };

  return (
    <DotField
      palette="ember"
      motion={isLogginIn ? "flow" : "breathe"}
      speed={isLogginIn ? 2.4 : 1}
      pixel={2}
      seed={9}
      className="lb-fullscreen"
    >
      <div className="lb-fullscreen__stage">
        <GlassCard tone="clear" padding="lg" className="lb-login">
          <form onSubmit={loginUser} className="lb-login__form">
            <div className="lb-candle" aria-hidden="true">
              <FirePlace />
            </div>
            <h1 className="pt-display lb-login__title">Fire handle</h1>
            <TextField
              id="name"
              name="name"
              label="Nombre"
              type="text"
              autoComplete="username"
              required
              ref={nameRef}
            />
            <TextField
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              required
              ref={passwordRef}
              error={failed ? "Nombre o contraseña incorrectos" : undefined}
            />
            <Button type="submit" variant="aurora" size="lg" loading={isLogginIn}>
              {isLogginIn ? "Entrando" : "Entrar"}
            </Button>
          </form>
        </GlassCard>
      </div>
    </DotField>
  );
}
