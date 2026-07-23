"use client";

import Link from "next/link";
import { useState } from "react";

type Desk = {
  id: string;
  name: string;
  zone: string;
  type: string;
  features: string[];
  available: boolean;
};

type AddOn = {
  id: string;
  name: string;
  description: string;
};

const desks: Desk[] = [
  {
    id: "D-101",
    name: "Window Desk 101",
    zone: "North Wing",
    type: "Standard Desk",
    features: ["Natural light", "Monitor", "Ergonomic chair"],
    available: true,
  },
  {
    id: "D-102",
    name: "Focus Desk 102",
    zone: "Quiet Zone",
    type: "Focus Desk",
    features: ["Low-noise area", "Monitor", "Privacy divider"],
    available: true,
  },
  {
    id: "D-103",
    name: "Standing Desk 103",
    zone: "East Wing",
    type: "Standing Desk",
    features: ["Height adjustable", "Dual monitors", "Desk lamp"],
    available: true,
  },
  {
    id: "D-104",
    name: "Window Desk 104",
    zone: "South Wing",
    type: "Standard Desk",
    features: ["City view", "Monitor", "Ergonomic chair"],
    available: false,
  },
  {
    id: "D-105",
    name: "Collaboration Desk 105",
    zone: "Team Zone",
    type: "Collaboration Desk",
    features: ["Large desk", "Whiteboard access", "Power hub"],
    available: true,
  },
  {
    id: "D-106",
    name: "Executive Desk 106",
    zone: "West Wing",
    type: "Premium Desk",
    features: ["Dual monitors", "Premium chair", "Privacy screen"],
    available: true,
  },
];

const addOns: AddOn[] = [
  {
    id: "parking",
    name: "Parking Pass",
    description: "Reserve a staff parking space for the booking day.",
  },
  {
    id: "locker",
    name: "Day Locker",
    description: "Secure personal storage close to your workspace.",
  },
  {
    id: "monitor",
    name: "Extra Monitor",
    description: "Add one additional monitor to the selected desk.",
  },
  {
    id: "accessibility",
    name: "Accessibility Setup",
    description: "Request an accessible desk configuration and support.",
  },
];

export default function ReserveWorkspacePage() {
  const [selectedDeskId, setSelectedDeskId] = useState<string>("D-101");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [duration, setDuration] = useState<string>("8");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [bookingReference, setBookingReference] = useState<string>("");

  const selectedDesk = desks.find((desk) => desk.id === selectedDeskId) ?? null;

  const canBook = selectedDesk !== null && date.length > 0;

  function toggleAddOn(id: string) {
    setSelectedAddOns((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function handleReserve() {
    if (!selectedDesk || !date) {
      return;
    }

    setBookingReference(`DEMO-${Date.now().toString().slice(-6)}`);
    setConfirmed(true);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 sm:px-6">
          <div>
            <Link
              href="/dashboard"
              className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
            >
              <span aria-hidden="true">←</span>
              Back to dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Reserve a Workspace
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Select an available desk, booking time, and optional staff
              services.
            </p>
          </div>

          <div className="hidden rounded-xl bg-blue-50 px-4 py-3 text-right sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Internal Portal
            </p>
            <p className="text-sm font-medium text-blue-900">
              Staff workspace booking
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <span className="text-sm font-semibold text-blue-700">
                Step 1
              </span>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Booking details
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Reservation date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Start time
                </span>
                <select
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Duration
                </span>
                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="2">2 hours</option>
                  <option value="4">4 hours</option>
                  <option value="8">Full day</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-blue-700">
                  Step 2
                </span>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Select a desk
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                {desks.filter((desk) => desk.available).length} desks available
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {desks.map((desk) => {
                const selected = selectedDeskId === desk.id;

                return (
                  <button
                    key={desk.id}
                    type="button"
                    disabled={!desk.available}
                    onClick={() => setSelectedDeskId(desk.id)}
                    aria-pressed={selected}
                    className={`relative rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : desk.available
                          ? "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                          : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {desk.id} · {desk.zone}
                        </p>
                        <h3 className="mt-1 font-semibold text-slate-900">
                          {desk.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {desk.type}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          desk.available
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {desk.available ? "Available" : "Reserved"}
                      </span>
                    </div>

                    <div className="mb-4 h-28 rounded-xl border border-slate-200 bg-slate-100 p-3">
                      <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300">
                        <div className="text-center">
                          <div className="mx-auto mb-2 h-8 w-14 rounded border-2 border-slate-400" />
                          <div className="mx-auto h-3 w-20 rounded bg-slate-300" />
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-1.5">
                      {desk.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <span className="text-emerald-600" aria-hidden="true">
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {selected && (
                      <span className="absolute bottom-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <span className="text-sm font-semibold text-blue-700">
                Step 3
              </span>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Select optional add-ons
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add any equipment or services needed for your workday.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {addOns.map((addOn) => {
                const checked = selectedAddOns.includes(addOn.id);

                return (
                  <label
                    key={addOn.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
                      checked
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddOn(addOn.id)}
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span className="flex-1">
                      <span className="font-semibold text-slate-900">
                        {addOn.name}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-slate-500">
                        {addOn.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Reservation summary
            </h2>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Selected workspace
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {selectedDesk?.name ?? "No desk selected"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {selectedDesk
                  ? `${selectedDesk.zone} · ${selectedDesk.type}`
                  : "Choose an available desk"}
              </p>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Date</dt>
                <dd className="font-medium text-slate-900">
                  {date || "Not selected"}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Start time</dt>
                <dd className="font-medium text-slate-900">{startTime}</dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Duration</dt>
                <dd className="font-medium text-slate-900">
                  {duration === "8" ? "Full day" : `${duration} hours`}
                </dd>
              </div>
            </dl>

            <div className="my-5 border-t border-slate-200" />

            <div>
              <p className="text-sm font-medium text-slate-700">
                Selected add-ons
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedAddOns.length > 0 ? (
                  addOns
                    .filter((item) => selectedAddOns.includes(item.id))
                    .map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        {item.name}
                      </span>
                    ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No add-ons selected
                  </span>
                )}
              </div>
            </div>

            {!date && (
              <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Select a reservation date to continue.
              </p>
            )}

            <button
              type="button"
              onClick={handleReserve}
              aria-disabled={!canBook}
              className={`mt-5 w-full rounded-xl px-4 py-3.5 font-semibold text-white transition focus:outline-none focus:ring-4 ${
                canBook
                  ? "bg-blue-700 hover:bg-blue-800 focus:ring-blue-100"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              Book Workspace
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              The booking is not stored in a database.
            </p>
          </div>
        </aside>
      </div>

      {confirmed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-confirmation-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
              ✓
            </div>

            <h2
              id="booking-confirmation-title"
              className="mt-5 text-2xl font-bold text-slate-900"
            >
              Workspace booked
            </h2>

            <p className="mt-2 leading-6 text-slate-500">
              Your booking for {selectedDesk?.name} has been created for {date}{" "}
              at {startTime}.
            </p>

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Reference</span>
                <span className="font-semibold text-slate-900">
                  {bookingReference}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
