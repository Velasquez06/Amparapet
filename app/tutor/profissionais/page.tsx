'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PawPrint, Search, Star, MapPin, ArrowLeft, Stethoscope, Heart } from 'lucide-react';

interface Professional {
  id: number; name: string; role: string; city: string; avatar: string;
  bio: string; experience_years: number; crmv: string;
  services: string[]; specialties: string[];
  rating: number; total_reviews: number; total_appointments: number;
}

export default function BuscarProfissionais() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | 'cuidador' | 'veterinario'>('todos');

  useEffect(() => { fetchProfessionals(); }, []);

  async function fetchProfessionals() {
    setLoading(true);
    const res = await fetch('/api/professionals');
    const data = await res.json();
    setProfessionals(data.professionals || []);
    setLoading(false);
  }

  const filtered = professionals.filter(p => {
    const matchType = filter === 'todos' || p.role === filter;
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchName;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/tutor/dashboard" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>
            <ArrowLeft size={18} /> Voltar
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PawPrint size={20} color="var(--accent)" />
            <span style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--accent)' }}>Ampara Pet</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem' }}>Buscar Profissionais</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Encontre o profissional ideal para cuidar do seu pet</p>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['todos', 'cuidador', 'veterinario'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0.6rem 1.1rem', borderRadius: '10px', border: '1.5px solid', borderColor: filter === f ? 'var(--accent)' : 'var(--border)', background: filter === f ? 'var(--accent)' : 'white', color: filter === f ? 'white' : 'var(--text)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                {f === 'todos' ? 'Todos' : f === 'cuidador' ? '🤝 Cuidadores' : '🩺 Veterinários'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Carregando profissionais...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Search size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p>Nenhum profissional encontrado</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(p => (
              <div key={p.id} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>

                {/* Avatar */}
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: p.role === 'veterinario' ? '#2c5f4a' : 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.6rem' }}>
                  {p.role === 'veterinario' ? '🩺' : '🤝'}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{p.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                        <span style={{ fontSize: '0.8rem', background: p.role === 'veterinario' ? '#2c5f4a' : 'var(--accent)', color: 'white', padding: '0.15rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
                          {p.role === 'veterinario' ? 'Médico Veterinário' : 'Cuidador'}
                        </span>
                        {p.crmv && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>CRMV {p.crmv}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem' }}>
                        <Star size={16} fill="#f59e0b" /> {p.rating.toFixed(1)}
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>({p.total_reviews})</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.total_appointments} atendimentos</div>
                    </div>
                  </div>

                  {p.city && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0.4rem 0' }}>
                      <MapPin size={13} /> {p.city}
                    </div>
                  )}

                  {p.bio && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0.4rem 0' }}>{p.bio.slice(0, 120)}{p.bio.length > 120 ? '...' : ''}</p>}

                  {/* Serviços */}
                  {(p.services?.length > 0 || p.specialties?.length > 0) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                      {(p.services?.length > 0 ? p.services : p.specialties).slice(0, 4).map(s => (
                        <span key={s} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'white' }}>{s}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem' }}>
                    <Link href={`/tutor/profissionais/${p.id}`} style={{ textDecoration: 'none' }}>
                      <button className="btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>Ver perfil</button>
                    </Link>
                    <Link href={`/tutor/agendar?profissional=${p.id}`} style={{ textDecoration: 'none' }}>
                      <button className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}>Agendar</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
