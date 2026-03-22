# 📝 Trabalho — Fundamentos de Testes

## Identificação

> ⚠️ **OBRIGATÓRIO:** Antes de começar qualquer implementação, crie o arquivo `aluno.ts` na raiz do projeto com o seu nome.

```typescript
// aluno.ts
export const aluno = {
    nome: 'Seu Nome Completo Aqui',
}
```

Trabalhos entregues **sem o arquivo `aluno.ts`** ou com o campo `nome` vazio **terão 5 pts descontados**.

---

## Objetivo

Implementar a lógica de negócio de **3 cenários** em TypeScript, fazendo com que todos os testes passem (`✔ [PASSOU]`).

Cada cenário já possui interfaces, dados e os testes prontos. Você só precisa escrever o corpo das funções.

Leia o arquivo [ENUNCIADO.md](ENUNCIADO.md) para entender as regras de negócio de cada cenário em detalhe.

---

## Estrutura do Projeto

```
trabalho/
├── aluno.ts                          ← ⚠️ VOCÊ DEVE CRIAR ESTE ARQUIVO
├── cenario01-pizzaria/
│   └── index.ts                      ← implementar aqui
├── cenario02-hotel/
│   └── index.ts                      ← implementar aqui
├── cenario03-notas/
│   └── index.ts                      ← implementar aqui
├── cenario04-gorjeta-FINALIZADO/
│   └── index.ts                      ← exemplo de como deve ficar (não editar)
├── framework-teste.ts                ← não editar
├── corrigir.ts                       ← não editar
├── ENUNCIADO.md                      ← leia antes de começar
└── package.json
```

---

## Como Rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar um cenário com hot-reload (recarrega automaticamente ao salvar)

```bash
npm run dev:cenario01   # 🍕 Pizzaria
npm run dev:cenario02   # 🏨 Hotel
npm run dev:cenario03   # 🎓 Notas
```

### 3. Ver o exemplo finalizado

```bash
npx tsx cenario04-gorjeta-FINALIZADO/index.ts
```

### 4. Corrigir todos os cenários de uma vez

```bash
npm run corrigir
```

Este comando roda os 3 cenários e exibe um relatório final com a sua nota.

---

## Critérios de Avaliação

| Critério | Pontos |
|----------|--------|
| Cada teste correto (`✔ [PASSOU]`) | 1 ponto |
| **Total** | **30 pontos** |

- Cenário 01 — Pizzaria: **10 pontos**
- Cenário 02 — Hotel: **10 pontos**
- Cenário 03 — Notas: **10 pontos**

---

## Como Entregar

1. **Certifique-se** de que o arquivo `aluno.ts` está criado com seu nome completo
2. **Verifique** sua nota rodando `npm run corrigir`
3. **Faça commit** de todas as alterações:
   ```bash
   git add .
   git commit -m "Trabalho finalizado - Seu Nome"
   ```
4. **Envie o repositório** (link do GitHub) pelo Teams até a data limite

> Apenas os arquivos `aluno.ts`, `cenario01-pizzaria/index.ts`, `cenario02-hotel/index.ts` e `cenario03-notas/index.ts` devem ser alterados. Não modifique os demais arquivos.

---

## Dicas

- Leia as **regras de negócio** com atenção antes de implementar
- Use o **Cenário 04** como referência de como uma implementação finalizada deve ser estruturada
- Faça **um cenário por vez** — rode com `npm run dev:cenarioXX` e observe a saída
- **Calcule na mão** antes de implementar para entender os valores esperados
- A função deve retornar exatamente os campos definidos nas interfaces

Bons estudos! 🚀
