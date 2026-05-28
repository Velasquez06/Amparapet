'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PawPrint, Phone, AlertTriangle } from 'lucide-react';

interface Pet { id: number; name: string; species: string; breed: string; }

const EMERGENCY_SIGNS = [
  'Sangramento intenso', 'Vômito persistente com sangue', 'Ingestão de substância tóxica',
  'Dificuldade para respirar', 'Convulsões', 'Perda de consciência',
  'Fraturas visíveis', 'Temperatura muito alta ou baixa', 'Desorientação súbita',
  'Trauma grave', 'Picada de cobra ou inseto', 'Mais de 24h sem comer/beber',
];

export default function EmergenciaPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/pets').then(r => r.json()).then(d => setPets(d.pets || []));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5e8e8' }}>
      <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow)' }}>
        <Link href="/tutor/dashboard" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>
          <ArrowLeft size={18} /> Voltar
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PawPrint size={20} color="var(--accent)" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--accent)' }}>Ampara Pet</span>
        </div>
      </header>

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle color="#c0392b" /> Modo Emergência
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Acesso rápido a atendimento veterinário de urgência</p>

        {/* Botão de emergência */}
        <div style={{ background: '#fde8e8', border: '2px solid #c0392b', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#c0392b', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Está é uma emergência?</p>
          <p style={{ color: '#c0392b', fontSize: '0.9rem', marginBottom: '1rem' }}>Se seu pet está em perigo imediato, NÃO ESPERE O PIOR. Ligue agora.</p>
          <a href="tel:192">
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '10px', padding: '0.85rem 1.5rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              <Phone size={20} /> Ligar para 192 (Emergência)
            </button>
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Qual pet */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>🐾 Qual pet precisa de atendimento?</h2>
            {pets.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum pet cadastrado.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pets.map(p => (
                  <button key={p.id} onClick={() => setSelectedPet(p.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid', borderColor: selectedPet === p.id ? '#c0392b' : 'var(--border)', background: selectedPet === p.id ? '#fde8e8' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: '1.5rem' }}>{p.species === 'Gato' ? '🐱' : '🐶'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.breed || p.species}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quando é emergência */}
          <div style={{ background: '#fff8e8', border: '1.5px solid #f59e0b', borderRadius: '14px', padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#b45309', marginBottom: '0.75rem' }}>⚠️ Quando é emergência?</h2>
            <p style={{ fontSize: '0.82rem', color: '#b45309', marginBottom: '0.5rem' }}>Leve seu pet imediatamente ao veterinário se apresentar:</p>
            <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {EMERGENCY_SIGNS.map(s => (
                <li key={s} style={{ fontSize: '0.8rem', color: '#92400e' }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contatos de vets */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>📞 Veterinários disponíveis na plataforma</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Dra. Helena Andrade', spec: 'Ortopedia', phone: '(61) 9 9999-0003' },
              { name: 'Dr. Carlos Oliveira', spec: 'Clínico Geral', phone: '(61) 9 9999-0004' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '10px', background: 'var(--bg)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{v.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Especialidade: {v.spec}</div>
                </div>
                <a href={`tel:${v.phone}`}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 0.9rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                    <Phone size={14} /> {v.phone}
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
