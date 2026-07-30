const categorias = [
  {
    nome: "Anéis",
    icone: "💍",
    texto: "Peças delicadas para todos os momentos.",
  },
  {
    nome: "Colares",
    icone: "📿",
    texto: "Modelos que destacam sua personalidade.",
  },
  {
    nome: "Brincos",
    icone: "✨",
    texto: "Detalhes que transformam qualquer produção.",
  },
  {
    nome: "Pulseiras",
    icone: "💎",
    texto: "Elegância e charme para o seu dia.",
  },
];

function Categories({
  categoriaSelecionada,
  aoSelecionarCategoria,
}) {
  return (
    <section className="categories">
      <div className="section-heading">
        <span>Nossa coleção</span>
        <h2>Compre por categoria</h2>

        <p>
          Encontre com facilidade a peça perfeita para você.
        </p>
      </div>

      <div className="categories-grid">
        {categorias.map((categoria) => (
          <button
            type="button"
            className={
              categoriaSelecionada === categoria.nome
                ? "category-card active"
                : "category-card"
            }
            key={categoria.nome}
            onClick={() =>
              aoSelecionarCategoria(categoria.nome)
            }
          >
            <span className="category-icon">
              {categoria.icone}
            </span>

            <h3>{categoria.nome}</h3>
            <p>{categoria.texto}</p>

            <strong>Ver produtos →</strong>
          </button>
        ))}
      </div>

      {categoriaSelecionada !== "Todos" && (
        <button
          type="button"
          className="show-all-categories"
          onClick={() => aoSelecionarCategoria("Todos")}
        >
          Mostrar todos os produtos
        </button>
      )}
    </section>
  );
}

export default Categories;