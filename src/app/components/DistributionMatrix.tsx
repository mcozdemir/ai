import { Switch } from "./ui/switch";
import { StatusChip } from "./StatusChip";
import type { Listing, Hub, Channel } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface DistributionMatrixProps {
  listings: Listing[];
  onToggleChannel?: (hub: Hub, channel: Channel, active: boolean) => void;
  readonly?: boolean;
}

const CHANNELS: Channel[] = ['WEB', 'AMZ', 'TYFT', 'N11', 'TDY', 'HB', 'AMZSF', 'MRP'];

export function DistributionMatrix({ listings, onToggleChannel, readonly = false }: DistributionMatrixProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dağıtım Matrisi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Hub</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Durum</th>
                {CHANNELS.map(channel => (
                  <th key={channel} className="text-center py-3 px-4 font-medium text-sm text-gray-700">
                    {channel}
                  </th>
                ))}
                <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Son Sync</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing, idx) => {
                const channelMap = listing.channels.reduce((acc, ch) => {
                  acc[ch.channel] = ch.active;
                  return acc;
                }, {} as Record<Channel, boolean>);

                return (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-medium">
                        {listing.hub}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <StatusChip status={listing.state} />
                    </td>
                    {CHANNELS.map(channel => {
                      const isActive = channelMap[channel] || false;
                      const isAvailable = listing.channels.some(ch => ch.channel === channel);
                      
                      return (
                        <td key={channel} className="py-3 px-4 text-center">
                          {isAvailable ? (
                            <Switch
                              checked={isActive}
                              onCheckedChange={(checked) => 
                                !readonly && onToggleChannel?.(listing.hub, channel, checked)
                              }
                              disabled={readonly || listing.state !== 'Active'}
                            />
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(listing.lastSync).toLocaleString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {listings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">Bu ürün henüz herhangi bir Hub'a gönderilmemiş.</p>
            </div>
          )}
        </div>

        {listings.some(l => l.errors && l.errors.length > 0) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900 mb-2">Hatalar:</p>
            {listings.filter(l => l.errors && l.errors.length > 0).map((listing, idx) => (
              <div key={idx} className="text-sm text-red-700 mb-1">
                <span className="font-medium">{listing.hub}:</span> {listing.errors?.join(', ')}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}