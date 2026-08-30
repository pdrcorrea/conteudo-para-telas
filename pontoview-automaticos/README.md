# PontoView • Biblioteca de Painéis

Biblioteca unificada de conteúdo automático para TV corporativa, salas de espera e mídia indoor. Todos os módulos compartilham a mesma linguagem visual PontoView, safe area, responsividade horizontal/vertical e fallbacks para indisponibilidade de fontes externas.

## Política de atualização

A biblioteca foi ajustada para trabalhar bem em players de mídia indoor que recarregam URLs periodicamente.

- Notícias, Saúde e Orientações escolhem um novo conteúdo a cada refresh da página.
- Economia e Sustentabilidade mantêm os dados disponíveis na tela e trocam apenas o destaque principal a cada refresh.
- Cultura e Curiosidades escolhem um novo tema a cada refresh, mas podem paginar automaticamente o texto daquele mesmo tema para permitir leitura confortável.
- Tempo e Hoje consultam os dados ao abrir a página; relógios continuam avançando localmente sem gerar novas consultas.
- Saudações escolhe entre uma saudação do período e uma mensagem de boas-vindas a cada refresh.

O sistema tenta evitar repetir imediatamente o mesmo conteúdo usando armazenamento local do navegador.

## Cache e proteção das APIs

Há duas camadas de cache:

1. `shared/pv.js` mantém respostas no `localStorage` do player. Assim, vários refreshes consecutivos podem reutilizar o mesmo conjunto de dados sem consultar novamente a API externa.
2. O Worker unificado usa a Cloudflare Cache API. Quando publicado, vários players podem compartilhar respostas em cache na borda antes que uma nova consulta seja feita à fonte original.

TTLs atuais do Worker:

- Notícias: 5 minutos
- Tempo: 10 minutos
- Economia: 3 minutos
- Hoje: 1 hora
- Curiosidades: 6 horas
- Cultura: 12 horas
- Sustentabilidade: 6 horas
- Saúde: 6 horas

Respostas antigas também podem ser usadas localmente como fallback temporário quando uma fonte externa falha.

## Painéis disponíveis

- `hoje/` - data, dia da semana, feriados nacionais, estação, dia do ano e próximo feriado.
- `saudacoes/` - bem-vindo, bom dia, boa tarde e boa noite, com cenário adaptado ao horário.
- `hora/` - hora exata, data e localização aproximada.
- `tempo/` - condição atual, próximos dias, sensação térmica, vento, umidade, chuva e alertas meteorológicos. À noite, condições de céu limpo usam lua no lugar do sol.
- `noticias/` - central RSS com múltiplas fontes, imagem, favicon e QR Code.
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
- RadarMeteorológico: alertas meteorológicos usados como apoio ao painel de tempo.
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

Sem o parâmetro, os painéis tentam suas fontes públicas ou fallbacks diretamente e ainda utilizam o cache local do navegador.

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

O projeto usa o logo PontoView disponível em `assets/logo/pontoview-logo-white.png`. O sistema visual base está em `shared/pontoview.css` e `shared/pv.js`, mas cada tema mantém personalidade própria para evitar uma biblioteca de telas visualmente repetitivas.
