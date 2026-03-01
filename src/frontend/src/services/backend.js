// Configuración del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Extrae el mensaje de error del backend sin importar la estructura
 * @param {Object} errorData - JSON devuelto por el backend
 * @param {number} status - Código HTTP
 * @returns {string} Mensaje de error legible
 */
function extractErrorMessage(errorData, status) {
  if (!errorData || typeof errorData !== "object") {
    return `Error HTTP: ${status}`;
  }

  return (
    errorData.message ||
    errorData.detail ||
    errorData.error ||
    errorData.msg ||
    (Array.isArray(errorData.errors) && errorData.errors.join(", ")) ||
    `Error HTTP: ${status}`
  );
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  // Error HTTP
  if (!response.ok) {
    throw new Error(extractErrorMessage(data, response.status));
  }

  // Error lógico (status: "error")
  if (data?.status?.toLowerCase?.() === "error") {
    throw new Error(extractErrorMessage(data, response.status));
  }

  return data;
}

/**
 * Subir un único documento al backend
 * @param {File} file - Archivo a subir
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function uploadDocument(file) {
  if (!file) {
    throw new Error("No se ha proporcionado ningún archivo");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/documento`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response);
}

/**
 * Subir múltiples documentos al backend
 * @param {FileList|Array<File>} files - Lista de archivos a subir
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function uploadDocuments(files) {
  if (!files || files.length === 0) {
    throw new Error("No se han proporcionado archivos");
  }

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const response = await fetch(`${API_BASE_URL}/documentos`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response);
}

/**
 * Realizar una consulta para analizar documentos
 * @param {string} query - Consulta a realizar
 * @returns {Promise<Object>} Resultado del análisis
 */
export async function analyzeDocuments(query) {
  if (!query || query.trim() === "") {
    throw new Error("La consulta no puede estar vacía");
  }

  const response = await fetch(
    `${API_BASE_URL}/analyze?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
    },
  );

  return handleResponse(response);
}

/**
 * Verificar el estado del servidor
 * @returns {Promise<boolean>} true si el servidor está disponible
 */
export async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch {
    return false;
  }
}
