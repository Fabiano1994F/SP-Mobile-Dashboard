import os
import requests
from datetime import datetime
from supabase import create_client

# ✅ Puxando das variáveis de ambiente do painel da Vercel
URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY") # Certifique-se de adicionar esta no Vercel Settings

supabase = create_client(URL, KEY)

def handler(request):
    # São Paulo, SP
    lat, lon = "-23.5505", "-46.6333"
    
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric&lang=pt_br"

    try:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 🌤️ Consultando Previsão do Tempo...")
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            temp = data["main"]["temp"]
            descricao = data["weather"][0]["description"].upper()
            humidade = data["main"]["humidity"]

            payload = {
                "id": 1, # Usamos um ID fixo para apenas atualizar a mesma linha sempre
                "temp": f"{int(temp)}°C",
                "description": descricao,
                "humidity": f"{humidade}%",
                "city": "São Paulo"
            }

            # Upsert para manter sempre apenas um registro atualizado de clima
            supabase.table('weather_status').upsert(payload, on_conflict="id").execute()
            
            return {
                "statusCode": 200,
                "body": {"message": f"Clima atualizado: {temp}°C, {descricao}"}
            }
        else:
            return {
                "statusCode": 500,
                "body": {"error": "Falha na API OpenWeather", "details": data}
            }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": {"error": str(e)}
        }