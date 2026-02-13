import { Button } from "./ui/button";
import { X, Send, Archive, Trash2, AlertCircle, Settings } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onSendToHub?: () => void;
  onDelete?: () => void;
  onSetChannels?: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
}

export function BulkActionBar({
  selectedCount,
  onClear,
  onSendToHub,
  onDelete,
  onSetChannels,
  onArchive,
  onUnarchive,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl px-4 py-3 flex items-center gap-4 border border-gray-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium">
            {selectedCount} ürün seçildi
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSendToHub && (
            <Button size="sm" variant="secondary" onClick={onSendToHub} className="gap-2">
              <Send className="h-4 w-4" />
              Hub'a Gönder
            </Button>
          )}

          {onSetChannels && (
            <Button size="sm" variant="secondary" onClick={onSetChannels} className="gap-2">
              <Settings className="h-4 w-4" />
              Kanal Ayarla
            </Button>
          )}

          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Sil
            </Button>
          )}

          {onArchive && (
            <Button size="sm" variant="secondary" onClick={onArchive} className="gap-2">
              <Archive className="h-4 w-4" />
              Arşivle
            </Button>
          )}

          {onUnarchive && (
            <Button size="sm" variant="secondary" onClick={onUnarchive} className="gap-2">
              <Archive className="h-4 w-4" />
              Arşivden Çıkar
            </Button>
          )}
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={onClear}
          className="gap-2 text-white hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
          Temizle
        </Button>
      </div>
    </div>
  );
}