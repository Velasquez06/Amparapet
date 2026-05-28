'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, ArrowLeft, Star, MapPin, Clock, Shield } from 'lucide-react';

interface Professional {
  id: number; name: string; email: string; role: string; phone: string; city: string; state: string; avatar: string;
  bio: string; experience_years: number; crmv: string; crmv_state: string; graduation: string;
  services: string[]; specialties: string[]; availability: Record<string, string>;
  rating: number; total_reviews: number; total_appointments: number;
}

export default function PrestadorPerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user || meData.user.role === 'tutor') { router.push('/login'); return; }

      const profRes = await fetch(`/api/professionals/${meData.user.id}`);
      const profData = await profRes.json();
      setProfile(profData.professional);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <PawPrint size={40} color="var(--accent)" />
    </div>
  );

  if (!profile) return null;

  const isVet = profile.role === 'veterinario';
  const services = isVet ? profile.specialties : profile.services;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow)' }}>
        <Link href="/prestador/dashboard" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>
          <ArrowLeft size={18} /> Voltar
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PawPrint size={20} color="var(--accent)" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--accent)' }}>Ampara Pet</span>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header do perfil */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: isVet ? '#2c5f4a' : 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', flexShrink: 0 }}>
              {isVet ? '🩺' : '🤝'}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{profile.name}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.82rem', background: isVet ? '#2c5f4a' : 'var(--accent)', color: 'white', padding: '0.2rem 0.7rem', borderRadius: '999px', fontWeight: 600 }}>
                  {isVet ? 'Médico Veterinário' : 'Cuidador'}
                </span>
                {profile.crmv && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '0.2rem 0.7rem', borderRadius: '999px', border: '1px solid var(--border)' }}>CRMV-{profile.crmv_state} {profile.crmv}</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                {profile.city && <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} />{profile.city}, {profile.state}</span>}
                <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} />{profile.experience_years} anos de experiência</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>
                <Star size={18} fill="#f59e0b" /> {profile.rating?.toFixed(1) || '0.0'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{profile.total_reviews} avaliações</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{profile.total_appointments} atendimentos</div>
            </div>
          </div>
          {profile.bio && <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>{profile.bio}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Serviços */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.85rem' }}>🛠️ Serviços oferecidos</h2>
            {services?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {services.map(s => (
                  <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.88rem' }}>{s}</span>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum serviço cadastrado.</p>}
          </div>

          {/* Disponibilidade */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.85rem' }}>📅 Disponibilidade</h2>
            {profile.availability && Object.keys(profile.availability).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.entries(profile.availability).map(([day, hours]) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>{day}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{hours}</span>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Disponibilidade não configurada.</p>}
          </div>

          {/* Formação (vet) */}
          {isVet && profile.graduation && (
            <div className="card">
              <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.85rem' }}>🎓 Formação</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{profile.graduation}</p>
            </div>
          )}

          {/* Limitações (cuidador) */}
          {!isVet && (
            <div style={{ background: '#fff8e8', border: '1.5px solid #f59e0b', borderRadius: '14px', padding: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} /> Limitações
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#92400e', marginBottom: '0.5rem' }}>Por não possuir CRMV:</p>
              <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {['Não pode aplicar medicamentos ou vacinas', 'Não realiza procedimentos veterinários', 'Não pode diagnosticar doenças'].map(l => (
                  <li key={l} style={{ fontSize: '0.82rem', color: '#92400e' }}>{l}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Para editar seu perfil, entre em contato com o suporte.</p>
        </div>
      </main>
    </div>
  );
}
