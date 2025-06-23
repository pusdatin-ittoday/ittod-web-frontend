import { useEffect, useState } from "react";

export function useRegisStatus(competitionKey) {
    const [isRegisOpen, setIsRegisOpen] = useState(null);

    useEffect(() => {
        fetch("/config/registration-config.json")
            .then(res => res.json())
            .then(config => setIsRegisOpen(config[competitionKey]?.isRegisOpen ?? false));
    }, [competitionKey]);

    return isRegisOpen;
}

export function useBatch() {
    const [batch, setBatch] = useState(null);

    useEffect(() => {
        fetch("/config/registration-config.json")
            .then(res => res.json())
            .then(config => setBatch(config.batch ?? null));
    }, []);

    return String(batch).charAt(0).toUpperCase() + String(batch).slice(1);
}