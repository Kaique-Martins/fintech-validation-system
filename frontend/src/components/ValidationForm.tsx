import React, { useState } from 'react';
import { ValidationRecord } from '../types/validation';
import '../styles/ValidationForm.css';

interface ValidationFormProps {
  onSubmit: (record: ValidationRecord) => void;
  loading: boolean;
}

export const ValidationForm: React.FC<ValidationFormProps> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState<ValidationRecord>({
    produto: '',
    categoria: '',
    preco: 0,
    cidade: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'preco' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.produto || !form.cidade || form.preco <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios (Produto, Cidade, Preço)');
      return;
    }
    onSubmit(form);
  };

  const handleReset = () => {
    setForm({
      produto: '',
      categoria: '',
      preco: 0,
      cidade: '',
    });
  };

  return (
    <form className="validation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="produto">Produto *</label>
        <input
          type="text"
          id="produto"
          name="produto"
          value={form.produto}
          onChange={handleChange}
          placeholder="Ex: Notebook Dell XPS"
          disabled={loading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoria</label>
        <input
          type="text"
          id="categoria"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          placeholder="Ex: Eletrônicos (deixe vazio para inferir)"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="preco">Preço (R$) *</label>
        <input
          type="number"
          id="preco"
          name="preco"
          value={form.preco}
          onChange={handleChange}
          placeholder="Ex: 3500.00"
          step="0.01"
          min="0"
          disabled={loading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cidade">Cidade *</label>
        <input
          type="text"
          id="cidade"
          name="cidade"
          value={form.cidade}
          onChange={handleChange}
          placeholder="Ex: São Paulo"
          disabled={loading}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? '⏳ Processando...' : '🔍 Validar'}
        </button>
        <button type="button" onClick={handleReset} disabled={loading} className="btn-secondary">
          🔄 Limpar
        </button>
      </div>
    </form>
  );
};
