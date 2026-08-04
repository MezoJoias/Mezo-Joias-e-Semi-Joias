import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ImageUpload from "../components/ImageUpload";
import MultiImageUpload from "../components/MultiImageUpload";
import { AuthContext } from "../context/AuthContext";
import { ProductsContext } from "../context/ProductsContext";
import { nomesCategorias } from "../data/categorias";
import { uploadImagemProduto } from "../services/storage";
import { normalizarVariacoes } from "../utils/variacoes";

const estadoInicial = {
  nome: "",
  preco: "",
  categoria: "",
  descricao: "",
  imagem: "",
  imagens: [],
  variacoes: [],
};

function Admin() {
  const { sair } = useContext(AuthContext);
  const { produtos, adicionarProduto, editarProduto, excluirProduto } =
    useContext(ProductsContext);
  const navigate = useNavigate();

  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [arquivosImagensExtras, setArquivosImagensExtras] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [formulario, setFormulario] = useState(estadoInicial);
  const [produtoEditando, setProdutoEditando] = useState(null);

  const sairDoPainel = async () => {
    await sair();
    navigate("/admin/login");
  };

  const atualizarCampo = ({ target: { name, value } }) => {
    setFormulario((estadoAtual) => ({ ...estadoAtual, [name]: value }));
  };

  const adicionarVariacao = () => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      variacoes: [
        ...estadoAtual.variacoes,
        { nome: "", opcoes: [{ nome: "", preco: "" }] },
      ],
    }));
  };

  const atualizarNomeVariacao = (variacaoIndex, valor) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      variacoes: estadoAtual.variacoes.map((variacao, index) =>
        index === variacaoIndex ? { ...variacao, nome: valor } : variacao
      ),
    }));
  };

  const adicionarOpcao = (variacaoIndex) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      variacoes: estadoAtual.variacoes.map((variacao, index) =>
        index === variacaoIndex
          ? {
              ...variacao,
              opcoes: [...variacao.opcoes, { nome: "", preco: "" }],
            }
          : variacao
      ),
    }));
  };

  const atualizarOpcao = (variacaoIndex, opcaoIndex, campo, valor) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      variacoes: estadoAtual.variacoes.map((variacao, index) =>
        index === variacaoIndex
          ? {
              ...variacao,
              opcoes: variacao.opcoes.map((opcao, indice) =>
                indice === opcaoIndex ? { ...opcao, [campo]: valor } : opcao
              ),
            }
          : variacao
      ),
    }));
  };

  const removerOpcao = (variacaoIndex, opcaoIndex) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      variacoes: estadoAtual.variacoes.map((variacao, index) =>
        index === variacaoIndex
          ? {
              ...variacao,
              opcoes: variacao.opcoes.filter((_, indice) => indice !== opcaoIndex),
            }
          : variacao
      ),
    }));
  };

  const removerVariacao = (variacaoIndex) => {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      variacoes: estadoAtual.variacoes.filter(
        (_, index) => index !== variacaoIndex
      ),
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
      alert("Preencha nome, preço, categoria e selecione uma imagem.");
      return;
    }

    const variacoesInvalidas = formulario.variacoes.some(
      (variacao) =>
        !String(variacao.nome || "").trim() ||
        !Array.isArray(variacao.opcoes) ||
        variacao.opcoes.length === 0 ||
        variacao.opcoes.some((opcao) => !String(opcao.nome || "").trim())
    );

    if (variacoesInvalidas) {
      alert("Preencha o nome da variação e o nome de todas as opções.");
      return;
    }

    try {
      setEnviando(true);

      let urlImagem = formulario.imagem;
      if (arquivoImagem) {
        urlImagem = await uploadImagemProduto(arquivoImagem);
      }

      const imagensExtrasExistentes = formulario.imagens.filter(
        (imagem) => typeof imagem === "string" && imagem.trim()
      );
      const novasUrlsImagensExtras = await Promise.all(
        arquivosImagensExtras.map(uploadImagemProduto)
      );
      const todasAsImagens = [
        urlImagem,
        ...imagensExtrasExistentes,
        ...novasUrlsImagensExtras,
      ].filter(
        (imagem, index, lista) => imagem && lista.indexOf(imagem) === index
      );

      const variacoes = formulario.variacoes.map((variacao) => ({
        nome: variacao.nome.trim(),
        opcoes: variacao.opcoes.map((opcao) => ({
          nome: opcao.nome.trim(),
          preco: String(opcao.preco || "").trim(),
        })),
      }));

      const dadosProduto = {
        ...formulario,
        imagem: urlImagem,
        imagens: todasAsImagens,
        variacoes,
      };

      if (produtoEditando !== null) {
        await editarProduto({ ...dadosProduto, id: produtoEditando });
        alert("Produto atualizado com sucesso!");
      } else {
        await adicionarProduto(dadosProduto);
        alert("Produto cadastrado com sucesso!");
      }

      setFormulario(estadoInicial);
      setProdutoEditando(null);
      setArquivoImagem(null);
      setArquivosImagensExtras([]);
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro);
      alert(erro?.message || "Não foi possível salvar o produto.");
    } finally {
      setEnviando(false);
    }
  };

  const iniciarEdicao = (produto) => {
    setProdutoEditando(produto.id);
    setArquivoImagem(null);
    setArquivosImagensExtras([]);

    const imagensAdicionais = (produto.imagens || []).filter(
      (imagem) => imagem !== produto.imagem
    );

    setFormulario({
      nome: produto.nome || "",
      preco: produto.preco || "",
      categoria: produto.categoria || "",
      descricao: produto.descricao || "",
      imagem: produto.imagem || "",
      imagens: imagensAdicionais,
      variacoes: normalizarVariacoes(produto.variacoes).map((variacao) => ({
        nome: variacao.nome,
        opcoes: variacao.opcoes.map((opcao) => ({ ...opcao })),
      })),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicao = () => {
    setProdutoEditando(null);
    setFormulario(estadoInicial);
    setArquivoImagem(null);
    setArquivosImagensExtras([]);
  };

  const confirmarExclusao = async (produto) => {
    if (!window.confirm(`Deseja excluir o produto "${produto.nome}"?`)) {
      return;
    }

    try {
      await excluirProduto(produto.id);
    } catch (erro) {
      alert(erro?.message || "Não foi possível excluir o produto.");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-header">
        <span>Painel administrativo</span>
        <h1>{produtoEditando !== null ? "Editar produto" : "Cadastrar produto"}</h1>
        <p>Gerencie os produtos exibidos na loja.</p>
        <div className="admin-header-actions">
          <Link to="/admin/pedidos" className="admin-orders-button">Ver pedidos</Link>
          <button type="button" className="admin-logout-button" onClick={sairDoPainel}>Sair do painel</button>
        </div>
      </section>

      <section className="admin-form-section">
        <form className="admin-form" onSubmit={salvarProduto}>
          <div className="admin-form-grid">
            <label>
              Nome do produto
              <input type="text" name="nome" value={formulario.nome} onChange={atualizarCampo} placeholder="Ex.: Pulseira Dourada" disabled={enviando} />
            </label>
            <label>
              Preço base
              <input type="text" name="preco" value={formulario.preco} onChange={atualizarCampo} placeholder="Ex.: 39,90" disabled={enviando} />
            </label>
            <label>
              Categoria
              <select name="categoria" value={formulario.categoria} onChange={atualizarCampo} disabled={enviando}>
                <option value="">Selecione uma categoria</option>
                {nomesCategorias.map((categoria) => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Descrição
            <textarea name="descricao" value={formulario.descricao} onChange={atualizarCampo} placeholder="Descreva o produto..." rows="5" disabled={enviando} />
          </label>

          <section className="admin-variations-section">
            <div className="admin-variations-header">
              <div>
                <h3>Variações do produto</h3>
                <p>O preço da opção substitui o preço base. Deixe vazio quando a opção não mudar o valor.</p>
              </div>
              <button type="button" onClick={adicionarVariacao} disabled={enviando}>+ Adicionar variação</button>
            </div>

            {formulario.variacoes.length === 0 ? (
              <p className="admin-variations-empty">Este produto não possui variações.</p>
            ) : (
              <div className="admin-variations-list">
                {formulario.variacoes.map((variacao, variacaoIndex) => (
                  <article className="admin-variation-card" key={variacaoIndex}>
                    <div className="admin-variation-card-header">
                      <label>
                        Nome da variação
                        <input
                          type="text"
                          value={variacao.nome}
                          onChange={(evento) =>
                            atualizarNomeVariacao(variacaoIndex, evento.target.value)
                          }
                          placeholder="Ex.: Quantidade"
                          disabled={enviando}
                        />
                      </label>
                      <button type="button" className="admin-remove-variation" onClick={() => removerVariacao(variacaoIndex)} disabled={enviando}>Remover variação</button>
                    </div>

                    <div className="admin-variation-options-heading">
                      <span>Opção</span>
                      <span>Preço da opção</span>
                      <span></span>
                    </div>

                    <div className="admin-variation-options-list">
                      {variacao.opcoes.map((opcao, opcaoIndex) => (
                        <div className="admin-variation-option-row" key={opcaoIndex}>
                          <input
                            type="text"
                            value={opcao.nome}
                            onChange={(evento) =>
                              atualizarOpcao(
                                variacaoIndex,
                                opcaoIndex,
                                "nome",
                                evento.target.value
                              )
                            }
                            placeholder="Ex.: Kit com 3"
                            disabled={enviando}
                          />
                          <input
                            type="text"
                            inputMode="decimal"
                            value={opcao.preco}
                            onChange={(evento) =>
                              atualizarOpcao(
                                variacaoIndex,
                                opcaoIndex,
                                "preco",
                                evento.target.value
                              )
                            }
                            placeholder="Ex.: 105,00"
                            disabled={enviando}
                          />
                          <button
                            type="button"
                            className="admin-remove-option"
                            onClick={() => removerOpcao(variacaoIndex, opcaoIndex)}
                            disabled={enviando || variacao.opcoes.length === 1}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>

                    <button type="button" className="admin-add-option" onClick={() => adicionarOpcao(variacaoIndex)} disabled={enviando}>+ Adicionar opção</button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <ImageUpload
            titulo="Imagem principal"
            imagem={formulario.imagem}
            aoSelecionar={setArquivoImagem}
            aoRemover={() => {
              setArquivoImagem(null);
              setFormulario((atual) => ({ ...atual, imagem: "" }));
            }}
            enviando={enviando}
          />

          <MultiImageUpload
            imagensExistentes={formulario.imagens}
            arquivos={arquivosImagensExtras}
            aoSelecionar={(novos) =>
              setArquivosImagensExtras((atuais) => [...atuais, ...novos])
            }
            aoRemoverArquivo={(index) =>
              setArquivosImagensExtras((atuais) =>
                atuais.filter((_, indice) => indice !== index)
              )
            }
            aoRemoverImagemExistente={(index) =>
              setFormulario((atual) => ({
                ...atual,
                imagens: atual.imagens.filter((_, indice) => indice !== index),
              }))
            }
            enviando={enviando}
          />

          <div className="admin-form-actions">
            <button type="submit" className="admin-save-button" disabled={enviando}>{enviando ? "Enviando..." : produtoEditando !== null ? "Salvar alterações" : "Cadastrar produto"}</button>
            {produtoEditando !== null && <button type="button" className="admin-cancel-button" onClick={cancelarEdicao} disabled={enviando}>Cancelar edição</button>}
          </div>
        </form>
      </section>

      <section className="admin-products-section">
        <div className="admin-products-header">
          <div><span>Catálogo</span><h2>Produtos cadastrados</h2></div>
          <strong>{produtos.length} {produtos.length === 1 ? "produto" : "produtos"}</strong>
        </div>

        {produtos.length > 0 ? (
          <div className="admin-products-list">
            {produtos.map((produto) => (
              <article className="admin-product-card" key={produto.id}>
                <img src={produto.imagem} alt={produto.nome} />
                <div className="admin-product-info">
                  <span>{produto.categoria}</span>
                  <h3>{produto.nome}</h3>
                  <strong>{produto.preco}</strong>
                  <p>{produto.descricao}</p>
                  {normalizarVariacoes(produto.variacoes).length > 0 && (
                    <div className="admin-product-variations">
                      {normalizarVariacoes(produto.variacoes).map((variacao) => (
                        <small key={variacao.nome}>
                          <strong>{variacao.nome}:</strong>{" "}
                          {variacao.opcoes
                            .map((opcao) =>
                              opcao.preco
                                ? `${opcao.nome} (${opcao.preco})`
                                : opcao.nome
                            )
                            .join(", ")}
                        </small>
                      ))}
                    </div>
                  )}
                </div>
                <div className="admin-product-actions">
                  <button type="button" onClick={() => iniciarEdicao(produto)}>Editar</button>
                  <button type="button" className="admin-delete-button" onClick={() => confirmarExclusao(produto)}>Excluir</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty"><h3>Nenhum produto cadastrado</h3><p>Use o formulário acima para adicionar o primeiro produto.</p></div>
        )}
      </section>
    </main>
  );
}

export default Admin;
