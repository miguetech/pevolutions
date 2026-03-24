import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
}) => (
  <div className="glass-card p-12 text-center">
    <div className="text-6xl mb-4 opacity-50">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    {description && (
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
    )}
    {action && (
      <button onClick={action.onClick} className="btn-primary">
        {action.label}
      </button>
    )}
  </div>
);

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Oops! Something went wrong',
  message,
  onRetry,
}) => (
  <div className="glass-card p-8 border-2 border-fire/20">
    <div className="flex items-start gap-4">
      <div className="text-4xl">⚠️</div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-fire mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-secondary">
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  </div>
);
