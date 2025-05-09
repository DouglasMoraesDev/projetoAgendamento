// public/js/calendar.js
import { get, request } from './api.js'; // agora usando get() para clareza

// Verifica token e logout
if (!localStorage.getItem('token')) {
  window.location = 'login.html';
}
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location = 'login.html';
};

document.addEventListener('DOMContentLoaded', async () => {
  const Calendar = FullCalendar.Calendar;
  const calendarEl = document.getElementById('calendar');

  let consultas = [];
  try {
    // Busca todas as consultas do profissional logado
    consultas = await get('/api/appointments'); // <-- ajustado para usar `get`
  } catch (err) {
    console.error('Erro ao carregar consultas:', err);
    alert('Não foi possível carregar agenda.');
    return;
  }

  // Mapeia para eventos do FullCalendar
  const events = consultas.map(c => ({
    id: c.id.toString(),
    title: c.cliente?.nome || 'Sem nome', // protege contra null
    start: new Date(c.dataHora).toISOString(),
    color: (() => {
      if (c.status === 'agendada')   return 'blue';
      if (c.status === 'confirmada') return 'green';
      if (c.status === 'cancelada')  return 'red';
    })()
  }));

  const calendar = new Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events,
    editable: true,
    eventDrop: async info => {
      const newDate = info.event.start.toISOString();
      try {
        // PATCH em /api/appointments/:id/reschedule
        await request(
          `/api/appointments/${info.event.id}/reschedule`,
          'PATCH',
          { dataHora: newDate }
        );
        alert('Consulta reagendada!');
      } catch (err) {
        console.error('Erro ao reagendar:', err);
        alert('Erro ao reagendar: ' + err.message);
        info.revert(); // desfaz o drag caso falhe
      }
    }
  });

  calendar.render();
});
