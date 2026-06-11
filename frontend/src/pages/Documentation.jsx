import { AlertCircle, ChevronLeft, ChevronRight, ExternalLink, FileText, Loader2, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import { documentationPdfGitHubUrl, documentationPdfUrl } from "../config/platform.js";

const pdfJsUrl = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs";
const pdfWorkerUrl = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";

export default function Documentation() {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [previewRequested, setPreviewRequested] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.15);
  const [status, setStatus] = useState({ type: "idle" });

  useEffect(() => {
    if (!previewRequested || pdfDocument) {
      return undefined;
    }

    let ignore = false;

    async function loadPdf() {
      setStatus({ type: "loading", message: "Loading documentation preview..." });

      try {
        const pdfjsLib = await import(/* @vite-ignore */ pdfJsUrl);
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

        const documentTask = pdfjsLib.getDocument({ url: documentationPdfUrl });
        const loadedDocument = await documentTask.promise;

        if (!ignore) {
          setPdfDocument(loadedDocument);
          setPageCount(loadedDocument.numPages);
          setPageNumber(1);
          setStatus({ type: "ready" });
        }
      } catch (error) {
        if (!ignore) {
          setStatus({
            type: "error",
            message: error?.message || "Could not load the PDF preview. Open the document on GitHub instead."
          });
        }
      }
    }

    void loadPdf();

    return () => {
      ignore = true;
    };
  }, [pdfDocument, previewRequested]);

  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) {
      return undefined;
    }

    let ignore = false;

    async function renderPage() {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // Completed render tasks may not need cancellation.
          }
          renderTaskRef.current = null;
        }

        setStatus({ type: "rendering", message: "Rendering page..." });

        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        const renderTask = page.render({ canvasContext: context, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
        renderTaskRef.current = null;

        if (!ignore) {
          setStatus({ type: "ready" });
        }
      } catch (error) {
        if (!ignore && error?.name !== "RenderingCancelledException") {
          setStatus({
            type: "error",
            message: error?.message || "Could not render this PDF page."
          });
        }
      }
    }

    void renderPage();

    return () => {
      ignore = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Completed render tasks may not need cancellation.
        }
        renderTaskRef.current = null;
      }
    };
  }, [pageNumber, pdfDocument, scale]);

  return (
    <div>
      <PageHeader eyebrow="Documentation" title="Read project documentation">
        View the latest compiled project documentation inside the website.
      </PageHeader>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
              <FileText size={21} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">ER Project Hub Documentation</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                The PDF preview loads only when requested and renders inside this page.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPreviewRequested(true)}
              disabled={previewRequested}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <FileText size={16} aria-hidden="true" />
              {previewRequested ? "Preview Loaded" : "Preview PDF"}
            </button>
            <a
              href={documentationPdfGitHubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Open on GitHub
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        {!previewRequested ? (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            PDF preview is ready. Use Preview PDF to load and read it inside this page.
          </div>
        ) : (
          <div className="mt-5">
            <ViewerControls
              pageNumber={pageNumber}
              pageCount={pageCount}
              scale={scale}
              disabled={!pdfDocument || status.type === "loading"}
              onPrevious={() => setPageNumber((page) => Math.max(1, page - 1))}
              onNext={() => setPageNumber((page) => Math.min(pageCount, page + 1))}
              onZoomOut={() => setScale((value) => Math.max(0.75, Number((value - 0.15).toFixed(2))))}
              onZoomIn={() => setScale((value) => Math.min(1.75, Number((value + 0.15).toFixed(2))))}
            />

            {status.type === "loading" || status.type === "rendering" ? (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                {status.message}
              </div>
            ) : null}

            {status.type === "error" ? (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950">
                <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
                <p>{status.message}</p>
              </div>
            ) : null}

            <div className="mt-4 overflow-auto rounded-lg border border-slate-200 bg-slate-100 p-4">
              <canvas ref={canvasRef} className="mx-auto block rounded bg-white shadow-soft" />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ViewerControls({ pageNumber, pageCount, scale, disabled, onPrevious, onNext, onZoomOut, onZoomIn }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={disabled || pageNumber <= 1}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={disabled || pageNumber >= pageCount}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="rounded-lg bg-white px-3 py-2">
          Page {pageCount ? pageNumber : "-"} / {pageCount || "-"}
        </span>
        <button
          type="button"
          onClick={onZoomOut}
          disabled={disabled}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <span className="rounded-lg bg-white px-3 py-2">{Math.round(scale * 100)}%</span>
        <button
          type="button"
          onClick={onZoomIn}
          disabled={disabled}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
