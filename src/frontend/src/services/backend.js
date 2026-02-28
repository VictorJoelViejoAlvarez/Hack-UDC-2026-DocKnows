// Configuración del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Subir un único documento al backend
 * @param {File} file - Archivo a subir
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function uploadDocument(file) {
    if (!file) {
        throw new Error('No se ha proporcionado ningún archivo');
    }

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/documento`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al subir documento:', error);
        throw error;
    }
}

/**
 * Subir múltiples documentos al backend
 * @param {FileList|Array<File>} files - Lista de archivos a subir
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function uploadDocuments(files) {
    if (!files || files.length === 0) {
        throw new Error('No se han proporcionado archivos');
    }

    try {
        const formData = new FormData();
        
        // Agregar todos los archivos al FormData
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        const response = await fetch(`${API_BASE_URL}/documentos`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al subir documentos:', error);
        throw error;
    }
}

/**
 * Realizar una consulta para analizar documentos
 * @param {string} query - Consulta a realizar
 * @returns {Promise<Object>} Resultado del análisis
 */
export async function analyzeDocuments(query) {
    if (!query || query.trim() === '') {
        throw new Error('La consulta no puede estar vacía');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/analyze?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al analizar documentos:', error);
        throw error;
    }
}

/**
 * Verificar el estado del servidor
 * @returns {Promise<boolean>} true si el servidor está disponible
 */
export async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000) // 5 segundos de timeout
        });
        return response.ok;
    } catch (error) {
        console.error('Servidor no disponible:', error);
        return false;
    }
}