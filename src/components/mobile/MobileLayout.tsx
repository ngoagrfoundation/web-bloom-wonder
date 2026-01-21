import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MobileLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const MobileLayout = ({ children, showFooter = true }: MobileLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen pb-20">
        <MobileHeader />
        {children}
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      {children}
      {showFooter && <Footer />}
    </div>
  );
};

export default MobileLayout;