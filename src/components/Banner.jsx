function Banner() {
  const irParaProdutos = () => {
    const secaoProdutos = document.getElementById("produtos");

    if (secaoProdutos) {
      secaoProdutos.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="banner">
      <p className="banner-label">Mezo Joias e Semi-Joias</p>

      <h1>Elegância em cada detalhe</h1>

      <p>
        Descubra joias que transformam momentos especiais em
        lembranças inesquecíveis.
      </p>

      <button type="button" onClick={irParaProdutos}>
        Comprar Agora
      </button>
    </section>
  );
}

export default Banner;