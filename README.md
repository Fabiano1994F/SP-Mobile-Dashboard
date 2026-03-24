🚦 SP Mobility Dashboard
O SP Mobility Dashboard é uma plataforma em tempo real que monitora as condições de tráfego das principais vias e rodovias de São Paulo. Integrando dados oficiais da API TomTom, o sistema oferece uma visão clara e rápida para motoristas e gestores de logística.

🚀 Funcionalidades
Monitoramento em Tempo Real: Atualização automática do tráfego a cada 10 minutos (configurável).

Status Inteligente: Classificação automática entre "Tráfego Normal", "Lentidão Moderada" e "Engarrafamento" baseado na velocidade real vs. velocidade de fluxo livre.

Dados de Velocidade: Exibição da velocidade média atual em cada trecho monitorado.

Interface Dark Mode: Design moderno focado em legibilidade e baixo cansaço visual.

🛠️ Tecnologias Utilizadas
Frontend
Next.js 14/15: Framework React para uma interface rápida e otimizada.

Tailwind CSS: Estilização moderna e responsiva.

Lucide React: Ícones minimalistas para interface.

Backend & Dados
Python: Script automatizado para consumo de dados.

Supabase: Banco de dados PostgreSQL com capacidades em tempo real.

TomTom Traffic API: Fonte oficial de dados de tráfego mundial.

🏗️ Arquitetura do Projeto
O projeto funciona em um modelo de Pipeline de Dados:

O script Python (traffic_api.py) solicita dados da TomTom API.

O script processa a velocidade e calcula o status da via.

Os dados são enviados para o Supabase via upsert (evitando duplicidade).

O Next.js consome a tabela do Supabase e reflete as mudanças instantaneamente para o usuário.

🔧 Como Rodar o Projeto
Backend (Python)
Instale as dependências: pip install requests supabase

Configure suas chaves no arquivo ou via .env.

Rode o script: python traffic_api.py

Frontend (Next.js)
Instale as dependências: npm install

Rode em desenvolvimento: npm run dev

👨‍💻 Autor
Fabiano Santos Desenvolvedor Full Stack & Especialista em TI