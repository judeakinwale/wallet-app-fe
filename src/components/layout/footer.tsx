import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="w-full flex items-center justify-center border-t border-border bg-background">
        <span className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Wallet App. All rights reserved.
        </span>
      </footer>
    </div>
  );
};

export default Footer;
