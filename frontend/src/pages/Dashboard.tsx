import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboard, type DashboardStats } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, BarChart3, Wheat, Activity, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboard.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground">Start making predictions to see your dashboard.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Predictions',
      value: stats.total_predictions,
      icon: Activity,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Average Yield',
      value: `${stats.average_yield} t/ha`,
      icon: TrendingUp,
      color: 'bg-leaf/10 text-leaf',
    },
    {
      title: 'Best Crop',
      value: stats.best_crop,
      icon: Wheat,
      color: 'bg-earth/10 text-earth',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your crop yield predictions and analytics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                      <p className="text-3xl font-bold">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${card.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Yield by Crop Bar Chart */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Yield by Crop Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.yield_by_crop || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="crop" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="yield" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Prediction Trends Line Chart */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-leaf" />
                Prediction Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.prediction_trends || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="predictions" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    name="Predictions"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="avg_yield" 
                    stroke="hsl(var(--leaf))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--leaf))' }}
                    name="Avg Yield (t/ha)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Predictions Table */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-earth" />
              Recent Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Crop</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Yield (t/ha)</TableHead>
                    <TableHead className="text-right">Confidence</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.recent_predictions?.slice(0, 5).map((prediction, index) => (
                    <TableRow key={prediction.id}>
                      <TableCell className="font-medium">
                        <span className="mr-2">🌾</span>
                        {prediction.crop_type}
                      </TableCell>
                      <TableCell>{prediction.location}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {prediction.predicted_yield}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-leaf/10 text-leaf text-xs font-medium">
                          N/A
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {prediction.created_at ? new Date(prediction.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
