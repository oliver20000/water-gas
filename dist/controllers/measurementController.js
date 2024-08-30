"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMeasurement = void 0;
const googleGeminiService_1 = require("../services/googleGeminiService");
const validation_1 = require("../utils/validation");
const uuid_1 = require("uuid");
const measurements = [];
const uploadMeasurement = async (req, res) => {
    try {
        const { image, customer_code, measure_datetime, measure_type } = req.body;
        const validationError = (0, validation_1.validateUploadRequest)(req.body);
        if (validationError) {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: validationError,
            });
        }
        const existingMeasurement = measurements.find(measurement => measurement.customerCode === customer_code &&
            measurement.measureType === measure_type &&
            new Date(measurement.measureDatetime).getMonth() === new Date(measure_datetime).getMonth());
        if (existingMeasurement) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada',
            });
        }
        const geminiResponse = await (0, googleGeminiService_1.processImageWithGemini)(image);
        const newMeasurement = {
            uuid: (0, uuid_1.v4)(),
            customerCode: customer_code,
            measureDatetime: new Date(measure_datetime),
            measureType: measure_type,
            measureValue: geminiResponse.value,
            imageUrl: geminiResponse.imageUrl,
            confirmed: false,
        };
        measurements.push(newMeasurement);
        return res.status(200).json({
            image_url: newMeasurement.imageUrl,
            measure_value: newMeasurement.measureValue,
            measure_uuid: newMeasurement.uuid,
        });
    }
    catch (error) {
        return res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: 'Erro ao processar a requisição',
        });
    }
};
exports.uploadMeasurement = uploadMeasurement;
