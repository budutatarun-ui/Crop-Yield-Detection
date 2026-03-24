import React, { useState } from 'react';
import PredictionForm from '@/components/PredictionForm';
import PredictionCard from '@/components/PredictionCard';
import { predictions, type PredictionInput, type PredictionResult } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Predict: React.FC = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePredict = async (data: PredictionInput) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const prediction = await predictions.create(data);
      setResult(prediction);
      toast({
        title: 'Prediction Complete!',
        description: `Estimated yield: ${prediction.predicted_yield} ${prediction.unit || 'tons'}`,
      });
    } catch (error) {
      toast({
        title: 'Prediction Failed',
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Predict Your Crop Yield
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your farm details below and let our AI analyze the data to provide 
            accurate yield predictions and recommendations.
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="animate-slide-up">
            <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
          </div>

          {/* Result or Placeholder */}
          <div className="lg:sticky lg:top-24">
            {result ? (
              <PredictionCard result={result} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-4xl">🌱</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Prediction Yet
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  Fill out the form and click "Predict Yield" to get your AI-powered crop yield prediction.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
