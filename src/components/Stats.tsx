import React from 'react';
import { ChevronUp, Vote, Users, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useElection } from '@/contexts/ElectionContext';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trendingUp?: boolean;
  trendValue?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trendingUp,
  trendValue,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trendValue && (
          <div className="mt-1 flex items-center text-sm">
            <ChevronUp
              className={cn(
                "h-4 w-4 mr-1",
                trendingUp ? "text-green-500" : "text-red-500 transform rotate-180"
              )}
            />
            <span 
              className={cn(
                "font-medium",
                trendingUp ? "text-green-500" : "text-red-500"
              )}
            >
              {trendValue}
            </span>
            {description && (
              <span className="ml-2 text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        )}
        {!trendValue && description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface StatsProps {
  className?: string;
}

const Stats: React.FC<StatsProps> = ({ className }) => {
  const { elections, activeElections, voters } = useElection();
  
  // Calculate total votes
  const totalVotes = elections.reduce((total, election) => total + (election.totalVotes || 0), 0);
  
  // Calculate participation rate
  const totalVoters = voters.length;
  const participationRate = totalVoters > 0 
    ? Math.round((totalVotes / totalVoters) * 100) 
    : 0;
  
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      <StatCard
        title="Total Elections"
        value={elections.length}
        description={`${activeElections.length} active now`}
        icon={<Vote className="h-4 w-4 text-primary" />}
        trendingUp
        trendValue="16.2%"
      />
      <StatCard
        title="Registered Voters"
        value={totalVoters || 0}
        description="from last month"
        icon={<Users className="h-4 w-4 text-primary" />}
        trendingUp
        trendValue="8.1%"
      />
      <StatCard
        title="Votes Cast"
        value={totalVotes || 0}
        description={`${participationRate}% participation`}
        icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
        trendingUp
        trendValue="12.3%"
      />
    </div>
  );
};

export default Stats;
