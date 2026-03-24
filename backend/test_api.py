import requests

def check_metro():
    url = "https://www.diretooficial.com.br/api/status" # Uma alternativa pública comum
    try:
        response = requests.get(url)
        dados = response.json()
        print("Dados recebidos com sucesso!")
        return dados
    except Exception as e:
        print(f"Erro ao conectar: {e}")

if __name__ == "__main__":
    check_metro()
    