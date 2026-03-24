"""
Machine Learning Model Training Script
Trains a Random Forest model for crop yield prediction.
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os


class CropYieldPredictor:
    """Crop Yield Prediction Model Trainer."""
    
    def __init__(self, data_path):
        """
        Initialize the predictor with dataset path.
        
        Args:
            data_path (str): Path to the CSV dataset
        """
        self.data_path = data_path
        self.model = None
        self.label_encoders = {}
        self.feature_columns = None
        self.target_column = 'Yield'
    
    def load_data(self):
        """Load and prepare the dataset."""
        print("Loading data...")
        self.df = pd.read_csv(self.data_path)
        
        # Remove carriage returns from column names
        self.df.columns = self.df.columns.str.strip()
        
        print(f"Dataset shape: {self.df.shape}")
        print(f"Columns: {list(self.df.columns)}")
        
        # Display basic statistics
        print("\nDataset Info:")
        print(self.df.info())
        print("\nFirst few rows:")
        print(self.df.head())
        
        return self
    
    def preprocess_data(self):
        """Preprocess the data for training."""
        print("\nPreprocessing data...")
        
        # Handle missing values
        print(f"Missing values before:\n{self.df.isnull().sum()}")
        
        # Fill missing values with median for numeric columns
        numeric_columns = self.df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            self.df[col].fillna(self.df[col].median(), inplace=True)
        
        # Fill missing values with mode for categorical columns
        categorical_columns = self.df.select_dtypes(include=['object']).columns
        for col in categorical_columns:
            self.df[col].fillna(self.df[col].mode()[0], inplace=True)
        
        print(f"Missing values after:\n{self.df.isnull().sum()}")
        
        # Encode categorical variables
        categorical_features = ['Crop', 'Season', 'State']
        
        for feature in categorical_features:
            if feature in self.df.columns:
                le = LabelEncoder()
                self.df[feature] = le.fit_transform(self.df[feature].astype(str))
                self.label_encoders[feature] = le
                print(f"Encoded {feature}: {len(le.classes_)} unique values")
        
        # Select features for training
        self.feature_columns = [
            'Crop', 'Season', 'State', 'Area',
            'Annual_Rainfall', 'Fertilizer', 'Pesticide'
        ]
        
        # Ensure all feature columns exist
        missing_cols = [col for col in self.feature_columns if col not in self.df.columns]
        if missing_cols:
            print(f"Warning: Missing columns {missing_cols}")
            self.feature_columns = [col for col in self.feature_columns if col in self.df.columns]
        
        print(f"Feature columns: {self.feature_columns}")
        print(f"Target column: {self.target_column}")
        
        return self
    
    def split_data(self, test_size=0.2, random_state=42):
        """Split data into training and testing sets."""
        print(f"\nSplitting data (test_size={test_size})...")
        
        X = self.df[self.feature_columns]
        y = self.df[self.target_column]
        
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )
        
        print(f"Training set size: {len(self.X_train)}")
        print(f"Testing set size: {len(self.X_test)}")
        
        return self
    
    def train_model(self, n_estimators=100, random_state=42):
        """Train the Random Forest model."""
        print("\nTraining Random Forest model...")
        
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            random_state=random_state,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            n_jobs=-1,
            verbose=1
        )
        
        self.model.fit(self.X_train, self.y_train)
        
        print("Model training completed!")
        
        return self
    
    def evaluate_model(self):
        """Evaluate the model performance."""
        print("\nEvaluating model...")
        
        # Make predictions
        y_train_pred = self.model.predict(self.X_train)
        y_test_pred = self.model.predict(self.X_test)
        
        # Calculate metrics
        train_r2 = r2_score(self.y_train, y_train_pred)
        test_r2 = r2_score(self.y_test, y_test_pred)
        
        train_rmse = np.sqrt(mean_squared_error(self.y_train, y_train_pred))
        test_rmse = np.sqrt(mean_squared_error(self.y_test, y_test_pred))
        
        train_mae = mean_absolute_error(self.y_train, y_train_pred)
        test_mae = mean_absolute_error(self.y_test, y_test_pred)
        
        print("\n" + "="*50)
        print("MODEL EVALUATION RESULTS")
        print("="*50)
        print(f"\nTraining Set:")
        print(f"  R² Score: {train_r2:.4f}")
        print(f"  RMSE: {train_rmse:.4f}")
        print(f"  MAE: {train_mae:.4f}")
        
        print(f"\nTesting Set:")
        print(f"  R² Score: {test_r2:.4f}")
        print(f"  RMSE: {test_rmse:.4f}")
        print(f"  MAE: {test_mae:.4f}")
        print("="*50)
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nFeature Importance:")
        print(feature_importance)
        
        return self
    
    def save_model(self, output_path='crop_model.pkl'):
        """Save the trained model."""
        print(f"\nSaving model to {output_path}...")
        
        # Save the entire model
        joblib.dump(self.model, output_path)
        
        print(f"Model saved successfully!")
        print(f"Model file size: {os.path.getsize(output_path) / 1024:.2f} KB")
        
        return self
    
    def test_prediction(self):
        """Test the model with sample predictions."""
        print("\nTesting predictions...")
        
        # Get a few samples from test set
        sample_indices = np.random.choice(len(self.X_test), size=5, replace=False)
        samples = self.X_test.iloc[sample_indices]
        actual_yields = self.y_test.iloc[sample_indices]
        
        predictions = self.model.predict(samples)
        
        print("\nSample Predictions:")
        print("-" * 70)
        for i, (idx, pred, actual) in enumerate(zip(sample_indices, predictions, actual_yields)):
            error = abs(pred - actual)
            error_pct = (error / actual * 100) if actual != 0 else 0
            print(f"Sample {i+1}:")
            print(f"  Predicted: {pred:.2f} | Actual: {actual:.2f} | Error: {error:.2f} ({error_pct:.1f}%)")
        print("-" * 70)


def main():
    """Main training pipeline."""
    print("="*70)
    print("CROP YIELD PREDICTION MODEL TRAINING")
    print("="*70)
    
    # Path to dataset
    data_path = 'crop_yield.csv'
    
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        print("Please ensure the dataset file is in the correct location.")
        return
    
    # Initialize and train
    predictor = CropYieldPredictor(data_path)
    
    predictor.load_data()
    predictor.preprocess_data()
    predictor.split_data(test_size=0.2)
    predictor.train_model(n_estimators=100)
    predictor.evaluate_model()
    predictor.test_prediction()
    predictor.save_model('crop_model.pkl')
    
    print("\n" + "="*70)
    print("TRAINING COMPLETED SUCCESSFULLY!")
    print("="*70)


if __name__ == "__main__":
    main()
