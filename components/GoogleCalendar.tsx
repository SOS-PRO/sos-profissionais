"use client";

type GoogleCalendarProps = {
  calendar: string;
};

export const GoogleCalendar = ({ calendar }: GoogleCalendarProps) => {
  return (
    <iframe
      src={calendar}
      style={{ border: 0 }}
      width="100%"
      height="600"
      frameBorder={0}
    ></iframe>
  );
};
