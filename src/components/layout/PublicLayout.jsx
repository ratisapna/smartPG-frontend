import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const PublicLayout = ({ children }) => {
  return (
    <div className="bg-[#0b0f19] min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-grow pt-20 animate-in fade-in duration-700">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
