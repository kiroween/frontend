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
        showToast("잠금 해제 날짜는 미래여야 합니다", "error");
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
      showToast("타임캡슐이 성공적으로 생성되었습니다", "success");
      
      // Navigate to graveyard page
      router.push("/graveyard");
    } catch (error) {
      // Handle API errors
      const errorMessage = 
        error && typeof error === 'object' && 'message' in error 
          ? String(error.message) 
          : "타임캡슐 생성 중 오류가 발생했습니다";
      
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
            매장 의식
          </h1>
          <p className="text-stone-500 text-lg">
            기억을 봉인하고 미래에 부활시키세요
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
                    타임캡슐 제목
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 2025년의 나에게"
                    className="w-full bg-stone-950/80 border-2 border-stone-700 rounded-lg px-4 py-3 text-stone-300 focus:border-[var(--soul-blue)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-cinzel text-stone-300 mb-2">
                    미래의 나에게 남길 메시지
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="미래의 당신에게 전하고 싶은 말을 적어주세요..."
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
                  다음 단계
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
                    이전
                  </Button>
                  <Button
                    variant="seal"
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={!selectedDate}
                    className="flex-1"
                  >
                    다음 단계
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <FileUpload onFilesChange={setFiles} />

                <div className="border-t-2 border-stone-700 pt-6">
                  <h4 className="font-cinzel text-lg text-stone-300 mb-4">
                    요약
                  </h4>
                  <div className="space-y-2 text-stone-400 text-sm">
                    <p>제목: {title}</p>
                    <p>부활일: {selectedDate}</p>
                    <p>파일: {files.length}개</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    variant="seal"
                    size="lg"
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="flex-1"
                  >
                    {isCreating ? "봉인 중..." : "기억 봉인하기"}
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
