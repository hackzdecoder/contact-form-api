// hooks/api.js or @hooks/api.js

import { useEffect, useState } from "react";

const useEndpoint = ({ url, method, body = null, trigger }) => {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        if (!url || !trigger) return;

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const res = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: method !== "GET" ? JSON.stringify(body) : null,
                });
                const data = await res.json();
                setResponse(data);
            } catch (err) {
                console.error("API Error:", err);
                setResponse({ error: "Something went wrong!" });
            }
        };

        fetchData();
    }, [trigger]);

    return response;
};

export default useEndpoint;
