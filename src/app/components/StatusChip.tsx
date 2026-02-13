import { Badge } from "./ui/badge";
import type { ListingState, JobStatus } from "../data/mockData";

interface StatusChipProps {
  status: ListingState | JobStatus | 'Healthy' | 'Warning' | 'Error' | 'Connected' | 'Expired' | 'Failed' | 'active' | 'inactive';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusChip({ status, size = 'sm' }: StatusChipProps) {
  const getVariant = () => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Healthy':
      case 'Connected':
      case 'active':
        return 'default' as const;
      case 'Inactive':
      case 'inactive':
        return 'secondary' as const;
      case 'Pending':
      case 'Running':
      case 'Warning':
        return 'outline' as const;
      case 'Failed':
      case 'Error':
      case 'Expired':
        return 'destructive' as const;
      case 'Partial':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getColor = () => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Healthy':
      case 'Connected':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
      case 'Running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Failed':
      case 'Error':
      case 'Expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Partial':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Inactive':
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-1';

  return (
    <Badge variant={getVariant()} className={`${getColor()} ${sizeClass} font-medium border`}>
      {status}
    </Badge>
  );
}
