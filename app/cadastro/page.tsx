'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, AlertCircle } from 'lucide-react';

type Role = 'tutor' | 'cuidador' | 'veterinario';

const ROLES = [
  { key: 'tutor' as Role, label: 'Tutor de Pet', icon: '🐾', desc: 'Quero contratar serviços para meu pet' },
  { key: 'cuidador' as Role, label: 'Cuidador', icon: '🤝', desc: 'Ofereço serviços de cuidado e passeios' },
  { key: 'veterinario' as Role, label: 'Médico Veterinário', icon: '🩺', desc: 'Ofereço atendimento veterinário' },
];

const CUIDADOR_SERVICES = ['Passeios', 'Banho e Tosa', 'Alimentação', 'Hospedagem', 'Day Care', 'Adestramento'];
const VET_SERVICES = ['Clínica Geral', 'Cirurgia', 'Dermatologia', 'Cardiologia', 'Ortopedia', 'Oncologia', 'Oftalmologia', 'Odontologia'];

export default function CadastroPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState< File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [crmvFile, setCrmvFile] = useState<File | null>(null);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [cep, setCep] = useState('');

  // Professional fields
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [crmv, setCrmv] = useState('');
  const [crmvState, setCrmvState] = useState('');
  const [graduation, setGraduation] = useState('');

  function toggleService(s: string) {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.currentTarget.files?.[0]
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function uploadFile(file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    await fetch('/api/upload', {method: 'POST', body: formData });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, password, role, phone, cpf, street, city, state, cep,
          bio, experience_years: Number(experienceYears),
          services: selectedServices,
          crmv, crmv_state: crmvState, graduation,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Erro ao criar conta'); return; }

      if (avatarFile) await uploadFile(avatarFile, 'avatar');
      if (diplomaFile) await uploadFile(diplomaFile, 'diploma');
      if (crmvFile) await uploadFile(crmvFile, 'crmv_file');

      if (role === 'tutor') router.push('/tutor/dashboard');
      else router.push('/prestador/dashboard')

    } catch {
      setError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  }

  const inputRow = (label: string, value: string, setter: (v: string) => void, opts?: { type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="label">{label}{opts?.required !== false && ' *'}</label>
      <input className="input" type={opts?.type || 'text'} placeholder={opts?.placeholder || ''} value={value} onChange={e => setter(e.target.value)} required={opts?.required !== false} />
    </div>
  );

  // Tela 1: escolha do tipo
  if (!role) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <PawPrint size={28} color="var(--accent)" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.4rem', color: 'var(--accent)' }}>Ampara Pet</span>
        </div>
        <div className="card" style={{ width: '100%', maxWidth: '480px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>Criar conta</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Que tipo de conta você quer criar?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROLES.map(r => (
              <button key={r.key} onClick={() => setRole(r.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px', border: '2px solid var(--border)', background: 'white', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#f0f9f6'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}>
                <span style={{ fontSize: '1.8rem' }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.desc}</div>
                </div>
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Já tem conta? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Entrar</Link>
          </p>
        </div>
        <Link href="/" style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>← Voltar ao início</Link>
      </div>
    );
  }

  const selectedRole = ROLES.find(r => r.key === role)!;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
        <PawPrint size={28} color="var(--accent)" />
        <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.4rem', color: 'var(--accent)' }}>Ampara Pet</span>
      </div>

      <div className="card fade-up" style={{ width: '100%', maxWidth: '540px' }}>
        <button onClick={() => setRole(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1rem', padding: 0 }}>← Voltar</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2rem' }}>{selectedRole.icon}</span>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Cadastro — {selectedRole.label}</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Preencha seus dados para criar a conta</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fde8e8', border: '1px solid #f5c6c6', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', gap: '8px', color: '#c0392b', fontSize: '0.85rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Informações básicas */}
          <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--accent)' }}>📋 Informações Básicas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {inputRow('Nome Completo', name, setName, { placeholder: 'Seu nome completo' })}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {inputRow('E-mail', email, setEmail, { type: 'email', placeholder: 'seu@email.com' })}
                {inputRow('Senha', password, setPassword, { type: 'password', placeholder: 'Mínimo 6 caracteres' })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {inputRow('Telefone', phone, setPhone, { placeholder: '(00) 9 0000-0000' })}
                {inputRow('CPF', cpf, setCpf, { placeholder: '000.000.000-00' })}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--accent)' }}>📍 Endereço</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {inputRow('Rua e número', street, setStreet, { placeholder: 'Rua das Flores, 123', required: false })}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                {inputRow('Cidade', city, setCity, { placeholder: 'Sua cidade', required: false })}
                {inputRow('Estado', state, setState, { placeholder: 'UF', required: false })}
                {inputRow('CEP', cep, setCep, { placeholder: '00000-000', required: false })}
              </div>
            </div>
          </div>

          {/* Campos para cuidador */}
          {role === 'cuidador' && (
            <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--accent)' }}>🤝 Informações Profissionais</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {inputRow('Tempo de Experiência (anos)', experienceYears, setExperienceYears, { type: 'number', placeholder: '3' })}
                <div>
                  <label className="label">Serviços Oferecidos *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {CUIDADOR_SERVICES.map(s => (
                      <button key={s} type="button" onClick={() => toggleService(s)}
                        style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', border: '1.5px solid', borderColor: selectedServices.includes(s) ? 'var(--accent)' : 'var(--border)', background: selectedServices.includes(s) ? 'var(--accent)' : 'white', color: selectedServices.includes(s) ? 'white' : 'var(--text)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Apresentação *</label>
                  <textarea className="input" rows={3} placeholder="Conte sobre sua experiência..." value={bio} onChange={e => setBio(e.target.value)} required style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>
          )}

          {/* Campos para veterinário */}
          {role === 'veterinario' && (
            <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--accent)' }}>🩺 Informações Profissionais</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  {inputRow('Número do CRMV', crmv, setCrmv, { placeholder: '12345' })}
                  {inputRow('Estado do CRMV', crmvState, setCrmvState, { placeholder: 'DF' })}
                </div>
                {inputRow('Instituição de Graduação', graduation, setGraduation, { placeholder: 'UnB - Medicina Veterinária' })}
                {inputRow('Anos de Experiência', experienceYears, setExperienceYears, { type: 'number', placeholder: '5' })}
                <div>
                  <label className="label">Especialidades *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {VET_SERVICES.map(s => (
                      <button key={s} type="button" onClick={() => toggleService(s)}
                        style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', border: '1.5px solid', borderColor: selectedServices.includes(s) ? 'var(--accent)' : 'var(--border)', background: selectedServices.includes(s) ? 'var(--accent)' : 'white', color: selectedServices.includes(s) ? 'white' : 'var(--text)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Sobre você *</label>
                  <textarea className="input" rows={3} placeholder="Conte sobre sua formação e experiência..." value={bio} onChange={e => setBio(e.target.value)} required style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>
          )}
          {/* Foto de perfil - para todos */}
<div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '1rem' }}>
  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--accent)' }}>📷 Foto de Perfil</h3>
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    {avatarPreview && (
      <img src={avatarPreview as string} alt="Preview" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
    )}
    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange}
      style={{ fontSize: '0.85rem' }} />
  </div>
</div>

{/* Documentos - só para veterinário */}
{role === 'veterinario' && (
  <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '1rem' }}>
    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--accent)' }}>📄 Documentos</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div>
        <label className="label">Diploma de Medicina Veterinária (PDF, JPG ou PNG)</label>
        <input type="file" accept=".pdf,image/jpeg,image/png"
          onChange={e => setDiplomaFile(e.target.files?.[0] || null)}
          style={{ fontSize: '0.85rem' }} />
      </div>
      <div>
        <label className="label">Carteirinha CRMV (PDF, JPG ou PNG)</label>
        <input type="file" accept=".pdf,image/jpeg,image/png"
          onChange={e => setCrmvFile(e.target.files?.[0] || null)}
          style={{ fontSize: '0.85rem' }} />
      </div>
    </div>
  </div>
)}

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Já tem conta? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
