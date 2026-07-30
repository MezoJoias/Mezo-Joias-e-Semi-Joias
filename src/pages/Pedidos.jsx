import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PedidoCard from "../components/PedidoCard";
import { assinarPedidos, atualizarStatusPedido, buscarPedidos, excluirPedido } from "../services/pedidos";
import "./Pedidos.css";

function normalizarTexto(valor) {
  return String(valor || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvandoId, setSalvandoId] = useState(null);
  const [erro, setErro] = useState("");

  const carregarPedidos = async () => {
    try {
      setErro("");
      const dados = await buscarPedidos();
      setPedidos(dados);
    } catch (e) {
      setErro(e.message || "Não foi possível carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
    const cancelarAssinatura = assinarPedidos(carregarPedidos);
    return cancelarAssinatura;
  }, []);

  const pedidosFiltrados = useMemo(() => {
    const termo = normalizarTexto(busca.trim());

    return pedidos.filter((pedido) => {
      const correspondeStatus = filtroStatus === "Todos" || pedido.status === filtroStatus;
      const textoPedido = normalizarTexto(`${pedido.numero} ${pedido.nome_cliente} ${pedido.telefone}`);
      return correspondeStatus && (!termo || textoPedido.includes(termo));
    });
  }, [pedidos, busca, filtroStatus]);

  const resumo = useMemo(() => {
    const validos = pedidos.filter((pedido) => pedido.status !== "Cancelado");
    const faturamento = validos.reduce((total, pedido) => total + Number(pedido.total || 0), 0);
    return {
      total: pedidos.length,
      pendentes: pedidos.filter((pedido) => pedido.status === "Pendente").length,
      faturamento,
      ticketMedio: validos.length ? faturamento / validos.length : 0,
    };
  }, [pedidos]);

  const formatarMoeda = (valor) => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const mudarStatus = async (pedido, status) => {
    try {
      setSalvandoId(pedido.id);
      await atualizarStatusPedido(pedido.id, status);
      setPedidos((atuais) => atuais.map((item) => item.id === pedido.id ? { ...item, status } : item));
    } catch (e) {
      alert(e.message || "Não foi possível atualizar o status.");
    } finally {
      setSalvandoId(null);
    }
  };

  const removerPedido = async (pedido) => {
    const confirmar = window.confirm(`Deseja excluir o pedido ${pedido.numero}? Essa ação não pode ser desfeita.`);
    if (!confirmar) return;

    try {
      setSalvandoId(pedido.id);
      await excluirPedido(pedido.id);
      setPedidos((atuais) => atuais.filter((item) => item.id !== pedido.id));
      if (pedidoAberto === pedido.id) setPedidoAberto(null);
    } catch (e) {
      alert(e.message || "Não foi possível excluir o pedido.");
    } finally {
      setSalvandoId(null);
    }
  };

  return (
    <main className="pedidos-page">
      <header className="pedidos-header">
        <div>
          <span>Painel administrativo</span>
          <h1>Pedidos</h1>
          <p>Acompanhe clientes, itens, valores e o andamento das vendas.</p>
        </div>
        <Link to="/admin" className="pedidos-voltar">← Voltar aos produtos</Link>
      </header>

      <section className="pedidos-dashboard">
        <div><span>Total de pedidos</span><strong>{resumo.total}</strong></div>
        <div><span>Pendentes</span><strong>{resumo.pendentes}</strong></div>
        <div><span>Faturamento</span><strong>{formatarMoeda(resumo.faturamento)}</strong></div>
        <div><span>Ticket médio</span><strong>{formatarMoeda(resumo.ticketMedio)}</strong></div>
      </section>

      <section className="pedidos-filtros">
        <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por pedido, cliente ou telefone..." />
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option>Todos</option><option>Pendente</option><option>Confirmado</option><option>Enviado</option><option>Concluído</option><option>Cancelado</option>
        </select>
        <button type="button" onClick={carregarPedidos}>Atualizar</button>
      </section>

      {erro && <div className="pedidos-erro">{erro}</div>}

      {carregando ? (
        <div className="pedidos-vazio">Carregando pedidos...</div>
      ) : pedidosFiltrados.length ? (
        <section className="pedidos-lista">
          {pedidosFiltrados.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              aberto={pedidoAberto === pedido.id}
              aoAlternar={() => setPedidoAberto((atual) => atual === pedido.id ? null : pedido.id)}
              aoAtualizarStatus={(status) => mudarStatus(pedido, status)}
              aoExcluir={() => removerPedido(pedido)}
              salvando={salvandoId === pedido.id}
            />
          ))}
        </section>
      ) : (
        <div className="pedidos-vazio"><h2>Nenhum pedido encontrado</h2><p>Altere os filtros ou aguarde um novo pedido.</p></div>
      )}
    </main>
  );
}

export default Pedidos;
