import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Events from "./pages/Events";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Gallery from "./pages/Gallery";
import Donate from "./pages/Donate";
import NotFound from "./pages/NotFound";

// Focus Area Pages
import WomensEmpowerment from "./pages/focus/WomensEmpowerment";
import EnvironmentalSafety from "./pages/focus/EnvironmentalSafety";
import SkillDevelopment from "./pages/focus/SkillDevelopment";
import RuralDevelopment from "./pages/focus/RuralDevelopment";
import SocialWelfare from "./pages/focus/SocialWelfare";

// Cause Pages
import LakeCleaning from "./pages/causes/LakeCleaning";
import PhysicallyChallengedTreatment from "./pages/causes/PhysicallyChallengedTreatment";
import WaterFilterSchool from "./pages/causes/WaterFilterSchool";
import WheelchairStudent from "./pages/causes/WheelchairStudent";
import WheelchairElderly from "./pages/causes/WheelchairElderly";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsArticle />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/donate" element={<Donate />} />
            
            {/* Focus Area Routes */}
            <Route path="/focus/womens-empowerment" element={<WomensEmpowerment />} />
            <Route path="/focus/environmental-safety" element={<EnvironmentalSafety />} />
            <Route path="/focus/skill-development" element={<SkillDevelopment />} />
            <Route path="/focus/rural-development" element={<RuralDevelopment />} />
            <Route path="/focus/social-welfare" element={<SocialWelfare />} />
            
            {/* Cause Routes */}
            <Route path="/causes/lake-cleaning" element={<LakeCleaning />} />
            <Route path="/causes/physically-challenged-treatment" element={<PhysicallyChallengedTreatment />} />
            <Route path="/causes/water-filter-school" element={<WaterFilterSchool />} />
            <Route path="/causes/wheelchair-student" element={<WheelchairStudent />} />
            <Route path="/causes/wheelchair-elderly" element={<WheelchairElderly />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
