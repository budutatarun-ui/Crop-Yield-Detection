import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import heroImage from '@/assets/hero-farm.jpg';
import { 
  ArrowRight, 
  BarChart3, 
  Brain, 
  Users, 
  Leaf, 
  CloudRain, 
  ThermometerSun,
  TrendingUp
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI Powered',
      description: 'Advanced machine learning algorithms analyze multiple factors for accurate predictions.',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: BarChart3,
      title: 'Accurate Predictions',
      description: 'Get reliable yield estimates based on soil, weather, and historical data.',
      color: 'bg-leaf/10 text-leaf',
    },
    {
      icon: Users,
      title: 'Farmer Friendly',
      description: 'Simple, intuitive interface designed for farmers of all technical levels.',
      color: 'bg-earth/10 text-earth',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Farmers Trust Us' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '50+', label: 'Crop Types' },
    { value: '24/7', label: 'Support Available' },
  ];

  const howItWorks = [
    {
      icon: Leaf,
      title: 'Enter Farm Data',
      description: 'Provide details about your soil type, location, and planned cultivation.',
    },
    {
      icon: CloudRain,
      title: 'Add Weather Info',
      description: 'Input rainfall, temperature, and humidity expectations for your region.',
    },
    {
      icon: ThermometerSun,
      title: 'Get AI Analysis',
      description: 'Our AI processes your data using advanced agricultural models.',
    },
    {
      icon: TrendingUp,
      title: 'Receive Predictions',
      description: 'Get accurate yield predictions with confidence scores and recommendations.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Agricultural farmland"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              Powered by Advanced AI
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              AI-Based Crop Yield
              <span className="block text-primary">Prediction System</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Make smarter farming decisions with data-driven insights. Predict your crop yields 
              accurately and optimize your agricultural strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg h-14 px-8 gap-2">
                <Link to={isAuthenticated ? '/predict' : '/register'}>
                  {isAuthenticated ? 'Start Predicting' : 'Get Started Free'}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg h-14 px-8">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-up">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50"
              >
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose CropPredict?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with agricultural expertise 
              to deliver predictions you can trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex p-4 rounded-2xl ${feature.color} mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to get accurate crop yield predictions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative p-6 text-center group"
                >
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="pt-16">
                    <div className="inline-flex p-3 rounded-xl bg-muted mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Optimize Your Farming?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already making smarter decisions with our AI-powered predictions.
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="text-lg h-14 px-8 gap-2"
          >
            <Link to={isAuthenticated ? '/predict' : '/register'}>
              Start Free Today
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
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

export default Home;
