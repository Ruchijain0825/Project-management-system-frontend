import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleDot,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const getTicketDate = (ticket) => {
  // Supports common due-date field names without requiring a backend change.
  const value =
    ticket?.dueDate ||
    ticket?.deadline ||
    ticket?.due_date ||
    ticket?.targetDate;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const sameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const statusStyles = {
  "To Do": "border-blue-400/30 bg-blue-400/10 text-blue-300",
  "In Progress": "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
  Done: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
};

export default function Calendar({ tickets = [], onTicketClick }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const today = new Date();
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const ticketsWithDates = useMemo(
    () =>
      tickets
        .map((ticket) => ({ ticket, date: getTicketDate(ticket) }))
        .filter((item) => item.date),
    [tickets]
  );

  const ticketsByDate = useMemo(() => {
    const grouped = {};

    ticketsWithDates.forEach(({ ticket, date }) => {
      const key = dateKey(date);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ticket);
    });

    return grouped;
  }, [ticketsWithDates]);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [
    ...Array.from({ length: firstWeekday }, (_, index) => ({
      day: previousMonthDays - firstWeekday + index + 1,
      outside: true,
      date: new Date(year, month - 1, previousMonthDays - firstWeekday + index + 1),
    })),
    ...Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      outside: false,
      date: new Date(year, month, index + 1),
    })),
  ];

  while (calendarDays.length % 7 !== 0) {
    const nextDay = calendarDays.length - (firstWeekday + daysInMonth) + 1;
    calendarDays.push({
      day: nextDay,
      outside: true,
      date: new Date(year, month + 1, nextDay),
    });
  }

  const selectedTickets = ticketsByDate[dateKey(selectedDate)] || [];

  const changeMonth = (amount) => {
    setVisibleMonth(new Date(year, month + amount, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101A32]">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-300">
              <CalendarDays size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Project Calendar</h2>
              <p className="mt-1 text-xs text-slate-400">
                View your project deadlines at a glance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-yellow-400/60 hover:text-yellow-300"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-5">
          <div className="mb-4 flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-white">{monthLabel}</h3>
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 sm:gap-4 sm:text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                To Do
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Done
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs"
              >
                {day}
              </div>
            ))}

            {calendarDays.map(({ day, date, outside }, index) => {
              const key = dateKey(date);
              const dayTickets = ticketsByDate[key] || [];
              const isToday = sameDay(date, today);
              const isSelected = sameDay(date, selectedDate);

              return (
                <button
                  type="button"
                  key={`${key}-${index}`}
                  onClick={() => {
                    setSelectedDate(date);
                    if (outside) {
                      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                    }
                  }}
                  className={`relative flex min-h-[68px] flex-col items-center rounded-lg border p-1.5 transition sm:min-h-[92px] sm:items-start sm:p-2 ${
                    isSelected
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-slate-800 bg-[#0B1428] hover:border-slate-600"
                  } ${outside ? "opacity-40" : ""}`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday
                        ? "bg-yellow-400 text-black"
                        : isSelected
                        ? "text-yellow-300"
                        : "text-slate-300"
                    }`}
                  >
                    {day}
                  </span>

                  {dayTickets.length > 0 && (
                    <>
                      <div className="mt-1 hidden w-full space-y-1 sm:block">
                        {dayTickets.slice(0, 2).map((ticket) => (
                          <div
                            key={ticket._id || ticket.id}
                            className={`truncate rounded px-1.5 py-1 text-left text-[10px] ${
                              statusStyles[ticket.status] ||
                              "border border-slate-700 bg-slate-700/30 text-slate-300"
                            }`}
                          >
                            {ticket.title || "Untitled ticket"}
                          </div>
                        ))}
                        {dayTickets.length > 2 && (
                          <p className="px-1 text-[10px] text-slate-500">
                            +{dayTickets.length - 2} more
                          </p>
                        )}
                      </div>
                      <span className="mt-1 flex gap-0.5 sm:hidden">
                        {dayTickets.slice(0, 3).map((ticket, ticketIndex) => (
                          <span
                            key={ticket._id || ticket.id || ticketIndex}
                            className={`h-1.5 w-1.5 rounded-full ${
                              ticket.status === "Done"
                                ? "bg-emerald-400"
                                : ticket.status === "In Progress"
                                ? "bg-yellow-400"
                                : "bg-blue-400"
                            }`}
                          />
                        ))}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#101A32] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {selectedTickets.length} {selectedTickets.length === 1 ? "task" : "tasks"} scheduled
            </p>
          </div>
          <span className="rounded-lg bg-blue-400/10 px-3 py-2 text-xs font-semibold text-blue-300">
            Selected day
          </span>
        </div>

        {selectedTickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 px-4 py-10 text-center">
            <CalendarDays size={30} className="mx-auto text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-300">
              No deadlines for this day
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Tickets with a due date will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedTickets.map((ticket) => (
              <button
                type="button"
                key={ticket._id || ticket.id}
                onClick={() => onTicketClick?.(ticket)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-[#0B1428] p-3 text-left transition hover:border-slate-600"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-300">
                  {ticket.status === "Done" ? (
                    <CheckCircle2 size={19} />
                  ) : ticket.priority === "Critical" || ticket.priority === "High" ? (
                    <AlertCircle size={19} />
                  ) : (
                    <CircleDot size={19} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {ticket.title || "Untitled ticket"}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Clock3 size={12} />
                    {ticket.priority || "No priority"} · {ticket.type || "Ticket"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold ${
                    statusStyles[ticket.status] ||
                    "border-slate-700 bg-slate-700/30 text-slate-300"
                  }`}
                >
                  {ticket.status || "Unknown"}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
