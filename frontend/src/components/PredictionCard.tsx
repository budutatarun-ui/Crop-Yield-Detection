import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MapPin, Calendar } from 'lucide-react';
import type { PredictionResult } from '@/services/api';

interface PredictionCardProps {
  result: PredictionResult;
  className?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ result, className }) => {
  const formattedDate = result.created_at ? new Date(result.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className={cn('overflow-hidden animate-scale-in', className)}>
      <div className="h-2 gradient-hero" />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">Prediction Result</span>
          <span className="text-3xl">🌾</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Yield Display */}
        <div className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Estimated Yield</p>
          <p className="text-5xl font-bold text-primary">
            {result.predicted_yield}
          </p>
          <p className="text-lg text-muted-foreground">{result.unit || 'tons'}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div className="p-2 rounded-lg bg-earth/10">
              <MapPin className="h-5 w-5 text-earth" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-semibold truncate">{result.location}</p>
            </div>
          </div>
        </div>

        {/* Crop & Date Info */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-medium">{result.crop_type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
