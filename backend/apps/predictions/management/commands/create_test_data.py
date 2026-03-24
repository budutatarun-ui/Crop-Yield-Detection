from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from django.db.models.functions import TruncMonth
from django.db.models import Avg, Count
from apps.predictions.models import Prediction

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test data for testing prediction trends'

    def handle(self, *args, **options):
        # Create test user if not exists
        user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'name': 'Test User',
            }
        )
        
        if created:
            user.set_password('testpass123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.email}'))
        else:
            self.stdout.write(f'User already exists: {user.email}')
        
        # Clear existing predictions for this user
        Prediction.objects.filter(user=user).delete()
        self.stdout.write('Cleared existing predictions')
        
        # Create some test predictions with different dates spanning multiple months
        test_predictions = [
            {
                'crop_type': 'RICE',
                'location': 'West Bengal',
                'soil_type': 'LOAMY',
                'season': 'KHARIF',
                'rainfall': 2000,
                'temperature': 28,
                'humidity': 75,
                'fertilizer': 150,
                'pesticide': 50,
                'area': 10,
                'predicted_yield': 45.8,
            },
            {
                'crop_type': 'WHEAT',
                'location': 'Punjab',
                'soil_type': 'CLAY',
                'season': 'RABI',
                'rainfall': 500,
                'temperature': 20,
                'humidity': 60,
                'fertilizer': 120,
                'pesticide': 30,
                'area': 15,
                'predicted_yield': 32.5,
            },
            {
                'crop_type': 'MAIZE',
                'location': 'Maharashtra',
                'soil_type': 'SANDY',
                'season': 'SUMMER',
                'rainfall': 800,
                'temperature': 25,
                'humidity': 65,
                'fertilizer': 100,
                'pesticide': 40,
                'area': 8,
                'predicted_yield': 28.3,
            },
            {
                'crop_type': 'RICE',
                'location': 'Andhra Pradesh',
                'soil_type': 'LOAMY',
                'season': 'KHARIF',
                'rainfall': 1800,
                'temperature': 30,
                'humidity': 80,
                'fertilizer': 160,
                'pesticide': 45,
                'area': 12,
                'predicted_yield': 52.1,
            },
            {
                'crop_type': 'WHEAT',
                'location': 'Uttar Pradesh',
                'soil_type': 'SILT',
                'season': 'RABI',
                'rainfall': 600,
                'temperature': 18,
                'humidity': 55,
                'fertilizer': 130,
                'pesticide': 35,
                'area': 20,
                'predicted_yield': 38.7,
            }
        ]
        
        # Create new predictions with different dates
        import calendar
        current_date = datetime.now()
        
        for i, pred_data in enumerate(test_predictions):
            # Create predictions spanning the last 5 months
            target_month = current_date.month - i - 1
            target_year = current_date.year
            
            if target_month <= 0:
                target_month += 12
                target_year -= 1
                
            # Create date on the 15th of the target month
            from django.utils import timezone
            created_date = timezone.make_aware(datetime(target_year, target_month, 15))
            
            # Remove created_at from pred_data if it exists
            pred_data_copy = pred_data.copy()
            if 'created_at' in pred_data_copy:
                del pred_data_copy['created_at']
            
            prediction = Prediction.objects.create(
                user=user,
                **pred_data_copy
            )
            
            # Manually set the created_at timestamp
            Prediction.objects.filter(id=prediction.id).update(created_at=created_date)
            prediction.refresh_from_db()
            
            self.stdout.write(f'Created prediction: {prediction.crop_type} - {prediction.predicted_yield} ({prediction.created_at.strftime("%b %Y")})')
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(test_predictions)} test predictions'))
        
        # Test the trends query
        trends_data = Prediction.objects.filter(user=user).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            predictions=Count('id'),
            avg_yield=Avg('predicted_yield')
        ).order_by('month')
        
        self.stdout.write('\nTrends data:')
        for trend in trends_data:
            month_name = trend['month'].strftime('%b %Y') if trend['month'] else 'Unknown'
            self.stdout.write(f'  {month_name}: {trend["predictions"]} predictions, avg yield: {trend["avg_yield"]:.2f}')
