import Navbar from "@/components/Navbar";
import { google } from "googleapis";
import Footer from "@/components/Footer";
import { jwtDecode } from "jwt-decode";
import { Professional, Professionals } from "@/components/Professionals";
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
