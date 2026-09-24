import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const getTypeInfo = (type: string) => {
  switch (type) {
    case "ramp":
      return { icon: "♿", label: "Ramp" };
    case "lift":
    case "elevator":
      return { icon: "🛗", label: "Lift/Elevator" };
    case "tactile_path":
      return { icon: "🦯", label: "Tactile Path" };
    case "safe_path":
      return { icon: "🚶", label: "Safe Walkway" };
    case "obstacle":
    case "stairs":
    case "steep_slope":
    case "broken_sidewalk":
    case "narrow_path":
      return { icon: "🪜", label: "Obstacle" };
    default:
      return { icon: "📍", label: "Location" };
  }
};

const Community = () => {
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      try {
        const response = await fetch("http://localhost:8000/api/submissions?status=approved");
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }
        return await response.json();
      } catch (err) {
        console.warn("Backend not reachable. Using fallback community data.");
        // Fallback demo data when backend is not running
        return [
          {
            id: "1",
            type: "ramp",
            description: "New accessible ramp installed at the main entrance of City Library.",
            verified: true,
            rating: 5,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            type: "obstacle",
            description: "Broken sidewalk near Central Park. Wheelchairs cannot pass.",
            verified: false,
            rating: 2,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          }
        ];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-destructive">
        Error loading community feed.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Community Feed</h1>
            <p className="text-muted-foreground">
              Recent accessibility reports from our community members
            </p>
          </div>

          <div className="space-y-4">
            {submissions?.map((submission: any) => {
              const { icon } = getTypeInfo(submission.type);
              return (
                <Card key={submission.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <div className="text-4xl">{icon}</div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">
                            {submission.description ? submission.description.substring(0, 50) + (submission.description.length > 50 ? "..." : "") : "Accessibility Report"}
                          </h3>
                          <p className="text-sm text-muted-foreground">{submission.description}</p>
                        </div>
                        {submission.verified && (
                          <Badge className="bg-primary gap-1 whitespace-nowrap">
                            <CheckCircle2 size={14} />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: submission.rating || 0 }).map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {submission.created_at ? formatDistanceToNow(new Date(submission.created_at), { addSuffix: true }) : "Just now"}
                        </div>
                      </div>

                      {submission.image_url && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-border">
                          <img
                            src={submission.image_url}
                            alt="Accessibility Feature"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            {submissions?.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No submissions yet. Be the first to contribute!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
