"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--deep-void)] flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="font-cinzel text-3xl text-stone-300">
              무언가 잘못되었습니다
            </h1>
            <p className="text-stone-500">
              기억을 불러오는 중 문제가 발생했습니다.
            </p>
            <Button
              variant="seal"
              size="lg"
              onClick={() => window.location.href = "/"}
            >
              처음으로 돌아가기
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
