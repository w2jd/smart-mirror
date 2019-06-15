document.addEventListener('DOMContentLoaded', function() {
	var calendarEl = document.getElementById('tablecalendar');

	var tcalendar = new FullCalendar.Calendar(calendarEl, {

		plugins: [ 'interaction', 'dayGrid', 'list', 'googleCalendar' ],

		header: {
		//left: 'prev,next today',
		left: '',
		center: 'title',
		right: ''
		//right: 'dayGridMonth,listYear'
		},

		displayEventTime: false, // don't show the time column in list view

		// Google API Keys
		// http://fullcalendar.io/docs/google_calendar/
		googleCalendarApiKey: '[Google Calendar API]',

		// Google Calendar ID
		events: '[Google Calendar API]@group.calendar.google.com',

		eventClick: function(arg) {
		// opens events in a popup window
		window.open(arg.event.url, 'google-calendar-event', 'width=700,height=800');

		arg.jsEvent.preventDefault() // don't navigate in main tab
		},

	});

	tcalendar.render();
});
