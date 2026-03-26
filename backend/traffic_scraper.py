import requests
from bs4 import BeautifulSoup
import time
from datetime import datetime
from supabase import create_client

# Configurações do Supabase 
URL = "https://lxvmfpcrpnpowqwofyme.supabase.co"
KEY = "sb_publishable_6ElMQOaW-Hf9-1HkLTN05g_SlHBT0Ro"
supabase = create_client(URL, KEY)

# Cabeçalho para o site não bloquear o robô
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def scrape_sp_traffic():
    # Exemplo: Site da CET ou de portais de trânsito (G1/Mobilidade)
    # Aqui usamos uma URL de exemplo que lista lentidão
    url = "https://cge.sp.gov.br/v2/pontos-de-alerta.php" 
    
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🔍 Iniciando varredura de trânsito...")

    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Simulando a extração de uma lista de vias (Ajuste conforme o site escolhido)
        # O segredo é iterar sobre elementos comuns (linhas de tabela ou divs de card)
        vias_alvo = ["Marginal Tietê", "Marginal Pinheiros", "Av. 23 de Maio", "Radial Leste"]
        
        for via in vias_alvo:
            # Lógica de Busca: Procuramos o texto da via dentro do HTML
            status = "Fluindo"
            detalhe = "Trânsito normal na região."

            # Se o nome da via aparecer no site em um contexto de 'lentidão' ou 'alerta'
            if soup.find(text=lambda t: via.lower() in t.lower()):
                status = "Lentidão" # Simplificação para o dashboard
                detalhe = "Ponto de atenção detectado pelo CGE."

            payload = {
                "road_name": via,
                "status": status,
                "direction": detalhe,
                "updated_at": datetime.now().isoformat()
            }

            # Envia para o Supabase
            try:
                supabase.table('traffic_status').upsert(payload).execute()
                print(f"✅ {via}: {status}")
            except Exception as e:
                print(f"⚠️ Erro ao salvar {via}: {e}")

    except Exception as e:
        print(f"❌ Falha ao acessar o site: {e}")

if __name__ == "__main__":
    while True:
        scrape_sp_traffic()
        print("zzz... Próxima coleta em 10 minutos.")
        time.sleep(600)