import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { uploadImagemProduto } from "../services/storage";
import ImageUpload from "../components/ImageUpload";
import MultiImageUpload from "../components/MultiImageUpload";
import { AuthContext } from "../context/AuthContext";
import { ProductsContext } from "../context/ProductsContext";

function Admin() {
  const { sair } = useContext(AuthContext);

  const {
    produtos,
    adicionarProduto,
    editarProduto,
    excluirProduto,
    migrarProdutosAntigos,
  } = useContext(ProductsContext);

  const navigate = useNavigate();

  const estadoInicial = {
    nome: "",
    preco: "",
    categoria: "",
    descricao: "",
    imagem: "",
    imagens: [],
  };

  const [arquivoImagem, setArquivoImagem] =
    useState(null);
    const [
  arquivosImagensExtras,
  setArquivosImagensExtras,
] = useState([]);

  const [enviando, setEnviando] =
    useState(false);

  const [formulario, setFormulario] =
    useState(estadoInicial);

  const [produtoEditando, setProdutoEditando] =
    useState(null);

  const executarMigracao = async () => {
    const confirmar = window.confirm(
      "Deseja migrar os produtos antigos para o Supabase?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setEnviando(true);

      const resultado =
        await migrarProdutosAntigos();

      alert(resultado.mensagem);
    } catch (erro) {
      console.error(
        "Erro ao migrar produtos:",
        erro
      );

      alert(
        erro?.message ||
          "Não foi possível migrar os produtos."
      );
    } finally {
      setEnviando(false);
    }
  };

  const sairDoPainel = async () => {
    await sair();
    navigate("/admin/login");
  };

  const atualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [name]: value,
    }));
  };

  const salvarProduto = async (evento) => {
    evento.preventDefault();

    if (
      !formulario.nome.trim() ||
      !formulario.preco.trim() ||
      !formulario.categoria.trim() ||
      (!arquivoImagem && !formulario.imagem)
    ) {
      alert(
        "Preencha nome, preço, categoria e selecione uma imagem."
      );

      return;
    }

    try {
      setEnviando(true);

      let urlImagem = formulario.imagem;

      if (arquivoImagem) {
        urlImagem = await uploadImagemProduto(
          arquivoImagem
        );
      }

      const imagensExtrasExistentes =
  formulario.imagens.filter(
    (imagem) =>
      typeof imagem === "string" &&
      imagem.trim() !== ""
  );

const novasUrlsImagensExtras =
  await Promise.all(
    arquivosImagensExtras.map(
      (arquivo) =>
        uploadImagemProduto(arquivo)
    )
  );

const todasAsImagens = [
  urlImagem,
  ...imagensExtrasExistentes,
  ...novasUrlsImagensExtras,
].filter(
  (imagem, index, lista) =>
    imagem &&
    lista.indexOf(imagem) === index
);

      const dadosProduto = {
        ...formulario,
        imagem: urlImagem,
        imagens: todasAsImagens,
      };

      if (produtoEditando !== null) {
        await editarProduto({
          ...dadosProduto,
          id: produtoEditando,
        });

        alert("Produto atualizado com sucesso!");
      } else {
        await adicionarProduto(dadosProduto);

        alert("Produto cadastrado com sucesso!");
      }

      setFormulario(estadoInicial);
      setProdutoEditando(null);
      setArquivoImagem(null);
    } catch (erro) {
      console.error(
        "Erro ao salvar produto:",
        erro
      );

      alert(
        erro?.message ||
          "Não foi possível salvar o produto."
      );
    } finally {
      setArquivosImagensExtras([]);
      setEnviando(false);
    }
  };

  const iniciarEdicao = (produto) => {
    setProdutoEditando(produto.id);
    setArquivoImagem(null);
    setArquivosImagensExtras([]);

    const imagensAdicionais = (
      produto.imagens || []
    ).filter(
      (imagem) => imagem !== produto.imagem
    );

    setFormulario({
      nome: produto.nome || "",
      preco: produto.preco || "",
      categoria: produto.categoria || "",
      descricao: produto.descricao || "",
      imagem: produto.imagem || "",
      imagens: imagensAdicionais,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelarEdicao = () => {
    setProdutoEditando(null);
    setFormulario(estadoInicial);
    setArquivoImagem(null);
    setArquivosImagensExtras([]);
  };

  const confirmarExclusao = (produto) => {
    const confirmar = window.confirm(
      `Deseja excluir o produto "${produto.nome}"?`
    );

    if (confirmar) {
      excluirProduto(produto.id);
    }
  };

  const selecionarImagemPrincipal = (
  arquivo
) => {
  setArquivoImagem(arquivo);
};

  const removerImagemPrincipal = () => {
  setArquivoImagem(null);

  setFormulario((estadoAtual) => ({
    ...estadoAtual,
    imagem: "",
  }));
};

  const selecionarImagensExtras = (
  novosArquivos
) => {
  setArquivosImagensExtras(
    (arquivosAtuais) => [
      ...arquivosAtuais,
      ...novosArquivos,
    ]
  );
};

const removerArquivoImagemExtra = (
  index
) => {
  setArquivosImagensExtras(
    (arquivosAtuais) =>
      arquivosAtuais.filter(
        (_, indice) => indice !== index
      )
  );
};

const removerImagemExtraExistente = (
  index
) => {
  setFormulario((estadoAtual) => ({
    ...estadoAtual,
    imagens:
      estadoAtual.imagens.filter(
        (_, indice) => indice !== index
      ),
  }));
};

  return (
    <main className="admin-page">
      <section className="admin-header">
        <span>Painel administrativo</span>

        <h1>
          {produtoEditando !== null
            ? "Editar produto"
            : "Cadastrar produto"}
        </h1>

        <p>
          Gerencie os produtos exibidos na loja.
        </p>

        <div className="admin-header-actions">
          <Link to="/admin/pedidos" className="admin-orders-button">
            Ver pedidos
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={sairDoPainel}
          >
            Sair do painel
          </button>
        </div>

        <button
  type="button"
  onClick={executarMigracao}
  disabled={enviando}
>
  Migrar produtos antigos
</button>
      </section>

      <section className="admin-form-section">
        <form
          className="admin-form"
          onSubmit={salvarProduto}
        >
          <div className="admin-form-grid">
            <label>
              Nome do produto

              <input
                type="text"
                name="nome"
                value={formulario.nome}
                onChange={atualizarCampo}
                placeholder="Ex.: Anel Dourado"
              />
            </label>

            <label>
              Preço

              <input
                type="text"
                name="preco"
                value={formulario.preco}
                onChange={atualizarCampo}
                placeholder="Ex.: R$ 129,90"
              />
            </label>

            <label>
              Categoria

              <input
                type="text"
                name="categoria"
                value={formulario.categoria}
                onChange={atualizarCampo}
                placeholder="Ex.: Anéis"
              />
            </label>
          </div>

          <label>
            Descrição

            <textarea
              name="descricao"
              value={formulario.descricao}
              onChange={atualizarCampo}
              placeholder="Descreva o produto..."
              rows="5"
            />
          </label>

         <ImageUpload
  titulo="Imagem principal"
  imagem={formulario.imagem}
  aoSelecionar={selecionarImagemPrincipal}
  aoRemover={removerImagemPrincipal}
  enviando={enviando}
/>

<MultiImageUpload
  imagensExistentes={formulario.imagens}
  arquivos={arquivosImagensExtras}
  aoSelecionar={selecionarImagensExtras}
  aoRemoverArquivo={removerArquivoImagemExtra}
  aoRemoverImagemExistente={
    removerImagemExtraExistente
  }
  enviando={enviando}
/>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-save-button"
              disabled={enviando}
            >
              {enviando
                ? "Enviando..."
                : produtoEditando !== null
                  ? "Salvar alterações"
                  : "Cadastrar produto"}
            </button>

            {produtoEditando !== null && (
              <button
                type="button"
                className="admin-cancel-button"
                onClick={cancelarEdicao}
                disabled={enviando}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-products-section">
        <div className="admin-products-header">
          <div>
            <span>Catálogo</span>

            <h2>Produtos cadastrados</h2>
          </div>

          <strong>
            {produtos.length}{" "}
            {produtos.length === 1
              ? "produto"
              : "produtos"}
          </strong>
        </div>

        {produtos.length > 0 ? (
          <div className="admin-products-list">
            {produtos.map((produto) => (
              <article
                className="admin-product-card"
                key={produto.id}
              >
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                />

                <div className="admin-product-info">
                  <span>
                    {produto.categoria}
                  </span>

                  <h3>{produto.nome}</h3>

                  <strong>
                    {produto.preco}
                  </strong>

                  <p>
                    {produto.descricao}
                  </p>
                </div>

                <div className="admin-product-actions">
                  <button
                    type="button"
                    onClick={() =>
                      iniciarEdicao(produto)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() =>
                      confirmarExclusao(produto)
                    }
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <h3>
              Nenhum produto cadastrado
            </h3>

            <p>
              Use o formulário acima para
              adicionar o primeiro produto.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Admin;