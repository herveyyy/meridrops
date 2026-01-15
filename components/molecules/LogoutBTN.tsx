import React from "react";
import { Button } from "../atoms/Button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    classname?: string;
}
const LogoutBTN: React.FC<Props> = ({ classname }) => {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const res = await signOut({ redirect: false });
            if (res.url) {
                router.replace("/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <Button
            variant="ghost"
            size="md"
            icon={<LogOut className="w-4 h-4" />}
            className={`${classname} w-full`}
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
};

export default LogoutBTN;
