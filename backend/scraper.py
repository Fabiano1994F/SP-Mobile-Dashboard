import requests
from bs4 import BeautifulSoup
from datetime import datetime
from supabase import create_client, Client

# Suas credenciais já configuradas
SUPABASE_URL = "https://lxvmfpcrpnpowqwofyme.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dm1mcGNycG5wb3dxd29meW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDkyNjksImV4cCI6MjA4OTAyNTI2OX0.k1KH6BZAT87xYOeFl-2I3nMCzCLIripYxZJZx2q2LCA" 
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_metro_status():
    print("--- 🚇 Iniciando Scraping Real: Direto do Metrô ---")
    url = "https://www.diretodometro.com.br/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        # O site organiza as linhas dentro de divs ou listas
        # Vamos buscar os elementos que contêm o nome e o status
        linhas_html = soup.find_all('div', class_='linha') # Seletor comum nesse site

        for item in linhas_html:
            # Extraindo o nome (ex: "Linha 1 - Azul")
            nome_raw = item.find('span', class_='nome').text.strip()
            
            # Extraindo o status (ex: "Operação Normal")
            status_raw = item.find('span', class_='status').text.strip()

            # Limpeza rápida para manter o padrão do seu frontend
            nome = nome_raw.replace(" - ", "-") 
            
            payload = {
                "name": nome,
                "status": status_raw,
                "updated_at": datetime.now().isoformat()
            }

            # Upsert no Supabase
            supabase.table("linha_status").upsert(
                payload, 
                on_conflict="name"
            ).execute()
            
            print(f"✅ {nome}: {status_raw}")

        print("--- ✨ Banco de Dados Atualizado com Sucesso ---")

    except Exception as e:
        print(f"❌ Erro no Scraping: {e}")

if __name__ == "__main__":
    update_metro_status()