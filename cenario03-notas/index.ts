import { validar } from '../framework-teste'

// ===== INTERFACES =====
interface INotasAluno {
    P1: number
    P2: number
    P3: number
    P4: number
}

interface IAluno {
    id: number
    notas: INotasAluno
    presenca: number   // porcentagem, ex: 0.80 = 80%
    trabalhos: boolean // true = entregou todos
}

interface IResultadoMedia {
    media: number
    ehValido: boolean
}

interface IResultadoAprovacao {
    situacao: 'aprovado' | 'recuperacao' | 'reprovado'
    ehValido: boolean
}

// ===== DADOS DOS ALUNOS =====
const alunos: IAluno[] = [
    { id: 1, notas: { P1: 6, P2: 6, P3: 6, P4: 6 },    presenca: 0.70, trabalhos: false }, // sem bônus
    { id: 2, notas: { P1: 6, P2: 6, P3: 6, P4: 6 },    presenca: 0.80, trabalhos: false }, // bônus presença
    { id: 3, notas: { P1: 6, P2: 6, P3: 6, P4: 6 },    presenca: 0.70, trabalhos: true  }, // bônus trabalhos
    { id: 4, notas: { P1: 9, P2: 9, P3: 9, P4: 9 },    presenca: 0.80, trabalhos: true  }, // ambos bônus, teto 10
    { id: 5, notas: { P1: 8, P2: 8, P3: 8, P4: 8 },    presenca: 0.80, trabalhos: false }, // aprovado
    { id: 6, notas: { P1: 5, P2: 5, P3: 5, P4: 5 },    presenca: 0.70, trabalhos: false }, // recuperação
    { id: 7, notas: { P1: 2, P2: 2, P3: 2, P4: 2 },    presenca: 0.70, trabalhos: false }, // reprovado
    { id: 8, notas: { P1: 11, P2: 6, P3: 6, P4: 6 },   presenca: 0.80, trabalhos: false }, // nota inválida
    { id: 9, notas: { P1: 6, P2: -1, P3: 6, P4: 6 },   presenca: 0.80, trabalhos: false }, // nota negativa
]

// ===== IMPLEMENTAÇÃO =====

function encontrarAluno(alunoId: number): IAluno | undefined {
    return alunos.find(a => a.id === alunoId)
}

function notasValidas(notas: INotasAluno): boolean {
    return [notas.P1, notas.P2, notas.P3, notas.P4].every(n => n >= 0 && n <= 10)
}

export function calcularMedia(alunoId: number): IResultadoMedia {
    const INVALIDO: IResultadoMedia = { media: 0, ehValido: false }

    const aluno = encontrarAluno(alunoId)
    if (!aluno) return INVALIDO

    if (!notasValidas(aluno.notas)) return INVALIDO

    const { P1, P2, P3, P4 } = aluno.notas

    // Média ponderada: (P1×1 + P2×1 + P3×2 + P4×2) / 6
    let media = (P1 * 1 + P2 * 1 + P3 * 2 + P4 * 2) / 6

    // Bônus presença ≥ 75%
    if (aluno.presenca >= 0.75) {
        media += 0.5
    }

    // Bônus entregou todos os trabalhos
    if (aluno.trabalhos) {
        media += 1.0
    }

    // Nota máxima é 10
    if (media > 10) {
        media = 10
    }

    media = Math.round(media * 100) / 100

    return { media, ehValido: true }
}

export function verificarAprovacao(alunoId: number): IResultadoAprovacao {
    const INVALIDO: IResultadoAprovacao = { situacao: 'reprovado', ehValido: false }

    const aluno = encontrarAluno(alunoId)
    if (!aluno) return INVALIDO

    if (!notasValidas(aluno.notas)) return INVALIDO

    const { media } = calcularMedia(alunoId)

    let situacao: 'aprovado' | 'recuperacao' | 'reprovado'

    if (media >= 7) {
        situacao = 'aprovado'
    } else if (media >= 5) {
        situacao = 'recuperacao'
    } else {
        situacao = 'reprovado'
    }

    return { situacao, ehValido: true }
}

// ===== TESTES =====

// Teste 1 — Média simples sem bônus (presença < 75%, sem trabalhos)
// Aluno 1: (6+6+12+12)/6 = 36/6 = 6
const r1 = calcularMedia(1)
validar({ descricao: 'calcularMedia() - Sem bônus — media', atual: r1.media, esperado: 6 })
validar({ descricao: 'calcularMedia() - Sem bônus — ehValido', atual: r1.ehValido, esperado: true })

// Teste 2 — Média com bônus de presença (+0,5)
// Aluno 2: 6 + 0,5 = 6,5
const r2 = calcularMedia(2)
validar({ descricao: 'calcularMedia() - Bônus presença — media', atual: r2.media, esperado: 6.5 })

// Teste 3 — Média com bônus de trabalhos (+1,0)
// Aluno 3: 6 + 1 = 7
const r3 = calcularMedia(3)
validar({ descricao: 'calcularMedia() - Bônus trabalhos — media', atual: r3.media, esperado: 7 })

// Teste 4 — Média com ambos os bônus (teto de 10)
// Aluno 4: (9+9+18+18)/6 = 54/6 = 9, +0,5 +1,0 = 10,5 → 10
const r4 = calcularMedia(4)
validar({ descricao: 'calcularMedia() - Ambos bônus teto 10 — media', atual: r4.media, esperado: 10 })

// Teste 5 — Aprovação: média ≥ 7 → "aprovado"
// Aluno 5: (8+8+16+16)/6 = 48/6 = 8, +0,5 presença = 8,5
const r5 = verificarAprovacao(5)
validar({ descricao: 'verificarAprovacao() - Aprovado', atual: r5.situacao, esperado: 'aprovado' })
validar({ descricao: 'verificarAprovacao() - Aprovado — ehValido', atual: r5.ehValido, esperado: true })

// Teste 6 — Recuperação: média ≥ 5 e < 7 → "recuperacao"
// Aluno 6: (5+5+10+10)/6 = 30/6 = 5
const r6 = verificarAprovacao(6)
validar({ descricao: 'verificarAprovacao() - Recuperação', atual: r6.situacao, esperado: 'recuperacao' })

// Teste 7 — Reprovação: média < 5 → "reprovado"
// Aluno 7: (2+2+4+4)/6 = 12/6 = 2
const r7 = verificarAprovacao(7)
validar({ descricao: 'verificarAprovacao() - Reprovado', atual: r7.situacao, esperado: 'reprovado' })

// Teste 8 — Nota inválida (P1 = 11) — inválido
const r8 = calcularMedia(8)
validar({ descricao: 'calcularMedia() - Nota inválida P1=11 — ehValido', atual: r8.ehValido, esperado: false })

// Teste 9 — Nota negativa (P2 = -1) — inválido
const r9 = calcularMedia(9)
validar({ descricao: 'calcularMedia() - Nota negativa P2=-1 — ehValido', atual: r9.ehValido, esperado: false })

// Teste 10 — Aluno inexistente — inválido
const r10 = calcularMedia(999)
validar({ descricao: 'calcularMedia() - Aluno inexistente — ehValido', atual: r10.ehValido, esperado: false })