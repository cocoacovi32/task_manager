import requests
import json

try:
    resp = requests.post(
        'http://localhost:8000/api/token/',
        json={'username': 'admin', 'password': 'Password123'},
        timeout=10
    )
    print(f'Status Code: {resp.status_code}')
    if resp.status_code == 200:
        print('LOGIN SUCCESS!')
        print(json.dumps(resp.json(), indent=2))
    else:
        print('LOGIN FAILED!')
        print(f'Response: {resp.text}')
except Exception as e:
    print(f'Error: {type(e).__name__}: {str(e)}')
