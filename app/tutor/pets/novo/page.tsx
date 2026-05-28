'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, ArrowLeft, CheckCircle } from 'lucide-react';

const STEPS = ['Básico', 'Saúde', 'Comportamento', 'Cuidados', 'Emergência'];
const BEHAVIOR_TAGS = ['Dócil','Calmo','Tímido','Protetor','Carente','Teimoso','Brincalhão','Energético','Sociável','Independente','Obediente','Ansioso'];

export default function NovoPetPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Step 1 - Básico
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [microchip, setMicrochip] = useState('');

  // Step 2 - Saúde
  const [castrated, setCastrated] = useState('');
  const [vaccinated, setVaccinated] = useState('');
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');

  // Step 3 - Comportamento
  const [behaviorTags, setBehaviorTags] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState('');
  const [getsAlongPets, setGetsAlongPets] = useState('');
  const [getsAlongKids, setGetsAlongKids] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');

  // Step 4 - Cuidados
  const [foodType, setFoodType] = useState('');
  const [foodBrand, setFoodBrand] = useState('');
  const [foodFreq, setFoodFreq] = useState('');
  const [foodRestrictions, setFoodRestrictions] = useState('');
  const [exerciseNeeds, setExerciseNeeds] = useState('');
  const [groomingNeeds, setGroomingNeeds] = useState('');

  // Step 5 - Emergência
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [vetClinic, setVetClinic] = useState('');
  const [vetPhone, setVetPhone] = useState('');

  function toggleTag(t: string) {
    setBehaviorTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  async function handleFinish() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, species, breed, sex, birth_date: birthDate, weight, size, color, microchip,
          castrated: castrated === 'Sim', vaccinated: vaccinated === 'Sim',
          conditions, allergies, medications,
          behavior_tags: behaviorTags, energy_level: energyLevel,
          gets_along_pets: getsAlongPets, gets_along_kids: getsAlongKids, special_needs: specialNeeds,
        }),
      });
      if (res.ok) setSuccess(true);
      else { const d = await res.json(); setError(d.error || 'Erro ao cadastrar'); }
    } catch { setError('Erro de conexão'); }
    finally { setLoading(false); }
  }

  const field = (label: string, value: string, setter: (v: string) => void, opts?: { placeholder?: string; type?: string; required?: boolean }) => (
    <div>
      <label className="label">{label}{opts?.required !== false && ' *'}</label>
      <input className="input" type={opts?.type || 'text'} placeholder={opts?.placeholder || ''} value={value} onChange={e => setter(e.target.value)} />
    </div>
  );

  const selectField = (label: string, value: string, setter: (v: string) => void, options: string[]) => (
    <div>
      <label className="label">{label} *</label>
      <select className="input" value={value} onChange={e => setter(e.target.value)}>
        <option value="">Selecione</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card fade-up" style={{ maxWidth: '380px', width: '100%', textAlign: 'center' }}>
        <CheckCircle size={56} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pet cadastrado!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{name} foi adicionado com sucesso.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => { setSuccess(false); setStep(0); setName(''); setSpecies(''); }}>Cadastrar outro</button>
          <Link href="/tutor/dashboard"><button className="btn-outline">Ir para o início</button></Link>
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

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>Cadastrar novo pet</h1>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '0' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', background: i <= step ? 'var(--accent)' : 'var(--bg-input)', color: i <= step ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}>{i + 1}</div>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: i === step ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: '2px', background: i < step ? 'var(--accent)' : 'var(--border)', margin: '0 4px', marginBottom: '18px', transition: 'all 0.2s' }} />}
            </div>
          ))}
        </div>

        <div className="card fade-up">
          {error && <div style={{ background: '#fde8e8', border: '1px solid #f5c6c6', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#c0392b', fontSize: '0.85rem' }}>{error}</div>}

          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h2 style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>🐾 Informações Básicas</h2>
              {field('Nome do Pet', name, setName, { placeholder: 'Ex: Rex' })}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {selectField('Espécie', species, setSpecies, ['Cachorro', 'Gato', 'Pássaro', 'Coelho', 'Outro'])}
                {selectField('Sexo', sex, setSex, ['Macho', 'Fêmea'])}
              </div>
              {field('Raça', breed, setBreed, { placeholder: 'Ex: Labrador' })}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {field('Data de Nascimento', birthDate, setBirthDate, { type: 'date' })}
                {field('Peso', weight, setWeight, { placeholder: 'Ex: 8kg' })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {selectField('Porte', size, setSize, ['Pequeno', 'Médio', 'Grande', 'Gigante'])}
                {field('Cor/Pelagem', color, setColor, { placeholder: 'Ex: Caramelo' })}
              </div>
              {field('Número do Microchip', microchip, setMicrochip, { placeholder: 'Opcional', required: false })}
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h2 style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>🏥 Informações de Saúde</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {selectField('Castrado', castrated, setCastrated, ['Sim', 'Não'])}
                {selectField('Vacinação em dia?', vaccinated, setVaccinated, ['Sim', 'Não'])}
              </div>
              {field('Condições Médicas/Doenças Crônicas', conditions, setConditions, { placeholder: 'Ex: Diabetes, artrite...', required: false })}
              {field('Alergias', allergies, setAllergies, { placeholder: 'Ex: Pólen, frango...', required: false })}
              {field('Medicamentos em Uso', medications, setMedications, { placeholder: 'Ex: Insulina 2x/dia...', required: false })}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h2 style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>😸 Comportamento</h2>
              <div>
                <label className="label">Comportamento e Temperamento</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {BEHAVIOR_TAGS.map(t => (
                    <button key={t} type="button" onClick={() => toggleTag(t)}
                      style={{ padding: '0.35rem 0.8rem', borderRadius: '999px', border: '1.5px solid', borderColor: behaviorTags.includes(t) ? 'var(--accent)' : 'var(--border)', background: behaviorTags.includes(t) ? 'var(--accent)' : 'white', color: behaviorTags.includes(t) ? 'white' : 'var(--text)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {selectField('Nível de Energia', energyLevel, setEnergyLevel, ['Baixo', 'Médio', 'Alto', 'Muito Alto'])}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {selectField('Se dá bem com outros pets?', getsAlongPets, setGetsAlongPets, ['Sim', 'Não', 'Depende'])}
                {selectField('Se dá bem com crianças?', getsAlongKids, setGetsAlongKids, ['Sim', 'Não', 'Depende'])}
              </div>
              {field('Necessidades Especiais', specialNeeds, setSpecialNeeds, { placeholder: 'Descreva se houver...', required: false })}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h2 style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>🍽️ Cuidados</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {field('Tipo de alimentação', foodType, setFoodType, { placeholder: 'Ex: Ração seca' })}
                {field('Marca da ração', foodBrand, setFoodBrand, { placeholder: 'Ex: Premier' })}
              </div>
              {field('Frequência de alimentação', foodFreq, setFoodFreq, { placeholder: 'Ex: 2x ao dia' })}
              {field('Restrições alimentares', foodRestrictions, setFoodRestrictions, { placeholder: 'Ex: Sem glúten...', required: false })}
              {field('Necessidade de exercícios', exerciseNeeds, setExerciseNeeds, { placeholder: 'Ex: 30 min de caminhada/dia', required: false })}
              {field('Necessidade de tosa/banho', groomingNeeds, setGroomingNeeds, { placeholder: 'Ex: Banho quinzenal', required: false })}
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <h2 style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>🚨 Contato de Emergência</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {field('Nome do contato', emergencyContact, setEmergencyContact, { placeholder: 'Nome completo' })}
                {field('Telefone', emergencyPhone, setEmergencyPhone, { placeholder: '(00) 9 0000-0000' })}
              </div>
              {field('Relação com o pet', emergencyRelation, setEmergencyRelation, { placeholder: 'Ex: Familiar, vizinho...' })}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem', marginTop: '0.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Clínica Veterinária Preferencial</h3>
                {field('Nome da clínica', vetClinic, setVetClinic, { placeholder: 'Ex: Clínica VetCare', required: false })}
                {field('Telefone da clínica', vetPhone, setVetPhone, { placeholder: '(00) 9 0000-0000', required: false })}
              </div>
              <div style={{ background: '#e8f4f0', border: '1px solid var(--accent-light)', borderRadius: '10px', padding: '0.85rem 1rem', fontSize: '0.82rem', color: 'var(--accent-dark)' }}>
                ℹ️ As informações de emergência são essenciais para garantir o bem-estar do seu pet em situações críticas.
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            {step > 0 && (
              <button className="btn-outline" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>Anterior</button>
            )}
            {step < 4 ? (
              <button className="btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 0 && !name} style={{ flex: 2 }}>Próximo</button>
            ) : (
              <button className="btn-primary" onClick={handleFinish} disabled={loading} style={{ flex: 2 }}>
                {loading ? 'Salvando...' : 'Finalizar Cadastro'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
