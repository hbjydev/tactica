import { XhrHttpClient } from '@inertiajs/core';
import type { HttpRequestConfig, HttpResponse } from '@inertiajs/core';

export class CredentialedXhrClient extends XhrHttpClient {
    protected override doRequest(
        config: HttpRequestConfig,
    ): Promise<HttpResponse> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            const url = new URL(config.url);
            if (config.params) {
                Object.entries(config.params).forEach(([k, v]) =>
                    url.searchParams.set(k, String(v)),
                );
            }

            xhr.open(config.method.toUpperCase(), url.toString(), true);

            const xsrfToken = document.cookie.match(
                new RegExp('(^|;\\s*)(XSRF-TOKEN)=([^;]*)'),
            )?.[3];
            if (xsrfToken) {
                xhr.setRequestHeader(
                    'X-XSRF-TOKEN',
                    decodeURIComponent(xsrfToken),
                );
            }

            if (config.headers) {
                const isFormData = config.data instanceof FormData;
                Object.entries(config.headers).forEach(([key, value]) => {
                    if (key.toLowerCase() !== 'content-type' || !isFormData) {
                        xhr.setRequestHeader(key, String(value));
                    }
                });
            }

            if (config.onUploadProgress) {
                xhr.upload.onprogress = (event) => {
                    const progress = event.lengthComputable
                        ? event.loaded / event.total
                        : undefined;
                    config.onUploadProgress!({
                        progress,
                        percentage: progress ? Math.round(progress * 100) : 0,
                        loaded: event.loaded,
                        total: event.lengthComputable ? event.total : undefined,
                    });
                };
            }

            if (config.signal) {
                config.signal.addEventListener('abort', () => xhr.abort());
            }

            xhr.onabort = () => reject(new Error('Request was cancelled'));
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.onload = () => {
                const headers: Record<string, string> = {};
                xhr.getAllResponseHeaders()
                    .split('\r\n')
                    .forEach((line) => {
                        const idx = line.indexOf(':');
                        if (idx > 0) {
                            headers[line.slice(0, idx).toLowerCase().trim()] =
                                line.slice(idx + 1).trim();
                        }
                    });
                resolve({
                    status: xhr.status,
                    data: xhr.responseText,
                    headers,
                });
            };

            let body: BodyInit | null = null;
            if (config.data != null) {
                if (config.data instanceof FormData) {
                    body = config.data;
                } else if (typeof config.data === 'object') {
                    body = JSON.stringify(config.data);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                } else {
                    body = String(config.data);
                }
            }

            xhr.send(body);
        });
    }
}
