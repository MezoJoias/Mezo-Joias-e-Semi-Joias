const STATUS = ["Pendente", "Confirmado", "Enviado", "Concluído", "Cancelado"];

function converterPreco(preco) {
  if (typeof preco === "number") return preco;
  if (!preco) return 0;

  return Number(
    String(preco)
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  ) || 0;
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data) {
  if (!data) return "Data não informada";
  return new Date(data).toLocaleString("pt-BR");
}

function normalizarTelefone(telefone) {
  const numeros = String(telefone || "").replace(/\D/g, "");
  if (!numeros) return "";
  return numeros.startsWith("55") ? numeros : `55${numeros}`;
}

function PedidoCard({ pedido, aberto, aoAlternar, aoAtualizarStatus, aoExcluir, salvando }) {
  const itens = pedido.itens_pedido || [];
  const quantidade = itens.reduce((total, item) => total + Number(item.quantidade || 0), 0);
  const telefoneWhatsApp = normalizarTelefone(pedido.telefone);
  const classeStatus = String(pedido.status || "Pendente").toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="pedido-card">
      <button type="button" className="pedido-card-resumo" onClick={aoAlternar}>
        <div>
          <span className="pedido-numero">#{pedido.numero}</span>
          <h3>{pedido.nome_cliente || "Cliente não informado"}</h3>
          <p>{formatarData(pedido.created_at)} · {quantidade} {quantidade === 1 ? "item" : "itens"}</p>
        </div>

        <div className="pedido-card-resumo-direita">
          <strong>{formatarMoeda(pedido.total)}</strong>
          <span className={`pedido-status pedido-status-${classeStatus}`}>{pedido.status || "Pendente"}</span>
          <span className="pedido-seta">{aberto ? "▲" : "▼"}</span>
        </div>
      </button>

      {aberto && (
        <div className="pedido-detalhes">
          <div className="pedido-dados-grid">
            <div><span>Telefone</span><strong>{pedido.telefone || "Não informado"}</strong></div>
            <div><span>Endereço</span><strong>{pedido.endereco || "A combinar"}</strong></div>
            <div className="pedido-observacoes"><span>Observações</span><strong>{pedido.observacoes || "Nenhuma observação"}</strong></div>
          </div>

          <div className="pedido-itens">
            <h4>Itens do pedido</h4>
            {itens.map((item) => {
              const subtotal = converterPreco(item.preco) * Number(item.quantidade || 0);
              return (
                <div className="pedido-item" key={item.id}>
                  {item.imagem ? <img src={item.imagem} alt={item.nome} /> : <div className="pedido-item-sem-imagem">Sem imagem</div>}
                  <div className="pedido-item-info">
                    <strong>{item.nome}</strong>
                    <span>{item.quantidade}x {item.preco}</span>
                  </div>
                  <strong>{formatarMoeda(subtotal)}</strong>
                </div>
              );
            })}
          </div>

          <div className="pedido-acoes">
            <label>
              Status
              <select value={pedido.status || "Pendente"} onChange={(evento) => aoAtualizarStatus(evento.target.value)} disabled={salvando}>
                {STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>

            {telefoneWhatsApp && (
              <a className="pedido-whatsapp" href={`https://wa.me/${telefoneWhatsApp}`} target="_blank" rel="noreferrer">Abrir WhatsApp</a>
            )}

            <button type="button" className="pedido-excluir" onClick={aoExcluir} disabled={salvando}>Excluir pedido</button>
          </div>
        </div>
      )}
    </article>
  );
}

export default PedidoCard;
