"use client";

import { useState } from "react";
import { Collaborator } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { UserMinus, Crown, Edit, Eye } from "lucide-react";

interface CollaboratorListProps {
  collaborators: Collaborator[];
  onRemove?: (collaboratorId: string) => void;
  canManage: boolean;
}

export function CollaboratorList({
  collaborators,
  onRemove,
  canManage,
}: CollaboratorListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (collaboratorId: string) => {
    if (!onRemove) return;

    const confirmed = confirm("이 협력자를 제거하시겠습니까?");
    if (!confirmed) return;

    setRemovingId(collaboratorId);
    try {
      await onRemove(collaboratorId);
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const getRoleIcon = (role: Collaborator["role"]) => {
    switch (role) {
      case "owner":
        return <Crown size={14} className="text-[var(--seal-gold)]" />;
      case "editor":
        return <Edit size={14} className="text-soul-blue" />;
      case "viewer":
        return <Eye size={14} className="text-stone-400" />;
    }
  };

  const getRoleLabel = (role: Collaborator["role"]) => {
    switch (role) {
      case "owner":
        return "소유자";
      case "editor":
        return "편집자";
      case "viewer":
        return "뷰어";
    }
  };

  if (collaborators.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        <p>아직 협력자가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {collaborators.map((collaborator) => (
        <div
          key={collaborator.id}
          className="flex items-center gap-4 p-4 bg-stone-900/50 border border-stone-700 rounded-lg hover:border-stone-600 transition-colors"
        >
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-stone-700 to-stone-800 rounded-full flex items-center justify-center flex-shrink-0">
            {collaborator.avatar ? (
              <img
                src={collaborator.avatar}
                alt={collaborator.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-stone-300 text-lg font-cinzel">
                {collaborator.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-stone-200 font-medium truncate">
                {collaborator.name}
              </h3>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-stone-800 rounded-full">
                {getRoleIcon(collaborator.role)}
                <span className="text-xs text-stone-400">
                  {getRoleLabel(collaborator.role)}
                </span>
              </div>
            </div>
            <p className="text-stone-500 text-sm truncate">
              {collaborator.email}
            </p>
            <p className="text-stone-600 text-xs mt-1">
              참여일: {new Date(collaborator.joinedAt).toLocaleDateString("ko-KR")}
            </p>
          </div>

          {/* Actions */}
          {canManage && collaborator.role !== "owner" && (
            <Button
              onClick={() => handleRemove(collaborator.id)}
              disabled={removingId === collaborator.id}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <UserMinus size={16} />
              {removingId === collaborator.id ? "제거 중..." : "제거"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
