# PontoView Conteúdos Automáticos

Coleção de cinco painéis para TV corporativa, sala de espera e mídia indoor, com visual PontoView, responsividade horizontal/vertical, transições suaves e fallback para indisponibilidade de fontes externas.

## Painéis

- `hoje/` - data, dia da semana, feriados nacionais, estação, dia do ano e próximo feriado.
- `curiosidades/` - curiosidades obtidas de conteúdo aberto da Wikipédia, com filtro básico para temas inadequados a ambientes públicos.
- `cultura/` - arte, arquitetura, música, literatura, museus e patrimônio cultural brasileiro.
- `economia/` - dólar, euro, Bitcoin, Selic e índices oficiais disponíveis.
- `sustentabilidade/` - potencial solar configurável por coordenadas e indicadores ambientais do Brasil.

## Fontes abertas e gratuitas

- BrasilAPI: feriados e taxas públicas disponíveis.
- AwesomeAPI Economia: cotações de moedas e Bitcoin.
- Wikimedia / Wikipédia: conteúdo enciclopédico e imagens quando disponíveis.
- NASA POWER: radiação solar diária por coordenadas.
- World Bank Indicators API: séries ambientais do Brasil.

As fontes podem alterar formato ou disponibilidade sem aviso. Por isso, todos os painéis possuem fallback visual e tratamento de ausência de dados. Conteúdo da Wikimedia deve respeitar as condições de atribuição e licenciamento aplicáveis às páginas e imagens utilizadas.

## API opcional no Cloudflare Worker

O diretório contém `src/index.js` e `wrangler.json` para publicar um Worker único com os endpoints:

- `/api/hoje`
- `/api/curiosidades`
- `/api/cultura`
- `/api/economia`
- `/api/sustentabilidade`
- `/health`

Os painéis também tentam consultar as fontes públicas diretamente quando o Worker não é informado. Para usar o Worker, acrescente o parâmetro `api` à URL do painel.

Exemplo:

```text
/economia/?api=https://pontoview-conteudos-api.seu-subdominio.workers.dev
```

## Sustentabilidade por cidade

O painel aceita localização por query string para obter o indicador solar da posição configurada:

```text
/sustentabilidade/?cidade=Minha%20Cidade&lat=-20.0000&lon=-40.0000
```

Também pode ser combinado com o parâmetro `api`.

## Estrutura

```text
pontoview-automaticos/
├── index.html
├── hoje/
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

## Identidade visual

O projeto usa o logo PontoView já presente em `assets/logo/pontoview-logo-white.png` no repositório principal. Os painéis mantêm a linguagem visual PontoView, com fundo azul, tipografia de alta leitura para TV, safe area, animações discretas, transições editoriais e adaptação a 16:9 e 9:16.
