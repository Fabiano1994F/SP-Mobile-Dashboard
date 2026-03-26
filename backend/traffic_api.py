import os
import requests
from datetime import datetime
from supabase import create_client

# ✅ Puxando das variáveis de ambiente que configuramos na Vercel
URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
API_KEY_TOMTOM = os.getenv("NEXT_PUBLIC_TOMTOM_API_KEY")

supabase = create_client(URL, KEY)

def handler(request): # O Vercel chama essa função 'handler'
    vias = {
        "Marginal Tietê": "-23.516,-46.623",
        "Marginal Pinheiros": "-23.589,-46.708",
        "Rod. Anchieta": "-23.681,-46.591",
        "Rod. Anhanguera": "-23.479,-46.756",
        "Rod. Ayrton Senna": "-23.486,-46.495",
        "Rod. Castelo Branco": "-23.508,-46.812",
        "Rod. dos Bandeirantes": "-23.447,-46.764",
        "Rod. Imigrantes": "-23.685,-46.612"
    }

    results = []
    for nome, coords in vias.items():
        url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={API_KEY_TOMTOM}&point={coords}"
        
        try:
            response = requests.get(url)
            data = response.json()
            
            flow = data.get("flowSegmentData", {})
            current_speed = flow.get("currentSpeed", 0)
            free_flow_speed = flow.get("freeFlowSpeed", 1)
            
            ratio = current_speed / free_flow_speed
            
            if ratio > 0.8: status = "TRÁFEGO NORMAL"
            elif ratio > 0.5: status = "LENTIDÃO MODERADA"
            else: status = "ENGARRAFAMENTO"

            payload = {
                "road_name": nome, 
                "status": status,
                "direction": f"Velocidade: {current_speed} km/h"
                # Removi o updated_at pois o Supabase pode gerar o default(now()) no banco
            }

            # Faz o Upsert no banco
            supabase.table('traffic_status').upsert(payload, on_conflict="road_name").execute()
            results.append({"via": nome, "status": "sucesso"})

        except Exception as e:
            results.append({"via": nome, "status": f"erro: {str(e)}"})

    return {
        "statusCode": 200,
        "body": {"message": "Atualização concluída", "detalhes": results}
    }