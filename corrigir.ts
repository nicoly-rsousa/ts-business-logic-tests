import { execSync } from 'child_process'
import * as path from 'path'

// 📊 Script de Correção — Lista de Treino
// Roda cada cenário e conta os testes que passaram/falharam

interface IResultadoCenario {
    nome: string
    passou: number
    falhou: number
    total: number
    saida: string
}

const cenarios = [
    { nome: '🍕 Cenário 01 — Pizzaria', arquivo: 'cenario01-pizzaria/index.ts' },
    { nome: '🏨 Cenário 02 — Hotel', arquivo: 'cenario02-hotel/index.ts' },
    { nome: '🎓 Cenário 03 — Notas', arquivo: 'cenario03-notas/index.ts' },
]

function rodarCenario(arquivo: string): string {
    const caminhoCompleto = path.join(__dirname, arquivo)
    try {
        const saida = execSync(`npx tsx "${caminhoCompleto}" 2>&1`, {
            encoding: 'utf-8',
            cwd: __dirname,
            timeout: 10000,
        })
        return saida
    } catch (error: any) {
        return error.stdout || error.stderr || ''
    }
}

function contarResultados(saida: string): { passou: number, falhou: number } {
    const passou = (saida.match(/✔ \[PASSOU\]/g) || []).length
    const falhou = (saida.match(/❌ \[FALHOU\]/g) || []).length
    return { passou, falhou }
}

console.log('╔══════════════════════════════════════════════════╗')
console.log('║        📊 CORREÇÃO — Lista de Treino             ║')
console.log('╚══════════════════════════════════════════════════╝\n')

const resultados: IResultadoCenario[] = []
let totalGeral = 0
let passouGeral = 0

for (const cenario of cenarios) {
    console.log(`▶ Rodando: ${cenario.nome}...`)
    console.log('─'.repeat(50))

    const saida = rodarCenario(cenario.arquivo)
    const { passou, falhou } = contarResultados(saida)
    const total = passou + falhou

    resultados.push({
        nome: cenario.nome,
        passou,
        falhou,
        total,
        saida
    })

    // Mostrar a saída do cenário
    const linhasTeste = saida.split('\n').filter(l => l.includes('[PASSOU]') || l.includes('[FALHOU]'))
    for (const linha of linhasTeste) {
        console.log(`  ${linha.trim()}`)
    }

    console.log(`\n  Resultado: ${passou}/${total} testes passaram`)
    console.log('─'.repeat(50) + '\n')

    totalGeral += total
    passouGeral += passou
}

// Relatório final
console.log('╔══════════════════════════════════════════════════╗')
console.log('║              📋RELATÓRIO FINAL                   ║')
console.log('╠══════════════════════════════════════════════════╣')

for (const r of resultados) {
    const status = r.passou === r.total ? '✅' : '⚠️'
    console.log(`║ ${status} ${r.nome.padEnd(35)} ${String(r.passou).padStart(2)}/${String(r.total).padStart(2)}      ║`)
}

console.log('╠══════════════════════════════════════════════════╣')
console.log(`║ 🏆 NOTA FINAL: ${passouGeral}/${totalGeral} pontos`.padEnd(51) + '║')
console.log('╚══════════════════════════════════════════════════╝')

if (passouGeral === totalGeral) {
    console.log('\n🎉 Parabéns! Todos os testes passaram!')
} else if (passouGeral >= totalGeral * 0.7) {
    console.log('\n👍 Bom trabalho! Revise os testes que falharam.')
} else {
    console.log('\n📚 Continue estudando! Releia as regras de negócio com atenção.')
}
