import type { NextConfig } from "next";

const serverIp = process.env.SYSTEM_LOCAL_ADDRESS || "";
const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ["*", "http://" + serverIp],
};

export default nextConfig;
