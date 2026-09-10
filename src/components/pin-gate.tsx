import { Delete, Lock } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { STORE_NAME, STORE_PIN } from "@/lib/catalog";

const SESSION_KEY = "cebolao-pin-ok";

export function PinGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setUnlocked(window.sessionStorage.getItem(SESSION_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (pin.length < 4) return;
    if (pin === STORE_PIN) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
      setPin("");
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  }, [pin]);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary-strong">
          <Lock className="size-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-extrabold">{STORE_NAME}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Digite a senha de 4 números para abrir o painel da loja.
        </p>
      </div>

      <div className="flex gap-3" aria-label="Senha digitada">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={`size-5 rounded-full border-2 ${
              pin.length > index ? "border-primary bg-primary" : "border-border bg-card"
            }`}
          />
        ))}
      </div>

      {error ? (
        <p className="text-base font-bold text-destructive">Senha errada, tente de novo.</p>
      ) : null}

      <div className="grid w-full max-w-xs grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <Button
            key={digit}
            variant="soft"
            size="xl"
            className="h-16 text-2xl font-extrabold"
            onClick={() => setPin((value) => (value + digit).slice(0, 4))}
          >
            {digit}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="xl"
          className="h-16"
          aria-label="Apagar"
          onClick={() => setPin((value) => value.slice(0, -1))}
        >
          <Delete aria-hidden />
        </Button>
        <Button
          variant="soft"
          size="xl"
          className="h-16 text-2xl font-extrabold"
          onClick={() => setPin((value) => (value + "0").slice(0, 4))}
        >
          0
        </Button>
      </div>
    </div>
  );
}
