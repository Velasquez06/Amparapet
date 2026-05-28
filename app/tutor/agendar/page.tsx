'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, ArrowLeft, CheckCircle } from 'lucide-react';

interface Professional { id: number; name: string; role: string; services: string[]; specialties: string[]; }
interface Pet { id: number; name: string; species: string; breed: string; }

const TIMES = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'];

function AgendarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profId = searchParams.get('profissional');

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedProf, setSelectedProf] = useState(profId || '');
  const [selectedPet, setSelectedPet] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('em_casa');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const [profRes, petRes] = await Promise.all([
        fetch('/api/professionals'),
        fetch('/api/pets'),
      ]);
      const profData = await profRes.json();
      const petData = await petRes.json();
      setProfessionals(profData.professionals || []);
      setPets(petData.pets || []);
    }
    load();
  }, []);

  const selectedProfObj = professionals.find(p => String(p.id) === selectedProf);
  const availableServices = selectedProfObj
    ? [...(selectedProfObj.services || []), ...(selectedProfObj.specialties || [])]
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!time) { setError('Selecione um horário'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professional_id: Number(selectedProf),
          pet_id: selectedPet ? Number(selectedPet) : null,
          service_type: serviceType,
          description, date, time, location, notes,
        }),
      });
      if (res.ok) setSuccess(true);
      else { const d = await res.json(); setError(d.error || 'Erro ao agendar'); }
    } catch { setError('Erro de conexão'); }
    finally { setLoading(false); }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card fade-up" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <CheckCircle size={56} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Agendamento realizado!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Seu agendamento foi enviado. Aguarde a confirmação do profissional.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link href="/tutor/agenda"><button className="btn-primary">Ver agenda</button></Link>
          <Link href="/tutor/dashboard"><button className="btn-outline">Início</button></Link>
        </div>
      </div>
    </div>
  );

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

      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.25rem' }}>Agendar Serviço</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Preencha os dados para solicitar um agendamento</p>

        {error && (
          <div style={{ background: '#fde8e8', border: '1px solid #f5c6c6', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#c0392b', fontSize: '0.85rem' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Profissional */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>👨‍⚕️ Profissional</h3>
            <label className="label">Selecione o profissional *</label>
            <select className="input" value={selectedProf} onChange={e => { setSelectedProf(e.target.value); setServiceType(''); }} required>
              <option value="">Escolha um profissional</option>
              {professionals.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.role === 'veterinario' ? 'Veterinário' : 'Cuidador'}</option>
              ))}
            </select>
            {availableServices.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <label className="label">Tipo de serviço *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {availableServices.map(s => (
                    <button key={s} type="button" onClick={() => setServiceType(s)}
                      style={{ padding: '0.4rem 0.85rem', borderRadius: '999px', border: '1.5px solid', borderColor: serviceType === s ? 'var(--accent)' : 'var(--border)', background: serviceType === s ? 'var(--accent)' : 'white', color: serviceType === s ? 'white' : 'var(--text)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pet */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>🐾 Seu Pet</h3>
            {pets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <p>Você ainda não tem pets cadastrados.</p>
                <Link href="/tutor/pets/novo" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Cadastrar pet →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {pets.map(p => (
                  <button key={p.id} type="button" onClick={() => setSelectedPet(String(p.id))}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.9rem', borderRadius: '10px', border: '1.5px solid', borderColor: selectedPet === String(p.id) ? 'var(--accent)' : 'var(--border)', background: selectedPet === String(p.id) ? '#f0f9f6' : 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.15s' }}>
                    <span>{p.species === 'Gato' ? '🐱' : '🐶'}</span> {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Descrição */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>📝 Detalhes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label className="label">Descreva o serviço desejado</label>
                <textarea className="input" rows={2} placeholder="Ex: Passeio de 30 minutos pelo parque..." value={description} onChange={e => setDescription(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="label">Observações adicionais</label>
                <textarea className="input" rows={2} placeholder="Ex: Meu pet é tímido com estranhos, avisar ao chegar..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>📅 Data e Horário</h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <label className="label">Data *</label>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="label">Horário *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {TIMES.map(t => (
                  <button key={t} type="button" onClick={() => setTime(t)}
                    style={{ padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1.5px solid', borderColor: time === t ? 'var(--accent)' : 'var(--border)', background: time === t ? 'var(--accent)' : 'white', color: time === t ? 'white' : 'var(--text)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Local */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>📍 Local do Atendimento</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[{ v: 'em_casa', l: '🏠 Em casa' }, { v: 'na_clinica', l: '🏥 Na clínica' }].map(o => (
                <button key={o.v} type="button" onClick={() => setLocation(o.v)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1.5px solid', borderColor: location === o.v ? 'var(--accent)' : 'var(--border)', background: location === o.v ? '#f0f9f6' : 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/tutor/dashboard" style={{ flex: 1, textDecoration: 'none' }}>
              <button type="button" className="btn-outline" style={{ width: '100%' }}>Cancelar</button>
            </Link>
            <button type="submit" className="btn-primary" disabled={loading || !selectedProf || !serviceType || !date} style={{ flex: 2 }}>
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function AgendarPage() {
  return <Suspense><AgendarForm /></Suspense>;
}
