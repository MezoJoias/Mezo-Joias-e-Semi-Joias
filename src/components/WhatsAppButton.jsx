function WhatsAppButton() {
  const telefone = "5551980486979";

  const mensagem =
    "Olá! Vim pelo site da Mezo Joias e gostaria de mais informações.";

  const link = `https://wa.me/${telefone}?text=${encodeURIComponent(
    mensagem
  )}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-floating"
      aria-label="Falar com a Mezo Joias pelo WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <span>💬</span>

      <strong>WhatsApp</strong>
    </a>
  );
}

export default WhatsAppButton;