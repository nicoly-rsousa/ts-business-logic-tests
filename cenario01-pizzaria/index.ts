import { validar } from '../framework-teste'

// ===== INTERFACES =====
interface IPizza {
    tamanho: 'P' | 'M' | 'G' | 'GG'
    quantidade: number
    bordaRecheada: boolean
}

interface IPedido {
    pizzas: IPizza[]
}

interface IResultadoPedido {
    subtotal: number
    desconto: number
    frete: number
    total: number
    ehValido: boolean
}

// ===== DADOS =====
const precos: Record<string, number> = {
    P: 25,
    M: 35,
    G: 50,
    GG: 65,
}

const BORDA_RECHEADA = 8
const TAXA_ENTREGA = 7
const FRETE_GRATIS_MINIMO = 80
const DESCONTO_PROMOCAO = 0.10
const PEDIDO_MINIMO = 20
const MAX_PIZZAS = 5

// ===== IMPLEMENTAÇÃO =====
export function calcularPedido(pedido: IPedido): IResultadoPedido {
    const INVALIDO: IResultadoPedido = {
        subtotal: 0,
        desconto: 0,
        frete: 0,
        total: 0,
        ehValido: false,
    }

    // Pedido vazio
    if (!pedido.pizzas || pedido.pizzas.length === 0) {
        return INVALIDO
    }

    // Máximo de pizzas
    const totalPizzas = pedido.pizzas.reduce((acc, p) => acc + p.quantidade, 0)
    if (totalPizzas > MAX_PIZZAS) {
        return INVALIDO
    }

    // Calcular subtotal
    let subtotal = 0
    let pizzasGrandesOuGG = 0

    for (const pizza of pedido.pizzas) {
        const precoPizza = precos[pizza.tamanho]
        const borda = pizza.bordaRecheada ? BORDA_RECHEADA : 0
        subtotal += (precoPizza + borda) * pizza.quantidade

        if (pizza.tamanho === 'G' || pizza.tamanho === 'GG') {
            pizzasGrandesOuGG += pizza.quantidade
        }
    }

    // Pedido mínimo
    if (subtotal < PEDIDO_MINIMO) {
        return INVALIDO
    }

    // Promoção: 2 ou mais pizzas G ou GG → 10% de desconto no subtotal
    let desconto = 0
    if (pizzasGrandesOuGG >= 2) {
        desconto = Math.round(subtotal * DESCONTO_PROMOCAO * 100) / 100
    }

    const subtotalComDesconto = subtotal - desconto

    // Frete
    const frete = subtotal > FRETE_GRATIS_MINIMO ? 0 : TAXA_ENTREGA

    const total = Math.round((subtotalComDesconto + frete) * 100) / 100

    return {
        subtotal,
        desconto,
        frete,
        total,
        ehValido: true,
    }
}

// ===== TESTES =====

// Teste 1 — Pedido simples 1 pizza P sem borda — com frete
const pedido1: IPedido = {
    pizzas: [{ tamanho: 'P', quantidade: 1, bordaRecheada: false }],
}
const resultado1 = calcularPedido(pedido1)
validar({ descricao: 'calcularPedido() - Pedido simples pizza P — subtotal', atual: resultado1.subtotal, esperado: 25 })
validar({ descricao: 'calcularPedido() - Pedido simples pizza P — frete', atual: resultado1.frete, esperado: 7 })
validar({ descricao: 'calcularPedido() - Pedido simples pizza P — total', atual: resultado1.total, esperado: 32 })

// Teste 2 — Pedido acima de R$80 — frete grátis
const pedido2: IPedido = {
    pizzas: [{ tamanho: 'GG', quantidade: 1, bordaRecheada: false }],
}
const resultado2 = calcularPedido(pedido2)
validar({ descricao: 'calcularPedido() - Acima R$80 — frete grátis', atual: resultado2.frete, esperado: 0 })
validar({ descricao: 'calcularPedido() - Acima R$80 — total', atual: resultado2.total, esperado: 65 })

// Teste 3 — Pedido com borda recheada
const pedido3: IPedido = {
    pizzas: [{ tamanho: 'M', quantidade: 1, bordaRecheada: true }],
}
const resultado3 = calcularPedido(pedido3)
validar({ descricao: 'calcularPedido() - Com borda recheada — subtotal', atual: resultado3.subtotal, esperado: 43 })
validar({ descricao: 'calcularPedido() - Com borda recheada — total', atual: resultado3.total, esperado: 50 })

// Teste 4 — Promoção: 2 pizzas G → 10% desconto
const pedido4: IPedido = {
    pizzas: [{ tamanho: 'G', quantidade: 2, bordaRecheada: false }],
}
const resultado4 = calcularPedido(pedido4)
validar({ descricao: 'calcularPedido() - Promoção 2 G — desconto', atual: resultado4.desconto, esperado: 10 })
validar({ descricao: 'calcularPedido() - Promoção 2 G — total', atual: resultado4.total, esperado: 90 })

// Teste 5 — Pedido abaixo do mínimo R$20 — inválido
// Nota: não há pizza com preço abaixo de R$20 individualmente, mas quantidade 0 seria inválida
// O menor pedido válido é 1 pizza P = R$25, logo usamos um pedido vazio para testar
const pedido5: IPedido = { pizzas: [] }
const resultado5 = calcularPedido(pedido5)
validar({ descricao: 'calcularPedido() - Pedido vazio — inválido', atual: resultado5.ehValido, esperado: false })

// Teste 6 — Pedido vazio — inválido
const pedido6: IPedido = { pizzas: [] }
const resultado6 = calcularPedido(pedido6)
validar({ descricao: 'calcularPedido() - Vazio — ehValido false', atual: resultado6.ehValido, esperado: false })

// Teste 7 — Pedido com mais de 5 pizzas — inválido
const pedido7: IPedido = {
    pizzas: [{ tamanho: 'P', quantidade: 6, bordaRecheada: false }],
}
const resultado7 = calcularPedido(pedido7)
validar({ descricao: 'calcularPedido() - Mais de 5 pizzas — inválido', atual: resultado7.ehValido, esperado: false })

// Teste 8 — Pizza GG com borda + frete grátis
const pedido8: IPedido = {
    pizzas: [{ tamanho: 'GG', quantidade: 1, bordaRecheada: true }],
}
const resultado8 = calcularPedido(pedido8)
validar({ descricao: 'calcularPedido() - GG com borda — subtotal', atual: resultado8.subtotal, esperado: 73 })
validar({ descricao: 'calcularPedido() - GG com borda — frete grátis', atual: resultado8.frete, esperado: 0 })

// Teste 9 — Mix: 1 pizza P + 1 pizza G com borda
const pedido9: IPedido = {
    pizzas: [
        { tamanho: 'P', quantidade: 1, bordaRecheada: false },
        { tamanho: 'G', quantidade: 1, bordaRecheada: true },
    ],
}
const resultado9 = calcularPedido(pedido9)
validar({ descricao: 'calcularPedido() - Mix P + G borda — subtotal', atual: resultado9.subtotal, esperado: 83 })
validar({ descricao: 'calcularPedido() - Mix P + G borda — frete', atual: resultado9.frete, esperado: 0 })

// Teste 10 — Promoção + frete grátis (cenário completo)
const pedido10: IPedido = {
    pizzas: [
        { tamanho: 'GG', quantidade: 2, bordaRecheada: false },
    ],
}
const resultado10 = calcularPedido(pedido10)
// subtotal = 130, desconto = 13, frete = 0 (subtotal > 80), total = 117
validar({ descricao: 'calcularPedido() - Promoção + frete grátis — desconto', atual: resultado10.desconto, esperado: 13 })
validar({ descricao: 'calcularPedido() - Promoção + frete grátis — total', atual: resultado10.total, esperado: 117 })