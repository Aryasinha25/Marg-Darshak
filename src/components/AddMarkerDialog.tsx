import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";
import { storage, auth } from "@/integrations/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface AddMarkerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { Checkbox } from "@/components/ui/checkbox";

const AddMarkerDialog = ({ open, onOpenChange }: AddMarkerDialogProps) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    rating: "3",
    is_temporary: false,
  });

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGettingLocation(false);
          toast.success("Location captured successfully");
        },
        (error) => {
          console.error("Error getting location:", error);
          setGettingLocation(false);
          toast.error("Failed to get location. Please enable location services.");
        }
      );
    } else {
      setGettingLocation(false);
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast.error("Please capture location first");
      return;
    }
    if (!formData.type || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const storageRef = ref(storage, `submissions/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const userId = auth.currentUser?.uid || (localStorage.getItem("isGuest") === "true" ? "guest" : "anonymous");

      const submissionData = {
        ...formData,
        location,
        rating: parseInt(formData.rating),
        created_by: userId,
        image_url: imageUrl
      };

      console.log("Submitting:", submissionData);

      const response = await fetch("http://localhost:8000/api/submit-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Failed to submit report");

      toast.success("Marker added successfully!");
      onOpenChange(false);
      // Reset form
      setFormData({ type: "", description: "", rating: "3" });
      setLocation(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to add marker");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Accessibility Marker</DialogTitle>
          <DialogDescription>
            Help others by sharing accessibility information about this location
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Location *</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={location ? "default" : "outline"}
                className="w-full gap-2"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
                {location ? "Location Captured" : "Capture Current Location"}
              </Button>
            </div>
            {location && <p className="text-xs text-muted-foreground">Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select marker type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ramp">♿ Ramp</SelectItem>
                <SelectItem value="lift">🛗 Lift/Elevator</SelectItem>
                <SelectItem value="tactile_path">🦯 Tactile Path</SelectItem>
                <SelectItem value="safe_path">🚶 Safe Walkway</SelectItem>
                <SelectItem value="obstacle">🪜 Stairs/Obstacle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the accessibility feature..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Accessibility Rating</Label>
            <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                <SelectItem value="2">⭐⭐ Poor</SelectItem>
                <SelectItem value="1">⭐ Very Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox 
              id="temporary" 
              checked={formData.is_temporary}
              onCheckedChange={(checked) => setFormData({ ...formData, is_temporary: checked === true })}
            />
            <Label
              htmlFor="temporary"
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              This is a temporary obstacle (expires in 24 hours)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Submit for Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMarkerDialog;
