import type { NextConfig } from "next";

const serverIp = process.env.SYSTEM_LOCAL_ADDRESS || "";
const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ["*", `${serverIp}`],
};

export default nextConfig;
