export class CreateStatementRequestDto {
    sourceBankName: string;

    customerName?: string;

    customerEmail?: string;

    customerMobile?: string;

    accountNumber: string;

    startDate: string;

    endDate: string;

    purpose: string;

    notes?: string;

    expiresAt: string;
}