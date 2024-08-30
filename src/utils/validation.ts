export const validateUploadRequest = (body: any): string | null => {
    const { image, customer_code, measure_datetime, measure_type } = body;

    if (!image || typeof image !== 'string') {
        return 'imagem inválida'
    }

    if (!customer_code || typeof customer_code !== 'string') {
        return 'código do cliente inválido';
    }

    if (!measure_datetime || isNaN(Date.parse(measure_datetime))) {
        return 'Data de medição inválida';
    }

    if (!['WATER', 'GAS'].includes(measure_datetime)) {
        return 'Tipo de medição inválido. Deve ser WATER ou GAS';
    }
    return null;
};