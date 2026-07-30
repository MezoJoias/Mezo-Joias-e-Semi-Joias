import {
  useEffect,
  useRef,
  useState,
} from "react";

function MultiImageUpload({
  imagensExistentes = [],
  arquivos = [],
  aoSelecionar,
  aoRemoverArquivo,
  aoRemoverImagemExistente,
  enviando = false,
}) {
  const inputRef = useRef(null);
  const [arrastando, setArrastando] =
    useState(false);

  const [previews, setPreviews] =
    useState([]);

  useEffect(() => {
    const novosPreviews = arquivos.map(
      (arquivo) => ({
        arquivo,
        url: URL.createObjectURL(arquivo),
      })
    );

    setPreviews(novosPreviews);

    return () => {
      novosPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [arquivos]);

  const validarArquivos = (listaArquivos) => {
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const tamanhoMaximo = 5 * 1024 * 1024;

    const arquivosValidos = [];

    Array.from(listaArquivos).forEach(
      (arquivo) => {
        if (!tiposPermitidos.includes(arquivo.type)) {
          alert(
            `O arquivo "${arquivo.name}" não é JPG, PNG ou WEBP.`
          );

          return;
        }

        if (arquivo.size > tamanhoMaximo) {
          alert(
            `A imagem "${arquivo.name}" ultrapassa 5 MB.`
          );

          return;
        }

        arquivosValidos.push(arquivo);
      }
    );

    if (arquivosValidos.length > 0) {
      aoSelecionar(arquivosValidos);
    }
  };

  const selecionarArquivos = (evento) => {
    validarArquivos(evento.target.files);

    evento.target.value = "";
  };

  const soltarArquivos = (evento) => {
    evento.preventDefault();
    setArrastando(false);

    validarArquivos(
      evento.dataTransfer.files
    );
  };

  return (
    <section className="multi-image-upload">
      <div className="multi-image-upload-header">
        <div>
          <h2>Imagens adicionais</h2>

          <p>
            Selecione várias fotos do produto.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={enviando}
        >
          Adicionar imagens
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={selecionarArquivos}
        disabled={enviando}
      />

      <div
        className={`multi-image-dropzone ${
          arrastando
            ? "multi-image-dropzone-active"
            : ""
        }`}
        onClick={() =>
          !enviando &&
          inputRef.current?.click()
        }
        onDragEnter={(evento) => {
          evento.preventDefault();
          setArrastando(true);
        }}
        onDragOver={(evento) => {
          evento.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={(evento) => {
          evento.preventDefault();
          setArrastando(false);
        }}
        onDrop={soltarArquivos}
      >
        <strong>
          Clique ou arraste as imagens aqui
        </strong>

        <span>
          JPG, PNG ou WEBP — até 5 MB cada
        </span>
      </div>

      {imagensExistentes.length === 0 &&
        arquivos.length === 0 && (
          <p className="multi-image-empty">
            Nenhuma imagem adicional.
          </p>
        )}

      <div className="multi-image-grid">
        {imagensExistentes.map(
          (imagem, index) => (
            <article
              className="multi-image-card"
              key={`existente-${imagem}-${index}`}
            >
              <img
                src={imagem}
                alt={`Imagem adicional ${
                  index + 1
                }`}
              />

              <span>Salva</span>

              <button
                type="button"
                onClick={() =>
                  aoRemoverImagemExistente(
                    index
                  )
                }
                disabled={enviando}
              >
                Remover
              </button>
            </article>
          )
        )}

        {previews.map(
          (preview, index) => (
            <article
              className="multi-image-card"
              key={`${preview.arquivo.name}-${preview.arquivo.lastModified}`}
            >
              <img
                src={preview.url}
                alt={preview.arquivo.name}
              />

              <span>Nova</span>

              <button
                type="button"
                onClick={() =>
                  aoRemoverArquivo(index)
                }
                disabled={enviando}
              >
                Remover
              </button>
            </article>
          )
        )}
      </div>
    </section>
  );
}

export default MultiImageUpload;