'use client';

import { create } from 'zustand';
import { 
  SchengenVisaData, 
  Step1Personal, 
  Step2Passport, 
  Step3Travel, 
  Step4Invitation, 
  Step5Funding,
  initialSchengenData,
  initialStep1,
  initialStep2,
  initialStep3,
  initialStep4,
  initialStep5,
  Companion
} from './types';

interface SchengenVisaStore {
  currentStep: number;
  totalSteps: number;
  formData: SchengenVisaData;
  
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateStep1: (data: Partial<Step1Personal>) => void;
  updateStep2: (data: Partial<Step2Passport>) => void;
  updateStep3: (data: Partial<Step3Travel>) => void;
  updateStep4: (data: Partial<Step4Invitation>) => void;
  updateStep5: (data: Partial<Step5Funding>) => void;
  addCompanion: (companion: Companion) => void;
  removeCompanion: (index: number) => void;
  reset: () => void;
}

export const useSchengenVisaStore = create<SchengenVisaStore>((set) => ({
  currentStep: 1,
  totalSteps: 6,
  formData: initialSchengenData,
  
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.totalSteps)
  })),
  
  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),
  
  updateStep1: (data) => set((state) => ({
    formData: {
      ...state.formData,
      step1: { ...state.formData.step1, ...data }
    }
  })),
  
  updateStep2: (data) => set((state) => ({
    formData: {
      ...state.formData,
      step2: { ...state.formData.step2, ...data }
    }
  })),
  
  updateStep3: (data) => set((state) => ({
    formData: {
      ...state.formData,
      step3: { ...state.formData.step3, ...data }
    }
  })),
  
  updateStep4: (data) => set((state) => ({
    formData: {
      ...state.formData,
      step4: { ...state.formData.step4, ...data }
    }
  })),
  
  updateStep5: (data) => set((state) => ({
    formData: {
      ...state.formData,
      step5: { ...state.formData.step5, ...data }
    }
  })),
  
  addCompanion: (companion) => set((state) => ({
    formData: {
      ...state.formData,
      step3: {
        ...state.formData.step3,
        companions: [...state.formData.step3.companions, companion]
      }
    }
  })),
  
  removeCompanion: (index) => set((state) => ({
    formData: {
      ...state.formData,
      step3: {
        ...state.formData.step3,
        companions: state.formData.step3.companions.filter((_, i) => i !== index)
      }
    }
  })),
  
  reset: () => set({
    currentStep: 1,
    formData: initialSchengenData
  }),
}));
