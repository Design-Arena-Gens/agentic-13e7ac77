"use client";

import { useMemo, useState } from "react";
import {
  FaBell,
  FaEdit,
  FaMoon,
  FaPlus,
  FaPrint,
  FaRedo,
  FaSyncAlt,
  FaTrash,
} from "react-icons/fa";

type Entry = {
  id: string;
  plateNumber: string;
  yukBilanKg: number;
  yuksizKg: number;
  sofVazinKg: number;
  date: string;
  summa: number;
  checkNumber: string;
};

const initialEntries: Entry[] = [
  {
    id: "1",
    plateNumber: "30A 777 AA",
    yukBilanKg: 32000,
    yuksizKg: 12000,
    sofVazinKg: 20000,
    date: "2024-06-17",
    summa: 30000,
    checkNumber: "CHK-0092",
  },
  {
    id: "2",
    plateNumber: "80B 905 BB",
    yukBilanKg: 28000,
    yuksizKg: 11000,
    sofVazinKg: 17000,
    date: "2024-06-18",
    summa: 40000,
    checkNumber: "CHK-0118",
  },
];

const defaultFormState = {
  plateNumber: "",
  yukBilanKg: "",
  yuksizKg: "",
  date: "",
  summa: "",
  checkNumber: "",
};

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [form, setForm] = useState<typeof defaultFormState>(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const alarmActive = true;

  const computedSofVazin = useMemo(() => {
    const yukBilan = Number(form.yukBilanKg) || 0;
    const yuksiz = Number(form.yuksizKg) || 0;
    return Math.max(yukBilan - yuksiz, 0);
  }, [form.yukBilanKg, form.yuksizKg]);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) {
      return entries;
    }
    const term = search.trim().toLowerCase();
    return entries.filter((entry) =>
      [
        entry.plateNumber,
        entry.checkNumber,
        entry.date,
        entry.yukBilanKg,
        entry.yuksizKg,
        entry.sofVazinKg,
        entry.summa,
      ]
        .map((value) => `${value}`.toLowerCase())
        .some((value) => value.includes(term)),
    );
  }, [entries, search]);

  const highlightMatch = (value: string | number) => {
    const content = `${value}`;
    if (!search.trim()) return content;
    const pattern = new RegExp(`(${escapeRegExp(search.trim())})`, "ig");
    const parts = content.split(pattern);

    return parts.map((part, index) =>
      part.toLowerCase() === search.trim().toLowerCase() ? (
        <span key={`${part}-${index}`} className="text-red-400">
          {part}
        </span>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      ),
    );
  };

  const handleFormChange = (
    field: keyof typeof defaultFormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const plateNumber = form.plateNumber.trim();
    if (!plateNumber) {
      return;
    }

    const yukBilanKg = Number(form.yukBilanKg) || 0;
    const yuksizKg = Number(form.yuksizKg) || 0;
    const newEntry: Entry = {
      id: editingId ?? crypto.randomUUID(),
      plateNumber,
      yukBilanKg,
      yuksizKg,
      sofVazinKg: Math.max(yukBilanKg - yuksizKg, 0),
      date: form.date || new Date().toISOString().slice(0, 10),
      summa: Number(form.summa) || 0,
      checkNumber: form.checkNumber.trim(),
    };

    setEntries((prev) => {
      if (editingId) {
        return prev.map((entry) =>
          entry.id === editingId ? { ...newEntry } : entry,
        );
      }
      return [newEntry, ...prev];
    });

    setForm(defaultFormState);
    setEditingId(null);
    setSelectedId(newEntry.id);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setEntries((prev) => prev.filter((entry) => entry.id !== selectedId));
    if (editingId === selectedId) {
      setEditingId(null);
      setForm(defaultFormState);
    }
    setSelectedId(null);
  };

  const handleEditSelected = () => {
    if (!selectedId) return;
    const entry = entries.find((item) => item.id === selectedId);
    if (!entry) return;
    setForm({
      plateNumber: entry.plateNumber,
      yukBilanKg: String(entry.yukBilanKg),
      yuksizKg: String(entry.yuksizKg),
      date: entry.date,
      summa: String(entry.summa),
      checkNumber: entry.checkNumber,
    });
    setEditingId(entry.id);
  };

  const handleReload = () => {
    setEntries(initialEntries);
    setForm(defaultFormState);
    setEditingId(null);
    setSelectedId(null);
    setSearch("");
  };

  const handleRelay = () => {
    setSelectedId(null);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen w-full bg-black/30 px-4 py-10 text-white backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-3xl bg-black/50 p-8 shadow-xl ring-1 ring-white/20">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/80 text-3xl shadow-lg">
              🐪
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-amber-200">
                Desert Weigh Station
              </p>
              <h1 className="text-2xl font-semibold text-white">
                Caravan Freight Control
              </h1>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <div className="relative w-full max-w-sm">
              <FaMoon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-200" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search manifest..."
                className="w-full rounded-full border border-amber-400/40 bg-black/50 py-3 pl-12 pr-5 text-sm text-white placeholder:text-amber-100/60 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-red-300">
                <span className="relative inline-flex h-3 w-3">
                  {alarmActive && (
                    <>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                    </>
                  )}
                </span>
                <FaBell />
                Alarm Active
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-amber-500/90 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-amber-400"
              onClick={() => {
                setEditingId(null);
                setForm(defaultFormState);
              }}
            >
              <FaPlus /> Add
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              onClick={handleEditSelected}
            >
              <FaEdit /> Edit
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-red-500/70 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-500"
              onClick={handleDeleteSelected}
            >
              <FaTrash /> Delete
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              onClick={handlePrint}
            >
              <FaPrint /> Print
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              onClick={handleReload}
            >
              <FaRedo /> Reload
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              onClick={handleRelay}
            >
              <FaSyncAlt /> Relay
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <label className="flex flex-col gap-2 text-sm uppercase tracking-wide text-amber-100">
              Plate Number
              <input
                value={form.plateNumber}
                onChange={(event) =>
                  handleFormChange("plateNumber", event.target.value.toUpperCase())
                }
                placeholder="e.g. 30A 777 AA"
                className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm uppercase tracking-wide text-amber-100">
              Yuk bilan (Kg)
              <input
                type="number"
                min={0}
                value={form.yukBilanKg}
                onChange={(event) =>
                  handleFormChange("yukBilanKg", event.target.value)
                }
                placeholder="32000"
                className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm uppercase tracking-wide text-amber-100">
              Yuksiz (Kg)
              <input
                type="number"
                min={0}
                value={form.yuksizKg}
                onChange={(event) =>
                  handleFormChange("yuksizKg", event.target.value)
                }
                placeholder="12000"
                className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm uppercase tracking-wide text-amber-100">
              Sof Vazin (Kg)
              <input
                value={computedSofVazin}
                readOnly
                className="cursor-not-allowed rounded-lg border border-amber-300/60 bg-black/20 px-3 py-2 text-white"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm uppercase tracking-wide text-amber-100">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(event) => handleFormChange("date", event.target.value)}
                className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm uppercase tracking-wide text-amber-100">
              Summa
              <input
                type="number"
                min={0}
                value={form.summa}
                onChange={(event) => handleFormChange("summa", event.target.value)}
                placeholder="30000"
                className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm uppercase tracking-wide text-amber-100">
              Add-on Check Number
              <input
                value={form.checkNumber}
                onChange={(event) =>
                  handleFormChange("checkNumber", event.target.value.toUpperCase())
                }
                placeholder="CHK-0000"
                className="rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/70"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-amber-400"
              >
                <FaPlus />
                {editingId ? "Update Entry" : "Submit Entry"}
              </button>
            </div>
          </form>
          <div className="grid gap-2 text-sm text-amber-100">
            <p>
              Summa 30,000 · 40,000 — adjust in the form to track current
              charges.
            </p>
            <p>Automatically subtracting loaded and empty weights for net mass.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20 text-left text-sm text-amber-100">
              <thead className="uppercase tracking-wide text-amber-300">
                <tr>
                  <th className="px-4 py-3">Plate_Number</th>
                  <th className="px-4 py-3">Yuk_bilan</th>
                  <th className="px-4 py-3">Yuksiz</th>
                  <th className="px-4 py-3">Sof_Vazin</th>
                  <th className="px-4 py-3">Sana (Date)</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Check #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredEntries.map((entry) => {
                  const isSelected = selectedId === entry.id;
                  const shouldHighlight = search.trim().length > 0;
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedId(entry.id)}
                      className={`cursor-pointer transition hover:bg-white/10 ${
                        isSelected ? "bg-white/15" : ""
                      } ${shouldHighlight ? "text-red-400" : ""}`}
                    >
                      <td className="px-4 py-3">{highlightMatch(entry.plateNumber)}</td>
                      <td className="px-4 py-3">
                        {highlightMatch(entry.yukBilanKg.toLocaleString())}
                      </td>
                      <td className="px-4 py-3">
                        {highlightMatch(entry.yuksizKg.toLocaleString())}
                      </td>
                      <td className="px-4 py-3">
                        {highlightMatch(entry.sofVazinKg.toLocaleString())}
                      </td>
                      <td className="px-4 py-3">{highlightMatch(entry.date)}</td>
                      <td className="px-4 py-3">
                        {highlightMatch(
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "UZS",
                            maximumFractionDigits: 0,
                          }).format(entry.summa),
                        )}
                      </td>
                      <td className="px-4 py-3">{highlightMatch(entry.checkNumber)}</td>
                    </tr>
                  );
                })}
                {filteredEntries.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-sm text-amber-100/70"
                    >
                      No matching caravans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
