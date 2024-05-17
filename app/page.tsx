import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Professionals } from "@/components/Professionals";
import { getProfessionals } from "@/server/getProfessionals";

export default async function ProfessionalsPage() {
  const professionals = await getProfessionals();

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <Professionals professionals={professionals} />
      <Footer />
    </main>
  );
}
