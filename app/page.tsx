'use client';
import Link from 'next/link';
import { Heart, Shield, Star, PawPrint, Stethoscope, Scissors, Footprints } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={{ background:'white', borderBottom:'1px solid var(--border)', padding:'0 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:'64px', position:'sticky', top:0, zIndex:100, boxShadow:'var(--shadow)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <PawPrint size={24} color="var(--accent)" />
          <span style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1.2rem', color:'var(--accent)' }}>Ampara Pet</span>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <Link href="/login"><button className="btn-outline" style={{ padding:'0.5rem 1.25rem', fontSize:'0.9rem' }}>Login</button></Link>
          <Link href="/cadastro"><button className="btn-primary" style={{ padding:'0.5rem 1.25rem', fontSize:'0.9rem' }}>Cadastro</button></Link>
        </div>
      </nav>

      <section style={{ textAlign:'center', padding:'5rem 2rem 4rem', background:'linear-gradient(135deg, #e8f4f0 0%, var(--bg) 100%)' }}>
        <div style={{ maxWidth:'640px', margin:'0 auto' }} className="fade-up">
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--accent-light)', color:'white', padding:'0.4rem 1rem', borderRadius:'999px', fontSize:'0.85rem', fontWeight:600, marginBottom:'1.5rem' }}>
            <Heart size={14} /> Cuidado que vai além
          </div>
          <h1 style={{ fontSize:'2.8rem', fontWeight:700, lineHeight:1.2, marginBottom:'1rem' }}>
            Seu pet merece os<br/><span style={{ color:'var(--accent)' }}>melhores cuidados</span>
          </h1>
          <p style={{ fontSize:'1.1rem', color:'var(--text-muted)', lineHeight:1.7, marginBottom:'2rem' }}>
            Conectamos tutores a cuidadores e veterinários de confiança. Do passeio diário à consulta especializada.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/cadastro"><button className="btn-primary" style={{ fontSize:'1rem', padding:'0.85rem 2rem' }}>Começar agora</button></Link>
            <Link href="/login"><button className="btn-outline" style={{ fontSize:'1rem', padding:'0.85rem 2rem' }}>Já tenho conta</button></Link>
          </div>
        </div>
      </section>

      <section style={{ padding:'4rem 2rem', maxWidth:'960px', margin:'0 auto' }}>
        <h2 style={{ textAlign:'center', fontSize:'1.8rem', fontWeight:700, marginBottom:'2rem' }}>Alguns dos nossos serviços</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem' }}>
          {[
            { icon:<Footprints size={28}/>, label:'Passeios', desc:'Caminhadas diárias com cuidadores verificados' },
            { icon:<Scissors size={28}/>, label:'Banho e Tosa', desc:'Estética profissional para seu pet' },
            { icon:<Stethoscope size={28}/>, label:'Consulta Veterinária', desc:'Atendimento com médicos veterinários registrados' },
            { icon:<Heart size={28}/>, label:'Day Care', desc:'Cuidados diurnos com atenção personalizada' },
            { icon:<Shield size={28}/>, label:'Hospedagem', desc:'Acolhimento seguro quando você viajar' },
            { icon:<Star size={28}/>, label:'Adestramento', desc:'Educação e treinamento comportamental' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign:'center', transition:'transform 0.2s', cursor:'default' }}
              onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-4px)')}
              onMouseLeave={e=>(e.currentTarget.style.transform='none')}>
              <div style={{ color:'var(--accent)', marginBottom:'0.75rem' }}>{s.icon}</div>
              <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.35rem' }}>{s.label}</h3>
              <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', lineHeight:1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background:'white', padding:'4rem 2rem' }}>
        <div style={{ maxWidth:'800px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:'2rem' }}>Como funciona</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1.5rem' }}>
            {[
              { step:'1', title:'Crie sua conta', desc:'Cadastre-se como tutor ou prestador' },
              { step:'2', title:'Encontre profissionais', desc:'Busque por tipo e avaliação' },
              { step:'3', title:'Agende o serviço', desc:'Escolha data, horário e local' },
              { step:'4', title:'Fique tranquilo', desc:'Acompanhe e avalie o serviço' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'var(--accent)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontFamily:'Poppins', fontWeight:700, fontSize:'1.2rem' }}>{s.step}</div>
                <h3 style={{ fontWeight:700, marginBottom:'0.35rem' }}>{s.title}</h3>
                <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', lineHeight:1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:'4rem 2rem', textAlign:'center' }}>
        <h2 style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:'1rem' }}>Pronto para começar?</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:'2rem' }}>Cadastro gratuito. Acesse todos os profissionais verificados.</p>
        <Link href="/cadastro"><button className="btn-primary" style={{ fontSize:'1rem', padding:'0.9rem 2.5rem' }}>Criar conta gratuita</button></Link>
      </section>

      <footer style={{ borderTop:'1px solid var(--border)', padding:'1.5rem 2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
        <PawPrint size={16} color="var(--accent)" />
        <span>© 2025 Ampara Pet. Feito com carinho.</span>
      </footer>
    </div>
  );
}
