import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
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

// Program Pages
import Education from "./pages/programs/Education";
import Healthcare from "./pages/programs/Healthcare";
import Livelihood from "./pages/programs/Livelihood";
import DentalTreatment from "./pages/programs/DentalTreatment";
import LearningSanskrit from "./pages/programs/LearningSanskrit";
import FoodDistribution from "./pages/programs/FoodDistribution";

// Cause Pages
import LakeCleaning from "./pages/causes/LakeCleaning";
import PhysicallyChallengedTreatment from "./pages/causes/PhysicallyChallengedTreatment";
import WaterFilterSchool from "./pages/causes/WaterFilterSchool";
import WheelchairStudent from "./pages/causes/WheelchairStudent";
import WheelchairElderly from "./pages/causes/WheelchairElderly";

// Admin Pages (lazy loaded)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Submissions = lazy(() => import("./pages/admin/Submissions"));
const Donations = lazy(() => import("./pages/admin/Donations"));
const GalleryManager = lazy(() => import("./pages/admin/GalleryManager"));
const EventsManager = lazy(() => import("./pages/admin/EventsManager"));
const NewsManager = lazy(() => import("./pages/admin/NewsManager"));
const DatabaseBrowser = lazy(() => import("./pages/admin/DatabaseBrowser"));
const ReelsManager = lazy(() => import("./pages/admin/ReelsManager"));
const TestimonialsManager = lazy(() => import("./pages/admin/TestimonialsManager"));
const SiteSettingsPage = lazy(() => import("./pages/admin/SiteSettings"));
const queryClient = new QueryClient();

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

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
            
            {/* Program Routes */}
            <Route path="/programs/education" element={<Education />} />
            <Route path="/programs/healthcare" element={<Healthcare />} />
            <Route path="/programs/livelihood" element={<Livelihood />} />
            <Route path="/programs/dental-treatment" element={<DentalTreatment />} />
            <Route path="/programs/learning-sanskrit" element={<LearningSanskrit />} />
            <Route path="/programs/food-distribution" element={<FoodDistribution />} />
            
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
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>} />
            <Route element={<Suspense fallback={<AdminFallback />}><AdminLayout /></Suspense>}>
              <Route path="/admin/dashboard" element={<Suspense fallback={<AdminFallback />}><Dashboard /></Suspense>} />
              <Route path="/admin/submissions" element={<Suspense fallback={<AdminFallback />}><Submissions /></Suspense>} />
              <Route path="/admin/donations" element={<Suspense fallback={<AdminFallback />}><Donations /></Suspense>} />
              <Route path="/admin/gallery" element={<Suspense fallback={<AdminFallback />}><GalleryManager /></Suspense>} />
              <Route path="/admin/events" element={<Suspense fallback={<AdminFallback />}><EventsManager /></Suspense>} />
              <Route path="/admin/news" element={<Suspense fallback={<AdminFallback />}><NewsManager /></Suspense>} />
              <Route path="/admin/database" element={<Suspense fallback={<AdminFallback />}><DatabaseBrowser /></Suspense>} />
              <Route path="/admin/reels" element={<Suspense fallback={<AdminFallback />}><ReelsManager /></Suspense>} />
              <Route path="/admin/testimonials" element={<Suspense fallback={<AdminFallback />}><TestimonialsManager /></Suspense>} />
              <Route path="/admin/settings" element={<Suspense fallback={<AdminFallback />}><SiteSettingsPage /></Suspense>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
