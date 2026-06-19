# 🖥️ ConteúdoParaTelas — PontoView Mídia Indoor

Sistema de mídia indoor da PontoView, integrado à plataforma **AdeusPendrive** para gestão remota de telas.

## 📁 Estrutura do Projeto

```
conteudo-para-telas/
├── ConteudoParaTelas.html     # Landing page principal
├── ComoUsar.html              # Tutorial de onboarding (Como Usar)
├── PainelDeControle.html      # Ghost page — painel de chamados para clientes
├── assets/
│   ├── logo/                  # Logotipos da marca PontoView
│   └── images/                # Imagens das páginas
└── README.md
```

## 📄 Páginas

| Arquivo | Descrição |
|---|---|
| `ConteudoParaTelas.html` | Landing page de conversão com planos e CTA |
| `ComoUsar.html` | Passo a passo de uso do sistema AdeusPendrive |
| `PainelDeControle.html` | Painel ghost para recebimento de chamados de clientes |

## ⚙️ Backend

O **PainelDeControle** utiliza o mesmo backend do **BusBoard** no Supabase, compartilhando:
- Autenticação (criação de conta / login)
- Controle de conta e perfil
- Pagamentos (Mercado Pago)
- Encerramento / cancelamento de plano

## 🔗 LGPD

As páginas de conformidade legal (Política de Privacidade e Termos de Uso) são reaproveitadas do projeto **BusBoard**.

## 🛠️ Tech Stack

- HTML5 / CSS3 / JavaScript
- Supabase (Auth, Database, Storage)
- Mercado Pago (Pagamentos)
- AdeusPendrive (Gestão de telas)
- Cloudflare Pages (Hospedagem)

## 🌐 Ecossistema PontoView

Este projeto faz parte do ecossistema PontoView de soluções de comunicação visual:
- [pontoview-system](https://github.com/pdrcorrea/pontoview-system)
- [pontoview-news-overlay](https://github.com/pdrcorrea/pontoview-news-overlay)
- [pontonews-panel](https://github.com/pdrcorrea/pontonews-panel)
