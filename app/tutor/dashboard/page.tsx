'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, Search, Calendar, MessageCircle, AlertTriangle, LogOut, Plus, User, ChevronRight } from 'lucide-react';

interface UserData { id: number; name: string; email: string; role: string; city?: string; }
interface Pet { id: number; name: string; species: string; breed: string; }
interface Appointment { id: number; professional_name: string; service_type: string; date: string; time: string; status: string; pet_name: string; }

export default function TutorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.user || data.user.role !== 'tutor') { router.push('/login'); return; }
      setUser(data.user);

      const [petsRes, apptRes] = await Promise.all([
        fetch('/api/pets'),
        fetch('/api/appointments'),
      ]);
      const petsData = await petsRes.json();
      const apptData = await apptRes.json();
      setPets(petsData.pets || []);
      setAppointments(apptData.appointments || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  const statusColor: Record<string, string> = {
    pendente: '#f59e0b', confirmado: '#10b981', concluido: '#6b7280', cancelado: '#ef4444',
  };
  const statusLabel: Record<string, string> = {
    pendente: 'Pendente', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado',
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <PawPrint size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    </div>
  );

  const upcoming = appointments.filter(a => a.status === 'pendente' || a.status === 'confirmado').slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PawPrint size={22} color="var(--accent)" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>Ampara Pet</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Olá, <strong style={{ color: 'var(--text)' }}>{user?.name?.split(' ')[0]}</strong></span>
          <Link href="/tutor/perfil">
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <User size={18} />
            </div>
          </Link>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Boas-vindas */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Bom dia, {user?.name?.split(' ')[0]}! 👋</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Gerencie seus pets e agendamentos por aqui</p>
        </div>

        {/* Ações rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { href: '/tutor/profissionais', icon: <Search size={22} />, label: 'Buscar Profissionais', color: '#5b8c7a' },
            { href: '/tutor/agendar', icon: <Calendar size={22} />, label: 'Agendar Serviço', color: '#7c6fcd' },
            { href: '/tutor/agenda', icon: <Calendar size={22} />, label: 'Minha Agenda', color: '#e67e22' },
            { href: '/tutor/emergencia', icon: <AlertTriangle size={22} />, label: 'Emergência', color: '#c0392b' },
          ].map((a, i) => (
            <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', border: '2px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = a.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}>
                <div style={{ color: a.color, marginBottom: '0.5rem' }}>{a.icon}</div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>{a.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Meus Pets */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>🐾 Meus Pets</h2>
              <Link href="/tutor/pets/novo" style={{ textDecoration: 'none' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                  <Plus size={14} /> Novo
                </button>
              </Link>
            </div>
            {pets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
                <PawPrint size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                <p style={{ fontSize: '0.85rem' }}>Nenhum pet cadastrado ainda</p>
                <Link href="/tutor/pets/novo" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>Cadastrar pet</button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pets.map(pet => (
                  <div key={pet.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '10px', background: 'var(--bg)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      {pet.species === 'Gato' ? '🐱' : '🐶'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pet.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pet.breed || pet.species}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximos agendamentos */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>📅 Próximos Agendamentos</h2>
              <Link href="/tutor/agenda" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
                <Calendar size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                <p style={{ fontSize: '0.85rem' }}>Nenhum agendamento próximo</p>
                <Link href="/tutor/agendar" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>Agendar serviço</button>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {upcoming.map(appt => (
                  <div key={appt.id} style={{ padding: '0.6rem 0.75rem', borderRadius: '10px', background: 'var(--bg)', borderLeft: `3px solid ${statusColor[appt.status]}` }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{appt.service_type}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {appt.professional_name} · {new Date(appt.date + 'T12:00:00').toLocaleDateString('pt-BR')} às {appt.time}
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: statusColor[appt.status] }}>{statusLabel[appt.status]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
