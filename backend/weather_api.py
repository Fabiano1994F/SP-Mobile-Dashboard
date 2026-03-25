import os
import requests
from datetime import datetime
from supabase import create_client

def update_weather_data():
    # 1. Credenciais via Variáveis de Ambiente (Configuradas no Painel da Vercel)
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    API_KEY = os.getenv("OPENWEATHER_API_KEY")

    # Verificação de segurança: evita que o código rode se as chaves não estiverem no sistema
    if not all([SUPABASE_URL, SUPABASE_KEY, API_KEY]):
        return "❌ Erro: Variáveis de ambiente faltando (verifique o painel da Vercel)."

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Configuração da consulta (São Paulo)
    CITY = "Sao Paulo,BR"
    url = f"https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric&lang=pt_br"

    try:
        response = requests.get(url, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            payload = {
                "id": 1, # Mantemos o ID 1 para que o Upsert sempre atualize a mesma linha
                "city": "São Paulo",
                "temp": round(data['main']['temp']),
                "condition": data['weather'][0]['description'].capitalize(),
                "icon_code": data['weather'][0]['icon'],
                "humidity": data['main']['humidity'],
                "updated_at": datetime.now().isoformat()
            }

            # Upsert no Supabase: Se o ID 1 existir, ele atualiza; se não, cria.
            supabase.table("weather_status").upsert(payload).execute()
            
            return f"✅ Sucesso! Clima em SP: {payload['temp']}°C - {payload['condition']}"
        else:
            return f"❌ Erro na API OpenWeather: {response.status_code} - {response.text}"

    except Exception as e:
        return f"❌ Erro crítico na execução: {str(e)}"

# A Vercel executa este bloco ao rodar o script (via Cron Job ou acesso direto)
if __name__ == "__main__":
    result = update_weather_data()
    print(result)