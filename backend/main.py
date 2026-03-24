import threading
import time
from flask import Flask, jsonify
from flask_cors import CORS
from scraper import update_metro_status 
from traffic_monitor import get_bing_traffic_data # Ajustado para o nome da função no seu arquivo
from weather_api import update_weather_data

app = Flask(__name__)
CORS(app) # Permite que seu Next.js acesse a API sem erros de política

# --- WORKER DE ATUALIZAÇÃO (Segundo Plano) ---
def update_worker():
    while True:
        try:
            print(f"[{time.strftime('%H:%M:%S')}] --- Iniciando Ciclo de Atualização ---")
            
            # Atualiza Metrô/CPTM
            update_metro_status()
            
            # Atualiza Trânsito (Bing)
            get_bing_traffic_data()

            # Atualiza Clima
            update_weather_data()
            
            print(f"[{time.strftime('%H:%M:%S')}] --- Ciclo Finalizado com Sucesso ---")
        except Exception as e:
            print(f"ERRO CRÍTICO NO WORKER: {e}")
            
        time.sleep(300) # 5 minutos

# --- ROTAS DA API (Para o Frontend) ---
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "timestamp": time.time()}), 200

# --- EXECUÇÃO ---
if __name__ == "__main__":
    # Inicia o thread de atualização em segundo plano
    # O daemon=True faz com que o thread morra se o script principal for parado
    monitor_thread = threading.Thread(target=update_worker, daemon=True)
    monitor_thread.start()

    # Inicia o servidor Flask
    print("Servidor Backend SP Mobile iniciado na porta 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)