import { useState, useEffect } from 'react';
import { getUsers } from '../api/user';
export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getUsers()
            .then((res) => setUsers(res.data))
            .finally(() => setLoading(false));
    }, []);
    return { users, loading };
};