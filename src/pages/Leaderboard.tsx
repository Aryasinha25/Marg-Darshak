import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Leaderboard = () => {
  const { data: leaders, isLoading, error } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      try {
        const response = await fetch("http://localhost:8000/api/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        return await response.json();
      } catch (err) {
        console.warn("Backend not reachable. Using fallback leaderboard data.");
        // Demo fallback data if backend is not running
        return [
          { id: "1", email: "sarah.j@example.com", points: 150, level: "Pathfinder Level 5" },
          { id: "2", email: "david.m@example.com", points: 120, level: "Pathfinder Level 4" },
          { id: "3", email: "a.patel@example.com", points: 90, level: "Pathfinder Level 3" },
          { id: "4", email: "j.smith@example.com", points: 40, level: "Pathfinder Level 2" },
        ];
      }
    },
  });

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1: return <Medal className="h-6 w-6 text-gray-400" />;
      case 2: return <Medal className="h-6 w-6 text-amber-700" />;
      default: return <Award className="h-5 w-5 text-primary/40" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            Top Pathfinders
          </h1>
          <p className="text-muted-foreground text-lg">
            Recognizing our most active community members who are making the world more accessible!
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">Error loading leaderboard.</div>
        ) : (
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 rounded-t-xl border-b border-border">
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>Earn 10 points for every verified accessibility report.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {leaders?.map((user: any, index: number) => (
                  <div key={user.id} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                    
                    <div className="w-12 text-center font-bold text-lg text-muted-foreground">
                      #{index + 1}
                    </div>
                    
                    <div className="mx-4 flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border">
                      {getRankIcon(index)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {user.email.split('@')[0]}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.level || "Pathfinder Level 1"}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-xl text-primary">{user.points}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Points</div>
                    </div>

                  </div>
                ))}

                {leaders?.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No points awarded yet. Be the first to map an accessible route!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
