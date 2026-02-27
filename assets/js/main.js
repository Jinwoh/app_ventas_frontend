import { apiGet } from "./api.js";

const grid = document.querySelector("#products-grid");
const resultsInfo = document.querySelector("#results-info");

function formatGs(value) {
  const n = Number(value ?? 0);
  return `Gs. ${new Intl.NumberFormat("es-PY").format(n)}`;
}

function safeText(v) {
  return (v ?? "").toString();
}

function stockLabel(activo) {
  return activo
    ? `<span class="text-xs font-semibold text-emerald-600">En stock</span>`
    : `<span class="text-xs font-semibold text-rose-600">Sin stock</span>`;
}

function productCardHTML(p) {
  const nombre = safeText(p.nombre);
  const descripcion = safeText(p.descripcion) || "Sin descripción";
  const precio = formatGs(p.precio);

  // tu API ya devuelve URL completa de cloudinary en "imagen"
  const imgUrl =
    p.imagen || "https://via.placeholder.com/600x450?text=Producto";

  // Categoria viene como objeto: {id, nombre}
  const categoria = p.categoria?.nombre ? safeText(p.categoria.nombre) : "";

  return `
    <div class="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col">
      <div class="relative aspect-[4/3] bg-slate-50 dark:bg-slate-900 p-6 flex items-center justify-center">
        <img
          class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
          src="${imgUrl}"
          alt="${nombre}"
          loading="lazy"
        />
        <button
          class="absolute bottom-3 right-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
          type="button"
          title="Favorito"
        >
          <span class="material-symbols-outlined text-sm">favorite</span>
        </button>
      </div>

      <div class="p-4 flex flex-col flex-1">
        <h3 class="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
          ${nombre}
        </h3>

        <p class="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
          ${descripcion}
        </p>

        ${
          categoria
            ? `<p class="text-xs text-slate-400 mb-3">Categoría: ${categoria}</p>`
            : ""
        }

        <div class="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div class="flex flex-col">
            <span class="text-lg font-bold text-slate-900 dark:text-white">${precio}</span>
            ${stockLabel(Boolean(p.activo))}
          </div>

          <button class="bg-primary hover:bg-blue-600 text-white p-2 rounded-lg transition-colors" type="button">
            <span class="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProductsPage(payload) {
  if (!grid) return;

  const productos = payload?.results ?? [];
  const total = payload?.count ?? productos.length;

  if (resultsInfo) {
    // DRF paginado: resultados de esta página = productos.length
    const shownFrom = productos.length > 0 ? 1 : 0;
    const shownTo = productos.length;
    resultsInfo.textContent = `Showing ${shownFrom}-${shownTo} of ${total} results`;
  }

  if (!productos.length) {
    grid.innerHTML = `<p class="text-slate-500 dark:text-slate-400">No hay productos cargados.</p>`;
    return;
  }

  grid.innerHTML = productos.map(productCardHTML).join("");
}

async function loadProducts() {
  try {
    if (grid)
      grid.innerHTML = `<p class="text-slate-500 dark:text-slate-400">Cargando...</p>`;

    // tu endpoint real:
    const data = await apiGet("/api/catalog/productos/");
    renderProductsPage(data);
  } catch (err) {
    console.error(err);
    if (grid)
      grid.innerHTML = `<p class="text-rose-600">Error: ${err.message}</p>`;
  }
}

loadProducts();
