// frontend/public/js/calendar.js

if (!localStorage.getItem('token')) location = 'login.html';
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  location = 'login.html';
};

document.addEventListener('DOMContentLoaded', async () => {
  const Calendar = FullCalendar.Calendar;
  const calendarEl = document.getElementById('calendar');

  // carrega eventos
  const consultas = await request('/consultas');
  const events = consultas.map(c => ({
    id: c.id,
    title: c.paciente_nome,
    start: c.dataHora,
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
      try {
        await request(`/consultas/${info.event.id}/reschedule`, 'PATCH', {
          dataHora: info.event.start.toISOString()
        });
        alert('Consulta reagendada!');
      } catch (err) {
        alert('Erro ao reagendar: ' + err.message);
        info.revert();
      }
    }
  });

  calendar.render();
});
