import {create} from 'zustand';

type BookingInfo = {
    profileId: string;
    doctorId: string;
    workAddressId: string;
    uid: string;
    startTime: string;
    endTime: string;
    bookedBy: 'PATIENT';
    consultationMode: string;
    consultationFee: string;
    textSymptoms: string;
    fileName: string;
    reportName: string;
    reports: string;
    prescriptions: string;
    patientNumber: string;
    patientName: string;
};

type PaymentInfo = {
    orderId: string;
    txnValue: string;
    paymentType: 'payinFull';
    couponId: string;
    bookingAmount: string;
    isUsedCoupon: string;
    isUsedBonus: string;
};

interface BookingInformationState {
    bookingInfo: any;
    paymentInfo: any;
    setBookingInformation: (data: any) => void;
    setPaymentInfo: (data: any) => void;
}

export const useBookingInformation = create<BookingInformationState>(set => ({
    bookingInfo: null,
    paymentInfo: null,
    setBookingInformation: data => set({bookingInfo: data}),
    setPaymentInfo: data => set({paymentInfo: data}),
}));
