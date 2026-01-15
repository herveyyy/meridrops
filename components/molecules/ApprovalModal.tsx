import { ShieldCheck } from "lucide-react";
import { Button } from "../atoms/Button";

interface Props {
    approvalQueue: { fileName: string }[];
    handleApprove: () => void;
    handleDeny: () => void;
    approvalType: "download";
}

const ApprovalModal: React.FC<Props> = ({
    approvalQueue,
    handleApprove,
    handleDeny,
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-pop">
            <div className="bg-surface w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">
                    {`Allow admin access?`}
                </h3>
                <p className="text-gray-400 text-center text-sm mb-6">
                    {`The Admin wants to access the file `}
                    <span className="text-white font-medium">
                        "{approvalQueue[0].fileName}"
                    </span>
                    .
                    {approvalQueue.length > 1 && (
                        <span className="block mt-2 text-xs text-gray-500">
                            +{approvalQueue.length - 1} more requests pending
                        </span>
                    )}
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleDeny} fullWidth>
                        Deny
                    </Button>
                    <Button variant="primary" onClick={handleApprove} fullWidth>
                        Allow
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalModal;
