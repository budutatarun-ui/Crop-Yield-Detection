// Fake API service for mock data and simulated API calls

export interface PredictionInput {
  location: string;
  soilType: string;
  cropType: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  area: number;
  fertilizerUsage: number;
}

export interface PredictionResult {
  id: string;
  estimatedYield: number;
  confidence: number;
  cropType: string;
  location: string;
  date: string;
  recommendations: string[];
}

export interface DashboardStats {
  totalPredictions: number;
  averageYield: number;
  bestCrop: string;
  recentPredictions: PredictionResult[];
  yieldByCrop: { crop: string; yield: number }[];
  predictionTrends: { month: string; predictions: number; avgYield: number }[];
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Crop yield factors (for mock calculation)
const cropYieldFactors: Record<string, number> = {
  wheat: 4.5,
  rice: 5.2,
  corn: 6.8,
  soybean: 3.2,
  cotton: 2.1,
  sugarcane: 8.5,
  potato: 22.0,
  tomato: 35.0,
};

// Mock prediction calculation
export const predictYield = async (input: PredictionInput): Promise<PredictionResult> => {
  await delay(2000); // Simulate API processing time
  
  const baseFactor = cropYieldFactors[input.cropType.toLowerCase()] || 5.0;
  
  // Calculate yield based on inputs
  const rainfallFactor = Math.min(input.rainfall / 100, 1.5);
  const tempFactor = input.temperature >= 20 && input.temperature <= 30 ? 1.0 : 0.8;
  const humidityFactor = input.humidity >= 40 && input.humidity <= 70 ? 1.0 : 0.85;
  const fertilizerFactor = 1 + (input.fertilizerUsage / 500);
  
  const estimatedYield = baseFactor * rainfallFactor * tempFactor * humidityFactor * fertilizerFactor;
  const confidence = 75 + Math.random() * 20;
  
  const recommendations = [
    `Optimal planting window for ${input.cropType} is approaching`,
    `Consider increasing irrigation by 10% for better yields`,
    `Soil nutrient levels are ideal for ${input.cropType} cultivation`,
  ];
  
  return {
    id: 'pred_' + Math.random().toString(36).substr(2, 9),
    estimatedYield: Math.round(estimatedYield * 10) / 10,
    confidence: Math.round(confidence * 10) / 10,
    cropType: input.cropType,
    location: input.location,
    date: new Date().toISOString(),
    recommendations,
  };
};

// Mock dashboard data
export const getDashboardStats = async (): Promise<DashboardStats> => {
  await delay(1000);
  
  return {
    totalPredictions: 156,
    averageYield: 5.4,
    bestCrop: 'Wheat',
    recentPredictions: [
      { id: '1', estimatedYield: 5.8, confidence: 89, cropType: 'Wheat', location: 'Punjab', date: '2024-01-15', recommendations: [] },
      { id: '2', estimatedYield: 4.2, confidence: 85, cropType: 'Rice', location: 'Karnataka', date: '2024-01-14', recommendations: [] },
      { id: '3', estimatedYield: 7.1, confidence: 92, cropType: 'Corn', location: 'Maharashtra', date: '2024-01-13', recommendations: [] },
      { id: '4', estimatedYield: 3.5, confidence: 78, cropType: 'Soybean', location: 'Madhya Pradesh', date: '2024-01-12', recommendations: [] },
      { id: '5', estimatedYield: 6.3, confidence: 88, cropType: 'Wheat', location: 'Haryana', date: '2024-01-11', recommendations: [] },
    ],
    yieldByCrop: [
      { crop: 'Wheat', yield: 5.8 },
      { crop: 'Rice', yield: 4.2 },
      { crop: 'Corn', yield: 7.1 },
      { crop: 'Soybean', yield: 3.5 },
      { crop: 'Cotton', yield: 2.8 },
      { crop: 'Sugarcane', yield: 8.2 },
    ],
    predictionTrends: [
      { month: 'Aug', predictions: 12, avgYield: 4.8 },
      { month: 'Sep', predictions: 18, avgYield: 5.1 },
      { month: 'Oct', predictions: 25, avgYield: 5.4 },
      { month: 'Nov', predictions: 32, avgYield: 5.2 },
      { month: 'Dec', predictions: 28, avgYield: 5.6 },
      { month: 'Jan', predictions: 41, avgYield: 5.8 },
    ],
  };
};

// Soil types
export const soilTypes = [
  'Alluvial',
  'Black Cotton',
  'Red',
  'Laterite',
  'Desert',
  'Mountain',
  'Clay',
  'Sandy Loam',
];

// Crop types
export const cropTypes = [
  'Wheat',
  'Rice',
  'Corn',
  'Soybean',
  'Cotton',
  'Sugarcane',
  'Potato',
  'Tomato',
];
