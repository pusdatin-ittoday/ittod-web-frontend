import { useEffect, useState } from "react";
import instance from "../api/axios";

export function useRegisStatus(competitionKey) {
    const [isRegisOpen, setIsRegisOpen] = useState(null);

    useEffect(() => {
        if (!competitionKey) return;
        
        instance.get(`/api/events/${competitionKey}`)
            .then(res => {
                if (res.data && res.data.success) {
                    setIsRegisOpen(!!res.data.data.is_active);
                } else {
                    setIsRegisOpen(false);
                }
            })
            .catch(err => {
                console.error("Error fetching registration status:", err);
                setIsRegisOpen(false);
            });
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