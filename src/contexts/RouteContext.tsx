import { createContext, useContext, useState, ReactNode } from "react";

type RouteCoordinates = {
  start: { lat: number; lng: number } | null;
  end: { lat: number; lng: number } | null;
};

type RouteContextType = {
  coordinates: RouteCoordinates;
  setCoordinates: (start: { lat: number; lng: number } | null, end: { lat: number; lng: number } | null) => void;
};

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinatesState] = useState<RouteCoordinates>({
    start: null,
    end: null,
  });

  const setCoordinates = (
    start: { lat: number; lng: number } | null,
    end: { lat: number; lng: number } | null
  ) => {
    setCoordinatesState({ start, end });
  };

  return (
    <RouteContext.Provider value={{ coordinates, setCoordinates }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
}
