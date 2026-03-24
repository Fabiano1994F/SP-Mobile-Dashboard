import requests
import time # Importado para o delay
from datetime import datetime
from supabase import create_client

# Credenciais (Mantenha as suas)
SUPABASE_URL = "https://lxvmfpcrpnpowqwofyme.supabase.co"
SUPABASE_KEY = "sb_publishable_6ElMQOaW-Hf9-1HkLTN05g_SlHBT0Ro" 
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_weather_data():
    API_KEY = "bb9038e8118e222a650ec1b728864689"
    # Usando o ID da cidade ou nome formatado para evitar erros
    CITY = "Sao Paulo,BR"
    url = f"https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric&lang=pt_br"

    try:
        response = requests.get(url, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            payload = {
                "id": 1,
                "city": "São Paulo",
                "temp": round(data['main']['temp']), # Arredonda para ficar limpo no dashboard
                "condition": data['weather'][0]['description'].capitalize(),
                "icon_code": data['weather'][0]['icon'],
                "humidity": data['main']['humidity'],
                "updated_at": datetime.now().isoformat()
            }

            # Tenta dar o Upsert no Supabase
            result = supabase.table("weather_status").upsert(payload).execute()
            print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Sucesso! Clima: {payload['temp']}°C - {payload['condition']}")
        else:
            print(f"❌ Erro na API OpenWeather: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"❌ Erro crítico na conexão: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando monitoramento de clima SP...")
    while True:
        update_weather_data()
        # Aguarda 15 minutos (900 segundos) antes de atualizar de novo
        # Evita banimento da API gratuita e economiza requisições no Supabase
        print("Zzz... Próxima atualização em 15 minutos.")
        time.sleep(900)