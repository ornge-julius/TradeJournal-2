import React from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const ConnectionStatus = () => {
  const { isConnected, isLoading } = useSupabase();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader className="h-4 w-4 animate-spin" />
        <span>Connecting to database...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${
      isConnected ? 'text-green-400' : 'text-red-400'
    }`}>
      {isConnected ? (
        <>
          <CheckCircle className="h-4 w-4" />
          <span>Database connected</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4" />
          <span>Database disconnected</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;
