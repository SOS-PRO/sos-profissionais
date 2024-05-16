import Navbar from "@/components/Navbar";
import { google } from "googleapis";
import Footer from "@/components/Footer";
import { jwtDecode } from "jwt-decode";
import { Professional, Professionals } from "@/components/Professionals";

const GOOGLE_FORM_RESPONSES_SPREADSHEET_ID = process.env.GOOGLE_FORM_RESPONSES_SPREADSHEET_ID;
const GOOGLE_AUTH_JWT = process.env.GOOGLE_AUTH_JWT;

const getProfessionals = async () => {
  const professionals: Professional[] = [];
  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/calendar.readonly"
  ];

  const credentials = jwtDecode(GOOGLE_AUTH_JWT as string) as any;
  const jwt = new google.auth.GoogleAuth({
    credentials,
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
        

      if (!verified) return;

      professionals.push({
        id: index.toString(),
        timestamp: new Date(year, month - 1, day, hour, minute, second),
        email: "",
        name,
        office,
        image,
        phone: "",
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
