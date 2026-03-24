from django.apps import AppConfig


class MlModelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.ml_model'
    verbose_name = 'ML Model'
    
    def ready(self):
        """Load ML model when Django starts."""
        from .predict import load_model
        load_model()
