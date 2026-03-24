import requests
import time
from datetime import datetime
from supabase import create_client

# Configurações do Supabase
URL = "https://lxvmfpcrpnpowqwofyme.supabase.co"
KEY = "sb_publishable_6ElMQOaW-Hf9-1HkLTN05g_SlHBT0Ro"
supabase = create_client(URL, KEY)

def get_tomtom_traffic():
    api_key = "dJVIc0A4t91hnzP2X4ihuRGhJ2JfqjSo"
    
    vias = {
        "Marginal Tietê": "-23.516,-46.623",
        "Marginal Pinheiros": "-23.589,-46.708",
        "Rod. Anchieta": "-23.681,-46.591",
        "Rod. Anhanguera": "-23.479,-46.756",
        # Adicione estas novas abaixo:
        "Rod. Ayrton Senna": "-23.486,-46.495",
        "Rod. Castelo Branco": "-23.508,-46.812",
        "Rod. dos Bandeirantes": "-23.447,-46.764",
        "Rod. Imigrantes": "-23.685,-46.612"
    }

    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🔄 Consultando TomTom Traffic...")

    for nome, coords in vias.items():
        # A URL precisa de latitude e longitude invertidas dependendo da versão, 
        # mas o padrão point=lat,lon costuma funcionar.
        url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={api_key}&point={coords}"
        
        try:
            response = requests.get(url)
            data = response.json()
            
            flow = data.get("flowSegmentData", {})
            current_speed = flow.get("currentSpeed", 0)
            free_flow_speed = flow.get("freeFlowSpeed", 1)
            
            ratio = current_speed / free_flow_speed
            
            # Ajustando os status para bater com o visual do seu dashboard
            if ratio > 0.8: status = "TRÁFEGO NORMAL"
            elif ratio > 0.5: status = "LENTIDÃO MODERADA"
            else: status = "ENGARRAFAMENTO"

            # IMPORTANTE: Verifique se 'road_name' é a chave primária no Supabase
            payload = {
                "road_name": nome, 
                "status": status,
                "direction": f"Velocidade: {current_speed} km/h",
                "updated_at": "now()" # Força o banco a usar o horário atual dele
            }

            # Tente forçar o upsert baseado no nome da via
            supabase.table('traffic_status').upsert(payload, on_conflict="road_name").execute()
            print(f"✅ {nome}: {status} ({current_speed}km/h)")

        except Exception as e:
            print(f"❌ Erro na via {nome}: {e}")

if __name__ == "__main__":
    while True:
        get_tomtom_traffic()
        print("zzz... Aguardando 10 min.")
        time.sleep(600)