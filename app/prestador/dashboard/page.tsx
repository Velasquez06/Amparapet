'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, Calendar, MessageCircle, AlertTriangle, LogOut, User, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface UserData { id: number; name: string; email: string; role: string; city?: string; }
interface Appointment {
  id: number; client_name: string; service_type: string; date: string;
  time: string; status: string; pet_name: string; pet_species: string; location: string; notes: string;
}

const STATUS_COLOR: Record<string, string> = {
  pendente: '#f59e0b', confirmado: '#10b981', concluido: '#6b7280', cancelado: '#ef4444',
};
const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado',
};

export default function PrestadorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.user || data.user.role === 'tutor') { router.push('/login'); return; }
      setUser(data.user);
      const apptRes = await fetch('/api/appointments');
      const apptData = await apptRes.json();
      setAppointments(apptData.appointments || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setUpdating(null);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <PawPrint size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    </div>
  );

  const pending = appointments.filter(a => a.status === 'pendente');
  const confirmed = appointments.filter(a => a.status === 'confirmado');
  const total = appointments.length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PawPrint size={22} color="var(--accent)" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>Ampara Pet</span>
          <span style={{ fontSize: '0.75rem', background: 'var(--accent)', color: 'white', padding: '0.15rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>
            {user?.role === 'veterinario' ? 'Veterinário' : 'Cuidador'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Olá, <strong>{user?.name?.split(' ')[0]}</strong></span>
          <Link href="/prestador/perfil">
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
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Painel do Profissional 👨‍⚕️</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Gerencie seus atendimentos e agenda</p>
        </div>

        {/* Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total de Atendimentos', value: total, color: 'var(--accent)', icon: '📋' },
            { label: 'Pendentes', value: pending.length, color: '#f59e0b', icon: '⏳' },
            { label: 'Confirmados', value: confirmed.length, color: '#10b981', icon: '✅' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, fontFamily: 'Poppins' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ações rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { href: '/prestador/agenda', icon: <Calendar size={20} />, label: 'Minha Agenda', color: '#e67e22' },
            { href: '/prestador/perfil', icon: <User size={20} />, label: 'Meu Perfil', color: 'var(--accent)' },
            { href: '/tutor/emergencia', icon: <AlertTriangle size={20} />, label: 'Emergência', color: '#c0392b' },
          ].map((a, i) => (
            <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', border: '2px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = a.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}>
                <div style={{ color: a.color, marginBottom: '0.5rem' }}>{a.icon}</div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{a.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Solicitações pendentes */}
        {pending.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ background: '#f59e0b', color: 'white', borderRadius: '999px', padding: '0.15rem 0.6rem', fontSize: '0.8rem' }}>{pending.length}</span>
              Solicitações Pendentes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pending.map(a => (
                <div key={a.id} className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{a.service_type}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        👤 {a.client_name} · 📅 {new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR')} às {a.time}
                      </div>
                      {a.pet_name && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>🐾 {a.pet_name} ({a.pet_species}) · {a.location === 'em_casa' ? '🏠 Em casa' : '🏥 Na clínica'}</div>}
                      {a.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>"{a.notes}"</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => updateStatus(a.id, 'cancelado')} disabled={updating === a.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1.5px solid #ef4444', background: 'white', color: '#ef4444', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                        <XCircle size={14} /> Recusar
                      </button>
                      <button onClick={() => updateStatus(a.id, 'confirmado')} disabled={updating === a.id}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.5rem 0.85rem', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                        <CheckCircle size={14} /> Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Todos os agendamentos */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Todos os Agendamentos</h2>
          {appointments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <p>Nenhum agendamento ainda. Seus clientes irão aparecer aqui.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {appointments.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '12px', background: 'white', border: '1px solid var(--border)', gap: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{a.service_type}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {a.client_name} · {new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR')} às {a.time}
                      {a.pet_name && ` · 🐾 ${a.pet_name}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: STATUS_COLOR[a.status], background: STATUS_COLOR[a.status] + '20', padding: '0.2rem 0.6rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                      {STATUS_LABEL[a.status]}
                    </span>
                    {a.status === 'confirmado' && (
                      <button onClick={() => updateStatus(a.id, 'concluido')} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: 'none', background: '#6b7280', color: 'white', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
