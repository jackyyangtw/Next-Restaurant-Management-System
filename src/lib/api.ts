const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://strapi-demo-vue3-production.up.railway.app/api";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    return response.json();
};
