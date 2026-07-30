import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { ProductsContext } from "../context/ProductsContext";
import { criarPedido } from "../services/pedidos";

function Carrinho() {
  const {
    carrinho,
    setCarrinho,
    removerDoCarrinho,
  } = useContext(CartContext);

  const { produtos } = useContext(ProductsContext);

  const [cliente, setCliente] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    observacoes: "",
  });

  const [finalizando, setFinalizando] = useState(false);

  const converterPreco = (preco) => {
    if (!preco) {
      return 0;
    }

    if (typeof preco === "number") {
      return preco;
    }

    return Number(
      preco
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim()
    );
  };

  const formatarPreco = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const aumentarQuantidade = (chaveItem) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.map((item) =>
        item.chaveItem === chaveItem
          ? {
              ...item,
              quantidade: item.quantidade + 1,
            }
          : item
      )
    );
  };

  const diminuirQuantidade = (chaveItem) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) =>
          item.chaveItem === chaveItem
            ? {
                ...item,
                quantidade: item.quantidade - 1,
              }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const limparCarrinho = () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja esvaziar o carrinho?"
    );

    if (confirmar) {
      setCarrinho([]);
    }
  };

  const atualizarCliente = (evento) => {
    const { name, value } = evento.target;

    setCliente((estadoAtual) => ({
      ...estadoAtual,
      [name]: value,
    }));
  };

  const itensDoCarrinho = carrinho
    .map((itemCarrinho) => {
      const produto = produtos.find(
        (item) =>
          String(item.id) === String(itemCarrinho.id)
      );

      if (!produto) {
        return null;
      }

      return {
        ...produto,
        quantidade: itemCarrinho.quantidade,
        variacoesSelecionadas: itemCarrinho.variacoesSelecionadas || {},
        chaveItem: itemCarrinho.chaveItem,
      };
    })
    .filter(Boolean);

  const quantidadeTotal = itensDoCarrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const total = itensDoCarrinho.reduce(
    (soma, item) => {
      const precoUnitario = converterPreco(item.preco);

      return soma + precoUnitario * item.quantidade;
    },
    0
  );

  const finalizarPedido = async () => {
    if (itensDoCarrinho.length === 0 || finalizando) {
      return;
    }

    if (!cliente.nome.trim()) {
      window.alert("Informe seu nome.");
      return;
    }

    if (!cliente.telefone.trim()) {
      window.alert("Informe seu telefone.");
      return;
    }

    const janelaWhatsapp = window.open("", "_blank");

    try {
      setFinalizando(true);

      const pedido = await criarPedido({
        cliente,
        itens: itensDoCarrinho,
        total,
      });

      const telefoneLoja = "5551980486979";

      const listaProdutos = itensDoCarrinho
        .map((item) => {
          const subtotal =
            converterPreco(item.preco) *
            item.quantidade;

          return [
            `${item.quantidade}x ${item.nome}`,
            ...Object.entries(item.variacoesSelecionadas || {}).map(
              ([nome, valor]) => `${nome}: ${valor}`
            ),
            `Preço unitário: ${item.preco}`,
            `Subtotal: ${formatarPreco(subtotal)}`,
          ].join("\n");
        })
        .join("\n\n");

      const mensagem = `
Olá! Gostaria de confirmar meu pedido.

Número do pedido: ${pedido.numero}

Cliente: ${cliente.nome.trim()}
Telefone: ${cliente.telefone.trim()}
Endereço: ${cliente.endereco.trim() || "A combinar"}

Produtos:

${listaProdutos}

Quantidade de itens: ${quantidadeTotal}
Total dos produtos: ${formatarPreco(total)}
Frete: A combinar

Observações:
${cliente.observacoes.trim() || "Nenhuma observação"}
      `.trim();

      const link = `https://wa.me/${telefoneLoja}?text=${encodeURIComponent(
        mensagem
      )}`;

      setCarrinho([]);

      setCliente({
        nome: "",
        telefone: "",
        endereco: "",
        observacoes: "",
      });

      if (janelaWhatsapp) {
        janelaWhatsapp.location.href = link;
      } else {
        window.location.href = link;
      }

      window.alert(
        `Pedido ${pedido.numero} criado com sucesso!`
      );
    } catch (erro) {
      if (janelaWhatsapp) {
        janelaWhatsapp.close();
      }

      console.error(
        "Erro ao finalizar pedido:",
        erro
      );

      window.alert(
        erro?.message ||
          "Não foi possível finalizar o pedido."
      );
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <main className="cart-page">
      <div className="cart-header">
        <span>Seu pedido</span>
        <h1>Carrinho de compras</h1>

        {itensDoCarrinho.length > 0 && (
          <p>
            {quantidadeTotal}{" "}
            {quantidadeTotal === 1
              ? "item no carrinho"
              : "itens no carrinho"}
          </p>
        )}
      </div>

      {itensDoCarrinho.length > 0 ? (
        <div className="cart-layout">
          <section className="cart-items">
            {itensDoCarrinho.map((item) => {
              const subtotal =
                converterPreco(item.preco) *
                item.quantidade;

              return (
                <article
                  className="cart-item"
                  key={item.chaveItem}
                >
                  <Link
                    to={`/produto/${item.id}`}
                    className="cart-item-image"
                  >
                    <img
                      src={item.imagem}
                      alt={item.nome}
                    />
                  </Link>

                  <div className="cart-item-info">
                    <p>{item.categoria}</p>

                    <Link
                      to={`/produto/${item.id}`}
                      className="cart-item-name"
                    >
                      <h2>{item.nome}</h2>
                    </Link>

                    <strong>{item.preco}</strong>

                    {Object.keys(item.variacoesSelecionadas || {}).length > 0 && (
                      <div className="cart-item-variations">
                        {Object.entries(item.variacoesSelecionadas).map(([nome, valor]) => (
                          <span key={nome}><strong>{nome}:</strong> {valor}</span>
                        ))}
                      </div>
                    )}

                    <div className="cart-quantity">
                      <button
                        type="button"
                        onClick={() =>
                          diminuirQuantidade(item.chaveItem)
                        }
                        disabled={finalizando}
                        aria-label={`Diminuir quantidade de ${item.nome}`}
                      >
                        −
                      </button>

                      <span>{item.quantidade}</span>

                      <button
                        type="button"
                        onClick={() =>
                          aumentarQuantidade(item.chaveItem)
                        }
                        disabled={finalizando}
                        aria-label={`Aumentar quantidade de ${item.nome}`}
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-item-subtotal">
                      Subtotal:{" "}
                      <strong>
                        {formatarPreco(subtotal)}
                      </strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() =>
                      removerDoCarrinho(item.chaveItem)
                    }
                    disabled={finalizando}
                  >
                    Remover
                  </button>
                </article>
              );
            })}

            <button
              type="button"
              className="clear-cart-button"
              onClick={limparCarrinho}
              disabled={finalizando}
            >
              Esvaziar carrinho
            </button>
          </section>

          <aside className="cart-summary">
            <h2>Resumo do pedido</h2>

            <div className="checkout-customer-form">
              <label>
                Nome

                <input
                  type="text"
                  name="nome"
                  value={cliente.nome}
                  onChange={atualizarCliente}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  disabled={finalizando}
                  required
                />
              </label>

              <label>
                Telefone

                <input
                  type="tel"
                  name="telefone"
                  value={cliente.telefone}
                  onChange={atualizarCliente}
                  placeholder="(48) 99999-9999"
                  autoComplete="tel"
                  disabled={finalizando}
                  required
                />
              </label>

              <label>
                Endereço

                <input
                  type="text"
                  name="endereco"
                  value={cliente.endereco}
                  onChange={atualizarCliente}
                  placeholder="Rua, número e bairro"
                  autoComplete="street-address"
                  disabled={finalizando}
                />
              </label>

              <label>
                Observações

                <textarea
                  name="observacoes"
                  value={cliente.observacoes}
                  onChange={atualizarCliente}
                  placeholder="Tamanho, cor, referência ou observação..."
                  rows="4"
                  disabled={finalizando}
                />
              </label>
            </div>

            <div className="cart-summary-line">
              <span>
                {quantidadeTotal === 1
                  ? "1 produto"
                  : `${quantidadeTotal} produtos`}
              </span>

              <strong>{formatarPreco(total)}</strong>
            </div>

            <div className="cart-summary-line">
              <span>Frete</span>
              <strong>A combinar</strong>
            </div>

            <div className="cart-total">
              <span>Total</span>
              <strong>{formatarPreco(total)}</strong>
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={finalizarPedido}
              disabled={finalizando}
            >
              {finalizando
                ? "Finalizando..."
                : "Finalizar pedido"}
            </button>

            <Link
              to="/#produtos"
              className="continue-shopping"
            >
              ← Continuar comprando
            </Link>
          </aside>
        </div>
      ) : (
        <div className="empty-cart">
          <span>🛍️</span>

          <h2>Seu carrinho está vazio</h2>

          <p>
            Adicione produtos para montar seu pedido.
          </p>

          <Link
            to="/#produtos"
            className="empty-cart-link"
          >
            Ver produtos
          </Link>
        </div>
      )}
    </main>
  );
}

export default Carrinho;