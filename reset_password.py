from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(username='admin')
u.set_password('NewPass123!')
u.save()
print('Password changed to: NewPass123!')
