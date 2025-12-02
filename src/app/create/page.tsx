"use client";

import { useState } from "react";
import SoulParticles from "@/components/animations/SoulParticles";
import FogEffect from "@/components/animations/FogEffect";
import { CryptexDatePicker } from "@/components/create/CryptexDatePicker";
import { FileUpload } from "@/components/create/FileUpload";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { gravesApi } from "@/lib/api/graves";
import { useToast } from "@/contexts/ToastContext";

export default function CreatePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      // Convert selectedDate string to Date object
      const unlockDate = new Date(selectedDate);

      // Validate unlock date is in the future
      if (unlockDate <= new Date()) {
        showToast("Unlock date must be in the future", "error");
        setIsCreating(false);
        return;
      }

      // Call the real API
      const response = await gravesApi.create({
        title,
        content: message,
        unlockDate,
      });

      // Show success message
      showToast("Time capsule created successfully", "success");

      // Navigate to graveyard page
      router.push("/graveyard");
    } catch (error) {
      // Handle API errors
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to create time capsule";

      showToast(errorMessage, "error");
      setIsCreating(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--deep-void)]">
      <SoulParticles />
      <FogEffect />

      <div className="relative z-20 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-cinzel text-5xl md:text-6xl text-stone-300 mb-4 tracking-wider">
            Burial Ritual
          </h1>
          <p className="text-stone-500 text-lg">
            Seal your memories and resurrect them in the future
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-cinzel font-bold transition-all duration-300
                    ${
                      step >= s
                        ? "bg-[var(--seal-gold)] text-black"
                        : "bg-stone-800 text-stone-600"
                    }
                  `}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`
                      w-16 h-1 mx-2 transition-all duration-300
                      ${step > s ? "bg-[var(--seal-gold)]" : "bg-stone-800"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-stone-900/60 border-2 border-stone-700 rounded-lg p-8 backdrop-blur-md">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block font-cinzel text-stone-300 mb-2">
                    Time Capsule Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., To myself in 2025"
                    className="w-full bg-stone-950/80 border-2 border-stone-700 rounded-lg px-4 py-3 text-stone-300 focus:border-[var(--soul-blue)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-cinzel text-stone-300 mb-2">
                    Message to Future Self
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message to your future self..."
                    rows={6}
                    className="w-full bg-stone-950/80 border-2 border-stone-700 rounded-lg px-4 py-3 text-stone-300 focus:border-[var(--soul-blue)] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <Button
                  variant="seal"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!title || !message}
                  className="w-full"
                >
                  Next Step
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <CryptexDatePicker onDateChange={setSelectedDate} />

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="seal"
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={!selectedDate}
                    className="flex-1"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <FileUpload onFilesChange={setFiles} />

                <div className="border-t-2 border-stone-700 pt-6">
                  <h4 className="font-cinzel text-lg text-stone-300 mb-4">
                    Summary
                  </h4>
                  <div className="space-y-2 text-stone-400 text-sm">
                    <p>Title: {title}</p>
                    <p>Resurrection Date: {selectedDate}</p>
                    <p>Files: {files.length}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="seal"
                    size="lg"
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="flex-1"
                  >
                    {isCreating ? "Sealing..." : "Seal Memory"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
