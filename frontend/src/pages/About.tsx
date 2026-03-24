import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Leaf, 
  CloudRain, 
  Database, 
  LineChart, 
  Users,
  Target,
  Zap,
  Shield
} from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Machine Learning Models',
      description: 'Our platform uses advanced ML algorithms trained on millions of agricultural data points to deliver accurate predictions.',
    },
    {
      icon: CloudRain,
      title: 'Weather Integration',
      description: 'Real-time weather data and historical patterns are factored into every prediction for maximum accuracy.',
    },
    {
      icon: Database,
      title: 'Comprehensive Data',
      description: 'We analyze soil composition, rainfall patterns, temperature variations, and more to give you the complete picture.',
    },
    {
      icon: LineChart,
      title: 'Trend Analysis',
      description: 'Track your predictions over time and identify patterns to continuously improve your farming strategies.',
    },
    {
      icon: Target,
      title: 'Precision Agriculture',
      description: 'Make data-driven decisions about crop selection, planting times, and resource allocation.',
    },
    {
      icon: Shield,
      title: 'Reliable Predictions',
      description: 'Every prediction comes with a confidence score so you know exactly how reliable our estimates are.',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Increase Productivity',
      description: 'Farmers using our platform have seen up to 25% increase in yield by making smarter decisions.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Farming',
      description: 'Optimize resource usage and reduce waste through precise predictions and recommendations.',
    },
    {
      icon: Users,
      title: 'Community Insights',
      description: 'Benefit from anonymized insights from our community of thousands of farmers.',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Brain className="h-4 w-4" />
            About Our Technology
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Transforming Agriculture with
            <span className="block text-primary">Artificial Intelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            CropPredict combines cutting-edge machine learning with agricultural science 
            to help farmers make smarter decisions and improve their productivity.
          </p>
        </div>
      </section>

      {/* How AI Helps Farmers */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How AI Helps Farmers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advanced algorithms analyze multiple factors to provide accurate, 
              actionable insights for your farm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Farmers Love CropPredict
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of farmers who are already benefiting from our AI-powered platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-leaf/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-leaf" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-primary-foreground/90 leading-relaxed">
            We believe that every farmer deserves access to the power of artificial intelligence. 
            Our mission is to democratize agricultural technology and help farmers around the world 
            increase their productivity, reduce waste, and build more sustainable farming practices.
          </p>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Technology
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Machine Learning
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-leaf mt-1">•</span>
                    Random Forest & Gradient Boosting models for yield prediction
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-leaf mt-1">•</span>
                    Neural networks for pattern recognition in weather data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-leaf mt-1">•</span>
                    Time-series analysis for trend forecasting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-earth" />
                  Data Sources
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-earth mt-1">•</span>
                    Historical crop yield data from government databases
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-earth mt-1">•</span>
                    Real-time weather APIs and satellite imagery
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-earth mt-1">•</span>
                    Soil composition databases and fertility maps
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <span className="font-bold">CropPredict</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CropPredict. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
