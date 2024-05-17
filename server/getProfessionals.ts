import { google } from "googleapis";
import { jwtDecode } from "jwt-decode";
import { Professional } from "@/components/Professionals";

const GOOGLE_FORM_RESPONSES_SPREADSHEET_ID = process.env.GOOGLE_FORM_RESPONSES_SPREADSHEET_ID;
const GOOGLE_AUTH_JWT = process.env.GOOGLE_AUTH_JWT;

function getToken() {
  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ];

  const credentials = jwtDecode(GOOGLE_AUTH_JWT as string) as any;

  const jwt = new google.auth.GoogleAuth({
    credentials,
    scopes,
  });

  return jwt;
}

async function getImageBase64(drive: any, imageUri: string) {
  if (!imageUri) return undefined;

  try {
    const imageId = imageUri.split("id=")[1];

    const response = await drive.files.get(
      {
        fileId: imageId,
        alt: "media",
      },
      { responseType: "arraybuffer" }
    );

    const base64 = Buffer.from(response.data as any).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    return undefined;
  }
}

export const getProfessionals = async () => {
  const professionals: Professional[] = [];

  const jwt = getToken();

  const sheets = google.sheets({ version: "v4", auth: jwt });
  const drive = google.drive({ version: "v3", auth: jwt });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_FORM_RESPONSES_SPREADSHEET_ID,
    range: "Respostas!A2:M",
  });

  const rows = response.data.values!;
  if (rows.length) {
    await Promise.all(
      rows.map(async (row, index) => {
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
          image: await getImageBase64(drive, image),
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
      })
    );
  }

  return professionals.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
