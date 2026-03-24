import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { soilTypes, cropTypes, seasons, states, type PredictionInput } from '@/services/api';
import { HelpCircle, RotateCcw, Sparkles } from 'lucide-react';
import Loader from './Loader';

interface PredictionFormProps {
  onSubmit: (data: PredictionInput) => Promise<void>;
  isLoading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PredictionInput>({
    location: '',
    soil_type: '',
    crop_type: '',
    season: 'KHARIF',
    rainfall: 0,
    temperature: 25,
    humidity: 60,
    area: 1,
    fertilizer: 100,
    pesticide: 50,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PredictionInput, string>>>({});

  const handleChange = (field: keyof PredictionInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PredictionInput, string>> = {};
    
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.soil_type) newErrors.soil_type = 'Please select soil type';
    if (!formData.crop_type) newErrors.crop_type = 'Please select crop type';
    if (formData.rainfall < 0) newErrors.rainfall = 'Rainfall cannot be negative';
    if (formData.temperature < -50 || formData.temperature > 60) newErrors.temperature = 'Invalid temperature';
    if (formData.humidity < 0 || formData.humidity > 100) newErrors.humidity = 'Humidity must be 0-100%';
    if (formData.area <= 0) newErrors.area = 'Area must be positive';
    if (formData.fertilizer < 0) newErrors.fertilizer = 'Cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      location: '',
      soil_type: '',
      crop_type: '',
      season: 'KHARIF',
      rainfall: 0,
      temperature: 25,
      humidity: 60,
      area: 1,
      fertilizer: 100,
      pesticide: 50,
    });
    setErrors({});
  };

  const InputWithTooltip = ({ 
    label, 
    tooltip, 
    children 
  }: { 
    label: string; 
    tooltip: string; 
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{label}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {children}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-3xl">🌾</span>
        </div>
        <CardTitle className="text-2xl">Crop Yield Prediction</CardTitle>
        <CardDescription>
          Enter your farm details to get AI-powered yield predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Location */}
            <InputWithTooltip 
              label="Location" 
              tooltip="Select your farm location"
            >
              <Select 
                value={formData.location} 
                onValueChange={(val) => handleChange('location', val)}
              >
                <SelectTrigger className={errors.location ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location}</p>
              )}
            </InputWithTooltip>

            {/* Soil Type */}
            <InputWithTooltip 
              label="Soil Type" 
              tooltip="Select the type of soil in your farmland"
            >
              <Select 
                value={formData.soil_type} 
                onValueChange={(val) => handleChange('soil_type', val)}
              >
                <SelectTrigger className={errors.soil_type ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.soil_type && (
                <p className="text-xs text-destructive">{errors.soil_type}</p>
              )}
            </InputWithTooltip>

            {/* Crop Type */}
            <InputWithTooltip 
              label="Crop Type" 
              tooltip="Select the crop you plan to cultivate"
            >
              <Select 
                value={formData.crop_type} 
                onValueChange={(val) => handleChange('crop_type', val)}
              >
                <SelectTrigger className={errors.crop_type ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.crop_type && (
                <p className="text-xs text-destructive">{errors.crop_type}</p>
              )}
            </InputWithTooltip>

            {/* Season */}
            <InputWithTooltip 
              label="Season" 
              tooltip="Select the growing season"
            >
              <Select 
                value={formData.season} 
                onValueChange={(val) => handleChange('season', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season.charAt(0) + season.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWithTooltip>

            {/* Rainfall */}
            <InputWithTooltip 
              label="Rainfall (mm)" 
              tooltip="Expected annual rainfall in millimeters"
            >
              <Input
                type="number"
                placeholder="e.g., 800"
                value={formData.rainfall || ''}
                onChange={(e) => handleChange('rainfall', Number(e.target.value))}
                className={errors.rainfall ? 'border-destructive' : ''}
              />
              {errors.rainfall && (
                <p className="text-xs text-destructive">{errors.rainfall}</p>
              )}
            </InputWithTooltip>

            {/* Temperature */}
            <InputWithTooltip 
              label="Temperature (°C)" 
              tooltip="Average temperature during growing season"
            >
              <Input
                type="number"
                placeholder="e.g., 25"
                value={formData.temperature}
                onChange={(e) => handleChange('temperature', Number(e.target.value))}
                className={errors.temperature ? 'border-destructive' : ''}
              />
              {errors.temperature && (
                <p className="text-xs text-destructive">{errors.temperature}</p>
              )}
            </InputWithTooltip>

            {/* Humidity */}
            <InputWithTooltip 
              label="Humidity (%)" 
              tooltip="Average relative humidity in your area"
            >
              <Input
                type="number"
                placeholder="e.g., 60"
                value={formData.humidity}
                onChange={(e) => handleChange('humidity', Number(e.target.value))}
                className={errors.humidity ? 'border-destructive' : ''}
              />
              {errors.humidity && (
                <p className="text-xs text-destructive">{errors.humidity}</p>
              )}
            </InputWithTooltip>

            {/* Area */}
            <InputWithTooltip 
              label="Area (hectares)" 
              tooltip="Total cultivation area in hectares"
            >
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 5"
                value={formData.area}
                onChange={(e) => handleChange('area', Number(e.target.value))}
                className={errors.area ? 'border-destructive' : ''}
              />
              {errors.area && (
                <p className="text-xs text-destructive">{errors.area}</p>
              )}
            </InputWithTooltip>

            {/* Fertilizer Usage */}
            <InputWithTooltip 
              label="Fertilizer Usage (kg/hectare)" 
              tooltip="Planned fertilizer application per hectare"
            >
              <Input
                type="number"
                placeholder="e.g., 100"
                value={formData.fertilizer}
                onChange={(e) => handleChange('fertilizer', Number(e.target.value))}
                className={errors.fertilizer ? 'border-destructive' : ''}
              />
              {errors.fertilizer && (
                <p className="text-xs text-destructive">{errors.fertilizer}</p>
              )}
            </InputWithTooltip>

            {/* Pesticide Usage */}
            <InputWithTooltip 
              label="Pesticide Usage (kg/hectare)" 
              tooltip="Planned pesticide application per hectare"
            >
              <Input
                type="number"
                placeholder="e.g., 50"
                value={formData.pesticide}
                onChange={(e) => handleChange('pesticide', Number(e.target.value))}
              />
            </InputWithTooltip>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 h-12 text-base gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader size="sm" />
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Predict Yield
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={isLoading}
              className="sm:w-auto gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;
