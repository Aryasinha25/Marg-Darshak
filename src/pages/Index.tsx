import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MapView from "@/components/MapView";
import RouteComparison from "@/components/RouteComparison";
import AddMarkerDialog from "@/components/AddMarkerDialog";
import { RouteProvider } from "@/contexts/RouteContext";

const Index = () => {
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [showAddMarker, setShowAddMarker] = useState(false);

  return (
    <RouteProvider>
      <div className={accessibilityMode ? "accessibility-mode" : ""}>
        {accessibilityMode && (
          <style>{`
            .accessibility-mode {
              --background: 0 0% 100%;
              --foreground: 0 0% 0%;
              --primary: 0 0% 0%;
              --primary-foreground: 0 0% 100%;
              --muted: 0 0% 90%;
              --muted-foreground: 0 0% 20%;
              --card: 0 0% 100%;
              --card-foreground: 0 0% 0%;
              --border: 0 0% 0%;
              font-size: 1.1rem;
              line-height: 1.6;
            }
            .accessibility-mode h1, .accessibility-mode h2, .accessibility-mode h3 {
              letter-spacing: 0.05em;
              text-decoration: underline;
            }
            .accessibility-mode button {
              border-width: 2px !important;
              font-weight: bold !important;
            }
            .accessibility-mode .custom-marker {
              transform: scale(1.5);
              border-width: 4px !important;
            }
          `}</style>
        )}
        <Navigation
          accessibilityMode={accessibilityMode}
          onAccessibilityToggle={() => setAccessibilityMode(!accessibilityMode)}
        />
        <Hero />
        <div id="map-view">
          <MapView
            onAddMarker={() => setShowAddMarker(true)}
          //  accessibilityMode={accessibilityMode}
          />
        </div>
        <RouteComparison />
        <AddMarkerDialog
          open={showAddMarker}
          onOpenChange={setShowAddMarker}
        />
      </div>
    </RouteProvider>
  );
};

export default Index;
