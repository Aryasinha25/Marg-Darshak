import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MapView from "@/components/MapView";
import RouteComparison from "@/components/RouteComparison";
import AddMarkerDialog from "@/components/AddMarkerDialog";
import { RouteProvider } from "@/contexts/RouteContext";

const Index = () => {
  const [showAddMarker, setShowAddMarker] = useState(false);

  return (
    <RouteProvider>
      <Navigation />
      <Hero />
      <div id="map-view">
        <MapView
          onAddMarker={() => setShowAddMarker(true)}
        />
      </div>
      <RouteComparison />
      <AddMarkerDialog
        open={showAddMarker}
        onOpenChange={setShowAddMarker}
      />
    </RouteProvider>
  );
};

export default Index;
