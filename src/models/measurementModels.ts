export interface Measurement {
    uuid: string;
    customerCode: string;
    measureDatetime: Date;
    measureType: 'WATER' | 'GAS';
    measureValue?: number;
    imageUrl: string;
    confirmed: boolean;
}