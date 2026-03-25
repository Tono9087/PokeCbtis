import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './HomePage.css'; // Reuse some basic grid layouts if needed

export default function Dashboard() {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(
    sessionStorage.getItem('dashboard_auth') === 'true'
  );
  const [errorLogin, setErrorLogin] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPass = import.meta.env.VITE_DASHBOARD_PASSWORD;
    if (password === correctPass) {
      setIsAuth(true);
      sessionStorage.setItem('dashboard_auth', 'true');
    } else {
      setErrorLogin(true);
    }
  };

  if (!isAuth) {
    return (
      <div style={dashboardStyles.loginContainer}>
        <div style={dashboardStyles.loginBox}>
          <h2 style={{ color: '#fc2403', marginBottom: '1rem' }}>Admin Dashboard</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorLogin(false);
              }}
              style={dashboardStyles.input}
            />
            {errorLogin && <p style={{ color: 'red', fontSize: '12px' }}>Contraseña incorrecta</p>}
            <button type="submit" style={dashboardStyles.btnPrimary}>Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    nombre: '',
    rol: 'alumno',
    semestre: '',
    grupo: '',
    especialidad: 'Programación',
    materia: '',
    descripcion: '',
    imagen_url: ''
  });
  const [success, setSuccess] = useState(false);

  // Fetch active records
  const { data: records, isLoading } = useQuery({
    queryKey: ['admin-plantel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plantel')
        .select('*')
        .eq('activo', true)
        .order('id', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Mutation to add
  const addMutation = useMutation({
    mutationFn: async (newMember) => {
      const { data, error } = await supabase.from('plantel').insert([newMember]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-plantel']);
      queryClient.invalidateQueries(['plantel']);
      setSuccess(true);
      setForm({
        nombre: '',
        rol: 'alumno',
        semestre: '',
        grupo: '',
        especialidad: 'Programación',
        materia: '',
        descripcion: '',
        imagen_url: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    }
  });

  // Mutation to deactivate
  const deactivateMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('plantel')
        .update({ activo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-plantel']);
      queryClient.invalidateQueries(['plantel']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate Rareza
    let rareza = 'comun';
    if (form.rol === 'profesor') {
      rareza = 'ultra_raro';
    } else {
      const sem = parseInt(form.semestre);
      if (sem >= 3 && sem <= 4) rareza = 'poco_comun';
      else if (sem >= 5 && sem <= 6) rareza = 'raro';
    }

    const payload = {
      ...form,
      rareza,
      semestre: form.rol === 'alumno' ? parseInt(form.semestre) : null,
      grupo: form.rol === 'alumno' ? form.grupo : null,
      materia: form.rol === 'profesor' ? form.materia : null,
      activo: true
    };

    addMutation.mutate(payload);
  };

  return (
    <div style={dashboardStyles.panelWrapper}>
      <h2 style={{ color: '#0ca6ab', marginBottom: '20px' }}>Administrar Plantel</h2>

      <section style={dashboardStyles.section}>
        <h3>Agregar Nuevo Miembro</h3>
        {success && <p style={{ color: 'green', fontWeight: 'bold' }}>¡Miembro agregado con éxito! ✅</p>}
        {addMutation.isError && <p style={{ color: 'red' }}>Error: {addMutation.error.message}</p>}

        <form onSubmit={handleSubmit} style={dashboardStyles.form}>
          <div style={dashboardStyles.row}>
            <div style={dashboardStyles.field}>
              <label>Nombre Completo</label>
              <input 
                required 
                type="text" 
                value={form.nombre} 
                onChange={e => setForm({...form, nombre: e.target.value})} 
                style={dashboardStyles.input}
              />
            </div>
            <div style={dashboardStyles.field}>
              <label>Rol</label>
              <select 
                value={form.rol} 
                onChange={e => setForm({...form, rol: e.target.value})} 
                style={dashboardStyles.input}
              >
                <option value="alumno">Alumno</option>
                <option value="profesor">Profesor</option>
              </select>
            </div>
          </div>

          {form.rol === 'alumno' ? (
            <div style={dashboardStyles.row}>
              <div style={dashboardStyles.field}>
                <label>Semestre (1-6)</label>
                <input 
                  type="number" min="1" max="6" required 
                  value={form.semestre} 
                  onChange={e => setForm({...form, semestre: e.target.value})} 
                  style={dashboardStyles.input}
                />
              </div>
              <div style={dashboardStyles.field}>
                <label>Grupo</label>
                <input 
                  type="text" required 
                  value={form.grupo} 
                  onChange={e => setForm({...form, grupo: e.target.value})} 
                  style={dashboardStyles.input}
                />
              </div>
            </div>
          ) : (
            <div style={dashboardStyles.field}>
              <label>Materia</label>
              <input 
                type="text" required 
                value={form.materia} 
                onChange={e => setForm({...form, materia: e.target.value})} 
                style={dashboardStyles.input}
              />
            </div>
          )}

          <div style={dashboardStyles.row}>
            <div style={dashboardStyles.field}>
              <label>Especialidad</label>
              <select 
                value={form.especialidad} 
                onChange={e => setForm({...form, especialidad: e.target.value})} 
                style={dashboardStyles.input}
              >
                <option value="Programación">Programación</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Deportes">Deportes</option>
                <option value="Ciencias">Ciencias</option>
                <option value="Artes">Artes</option>
                <option value="Inglés">Inglés</option>
              </select>
            </div>
            <div style={dashboardStyles.field}>
              <label>Imagen URL (Opcional)</label>
              <input 
                type="text" 
                placeholder="https://..."
                value={form.imagen_url} 
                onChange={e => setForm({...form, imagen_url: e.target.value})} 
                style={dashboardStyles.input}
              />
            </div>
          </div>

          <div style={dashboardStyles.field}>
            <label>Descripción / Habilidades</label>
            <textarea 
              rows="3"
              value={form.descripcion} 
              onChange={e => setForm({...form, descripcion: e.target.value})} 
              style={dashboardStyles.input}
            />
          </div>

          <button 
            type="submit" 
            disabled={addMutation.isLoading}
            style={dashboardStyles.btnPrimary}
          >
            {addMutation.isLoading ? 'Enviando...' : 'Insertar en Plantel'}
          </button>
        </form>
      </section>

      <section style={dashboardStyles.section}>
        <h3>Miembros Activos</h3>
        {isLoading ? <p>Cargando...</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={dashboardStyles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Especialidad</th>
                  <th>Rareza</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {records?.map(r => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.nombre}</td>
                    <td style={{ textTransform: 'capitalize' }}>{r.rol}</td>
                    <td>{r.especialidad}</td>
                    <td><span style={{...dashboardStyles.chip, ...getRarezaColor(r.rareza)}}>{r.rareza}</span></td>
                    <td>
                      <button 
                        onClick={() => deactivateMutation.mutate(r.id)}
                        disabled={deactivateMutation.isLoading}
                        style={dashboardStyles.btnDanger}
                      >
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function getRarezaColor(rareza) {
  switch(rareza) {
    case 'comun': return { backgroundColor: '#ddd', color: '#000' };
    case 'poco_comun': return { backgroundColor: '#3b82f6', color: '#fff' };
    case 'raro': return { backgroundColor: '#8b5cf6', color: '#fff' };
    case 'ultra_raro': return { backgroundColor: '#fc2403', color: '#fff' };
    default: return {};
  }
}

const dashboardStyles = {
  loginContainer: {
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0'
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWwidth: '350px'
  },
  panelWrapper: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh'
  },
  section: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '16px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '15px'
  },
  row: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  field: {
    flex: 1,
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  },
  btnPrimary: {
    backgroundColor: '#0ca6ab',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    marginTop: '10px',
    cursor: 'pointer'
  },
  btnDanger: {
    backgroundColor: 'transparent',
    color: '#fc2403',
    border: '1px solid #fc2403',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  chip: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '10px',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }
};
