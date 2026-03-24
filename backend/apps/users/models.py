"""
Custom User Model extending AbstractUser.
Uses email as the primary identifier instead of username.
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password."""
        if not email:
            raise ValueError(_('The Email field must be set'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User Model.
    
    Fields:
    - email: Primary identifier (unique)
    - name: User's full name
    - password: Hashed password
    - created_at: Timestamp of account creation
    """
    
    # Remove username, use email instead
    username = None
    
    email = models.EmailField(
        _('email address'),
        unique=True,
        db_index=True,
        error_messages={
            'unique': _("A user with that email already exists."),
        }
    )
    
    name = models.CharField(
        _('full name'),
        max_length=150,
        blank=True
    )
    
    created_at = models.DateTimeField(
        _('created at'),
        auto_now_add=True
    )
    
    updated_at = models.DateTimeField(
        _('updated at'),
        auto_now=True
    )
    
    # Set email as the unique identifier
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    objects = UserManager()
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the user's full name."""
        return self.name or self.email
    
    def get_short_name(self):
        """Return the user's short name."""
        return self.name.split()[0] if self.name else self.email.split('@')[0]
