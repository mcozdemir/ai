import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, User } from "lucide-react";

interface AuditEntry {
  timestamp: string;
  user: string;
  action: string;
  details?: string;
}

interface AuditTimelineProps {
  entries: AuditEntry[];
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Değişiklik Geçmişi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex gap-4 relative">
              {idx !== entries.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gray-200" />
              )}
              
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                </div>
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(entry.timestamp).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                
                {entry.details && (
                  <p className="text-xs text-gray-600 mb-1">{entry.details}</p>
                )}
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />
                  {entry.user}
                </div>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Henüz değişiklik kaydı bulunmuyor.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
