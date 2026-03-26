import requests
from bs4 import BeautifulSoup
from datetime import datetime
from supabase import create_client

# Configurações do Supabase (Ajuste com suas variáveis)
SUPABASE_URL = "https://lxvmfpcrpnpowqwofyme.supabase.co"
SUPABASE_KEY = "sb_publishable_6ElMQOaW-Hf9-1HkLTN05g_SlHBT0Ro"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_traffic_data():
    url = "https://g1.globo.com/sp/sao-paulo/transito/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        # O G1 usa 'feed-post-body' para as notícias de trânsito
        posts = soup.find_all('div', class_='feed-post-body')
        
        traffic_reports = []

        for post in posts[:6]: 
            content = post.find('a', class_='feed-post-link')
            if content:
                text = content.text.strip()
                
                # 1. Identificação da Via (Melhorada)
                via = "Outras Vias"
                vias_sp = ["Marginal Tietê", "Marginal Pinheiros", "Radial Leste", "23 de Maio", "Bandeirantes", "Anchieta"]
                for v in vias_sp:
                    if v.lower() in text.lower():
                        via = v
                        break

                # 2. Mapeamento de Status para o Frontend
                # O seu 'LineStatusCard.tsx' usa status específicos, vamos padronizar:
                status_final = "Atenção"
                if "lentidão" in text.lower() or "trânsito" in text.lower():
                    status_final = "Lentidão Moderada"
                if "interrompido" in text.lower() or "grave" in text.lower() or "acidente" in text.lower():
                    status_final = "Engarrafamento Grave"
                if "liberado" in text.lower() or "normal" in text.lower():
                    status_final = "Operação Normal"

                payload = {
                    "road_name": via,
                    "status": status_final,
                    "description": text[:120], # Descrição curta para o card
                    "updated_at": datetime.now().isoformat()
                }

                # 3. Persistência no Supabase (Upsert)
                # IMPORTANTE: A coluna 'road_name' deve ser Unique no banco!
                try:
                    supabase.table('traffic_status').upsert(payload, on_conflict='road_name').execute()
                    traffic_reports.append(payload)
                except Exception as db_err:
                    print(f"Erro ao salvar no Supabase: {db_err}")

        return traffic_reports

    except Exception as e:
        print(f"Erro no scraping G1: {e}")
        return []