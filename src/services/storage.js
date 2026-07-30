import { supabase } from "./supabase";

export async function uploadImagemProduto(
  arquivo
) {
  if (!(arquivo instanceof File)) {
    throw new Error(
      "O arquivo selecionado é inválido."
    );
  }

  const extensao =
    arquivo.name
      .split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const nomeSeguro = arquivo.name
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();

  const nomeArquivo = `${
    crypto.randomUUID()
  }-${nomeSeguro}.${extensao}`;

  const caminho = `imagens/${nomeArquivo}`;

  const { error: erroUpload } =
    await supabase.storage
      .from("produtos")
      .upload(caminho, arquivo, {
        cacheControl: "3600",
        contentType: arquivo.type,
        upsert: false,
      });

  if (erroUpload) {
    console.error(
      "Erro completo do upload:",
      erroUpload
    );

    throw erroUpload;
  }

  const { data } = supabase.storage
    .from("produtos")
    .getPublicUrl(caminho);

  if (!data?.publicUrl) {
    throw new Error(
      "Não foi possível gerar a URL da imagem."
    );
  }

  return data.publicUrl;
}