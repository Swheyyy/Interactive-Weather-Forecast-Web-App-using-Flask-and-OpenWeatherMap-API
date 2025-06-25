from flask import Flask, render_template, request
import requests
from datetime import datetime

app = Flask(__name__)

API_KEY = 'b7fc655555c074d8502af6c601e4a839'  
BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

@app.route('/', methods=['GET', 'POST'])
def index():
    weather_data = None

    if request.method == 'POST':
        city = request.form.get('city')
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'
        }
        response = requests.get(BASE_URL, params=params)
        if response.ok:
            data = response.json()
            weather_data = {
                'city': city.title(),
                'temperature': data['main']['temp'],
                'feels_like': data['main']['feels_like'],
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'],
                'pressure': data['main']['pressure'],
                'description': data['weather'][0]['description'].title(),
                'icon': data['weather'][0]['icon'],
                'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M:%S'),
                'sunset': datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M:%S')
            }
        else:
            weather_data = {'error': 'City not found!'}

    return render_template('index.html', weather=weather_data)

if __name__ == '__main__':
    app.run(debug=True)
