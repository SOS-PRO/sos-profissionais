"use client";

import Image from "next/image";
import VerifiedIcon from "@mui/icons-material/Verified";
import RightArrowIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";

export type Professional = {
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
  onCalendarClick: (calendar: string) => void;
};

const ProfessionalCard = ({ professional, onCalendarClick }: ProfessionalCardProps) => {
  return (
    <div
      className="flex flex-col p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
      onClick={() => {
        onCalendarClick(professional.calendar);
        // TODO: workaround to open calendar in new tab as the modal is not working in every machine
        window.open(professional.calendar);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {professional.image ? (
            <div className="w-12 h-12 overflow-hidden rounded-full">
              <Image
                src={professional.image}
                alt={professional.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
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
            <span className="mt-4"></span>
            <p className="text-sm text-gray-500">
              {professional.role} - {professional.office}
            </p>
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
    </div>
  );
};

type ProfessionalsProps = {
  professionals: Professional[];
};

export function Professionals({ professionals }: ProfessionalsProps) {
  const [search, setSearch] = useState<string>("");
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  const filteredProfessionals = professionals.filter((professional) => {
    if (professional.name.toLowerCase().includes(search.toLowerCase())) return true;
    if (professional.role.toLowerCase().includes(search.toLowerCase())) return true;
    if (professional.office.toLowerCase().includes(search.toLowerCase())) return true;
    if (
      professional.specialties.some((specialty) =>
        specialty.toLowerCase().includes(search.toLowerCase())
      )
    )
      return true;
    return false;
  });

  return (
    <>
      {/* TODO: calendar modal is not working in every machine */}
      {/* <Modal isOpen={!!selectedCalendar} onClose={() => setSelectedCalendar(null)}>
        <GoogleCalendar calendar={selectedCalendar || ""} />
      </Modal> */}

      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-2xl">Profissionais disponíveis ({professionals.length})</h1>
        <div className="flex items-center mt-4 mb-4">
          <input
            type="text"
            placeholder="Buscar profissional"
            className="p-2 border border-gray-200 rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredProfessionals.map((professional: Professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onCalendarClick={(calendar) => setSelectedCalendar(calendar)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
