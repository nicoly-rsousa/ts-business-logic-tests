# 📝 Lista de Treino — Fundamentos de Testes

## Objetivo

Este trabalho com lista de exercícios é uma **preparação para a prova prática**. Aqui você vai treinar a mesma dinâmica da prova: implementar a lógica das funções e verificar se seus testes passam usando o framework `validar()` que construímos em aula.

Cada cenário já possui:
- ✅ As **interfaces** (tipos) definidas
- ✅ Os **objetos de dados** prontos para uso
- ✅ A **assinatura da função** que você deve implementar
- ✅ Os **10 testes** com os valores esperados já preenchidos

Você precisa:
- 🔧 **Implementar** a lógica dentro de cada função seguindo as regras de negócio

---

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar um cenário específico (com hot-reload)

```bash
npm run dev:cenario01   # 🍕 Pizzaria
npm run dev:cenario02   # 🏨 Hotel
npm run dev:cenario03   # 🎓 Notas
```

---

## Framework de Testes — `validar()`

Utilizaremos o mesmo framework de testes que criamos em aula. A função `validar()` é importada do arquivo `framework-teste.ts`.

### Como funciona

```typescript
import { validar } from '../framework-teste'

validar({
    descricao: 'Descrição do que estou testando',
    atual: resultadoDaMinhaFuncao,    // o valor que a função retornou
    esperado: valorQueEuEspero        // o valor correto segundo as regras
})
```

### Exemplo de saída

Quando o teste **passa** (valor atual === valor esperado):
```
✔ [PASSOU] - calcularPedido() - Pedido com frete
```

Quando o teste **falha** (valor atual !== valor esperado):
```
❌ [FALHOU] - calcularPedido() - Pedido com frete
Esperava: 57 | Recebeu: 0
```

---

## Cenários

---

### 🍕 Cenário 01 — Pizzaria Delivery

**Arquivo:** `cenario01-pizzaria/index.ts`

**Regras de Negócio:**
1. Tamanhos e preços: **P** = R$ 25, **M** = R$ 35, **G** = R$ 50, **GG** = R$ 65
2. **Borda recheada**: acréscimo de **R$ 8,00** por pizza
3. **Taxa de entrega**: R$ 7,00 fixo — **grátis** se o subtotal for acima de R$ 80,00
4. **Promoção**: se o pedido tiver 2 ou mais pizzas de tamanho **G** ou **GG**, aplica-se **10% de desconto** no subtotal
5. **Pedido mínimo**: R$ 20,00 (subtotal, antes da taxa de entrega)
6. **Máximo** de **5 pizzas** por pedido (soma das quantidades)

**Função a implementar:** `calcularPedido(pedido: IPedido): IResultadoPedido`

**Testes:**
| # | Descrição |
|---|-----------|
| 1 | Pedido simples 1 pizza P sem borda — com frete |
| 2 | Pedido acima de R$80 — frete grátis |
| 3 | Pedido com borda recheada |
| 4 | Promoção: 2 pizzas G → 10% desconto |
| 5 | Pedido abaixo do mínimo R$20 — inválido |
| 6 | Pedido vazio — inválido |
| 7 | Pedido com mais de 5 pizzas — inválido |
| 8 | Pizza GG com borda + frete grátis |
| 9 | Mix: 1 pizza P + 1 pizza G com borda |
| 10 | Promoção + frete grátis (cenário completo) |

---

### 🏨 Cenário 02 — Sistema de Reserva de Hotel

**Arquivo:** `cenario02-hotel/index.ts`

**Regras de Negócio:**
1. Quarto **Standard**: R$ 150,00 por noite
2. Quarto **Luxo**: R$ 300,00 por noite
3. **Café da manhã** incluso: acréscimo de **R$ 30,00** por noite
4. Estadia de **3 ou mais noites**: **10% de desconto** nas diárias (antes do café)
5. **Alta temporada** (meses 12, 1 e 2): acréscimo de **30%** nas diárias (aplicado antes do desconto)
6. **Mínimo**: 1 noite | **Máximo**: 30 noites
7. **Capacidade**: quarto Standard até **2 hóspedes** | quarto Luxo até **4 hóspedes**

**Função a implementar:** `calcularReserva(reserva: IReserva): IResultadoReserva`

**Testes:**
| # | Descrição |
|---|-----------|
| 1 | Reserva standard 1 noite (mês normal) |
| 2 | Reserva luxo 1 noite (mês normal) |
| 3 | Reserva com café da manhã (standard, 2 noites) |
| 4 | Desconto 3+ noites (standard, 4 noites) |
| 5 | Alta temporada (mês 1, standard, 1 noite) |
| 6 | Alta temporada + desconto + café (luxo, 3 noites, mês 12) |
| 7 | 0 noites — inválido |
| 8 | 31 noites — inválido |
| 9 | 3 hóspedes em quarto standard (máx 2) — inválido |
| 10 | Luxo 5 noites com café (cenário completo) |

---

### 🎓 Cenário 03 — Sistema de Notas Escolares

**Arquivo:** `cenario03-notas/index.ts`

**Regras de Negócio:**
1. São 4 provas: **P1**, **P2**, **P3**, **P4** — notas de **0 a 10**
2. Pesos: **P1** e **P2** têm peso **1** | **P3** e **P4** têm peso **2**
3. Média ponderada: `(P1×1 + P2×1 + P3×2 + P4×2) / 6`
4. **Presença ≥ 75%**: bônus de **+0,5** na média
5. **Entregou todos os trabalhos**: bônus de **+1,0** na média
6. Nota máxima é **10** (bônus não ultrapassa 10)
7. Média final ≥ 7: **Aprovado**
8. Média final ≥ 5 e < 7: **Recuperação**
9. Média final < 5: **Reprovado**
10. Notas devem estar entre 0 e 10 — caso contrário: **inválido**

**Funções a implementar:**
- `calcularMedia(alunoId: number): IResultadoMedia`
- `verificarAprovacao(alunoId: number): IResultadoAprovacao`

**Testes:**
| # | Descrição |
|---|-----------|
| 1 | Média simples sem bônus (presença < 75%, sem trabalhos) |
| 2 | Média com bônus de presença (+0,5) |
| 3 | Média com bônus de trabalhos (+1,0) |
| 4 | Média com ambos os bônus (teto de 10) |
| 5 | Aprovação: média ≥ 7 → "aprovado" |
| 6 | Recuperação: média ≥ 5 e < 7 → "recuperacao" |
| 7 | Reprovação: média < 5 → "reprovado" |
| 8 | Nota inválida (P1 = 11) — inválido |
| 9 | Nota negativa (P2 = -1) — inválido |
| 10 | Aluno inexistente — inválido |

---

### 🍽️ Cenário 04 — Calculadora de Gorjeta *(Exemplo Finalizado)*

> ⚠️ **Este cenário está COMPLETO e serve exclusivamente como exemplo.**
> A implementação já está pronta — leia o código em `cenario04-gorjeta-FINALIZADO/index.ts` para entender como um cenário resolvido deve ser estruturado antes de resolver os outros.

**Arquivo:** `cenario04-gorjeta-FINALIZADO/index.ts`

**Regras de Negócio:**
1. Qualidade **'ruim'** → gorjeta de **5%** sobre o valor da conta
2. Qualidade **'regular'** → gorjeta de **10%** sobre o valor da conta
3. Qualidade **'excelente'** → gorjeta de **15%** sobre o valor da conta
4. Valor da conta deve ser **maior que zero** — caso contrário o resultado é **inválido**

**Função implementada:** `calcularGorjeta(entrada: IEntradaGorjeta): IResultadoGorjeta`

**Testes (já resolvidos):**
| # | Descrição | Resultado esperado |
|---|-----------|-------------------|
| 1a | Serviço excelente — gorjeta correta (R$ 100,00 × 15%) | `gorjeta: 15` |
| 1b | Serviço excelente — valor total correto | `valorTotal: 115` |
| 2 | Serviço regular — gorjeta correta (R$ 80,00 × 10%) | `gorjeta: 8` |
| 3 | Conta R$ 0,00 — resultado inválido | `ehValido: false` |

---

## Critérios de Avaliação

| Critério | Pontos |
|----------|--------|
| Cada teste correto (saída `✔ [PASSOU]`) | 1 ponto |
| **Total** | **30 pontos** |

- Cada cenário vale **10 pontos** (10 testes × 1 ponto)
- O teste só conta como correto se a saída for `✔ [PASSOU]`

---

## Dicas

1. **Leia as regras de negócio com atenção** antes de começar a implementar
2. **Comece pela função** — implemente a lógica primeiro, depois observe a saída
3. **Faça um cenário por vez** — rode com `npm run dev:cenarioXX` e veja o resultado
4. **Use os dados fornecidos** — os objetos já estão prontos, não precisa criar novos
5. **Calcule na mão** — antes de implementar, faça a conta manualmente para entender a regra
6. **Compare com as aulas** — a estrutura é a mesma que usamos na aula 03

Bons estudos! 🚀
