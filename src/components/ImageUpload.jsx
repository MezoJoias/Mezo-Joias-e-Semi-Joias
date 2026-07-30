import {
  useEffect,
  useRef,
  useState,
} from "react";

function ImageUpload({
  imagem,
  aoSelecionar,
  aoRemover,
  titulo = "Imagem principal",
  enviando = false,
}) {
  const inputRef = useRef(null);

  const [arrastando, setArrastando] =
    useState(false);

  const [erro, setErro] = useState("");

  const [previewLocal, setPreviewLocal] =
    useState("");

  useEffect(() => {
    return () => {
      if (previewLocal.startsWith("blob:")) {
        URL.revokeObjectURL(previewLocal);
      }
    };
  }, [previewLocal]);

  useEffect(() => {
    if (!imagem && previewLocal) {
      if (previewLocal.startsWith("blob:")) {
        URL.revokeObjectURL(previewLocal);
      }

      setPreviewLocal("");
    }
  }, [imagem, previewLocal]);

  const limparPreviewLocal = () => {
    if (previewLocal.startsWith("blob:")) {
      URL.revokeObjectURL(previewLocal);
    }

    setPreviewLocal("");
  };

  const processarArquivo = (arquivo) => {
    setErro("");

    if (!arquivo) {
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {
      setErro(
        "Use uma imagem JPG, PNG ou WEBP."
      );

      return;
    }

    const tamanhoMaximo = 2 * 1024 * 1024;

    if (arquivo.size > tamanhoMaximo) {
      setErro(
        "A imagem deve ter no máximo 2 MB."
      );

      return;
    }

    limparPreviewLocal();

    const novaPreview =
      URL.createObjectURL(arquivo);

    setPreviewLocal(novaPreview);

    aoSelecionar(arquivo);
  };

  const selecionarPeloInput = (evento) => {
    const arquivo =
      evento.target.files?.[0];

    processarArquivo(arquivo);

    evento.target.value = "";
  };

  const soltarArquivo = (evento) => {
    evento.preventDefault();
    evento.stopPropagation();

    setArrastando(false);

    if (enviando) {
      return;
    }

    const arquivo =
      evento.dataTransfer.files?.[0];

    processarArquivo(arquivo);
  };

  const abrirSeletor = () => {
    if (!enviando) {
      inputRef.current?.click();
    }
  };

  const removerImagem = (evento) => {
    evento.preventDefault();
    evento.stopPropagation();

    limparPreviewLocal();
    setErro("");

    aoRemover();
  };

  const imagemExibida =
    previewLocal || imagem;

  return (
    <div className="image-upload">
      <p className="image-upload-title">
        {titulo}
      </p>

      <div
        className={`image-dropzone ${
          arrastando ? "dragging" : ""
        } ${
          imagemExibida ? "has-image" : ""
        } ${
          enviando ? "uploading" : ""
        }`}
        onDragEnter={(evento) => {
          evento.preventDefault();

          if (!enviando) {
            setArrastando(true);
          }
        }}
        onDragOver={(evento) => {
          evento.preventDefault();

          if (!enviando) {
            setArrastando(true);
          }
        }}
        onDragLeave={(evento) => {
          evento.preventDefault();

          if (
            !evento.currentTarget.contains(
              evento.relatedTarget
            )
          ) {
            setArrastando(false);
          }
        }}
        onDrop={soltarArquivo}
        onClick={abrirSeletor}
        role="button"
        tabIndex={enviando ? -1 : 0}
        aria-disabled={enviando}
        onKeyDown={(evento) => {
          if (
            !enviando &&
            (evento.key === "Enter" ||
              evento.key === " ")
          ) {
            evento.preventDefault();
            abrirSeletor();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={selecionarPeloInput}
          hidden
          disabled={enviando}
        />

        {imagemExibida ? (
          <div className="image-upload-preview">
            <img
              src={imagemExibida}
              alt="Prévia do produto"
            />

            <div className="image-upload-overlay">
              <span>
                {enviando
                  ? "Enviando imagem..."
                  : "Clique ou arraste outra imagem"}
              </span>

              {!enviando && (
                <button
                  type="button"
                  onClick={removerImagem}
                >
                  Remover imagem
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="image-upload-placeholder">
            <span className="image-upload-icon">
              ＋
            </span>

            <strong>
              {enviando
                ? "Enviando imagem..."
                : "Arraste uma imagem para cá"}
            </strong>

            {!enviando && (
              <>
                <p>
                  ou clique para selecionar
                </p>

                <small>
                  JPG, PNG ou WEBP — máximo 2 MB
                </small>
              </>
            )}
          </div>
        )}
      </div>

      {erro && (
        <p className="image-upload-error">
          {erro}
        </p>
      )}
    </div>
  );
}

export default ImageUpload;