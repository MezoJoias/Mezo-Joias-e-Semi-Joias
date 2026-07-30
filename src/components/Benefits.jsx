function Benefits() {
  const beneficios = [
    {
      icone: "🚚",
      titulo: "Envio para todo o Brasil",
      texto: "Consulte prazo e valor do frete pelo WhatsApp.",
    },
    {
      icone: "💬",
      titulo: "Atendimento personalizado",
      texto: "Tire suas dúvidas e escolha sua joia com ajuda.",
    },
    {
      icone: "💎",
      titulo: "Produtos selecionados",
      texto: "Peças escolhidas com cuidado para nossa coleção.",
    },
    {
      icone: "🔒",
      titulo: "Compra segura",
      texto: "Atendimento direto e confirmação antes do pagamento.",
    },
  ];

  return (
    <section className="benefits">
      <div className="benefits-grid">
        {beneficios.map((beneficio) => (
          <article
            className="benefit-card"
            key={beneficio.titulo}
          >
            <span className="benefit-icon">
              {beneficio.icone}
            </span>

            <div>
              <h3>{beneficio.titulo}</h3>
              <p>{beneficio.texto}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Benefits;