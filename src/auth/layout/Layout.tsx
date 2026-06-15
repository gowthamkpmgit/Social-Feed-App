import { Box, Typography } from "@mui/material";
import React from "react";
import logoImg from "../../../src/assets/connectlogo.png";
interface AuthLayoutProps {
  badge: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ badge, children }) => {
  return (
    <Box className="h-screen w-full flex overflow-hidden">
      {" "}
      <Box className="hidden md:flex md:w-1/2 relative flex-col justify-center items-center p-12 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-center">
        <Box className="flex flex-col items-center gap-6 max-w-md">
          <Box className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
            <Typography variant="subtitle2">{badge}</Typography>
          </Box>
          <Box className="">
            <img width={260} height={260} src={logoImg} />
          </Box>
          <Box className="font-semibold text-2xl">E - Connect</Box>
          <Box className="mt-2">
            <Typography>
              Allows users to share posts, interact through comments, and manage
              their own content efficiently
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-6 py-12 overflow-y-auto">
        <Box className="w-full max-w-md">{children}</Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
