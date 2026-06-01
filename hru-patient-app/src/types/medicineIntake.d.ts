interface LabelValueIndex {
    label: string;
    value: string;
    _index: number;
}

interface MedicineDetails {
    medicineName: string;
    medicineId: string;
    frequency: LabelValueIndex;
    consumptionTime: LabelValueIndex;
    dosage: string; // Can be number if you're validating it as numeric
    unit: LabelValueIndex;
    duration: string; // Can be number if you're validating it as numeric
    time: LabelValueIndex;
    additionalNote: string;
}

type MedicineReminder = {
    _id: string; // Unique identifier for the medicine reminder
    medicineName: string; // Name of the medicine
    remainderTime: string; // ISO timestamp for the remainder time
    pescribedby: string; // Prescriber's name
    quantity: number; // Quantity of the medicine
    remainderDate: string; // ISO timestamp for the remainder date
    medicineId: string; // Unique identifier for the medicine
    dateandtime: string; // ISO timestamp for the full date and time
};
