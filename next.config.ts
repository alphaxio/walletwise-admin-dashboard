import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";

function getBuildCommit() {
  const deploymentCommit =
    process.env.APP_BUILD_COMMIT ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.COMMIT_REF;
  if (deploymentCommit) return deploymentCommit;

  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_BUILD_COMMIT: getBuildCommit(),
    NEXT_PUBLIC_APP_BUILD_TIME: new Date().toISOString(),
  },
  /* config options here */
  // output: "export",
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
