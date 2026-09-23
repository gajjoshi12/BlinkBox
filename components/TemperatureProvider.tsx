"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { kelvinToRgb, lighten, rgbToHex } from "@/lib/kelvin";

type Ctx = {
  kelvin: number;
  setKelvin: (k: number) => void;
};

const TempCtx = createContext<Ctx>({ kelvin: 2700, setKelvin: () => {} });
export const useTemperature = () => useContext(TempCtx);

function applyKelvin(kelvin: number) {
  if (typeof document === "undefined") return;
  const [r, g, b] = kelvinToRgb(kelvin);
  const [ar, ag, ab] = lighten([r, g, b], 0.15);
  const warm = rgbToHex([r, g, b]);
  const core = rgbToHex(lighten([r, g, b], 0.55));

  const root = document.documentElement.style;
  root.setProperty("--lamp-r", String(r));
  root.setProperty("--lamp-g", String(g));
  root.setProperty("--lamp-b", String(b));
  root.setProperty("--lamp-glow", `${r}, ${g}, ${b}`);
  root.setProperty("--ambient", `${ar}, ${ag}, ${ab}`);
  root.setProperty("--lamp-warm", warm);
  root.setProperty("--lamp-core", core);
  root.setProperty("--temp-label", `"${kelvin}K"`);
  document.documentElement.dataset.kelvin = String(kelvin);
}

export default function TemperatureProvider({ children }: { children: React.ReactNode }) {
  const [kelvin, setKelvinState] = useState(2700);

  const setKelvin = useCallback((k: number) => {
    setKelvinState(k);
    applyKelvin(k);
  }, []);

  useEffect(() => {
    applyKelvin(kelvin);
  }, [kelvin]);

  return <TempCtx.Provider value={{ kelvin, setKelvin }}>{children}</TempCtx.Provider>;
}
