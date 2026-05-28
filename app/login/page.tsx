'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

type Role = 'tutor' | 'cuidador' | 'veterinario';

const ROLES: { key: Role; label: string; icon: string; desc: string }[] = [
  { key: 'tutor', label: 'Tutor de Pet', icon: '🐾', desc: 'Quero contratar serviços para meu pet' },
  { key: 'cuidador', label: 'Cuidador', icon: '🤝', desc: 'Ofereço serviços de cuidado e passeios' },
  { key: 'veterinario', label: 'Médico Veterinário', icon: '🩺', desc: 'Ofereço atendimento veterinário' },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Erro ao entrar'); return; }

      const userRole = data.user.role;
      if (userRole === 'tutor') router.push('/tutor/dashboard');
      else router.push('/prestador/dashboard');
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Tela 1: escolha o tipo de conta
  if (!role) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <PawPrint size={28} color="var(--accent)" />
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.4rem', color: 'var(--accent)' }}>Ampara Pet</span>
        </div>
        <div className="card" style={{ width: '100%', maxWidth: '480px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>Bem-vindo de volta!</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Escolha o tipo da sua conta para continuar</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROLES.map(r => (
              <button key={r.key} onClick={() => setRole(r.key)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '12px', border: '2px solid var(--border)', background: 'white', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#f0f9f6'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}>
                <span style={{ fontSize: '1.8rem' }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.desc}</div>
                </div>
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Não tem conta?{' '}
            <Link href="/cadastro" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Cadastre-se</Link>
          </p>
        </div>
        <Link href="/" style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>← Voltar ao início</Link>
      </div>
    );
  }

  // Tela 2: formulário de login
  const selectedRole = ROLES.find(r => r.key === role)!;
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
        <PawPrint size={28} color="var(--accent)" />
        <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.4rem', color: 'var(--accent)' }}>Ampara Pet</span>
      </div>
      <div className="card fade-up" style={{ width: '100%', maxWidth: '420px' }}>
        <button onClick={() => setRole(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1rem', padding: 0 }}>← Voltar</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2rem' }}>{selectedRole.icon}</span>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Login — {selectedRole.label}</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedRole.desc}</p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fde8e8', border: '1px solid #f5c6c6', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#c0392b', fontSize: '0.85rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>
          <div>
            <label className="label">Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 <strong>Demo:</strong> Use <code>{role}@demo.com</code> / <code>123456</code>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '0.25rem' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Não tem conta?{' '}
          <Link href="/cadastro" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
