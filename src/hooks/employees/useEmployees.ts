"use client";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/services/apiService";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export interface Employees {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender: string;
  dayOfBirth: Date;
  nationality: string;
  imageUrl: string;
  employmentType: string // 'official' | 'temporary'
  jobTitleId: string;
  subUnitId: string;
  userId: string;
}

export function useEmployee() {
  const [employee, setEmployee] = useState<Employees[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployee() {
      try {
        const data = await fetchWithAuth(API_ENDPOINTS.GET_ALL_EMPLOYEES);
        setEmployee(data);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      }
    }

    loadEmployee();
  }, []);

  return { employee, error };
}
