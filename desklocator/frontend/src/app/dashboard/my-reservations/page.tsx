"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReservationStatus = "Upcoming" | "Completed" | "Cancelled";

type Reservation = {
  id: string;
  deskName: string;
  deskId: string;
  zone: string;
  date: string;
  startTime: string;
  duration: string;
  addOns: string[];
  status: ReservationStatus;
};

const reservations: Reservation[] = [
  {
    id: "RSV-240731",
    deskName: "Window Desk 101",
    deskId: "D-101",
    zone: "North Wing",
    date: "2026-07-24",
    startTime: "9:00 AM",
    duration: "Full day",
    addOns: ["Parking Pass", "Extra Monitor"],
    status: "Upcoming",
  },
  {
    id: "RSV-240615",
    deskName: "Focus Desk 102",
    deskId: "D-102",
    zone: "Quiet Zone",
    date: "2026-07-15",
    startTime: "10:00 AM",
    duration: "4 hours",
    addOns: ["Day Locker"],
    status: "Completed",
  },
  {
    id: "RSV-240402",
    deskName: "Standing Desk 103",
    deskId: "D-103",
    zone: "East Wing",
    date: "2026-07-04",
    startTime: "8:00 AM",
    duration: "Full day",
    addOns: [],
    status: "Cancelled",
  },
];

const statusStyles: Record<ReservationStatus, string> = {
  Upcoming: "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

export default function MyReservationsPage() {
  const [filter, setFilter] = useState<"All" | ReservationStatus>("All");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const filteredReservations = useMemo(() => {
    if (filter === "All") {
      return reservations;
    }

    return reservations.filter((reservation) => reservation.status === filter);
  }, [filter]);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
            >
              <span aria-hidden="true">←</span>
              Back to dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              My Reservations
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              View and manage your workspace bookings.
            </p>
          </div>

          <Link
            href="/dashboard/reserve-workspace"
            className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            + New Reservation
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Upcoming</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {reservations.filter((item) => item.status === "Upcoming").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {
                reservations.filter((item) => item.status === "Completed")
                  .length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Cancelled</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {
                reservations.filter((item) => item.status === "Cancelled")
                  .length
              }
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Reservation history
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review upcoming and previous workspace bookings.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["All", "Upcoming", "Completed", "Cancelled"] as const).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      filter === item
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <article
                  key={reservation.id}
                  className="p-5 transition hover:bg-slate-50 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-700">
                        ▦
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {reservation.deskName}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[reservation.status]}`}
                          >
                            {reservation.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {reservation.deskId} · {reservation.zone}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                          <span>📅 {reservation.date}</span>
                          <span>🕘 {reservation.startTime}</span>
                          <span>⌛ {reservation.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedReservation(reservation)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                      >
                        View Details
                      </button>

                      {reservation.status === "Upcoming" && (
                        <button
                          type="button"
                          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📅
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">
                  No reservations found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  There are no reservations matching this filter.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedReservation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reservation-details-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Reservation details
                </p>
                <h2
                  id="reservation-details-title"
                  className="mt-1 text-2xl font-bold text-slate-900"
                >
                  {selectedReservation.deskName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReservation(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Close reservation details"
              >
                ×
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">Reference</span>
                <span className="font-semibold text-slate-900">
                  {selectedReservation.id}
                </span>
              </div>
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-slate-500">Desk</dt>
                <dd className="text-right font-medium text-slate-900">
                  {selectedReservation.deskId}
                </dd>
              </div>

              <div className="flex justify-between gap-6">
                <dt className="text-slate-500">Location</dt>
                <dd className="text-right font-medium text-slate-900">
                  {selectedReservation.zone}
                </dd>
              </div>

              <div className="flex justify-between gap-6">
                <dt className="text-slate-500">Date</dt>
                <dd className="text-right font-medium text-slate-900">
                  {selectedReservation.date}
                </dd>
              </div>

              <div className="flex justify-between gap-6">
                <dt className="text-slate-500">Time</dt>
                <dd className="text-right font-medium text-slate-900">
                  {selectedReservation.startTime}
                </dd>
              </div>

              <div className="flex justify-between gap-6">
                <dt className="text-slate-500">Duration</dt>
                <dd className="text-right font-medium text-slate-900">
                  {selectedReservation.duration}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <p className="text-sm font-medium text-slate-700">Add-ons</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedReservation.addOns.length > 0 ? (
                  selectedReservation.addOns.map((addOn) => (
                    <span
                      key={addOn}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                    >
                      {addOn}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No add-ons selected
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedReservation(null)}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
