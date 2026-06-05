'use client';
import { useEffect, useState } from 'react';
export default function PerfilTutor(){
    const[user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(data => setUser(data.user));
    },[]);
    if (!user) return <p>Carregando...</p>;
    return(
        <div style={{ padding: '2rem' }}>
            <h1>Olá, {user.name}!</h1>
            <p>Email: {user.email}</p>
        </div>
    );
}