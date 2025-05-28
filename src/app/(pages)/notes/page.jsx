'use client'
import React, { useEffect, useState } from 'react';
import notesData from './notesData.json';
import { Button } from '../../components/ui/button';

const NotesPage = () => {
  const [data, setData] = useState(notesData);
  const [selectedNote, setSelectedNote] = useState(null);
  const [completionEnabled, setCompletionEnabled] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes

  useEffect(() => {
    let interval;
    if (selectedNote) {
      setCompletionEnabled(false);
      setTimer(10);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setCompletionEnabled(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedNote]);

  const handleMarkCompleted = () => {
    const updatedData = data.map(item =>
      item.id === selectedNote.id ? { ...item, status: "Completed" } : item
    );
    setData(updatedData);
    setSelectedNote(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 to-black text-white font-semibold">
      <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 drop-shadow-md">⚔️ Notes Arena</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(note => (
          <div key={note.id} className="bg-gray-800 p-5 rounded-xl shadow-2xl border border-yellow-400 hover:scale-105 transition-transform duration-200">
            <h2 className="text-2xl text-yellow-300 mb-3">{note.title}</h2>
            <p className={`mb-4 ${note.status === "Completed" ? "text-green-400" : "text-orange-300"}`}>
              Status: {note.status}
            </p>
            <Button
              onClick={() => setSelectedNote(note)}
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              📖 Read Now
            </Button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <div className="bg-gray-900 border border-yellow-500 w-[95%] md:w-3/4 h-[90%] rounded-xl p-6 flex flex-col shadow-2xl relative">
            <Button
              onClick={() => setSelectedNote(null)}
              className="absolute top-2 right-4 text-red-400 hover:text-red-600 text-3xl"
            >
              ✖
            </Button>
            <h2 className="text-2xl mb-4 text-yellow-300">{selectedNote.title}</h2>
            <div className="flex-1 overflow-hidden mb-4">
              <iframe
                src={selectedNote.pdfLink}
                title="PDF Viewer"
                className="w-full h-full border-2 border-yellow-500 rounded"
              />
            </div>
            <Button
              disabled={!completionEnabled}
              onClick={handleMarkCompleted}
              className={`w-full py-3 mt-2 rounded text-xl font-bold ${completionEnabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"}`}
            >
              {completionEnabled ? "✅ Mark as Completed" : `⏳ Wait... (${timer}s)`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
