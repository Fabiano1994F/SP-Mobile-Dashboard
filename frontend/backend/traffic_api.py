import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS
from supabase import create_client

app = Flask(__name__)
CORS(app)  # Permite que seu frontend acesse a API

# Configurações do Supabase e TomTom
URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
API_KEY_TOMTOM = os.getenv("NEXT_PUBLIC_TOMTOM_API_KEY")

# Inicializa o cliente Supabase
supabase = create_client(URL, KEY)

@app.route('/update-traffic', methods=['GET'])
def update_traffic():
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
    
    if not API_KEY_TOMTOM:
        return jsonify({"error": "Chave da TomTom não configurada"}), 500

    for nome, coords in vias.items():
        url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key={API_KEY_TOMTOM}&point={coords}"
        
        try:
            response = requests.get(url, timeout=10)
            data = response.json()
            
            flow = data.get("flowSegmentData", {})
            current_speed = flow.get("currentSpeed", 0)
            free_flow_speed = flow.get("freeFlowSpeed", 1) # Evita divisão por zero
            
            # Cálculo de tráfego
            ratio = current_speed / free_flow_speed
            
            if ratio > 0.8: status = "TRÁFEGO NORMAL"
            elif ratio > 0.5: status = "LENTIDÃO MODERADA"
            else: status = "ENGARRAFAMENTO"

            payload = {
                "road_name": nome, 
                "status": status,
                "direction": f"Velocidade: {current_speed} km/h"
            }

            # Upsert no Supabase
            supabase.table('traffic_status').upsert(payload, on_conflict="road_name").execute()
            results.append({"via": nome, "status": "sucesso"})

        except Exception as e:
            results.append({"via": nome, "status": f"erro: {str(e)}"})

    return jsonify({
        "message": "Atualização concluída", 
        "detalhes": results
    }), 200

# Rota padrão para teste
@app.route('/')
def health_check():
    return "API SP Mobility está online!", 200

if __name__ == "__main__":
    # O Render exige que a porta seja dinâmica via variável de ambiente
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)