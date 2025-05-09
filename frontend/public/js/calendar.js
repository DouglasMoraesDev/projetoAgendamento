// public/js/calendar.js
import { get, patch } from './api.js';

// Redireciona se não estiver logado
if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}

// Logout
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

document.addEventListener('DOMContentLoaded', async () => {
  const calendarEl = document.getElementById('calendar');

  let consultas;
  try {
    consultas = await get('/appointments');
  } catch (err) {
    alert('Não foi possível carregar agenda: ' + err.message);
    return;
  }

  const events = consultas.map(c => ({
    id:    String(c.id),
    title: c.clientNome,
    start: c.dataHora,
    color: { agendada: 'blue', confirmada: 'green', cancelada: 'red' }[c.status]
  }));

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events,
    editable: true,       // permite arrastar
    eventDrop: async info => {
      try {
        await patch(
          `/appointments/${info.event.id}/reschedule`,
          { dataHora: info.event.start.toISOString() }
        );
        alert('Consulta reagendada!');
      } catch (err) {
        alert('Erro ao reagendar: ' + err.message);
        info.revert();
      }
    }
  });

  calendar.render();
});
