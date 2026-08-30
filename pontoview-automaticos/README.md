# PontoView • Biblioteca de Painéis

Biblioteca unificada de conteúdo automático para TV corporativa, salas de espera e mídia indoor. Todos os módulos compartilham a mesma linguagem visual PontoView, safe area, transições, responsividade horizontal/vertical e fallbacks para indisponibilidade de fontes externas.

## Painéis disponíveis

- `hoje/` - data, dia da semana, feriados nacionais, estação, dia do ano e próximo feriado.
- `saudacoes/` - bem-vindo, bom dia, boa tarde e boa noite, com cenário adaptado ao horário.
- `hora/` - hora exata, data e localização aproximada.
- `tempo/` - condição atual, próximos dias, sensação térmica, vento, umidade, chuva e alertas meteorológicos. À noite, condições de céu limpo usam lua no lugar do sol.
- `noticias/` - central RSS com múltiplas fontes, imagem, favicon, QR Code e tempo de leitura adaptativo.
- `saude/` - dicas de saúde e bem-estar com conteúdo local e fonte remota opcional.
- `orientacoes/` - mensagens de convivência, atendimento, segurança e boas práticas.
- `curiosidades/` - curiosidades em formato editorial de múltiplas páginas para leitura confortável.
- `cultura/` - arte, arquitetura, música, literatura e patrimônio em narrativa visual paginada.
- `economia/` - dólar, euro, Bitcoin, Selic e IPCA, com ícones e animações de alta e queda.
- `sustentabilidade/` - energia solar, renováveis, cobertura florestal e emissões, com identidade visual ambiental.

## Fontes gratuitas utilizadas

- BrasilAPI: feriados e taxas públicas disponíveis.
- AwesomeAPI Economia: cotações de moedas e Bitcoin.
- Wikimedia / Wikipédia: conteúdo enciclopédico e imagens quando disponíveis.
- NASA POWER: radiação solar diária por coordenadas.
- World Bank Indicators API: séries ambientais do Brasil.
- Open-Meteo: previsão meteorológica.
- RadarMeteorológico: API gratuita que reproduz alertas oficiais do INMET; o painel mantém crédito à fonte e recomenda INMET/Defesa Civil para situações de emergência.
- Worker PontoNews existente: agregação RSS de notícias.
- Worker Dicas de Saúde existente: conteúdo remoto adicional de saúde.

Fontes externas podem alterar formato ou disponibilidade. Por isso, os painéis foram construídos com fallbacks e degradação progressiva. Conteúdo e imagens da Wikimedia devem respeitar as licenças aplicáveis às páginas e arquivos utilizados.

## Cloudflare Worker unificado

`src/index.js` pode ser publicado como um Worker único. Endpoints atuais:

- `/api/hoje`
- `/api/curiosidades`
- `/api/cultura`
- `/api/economia`
- `/api/sustentabilidade`
- `/api/noticias`
- `/api/saude`
- `/api/tempo`
- `/health`

Para os módulos que usam `PV.fromApi`, informe a URL do Worker com `?api=`:

```text
/economia/?api=https://pontoview-conteudos-api.seu-subdominio.workers.dev
```

Sem o parâmetro, os painéis tentam suas fontes públicas ou fallbacks diretamente.

## Parâmetros úteis

### Sustentabilidade

```text
/sustentabilidade/?cidade=Colatina&lat=-19.5394&lon=-40.6306
```

### Previsão do tempo

Pode trabalhar por geolocalização aproximada ou receber valores fixos:

```text
/tempo/?cidade=Colatina&uf=ES&lat=-19.5394&lon=-40.6306
```

Opcionalmente, `ibge=` pode ser informado para facilitar a identificação de alertas locais.

### Saudações

O nome de uma empresa, recepção ou ambiente pode ser acrescentado:

```text
/saudacoes/?nome=PontoView
```

## Estrutura

```text
pontoview-automaticos/
├── index.html
├── hoje/
├── saudacoes/
├── hora/
├── tempo/
├── noticias/
├── saude/
├── orientacoes/
├── curiosidades/
├── cultura/
├── economia/
├── sustentabilidade/
├── shared/
│   ├── pontoview.css
│   └── pv.js
├── src/
│   └── index.js
└── wrangler.json
```

## Origem dos módulos consolidados

Esta biblioteca reúne e reinterpreta, dentro do mesmo padrão visual, funcionalidades dos projetos independentes `pontoview-orientacoes`, `pontoview-dicasdesaude`, `pontonews-panel`, `HoraExata` e `PrevisaoDoTempo`, além dos novos módulos automáticos.

## Identidade visual

O projeto usa o logo PontoView disponível em `assets/logo/pontoview-logo-white.png`. O sistema visual base está em `shared/pontoview.css` e `shared/pv.js`, mas cada tema ganhou personalidade própria para evitar uma biblioteca de telas visualmente repetitivas.
