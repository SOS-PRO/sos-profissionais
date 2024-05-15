"use client";

type GoogleCalendarProps = {
  calendar: string;
};

export const GoogleCalendar = ({ calendar }: GoogleCalendarProps) => {
  return (
    <iframe
      //   src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1Nj2AiN7Qp_TnKGIg3mUwj876w9c7pZYOsRtvLbyDKi2LJETLE4uD5I0WnJwxAwxV44XZ0oeaX?gv=true"
      src={calendar}
      style={{ border: 0 }}
      width="100%"
      height="600"
      frameBorder={0}
    ></iframe>
  );
};
