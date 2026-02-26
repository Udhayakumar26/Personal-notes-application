"use client";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../components/ThemeToggle";
import { clearAllNotes } from "../../lib/notes";

export default function SettingsPage() {
  const router = useRouter();

  const handleClear = () => {
    if (!confirm('Clear all notes? This cannot be undone.')) return;
    clearAllNotes();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] text-slate-100 px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
          <h2 className="font-medium mb-2">Appearance</h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-slate-400">Toggle dark / light theme</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="font-medium mb-2">Data</h2>
          <button onClick={handleClear} className="bg-red-700 px-3 py-2 rounded-md">Clear all notes</button>
        </div>
      </div>
    </div>
  );
}
