import { validar } from '../framework-teste'

// ===== INTERFACES =====
interface IReserva {
    tipoQuarto: 'standard' | 'luxo'
    noites: number
    hospedes: number
    cafeDaManha: boolean
    mes: number
}

interface IResultadoReserva {
    valorDiaria: number
    totalDiarias: number
    totalCafe: number
    desconto: number
    total: number
    ehValido: boolean
}

// ===== CONSTANTES =====
const PRECOS = {
    standard: 150,
    luxo: 300,
}

const CAFE_POR_NOITE = 30
const DESCONTO_3_NOITES = 0.10
const ALTA_TEMPORADA_ACRESCIMO = 0.30
const ALTA_TEMPORADA_MESES = [12, 1, 2]
const CAPACIDADE = {
    standard: 2,
    luxo: 4,
}

// ===== IMPLEMENTAÇÃO =====
export function calcularReserva(reserva: IReserva): IResultadoReserva {
    const INVALIDO: IResultadoReserva = {
        valorDiaria: 0,
        totalDiarias: 0,
        totalCafe: 0,
        desconto: 0,
        total: 0,
        ehValido: false,
    }

    // Validações
    if (reserva.noites < 1 || reserva.noites > 30) {
        return INVALIDO
    }

    if (reserva.hospedes > CAPACIDADE[reserva.tipoQuarto]) {
        return INVALIDO
    }

    // Valor base da diária
    let valorDiaria = PRECOS[reserva.tipoQuarto]

    // Alta temporada: +30% nas diárias (aplicado antes do desconto)
    const isAltaTemporada = ALTA_TEMPORADA_MESES.includes(reserva.mes)
    if (isAltaTemporada) {
        valorDiaria = Math.round(valorDiaria * (1 + ALTA_TEMPORADA_ACRESCIMO) * 100) / 100
    }

    const totalDiariasAntesDesconto = valorDiaria * reserva.noites

    // Desconto 3+ noites: 10% nas diárias (antes do café)
    let desconto = 0
    if (reserva.noites >= 3) {
        desconto = Math.round(totalDiariasAntesDesconto * DESCONTO_3_NOITES * 100) / 100
    }

    const totalDiarias = Math.round((totalDiariasAntesDesconto - desconto) * 100) / 100

    // Café da manhã: +R$30 por noite
    const totalCafe = reserva.cafeDaManha ? CAFE_POR_NOITE * reserva.noites : 0

    const total = Math.round((totalDiarias + totalCafe) * 100) / 100

    return {
        valorDiaria,
        totalDiarias,
        totalCafe,
        desconto,
        total,
        ehValido: true,
    }
}

// ===== TESTES =====

// Teste 1 — Reserva standard 1 noite (mês normal)
const reserva1: IReserva = { tipoQuarto: 'standard', noites: 1, hospedes: 1, cafeDaManha: false, mes: 6 }
const res1 = calcularReserva(reserva1)
validar({ descricao: 'calcularReserva() - Standard 1 noite — total', atual: res1.total, esperado: 150 })
validar({ descricao: 'calcularReserva() - Standard 1 noite — ehValido', atual: res1.ehValido, esperado: true })

// Teste 2 — Reserva luxo 1 noite (mês normal)
const reserva2: IReserva = { tipoQuarto: 'luxo', noites: 1, hospedes: 2, cafeDaManha: false, mes: 6 }
const res2 = calcularReserva(reserva2)
validar({ descricao: 'calcularReserva() - Luxo 1 noite — total', atual: res2.total, esperado: 300 })

// Teste 3 — Reserva com café da manhã (standard, 2 noites)
// Diária: 150, total diárias: 300, café: 60, total: 360
const reserva3: IReserva = { tipoQuarto: 'standard', noites: 2, hospedes: 1, cafeDaManha: true, mes: 6 }
const res3 = calcularReserva(reserva3)
validar({ descricao: 'calcularReserva() - Com café 2 noites — totalCafe', atual: res3.totalCafe, esperado: 60 })
validar({ descricao: 'calcularReserva() - Com café 2 noites — total', atual: res3.total, esperado: 360 })

// Teste 4 — Desconto 3+ noites (standard, 4 noites)
// Diária: 150, total: 600, desconto 10% = 60, totalDiarias: 540, total: 540
const reserva4: IReserva = { tipoQuarto: 'standard', noites: 4, hospedes: 1, cafeDaManha: false, mes: 6 }
const res4 = calcularReserva(reserva4)
validar({ descricao: 'calcularReserva() - Desconto 3+ noites — desconto', atual: res4.desconto, esperado: 60 })
validar({ descricao: 'calcularReserva() - Desconto 3+ noites — total', atual: res4.total, esperado: 540 })

// Teste 5 — Alta temporada (mês 1, standard, 1 noite)
// Diária: 150 * 1.30 = 195, total: 195
const reserva5: IReserva = { tipoQuarto: 'standard', noites: 1, hospedes: 1, cafeDaManha: false, mes: 1 }
const res5 = calcularReserva(reserva5)
validar({ descricao: 'calcularReserva() - Alta temporada mês 1 — valorDiaria', atual: res5.valorDiaria, esperado: 195 })
validar({ descricao: 'calcularReserva() - Alta temporada mês 1 — total', atual: res5.total, esperado: 195 })

// Teste 6 — Alta temporada + desconto + café (luxo, 3 noites, mês 12)
// Diária luxo: 300 * 1.30 = 390, total diárias: 1170, desconto 10% = 117
// totalDiarias: 1053, café: 90, total: 1143
const reserva6: IReserva = { tipoQuarto: 'luxo', noites: 3, hospedes: 2, cafeDaManha: true, mes: 12 }
const res6 = calcularReserva(reserva6)
validar({ descricao: 'calcularReserva() - Alta temp + desconto + café — desconto', atual: res6.desconto, esperado: 117 })
validar({ descricao: 'calcularReserva() - Alta temp + desconto + café — total', atual: res6.total, esperado: 1143 })

// Teste 7 — 0 noites — inválido
const reserva7: IReserva = { tipoQuarto: 'standard', noites: 0, hospedes: 1, cafeDaManha: false, mes: 6 }
const res7 = calcularReserva(reserva7)
validar({ descricao: 'calcularReserva() - 0 noites — inválido', atual: res7.ehValido, esperado: false })

// Teste 8 — 31 noites — inválido
const reserva8: IReserva = { tipoQuarto: 'standard', noites: 31, hospedes: 1, cafeDaManha: false, mes: 6 }
const res8 = calcularReserva(reserva8)
validar({ descricao: 'calcularReserva() - 31 noites — inválido', atual: res8.ehValido, esperado: false })

// Teste 9 — 3 hóspedes em quarto standard (máx 2) — inválido
const reserva9: IReserva = { tipoQuarto: 'standard', noites: 2, hospedes: 3, cafeDaManha: false, mes: 6 }
const res9 = calcularReserva(reserva9)
validar({ descricao: 'calcularReserva() - 3 hóspedes standard — inválido', atual: res9.ehValido, esperado: false })

// Teste 10 — Luxo 5 noites com café (cenário completo)
// Diária: 300, total diárias: 1500, desconto 10% = 150, totalDiarias: 1350
// café: 150, total: 1500
const reserva10: IReserva = { tipoQuarto: 'luxo', noites: 5, hospedes: 3, cafeDaManha: true, mes: 6 }
const res10 = calcularReserva(reserva10)
validar({ descricao: 'calcularReserva() - Luxo 5 noites com café — desconto', atual: res10.desconto, esperado: 150 })
validar({ descricao: 'calcularReserva() - Luxo 5 noites com café — total', atual: res10.total, esperado: 1500 })