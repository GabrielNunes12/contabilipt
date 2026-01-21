# PRD: Calculadora Fiscal para Tech Contractors (Portugal)

## 1. Visão Geral
**Nome do Produto:** Contabilipt Calculator (Nome Provisório)
**Objetivo:** Ajudar trabalhadores independentes e contractors de TI em Portugal a simular cenários financeiros complexos e decidir o melhor regime fiscal (Recibos Verdes vs. Unipessoal), convertendo essa utilidade em assinaturas premium.
**Modelo de Negócio:** Freemium (Calculadora Básica Grátis + Otimização Premium).

## 2. O Problema
A fiscalidade para contractors em Portugal é complexa e burocrática. Profissionais com rendimentos elevados (> €30k/ano) frequentemente perdem dinheiro por não saberem o "ponto de viragem" exato entre manter-se em Recibos Verdes ou abrir uma empresa Unipessoal (Lda).

## 3. A Solução
Um simulador avançado que não só calcula o líquido, mas sugere ativamente a melhor estrutura fiscal.

### 3.1 Funcionalidades (Tiers)

#### **Free Tier (Recibos Verdes)**
*Focado em atração de tráfego e utilidade imediata.*
- **Cálculo de Líquido:** Input de Daily Rate e Dias Trabalhados.
- **Impostos:** Cálculo automático de IRS (Retenção e Progressivo), Segurança Social e IVA.
- **Resultado:** Visualização simples do Valor Líquido Mensal e Anual.

#### **Premium Tier (Desbloquear Otimização)**
*Focado em valor acrescentado e conversão.*
- **Comparativo Unipessoal:** Simulação lado a lado (Recibos Verdes vs. Empresa).
- **Análise "Turning Point":** Indicação explícita de "Você pouparia €X/ano abrindo empresa".
- **Cenários Avançados:**
    - Definição de Salário do Gerente (Otimização TSU).
    - Simulação de Despesas da Empresa (Carro, Equipamento, etc.).
    - Distribuição de Dividendos vs. Salário.
- **Relatório PDF:** Exportação simplificada do cenário (Roadmap Futuro).

## 4. Arquitetura Técnica

### **Stack**
- **Frontend:** Next.js 14+ (App Router) + TypeScript.
- **UI:** Tailwind CSS + Shadcn UI (Design Clean e Premium).
- **Backend/DB:** Supabase (PostgreSQL para dados de usuários e estado da assinatura).
- **Auth:** Supabase Auth (Email/Password + Verificação).
- **Pagamentos:** Stripe (Checkout Session + Webhooks).

### **Fluxo de Dados & Segurança**
1.  **Auth:** Proteção de rotas e persistência de sessão via Cookies (SSR).
2.  **Dados Fiscais:** Taxas de imposto (Config/Constants) separadas da lógica para fácil atualização anual (Orçamento de Estado).
3.  **Pagamentos:**
    - O utilizador subscreve via Stripe Checkout.
    - Webhook seguro (`stripe-signature`) atualiza a flag `is_premium` no Supabase (`public.profiles`).
    - UI atualiza imediatamente sem refresh manual (via `window.location`).

## 5. Roteiro de Implementação (Status Atual)

- [x] **Setup Inicial:** Next.js, Tailwind, Shadcn.
- [x] **Calculadora Grátis:** Lógica de Recibos Verdes implementada.
- [x] **Autenticação:** Login/Bypass, Proteção de Rotas.
- [x] **Lógica Premium:** Comparador Unipessoal e Análise de Poupança.
- [x] **Integração Stripe:**
    - [x] Fluxo de Assinatura Recorrente.
    - [x] Webhook de Ativação Automática.
- [ ] **Polimento UI:** Melhorias visuais e responsividade fina.
- [ ] **Lançamento:** Deploy Vercel + Configuração de Domínio.
