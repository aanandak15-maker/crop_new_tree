import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  content: string;
  icon?: 'info' | 'help';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  icon = 'info',
  size = 'sm',
  className = ''
}) => {
  const getIcon = () => {
    if (icon === 'help') {
      return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
    return <Info className="h-4 w-4 text-gray-400" />;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'h-5 w-5';
      case 'md':
        return 'h-4 w-4';
      default:
        return 'h-3 w-3';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={`inline-flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${className}`}>
            {icon === 'help' ? (
              <HelpCircle className={`${getSizeClasses()} text-gray-400`} />
            ) : (
              <Info className={`${getSizeClasses()} text-gray-400`} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
