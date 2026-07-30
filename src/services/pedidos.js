import { supabase } from "./supabase";

function gerarNumeroPedido() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const codigo = Math.floor(1000 + Math.random() * 9000);

  return `MZ-${ano}${mes}${dia}-${codigo}`;
}

export async function criarPedido({ cliente, itens, total }) {
  if (!cliente?.nome?.trim()) throw new Error("Informe o nome do cliente.");
  if (!cliente?.telefone?.trim()) throw new Error("Informe o telefone do cliente.");
  if (!itens?.length) throw new Error("O carrinho está vazio.");

  const numero = gerarNumeroPedido();

  const { data: pedido, error: erroPedido } = await supabase
    .from("pedidos")
    .insert({
      numero,
      nome_cliente: cliente.nome.trim(),
      telefone: cliente.telefone.trim(),
      endereco: cliente.endereco?.trim() || "",
      observacoes: cliente.observacoes?.trim() || "",
      total,
      status: "Pendente",
    })
    .select()
    .single();

  if (erroPedido) {
    console.error("Erro ao criar pedido:", erroPedido);
    throw new Error("Não foi possível salvar o pedido.");
  }

  const itensParaSalvar = itens.map((item) => ({
    pedido_id: pedido.id,
    produto_id: item.id,
    nome: item.nome,
    preco: item.preco,
    quantidade: item.quantidade,
    imagem: item.imagem || "",
    variacoes: item.variacoesSelecionadas || {},
  }));

  const { error: erroItens } = await supabase
    .from("itens_pedido")
    .insert(itensParaSalvar);

  if (erroItens) {
    console.error("Erro ao salvar itens:", erroItens);
    await supabase.from("pedidos").delete().eq("id", pedido.id);
    throw new Error("O pedido foi criado, mas os itens não puderam ser salvos.");
  }

  return { ...pedido, itens: itensParaSalvar };
}

export async function buscarPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*, itens_pedido(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw new Error("Não foi possível carregar os pedidos.");
  }

  return data || [];
}

export async function atualizarStatusPedido(id, status) {
  const { data, error } = await supabase
    .from("pedidos")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar status:", error);
    throw new Error("Não foi possível atualizar o status do pedido.");
  }

  return data;
}

export async function excluirPedido(id) {
  const { error } = await supabase.from("pedidos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir pedido:", error);
    throw new Error("Não foi possível excluir o pedido.");
  }
}

export function assinarPedidos(aoAlterar) {
  const canal = supabase
    .channel("pedidos-tempo-real")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "pedidos" },
      aoAlterar
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "itens_pedido" },
      aoAlterar
    )
    .subscribe();

  return () => supabase.removeChannel(canal);
}
