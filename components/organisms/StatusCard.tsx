import React from 'react';
import { Loader2, Wifi, Smartphone } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface StatusCardProps {
  status: 'idle' | 'scanning' | 'connecting' | 'connected' | 'auto-connecting';
  adminId: string;
  setAdminId: (id: string) => void;
  onConnect: () => void;
  onScan: () => void;
  onCancel: () => void;
  onDisconnect: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  adminId,
  setAdminId,
  onConnect,
  onScan,
  onCancel,
  onDisconnect
}) => {
  return (
    <div className={`bg-surface rounded-2xl p-5 shadow-ios transition-all duration-300 ${status === 'connected' ? 'border border-success/30' : ''}`}>
      
      {status === 'auto-connecting' && (
        <div className="flex flex-col items-center py-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
            <div className="w-16 h-16 bg-surface border-2 border-primary rounded-full flex items-center justify-center relative z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-1">Reconnecting...</h3>
          <p className="text-gray-400 text-sm">Looking for previously connected Admin</p>
          <button onClick={onCancel} className="mt-4 text-sm text-gray-500 underline">Cancel</button>
        </div>
      )}

      {status === 'idle' && (
        <div className="text-center py-4 animate-pop">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Connect to Local Admin</h3>
          <p className="text-gray-400 text-sm mb-6">Ensure you are on the same Wi-Fi network as the Admin device.</p>
          
          <div className="flex gap-3">
             <Input 
                placeholder="Enter Admin ID"
                className="text-center uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
             />
             <Button onClick={adminId ? onConnect : onScan}>
               {adminId ? 'Join' : 'Scan'}
             </Button>
          </div>
        </div>
      )}

      {status === 'scanning' && (
         <div className="flex flex-col items-center">
            <div id="reader" className="w-full rounded-xl overflow-hidden mb-4 border-2 border-primary/50"></div>
            <button onClick={onCancel} className="text-gray-400 text-sm font-medium">Cancel Scan</button>
         </div>
      )}

      {status === 'connecting' && (
         <div className="flex flex-col items-center py-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-gray-400">Connecting to Server...</p>
         </div>
      )}

      {status === 'connected' && (
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-success" />
               </div>
               <div>
                  <h3 className="font-semibold text-sm text-success">Connected</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{adminId}</p>
               </div>
            </div>
            <Button variant="secondary" size="sm" onClick={onDisconnect} className="text-xs py-1.5 px-3">
              Disconnect
            </Button>
         </div>
      )}
    </div>
  );
};