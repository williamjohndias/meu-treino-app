import { useState } from 'react';
import * as React from 'react';
import { GastoCartao } from '../types';
import { getDataHojeMenosUmDia } from '../utils/calculations';
import './Forms.css';

interface GastosCartaoFormProps {
  onAdd: (gasto: Omit<GastoCartao, 'id' | 'parcelaAtual' | 'valorParcela' | 'mes' | 'pago'>) => void;
  onUpdate?: (gasto: GastoCartao) => void;
  gastoEditando?: GastoCartao | null;
  onCancelEdit?: () => void;
}

export default function GastosCartaoForm({ onAdd, onUpdate, gastoEditando, onCancelEdit }: GastosCartaoFormProps) {
  const [descricao, setDescricao] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [dataInicio, setDataInicio] = useState(getDataHojeMenosUmDia());

  // Atualizar campos quando gastoEditando mudar
  React.useEffect(() => {
    if (gastoEditando) {
      setDescricao(gastoEditando.descricao);
      setValorTotal(gastoEditando.valorTotal.toString());
      setParcelas(gastoEditando.parcelas.toString());
      setDataInicio(gastoEditando.dataInicio);
    } else {
      setDescricao('');
      setValorTotal('');
      setParcelas('1');
      setDataInicio(getDataHojeMenosUmDia());
    }
  }, [gastoEditando]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valorTotal || !parcelas || !dataInicio) return;

    if (gastoEditando && onUpdate) {
      // Modo edição - atualizar apenas esta parcela
      onUpdate({
        ...gastoEditando,
        descricao,
        valorTotal: parseFloat(valorTotal),
        parcelas: parseInt(parcelas),
        dataInicio,
        valorParcela: Math.round((parseFloat(valorTotal) / parseInt(parcelas)) * 100) / 100,
      });
      if (onCancelEdit) onCancelEdit();
    } else {
      // Modo adição
      onAdd({
        descricao,
        valorTotal: parseFloat(valorTotal),
        parcelas: parseInt(parcelas),
        dataInicio,
      });
    }

    setDescricao('');
    setValorTotal('');
    setParcelas('1');
    setDataInicio(getDataHojeMenosUmDia());
  };

  const valorParcela = valorTotal && parcelas
    ? (parseFloat(valorTotal) / parseInt(parcelas)).toFixed(2)
    : '0.00';

  return (
    <div className="form-card">
      <h2>{gastoEditando ? '✏️ Editar Gasto no Cartão' : '💳 Adicionar Gasto no Cartão'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Compras no supermercado..."
            required
          />
        </div>

        <div className="form-group">
          <label>Valor Total (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Número de Parcelas</label>
          <input
            type="number"
            min="1"
            max="24"
            value={parcelas}
            onChange={(e) => setParcelas(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Data da Primeira Parcela</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </div>

        {valorTotal && parcelas && (
          <div className="info-box">
            <strong>Valor por Parcela: R$ {valorParcela}</strong>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn-primary">
            {gastoEditando ? 'Salvar Alterações' : 'Adicionar Gasto'}
          </button>
          {gastoEditando && onCancelEdit && (
            <button type="button" onClick={onCancelEdit} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

