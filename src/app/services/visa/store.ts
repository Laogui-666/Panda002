'use client';

import { create } from 'zustand';
import { 
  VisaFormData, 
  PersonalInfo, 
  PassportInfo, 
  TravelInfo, 
  InvitationInfo, 
  FundingInfo,
  initialPersonalInfo,
  initialPassportInfo,
  initialTravelInfo,
  initialInvitationInfo,
  initialFundingInfo
} from './types';

interface VisaFormStore {
  currentStep: number;
  totalSteps: number;
  formData: VisaFormData;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updatePersonal: (data: Partial<PersonalInfo>) => void;
  updatePassport: (data: Partial<PassportInfo>) => void;
  updateTravel: (data: Partial<TravelInfo>) => void;
  updateInvitation: (data: Partial<InvitationInfo>) => void;
  updateFunding: (data: Partial<FundingInfo>) => void;
  reset: () => void;
}

export const useVisaFormStore = create<VisaFormStore>((set) => ({
  currentStep: 1,
  totalSteps: 6,
  formData: {
    personal: initialPersonalInfo,
    passport: initialPassportInfo,
    travel: initialTravelInfo,
    invitation: initialInvitationInfo,
    funding: initialFundingInfo,
  },
  
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.totalSteps)
  })),
  
  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),
  
  updatePersonal: (data) => set((state) => ({
    formData: {
      ...state.formData,
      personal: { ...state.formData.personal, ...data }
    }
  })),
  
  updatePassport: (data) => set((state) => ({
    formData: {
      ...state.formData,
      passport: { ...state.formData.passport, ...data }
    }
  })),
  
  updateTravel: (data) => set((state) => ({
    formData: {
      ...state.formData,
      travel: { ...state.formData.travel, ...data }
    }
  })),
  
  updateInvitation: (data) => set((state) => ({
    formData: {
      ...state.formData,
      invitation: { ...state.formData.invitation, ...data }
    }
  })),
  
  updateFunding: (data) => set((state) => ({
    formData: {
      ...state.formData,
      funding: { ...state.formData.funding, ...data }
    }
  })),
  
  reset: () => set({
    currentStep: 1,
    formData: {
      personal: initialPersonalInfo,
      passport: initialPassportInfo,
      travel: initialTravelInfo,
      invitation: initialInvitationInfo,
      funding: initialFundingInfo,
    }
  }),
}));
