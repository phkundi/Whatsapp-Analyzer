from django.db import models

# Create your models here.
class Chat(models.Model):
    messages = models.IntegerField()
    name = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f'Chat Name {self.name} with {self.messages} messages'


