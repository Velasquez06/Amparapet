'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PawPrint, ArrowLeft, ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';

interface Appointment {
  id: number; professional_name: string; service_type: string;
  date: string; time: string; status: string; pet_name: string; location: string;
}

const STATUS_COLOR: Record<string, string> = {
  pendente: '#f59e0b', confirmado: '#10b981', concluido: '#6b7280', cancelado: '#ef4444',
};
const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado',
};
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/appointments').then(r => r.json()).then(d => {
      setAppointments(d.appointments || []);
      setLoading(false);
    });
  }, []);

  function prevWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  }
  function nextWeek() {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  }

  // Gera os 7 dias da semana atual
  function getWeekDays() {
    const start = new Date(currentDate);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  const weekDays = getWeekDays();
  const monthLabel = MONTHS[currentDate.getMonth()] + ' ' + currentDate.getFullYear();

  function toYMD(d: Date) {
    return d.toISOString().split('T')[0];
  }

  function hasAppointment(d: Date) {
    const ymd = toYMD(d);
    return appointments.some(a => a.date === ymd);
  }

  const selectedAppts = selectedDate
    ? appointments.filter(a => a.date === selectedDate)
    : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow)' }}>
        <Link href="/tutor/dashboard" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>
          <ArrowLeft size={18} /> Voltar
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PawPrint size={20} color="var(--accent)" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--accent)' }}>Ampara Pet</span>
        </div>
      </header>

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Minha Agenda</h1>
            <p style={{ color: 'var(--text-muted)' }}>Visualize seus agendamentos</p>
          </div>
          <Link href="/tutor/agendar" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.6rem 1.1rem', fontSize: '0.88rem' }}>
              <Plus size={16} /> Novo agendamento
            </button>
          </Link>
        </div>

        {/* Calendário semanal */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button onClick={prevWeek} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}><ChevronLeft size={20} /></button>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{monthLabel}</span>
            <button onClick={nextWeek} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}><ChevronRight size={20} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
            {weekDays.map((d, i) => {
              const ymd = toYMD(d);
              const isToday = toYMD(d) === toYMD(today);
              const isSelected = selectedDate === ymd;
              const hasAppt = hasAppointment(d);
              return (
                <button key={i} onClick={() => setSelectedDate(isSelected ? null : ymd)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.6rem 0.3rem', borderRadius: '10px', border: '1.5px solid', borderColor: isSelected ? 'var(--accent)' : isToday ? 'var(--accent-light)' : 'transparent', background: isSelected ? 'var(--accent)' : isToday ? '#f0f9f6' : 'var(--bg)', cursor: 'pointer', transition: 'all 0.15s', position: 'relative' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginBottom: '2px' }}>{DAYS[d.getDay()]}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? 'white' : isToday ? 'var(--accent)' : 'var(--text)' }}>{d.getDate()}</span>
                  {hasAppt && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSelected ? 'white' : 'var(--accent)', marginTop: '3px' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Agendamentos do dia selecionado */}
        <div className="card">
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            {selectedDate
              ? `Agendamentos — ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}`
              : 'Selecione um dia para ver os agendamentos'}
          </h2>

          {!selectedDate ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
              Clique em um dia no calendário acima
            </p>
          ) : loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>Carregando...</p>
          ) : selectedAppts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
              <Calendar size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>Nenhum agendamento para este dia</p>
              <Link href="/tutor/agendar" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>Agendar serviço</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedAppts.map(a => (
                <div key={a.id} style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'var(--bg)', borderLeft: `4px solid ${STATUS_COLOR[a.status]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{a.service_type}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {a.professional_name} · {a.time} · {a.location === 'em_casa' ? '🏠 Em casa' : '🏥 Na clínica'}
                      </div>
                      {a.pet_name && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>🐾 {a.pet_name}</div>}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: STATUS_COLOR[a.status], background: STATUS_COLOR[a.status] + '20', padding: '0.2rem 0.6rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
                      {STATUS_LABEL[a.status]}
                    </span>
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
