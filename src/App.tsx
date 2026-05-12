import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index.tsx";
import Products from "./pages/Products.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Collections from "./pages/Collections.tsx";
import Brands from "./pages/Brands.tsx";
import CollectionPage from "./pages/CollectionPage.tsx";
import Auth from "./pages/Auth.tsx";
import Account from "./pages/Account.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";

const queryClient = new QueryClient();

const AppRoutes = () => {
  useCartSync();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/produtos" element={<Products />} />
      <Route path="/produto/:handle" element={<ProductDetail />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/favoritos" element={<Wishlist />} />
      <Route path="/colecoes" element={<Collections />} />
      <Route path="/colecao/:slug" element={<CollectionPage mode="collection" />} />
      <Route path="/marcas" element={<Brands />} />
      <Route path="/marca/:slug" element={<CollectionPage mode="vendor" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/conta" element={<Account />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
