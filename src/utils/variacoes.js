export function converterPreco(preco) {
  if (typeof preco === "number") {
    return Number.isFinite(preco) ? preco : 0;
  }

  if (preco === null || preco === undefined || preco === "") {
    return 0;
  }

  const texto = String(preco)
    .replace("R$", "")
    .replace(/\s/g, "")
    .trim();

  if (!texto) {
    return 0;
  }

  const normalizado = texto.includes(",")
    ? texto.replace(/\./g, "").replace(",", ".")
    : texto;

  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : 0;
}

export function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function normalizarOpcao(opcao) {
  if (typeof opcao === "string" || typeof opcao === "number") {
    return {
      nome: String(opcao).trim(),
      preco: "",
    };
  }

  return {
    nome: String(opcao?.nome ?? opcao?.valor ?? opcao?.label ?? "").trim(),
    preco:
      opcao?.preco === null || opcao?.preco === undefined
        ? ""
        : String(opcao.preco).trim(),
  };
}

export function normalizarVariacoes(variacoes = []) {
  return (Array.isArray(variacoes) ? variacoes : [])
    .map((variacao) => ({
      nome: String(variacao?.nome || "").trim(),
      opcoes: (Array.isArray(variacao?.opcoes) ? variacao.opcoes : [])
        .map(normalizarOpcao)
        .filter((opcao) => opcao.nome),
    }))
    .filter((variacao) => variacao.nome && variacao.opcoes.length > 0);
}

export function obterOpcaoSelecionada(variacao, valorSelecionado) {
  return (variacao?.opcoes || [])
    .map(normalizarOpcao)
    .find((opcao) => opcao.nome === valorSelecionado);
}

export function obterPrecoSelecionado(produto, selecoes = {}) {
  let preco = converterPreco(produto?.preco);

  normalizarVariacoes(produto?.variacoes).forEach((variacao) => {
    const opcao = obterOpcaoSelecionada(
      variacao,
      selecoes[variacao.nome]
    );

    if (opcao && opcao.preco !== "") {
      preco = converterPreco(opcao.preco);
    }
  });

  return preco;
}
