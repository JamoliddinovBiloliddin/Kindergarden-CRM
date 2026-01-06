import React from "react";

const schedule = [
  { day: "Dushanba", slots: ["🎨 Rasm", "🎵 Musiqa", "🏃 Jismoniy tarbiya"] },
  { day: "Seshanba", slots: ["📖 O'qish", "🔢 Matematika", "🎭 Drama"] },
  { day: "Chorshanba", slots: ["✏️ Yozish", "🌍 Atrofdagi olam", "🏃 Jismoniy tarbiya"] },
  { day: "Payshanba", slots: ["🎨 Amaliy ish", "🎵 Musiqa", "🎮 O'yinlar"] },
  { day: "Juma", slots: ["📚 Kitob o'qish", "🎪 Erkin o'yin", "🎉 Dam olish"] },
];

export default function Schedule() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Haftalik dars jadvali</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-linear-to-r from-blue-50 to-purple-50">
            <tr>
              <th className="px-4 py-3 font-bold text-left">Kun</th>
              <th className="px-4 py-3 font-bold text-left">09:00-10:00</th>
              <th className="px-4 py-3 font-bold text-left">10:30-11:30</th>
              <th className="px-4 py-3 font-bold text-left">15:00-16:00</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schedule.map((d) => (
              <tr key={d.day} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{d.day}</td>
                {d.slots.map((s, idx) => (
                  <td key={idx} className="px-4 py-3">{s}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
