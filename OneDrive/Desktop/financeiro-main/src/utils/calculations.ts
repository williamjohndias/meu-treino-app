import { Receita, GastoCartao, GastoDebito, SaldoMensal } from '../types';

export const getMesAtual = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const getDataHojeMenosUmDia = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export const formatMes = (mes: string): string => {
  const [ano, mesNum] = mes.split('-');
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${meses[parseInt(mesNum) - 1]} ${ano}`;
};

export const calcularSaldoMensal = (
  mes: string,
  receitas: Receita[],
  gastosCartao: GastoCartao[],
  gastosDebito: GastoDebito[]
): SaldoMensal => {
  const receitasMes = receitas
    .filter(r => r.mes === mes)
    .reduce((sum, r) => sum + r.valor, 0);

  // Contabilizar TODOS os gastos do cartão do mês (mesmo os pagos)
  // Pois são gastos que foram/serão pagos naquele mês
  const gastosCartaoFiltrados = gastosCartao.filter(g => g.mes === mes);
  const gastosCartaoMes = gastosCartaoFiltrados
    .reduce((sum, g) => sum + g.valorParcela, 0);

  const gastosDebitoFiltrados = gastosDebito.filter(g => g.mes === mes);
  const gastosDebitoMes = gastosDebitoFiltrados
    .reduce((sum, g) => sum + g.valor, 0);

  const saldo = receitasMes - gastosCartaoMes - gastosDebitoMes;

  // Debug: Log detalhado do cálculo
  if (gastosCartaoFiltrados.length > 0 || gastosDebitoFiltrados.length > 0) {
    console.log(`💰 Cálculo para ${mes}:`, {
      receitasMes,
      gastosCartao: {
        quantidade: gastosCartaoFiltrados.length,
        total: gastosCartaoMes,
        detalhes: gastosCartaoFiltrados.map(g => ({ descricao: g.descricao, valor: g.valorParcela, pago: g.pago })),
      },
      gastosDebito: {
        quantidade: gastosDebitoFiltrados.length,
        total: gastosDebitoMes,
        detalhes: gastosDebitoFiltrados.map(g => ({ descricao: g.descricao, valor: g.valor })),
      },
      saldo,
    });
  }

  return {
    mes,
    receitas: receitasMes,
    gastosCartao: gastosCartaoMes,
    gastosDebito: gastosDebitoMes,
    saldo,
  };
};

export const getProximosMeses = (quantidade: number = 6): string[] => {
  const meses: string[] = [];
  const date = new Date();
  
  for (let i = 0; i < quantidade; i++) {
    const ano = date.getFullYear();
    const mes = date.getMonth() + 1;
    meses.push(`${ano}-${String(mes).padStart(2, '0')}`);
    date.setMonth(date.getMonth() + 1);
  }
  
  return meses;
};

export const calcularProjecao = (
  meses: string[],
  receitas: Receita[],
  gastosCartao: GastoCartao[],
  gastosDebito: GastoDebito[]
): SaldoMensal[] => {
  return meses.map(mes => calcularSaldoMensal(mes, receitas, gastosCartao, gastosDebito));
};

export interface AnalisePagamento {
  mes: string;
  faturaTotal: number;
  receitas: number;
  saldoDisponivel: number;
  podePagar: boolean;
  percentualCobertura: number;
  mesesRestantes: number;
}

export const analisarPagamentoFatura = (
  mes: string,
  receitas: Receita[],
  gastosCartao: GastoCartao[],
  gastosDebito: GastoDebito[],
  mesesFuturos: string[]
): AnalisePagamento => {
  const saldoMes = calcularSaldoMensal(mes, receitas, gastosCartao, gastosDebito);
  const faturaTotal = saldoMes.gastosCartao;
  const receitasMes = saldoMes.receitas;
  const saldoDisponivel = saldoMes.saldo;
  const podePagar = saldoDisponivel >= 0;
  const percentualCobertura = receitasMes > 0 ? (faturaTotal / receitasMes) * 100 : 0;

  // Calcular quantos meses são necessários para pagar a fatura se não puder pagar este mês
  let mesesRestantes = 0;
  if (!podePagar && faturaTotal > 0) {
    let saldoAcumulado = saldoDisponivel;
    for (const mesFuturo of mesesFuturos) {
      if (mesFuturo <= mes) continue;
      const saldoFuturo = calcularSaldoMensal(mesFuturo, receitas, gastosCartao, gastosDebito);
      saldoAcumulado += saldoFuturo.saldo;
      mesesRestantes++;
      if (saldoAcumulado >= faturaTotal) break;
    }
  }

  return {
    mes,
    faturaTotal,
    receitas: receitasMes,
    saldoDisponivel,
    podePagar,
    percentualCobertura,
    mesesRestantes,
  };
};

export const getTodosMesesComDados = (
  receitas: Receita[],
  gastosCartao: GastoCartao[],
  gastosDebito: GastoDebito[]
): string[] => {
  const meses = new Set<string>();
  receitas.forEach(r => meses.add(r.mes));
  gastosCartao.forEach(g => meses.add(g.mes));
  gastosDebito.forEach(g => meses.add(g.mes));
  return Array.from(meses).sort();
};

