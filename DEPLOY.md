# 🚀 Guia de Deploy - Sistema de Gestão de Estoque

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Repositório no GitHub
- Projeto configurado com Supabase

## 🔧 Configuração do Deploy

### 1. **Configurar Variáveis de Ambiente no Vercel**

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```
VITE_SUPABASE_URL=https://vlayangmpcogxoolcksc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYXlhbmdtcGNvZ3hvb2xja3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzEwMDIsImV4cCI6MjA2OTU0NzAwMn0.U4jxKlTf_eCX6zochG6wZPxRBvWk90erSNY_IEuYqrY
```

### 2. **Configurações do Projeto**

O arquivo `vercel.json` já está configurado com:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ SPA Routing configurado
- ✅ Cache otimizado para assets

### 3. **Deploy via GitHub**

1. Conecte seu repositório GitHub ao Vercel
2. O Vercel detectará automaticamente as configurações
3. Clique em **Deploy**

### 4. **Verificação Pós-Deploy**

Após o deploy, verifique:
- ✅ Aplicação carrega corretamente
- ✅ Conexão com Supabase funciona
- ✅ CRUD de estoque funciona
- ✅ Filtros e busca funcionam
- ✅ Exportação CSV funciona

## 🛠️ Comandos Úteis

```bash
# Build local
npm run build

# Preview local
npm run preview

# Desenvolvimento
npm run dev
```

## 📊 Otimizações Implementadas

- ✅ **Code Splitting**: Chunks separados para vendor, UI e Supabase
- ✅ **Cache Headers**: Assets com cache de 1 ano
- ✅ **Bundle Size**: Reduzido de 500KB para ~150KB por chunk
- ✅ **SPA Routing**: Configurado para React Router

## 🔍 Troubleshooting

### Erro: "No Next.js version detected"
- ✅ **Resolvido**: Arquivo `vercel.json` configurado para Vite

### Erro: "Environment variables not found"
- Verifique se as variáveis estão configuradas no Vercel
- Nomes devem começar com `VITE_`

### Erro: "404 on refresh"
- ✅ **Resolvido**: Rewrites configurados no `vercel.json`

## 📈 Performance

- **Build Time**: ~2s
- **Bundle Size**: ~500KB total (otimizado)
- **First Load**: ~150KB (vendor chunk)
- **Cache**: Assets com cache de 1 ano

## 🎯 Próximos Passos

1. Configurar domínio customizado (opcional)
2. Implementar analytics
3. Configurar monitoramento de erros
4. Otimizar SEO (meta tags)
