import Navbar from "@/components/Navbar";
import Image from "next/image";
import { google } from "googleapis";
import Footer from "@/components/Footer";
import VerifiedIcon from "@mui/icons-material/Verified";
import RightArrowIcon from "@mui/icons-material/ArrowForwardIos";

const GOOGLE_FORM_RESPONSES_SPREADSHEET_ID = process.env.GOOGLE_FORM_RESPONSES_SPREADSHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_JSON = {
  type: process.env.GOOGLE_AUTH_TYPE,
  project_id: process.env.GOOGLE_AUTH_PROJECT_ID,
  private_key_id: process.env.GOOGLE_AUTH_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_AUTH_PRIVATE_KEY,
  client_email: process.env.GOOGLE_AUTH_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_AUTH_URI,
  token_uri: process.env.GOOGLE_AUTH_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_AUTH_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE_AUTH_UNIVERSE_DOMAIN,
};

// Carimbo de data/hora	Endereço de e-mail	Nome do profissional	Nome do escritório ou clínica	Imagem para exibição (opcional)	Telefone para contato	Profissional	Deseja prestar consultoria em qual área?	Deseja prestar atendimento em qual área?	Deseja prestar atendimento em qual área da psicologia?	Áreas de atuação	"Link para agendamento
// Criar conforme sua disponibilidade em: https://calendar.google.com/calendar/u/0/r/appointment"	Verificado
type Professional = {
  id: string;
  timestamp: Date;
  email: string;
  name: string;
  office: string;
  image?: string;
  phone: string;
  role: string;
  specialties: string[];
  calendar: string;
  verified: boolean;
};

type ProfessionalCardProps = {
  professional: Professional;
};

const getProfessionals = async () => {
  const professionals: Professional[] = [];
  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ];
  const jwt = new google.auth.GoogleAuth({
    credentials: GOOGLE_SERVICE_ACCOUNT_JSON,
    scopes,
  });

  const sheets = google.sheets({ version: "v4", auth: jwt });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_FORM_RESPONSES_SPREADSHEET_ID,
    range: "Respostas!A2:M",
  });

  const rows = response.data.values!;
  if (rows.length) {
    rows.forEach((row, index) => {
      const [
        timestamp,
        email,
        name,
        office,
        image,
        phone,
        role,
        specialty1,
        specialty2,
        specialty3,
        specialties,
        calendar,
        verified,
      ] = row;

      const [day, month, year] = timestamp.split("/").map((n: string) => parseInt(n, 10));
      const [hour, minute, second] = timestamp
        .split(" ")[1]
        .split(":")
        .map((n: string) => parseInt(n, 10));

      if (index === 0) return;
      professionals.push({
        id: index.toString(),
        timestamp: new Date(year, month - 1, day, hour, minute, second),
        email,
        name,
        office,
        image,
        phone,
        role,
        specialties: [
          ...(specialty1 ? [specialty1.split(",").map((s: string) => s.trim())] : []),
          ...(specialty2 ? [specialty2.split(",").map((s: string) => s.trim())] : []),
          ...(specialty3 ? [specialty3.split(",").map((s: string) => s.trim())] : []),
          ...(specialties ? [specialties.split(",").map((s: string) => s.trim())] : []),
        ].flat(),
        calendar,
        verified: verified === "SIM",
      });
    });
  }

  const drive = google.drive({ version: "v3", auth: jwt });

  await Promise.all(
    professionals.map(async (professional) => {
      if (!professional.image) return;
      try {
        const imageId = professional.image.split("id=")[1];
        const response = await drive.files.get(
          {
            fileId: imageId,
            alt: "media",
          },
          { responseType: "arraybuffer" }
        );

        const base64 = Buffer.from(response.data as any).toString("base64");
        const image = `data:image/png;base64,${base64}`;
        professional.image = image;
      } catch (error) {
        professional.image = undefined;
      }
    })
  );

  return professionals.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  return (
    <a
      className="flex flex-col p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
      href={professional.calendar}
      target="_blank"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {professional.image ? (
            <Image
              src={professional.image}
              alt={professional.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 text-white font-bold rounded-full">
              {professional.name[0]}
            </div>
          )}
          <div className="ml-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {professional.name}
              {professional.verified && (
                <span className="text-blue-500">
                  <VerifiedIcon />
                </span>
              )}
            </h2>
            <span className="mt-4">
              <a
                href={professional.calendar}
                target="_blank"
                className="text-blue-500 font-semibold"
              >
                Consultar agenda
              </a>
            </span>
            <p className="text-sm text-gray-500">{professional.office}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RightArrowIcon />
        </div>
      </div>
      <div className="mt-4 border-t border-gray-200"></div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Especialidades</h3>
        <div className="flex gap-2 mt-2 flex-wrap">
          {professional.specialties.map((specialty) => (
            <span key={specialty} className="bg-gray-200 text-gray-600 p-2 rounded-lg text-sm">
              {specialty}
            </span>
          ))}
        </div>
      </div>
      <span className="mt-4 text-sm text-gray-500">
        Atualizado em {new Date(professional.timestamp).toLocaleString()}
      </span>
    </a>
  );
};

export default async function ProfessionalsPage() {
  const professionals = await getProfessionals();

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-2xl">Profissionais disponíveis ({professionals.length})</h1>
        {/* search bar */}
        <div className="flex items-center mt-4 mb-4">
          <input
            type="text"
            placeholder="Buscar profissional"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <button className="p-2 ml-2 bg-green-500 text-white rounded-lg">Buscar</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {professionals.map((professional: Professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
