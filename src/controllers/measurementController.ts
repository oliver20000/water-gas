import { Request, Response } from 'express';
import { processImageWithGemini } from '../services/googleGeminiService';
import { Measurement } from '../models/measurementModels';
import { validateUploadRequest } from '../utils/validation';
import { v4 as uuidv4 } from 'uuid';

const measurements: Measurement[] = []; 
export const uploadMeasurement = async (req: Request, res: Response) => {
  console.log('uploadMeasurement chamado');
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;


    const validationError = validateUploadRequest(req.body);
    if (validationError) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: validationError,
      });
    }


    const existingMeasurement = measurements.find(measurement =>
      measurement.customerCode === customer_code &&
      measurement.measureType === measure_type &&
      new Date(measurement.measureDatetime).getMonth() === new Date(measure_datetime).getMonth()
    );

    if (existingMeasurement) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    
    const geminiResponse = await processImageWithGemini(image);

    
    const newMeasurement: Measurement = {
      uuid: uuidv4(),
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
  } catch (error) {
    return res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro ao processar a requisição',
    });
  }
};


export const confirmMeasurement = (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value } = req.body;


  if (!measure_uuid || typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Dados inválidos fornecidos na requisição',
    });
  }


  const measurement = measurements.find(m => m.uuid === measure_uuid);

  if (!measurement) {
    return res.status(404).json({
      error_code: 'MEASURE_NOT_FOUND',
      error_description: 'Leitura não encontrada',
    });
  }


  if (measurement.confirmed) {
    return res.status(409).json({
      error_code: 'CONFIRMATION_DUPLICATE',
      error_description: 'Leitura já confirmada',
    });
  }

  
  measurement.measureValue = confirmed_value;
  measurement.confirmed = true;

  return res.status(200).json({
    success: true,
  });
};


export const listMeasurements = (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;


  let customerMeasurements = measurements.filter(m => m.customerCode === customer_code);


  if (measure_type) {
    const type = (measure_type as string).toUpperCase();
    if (type !== 'WATER' && type !== 'GAS') {
      return res.status(400).json({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição inválido. Deve ser WATER ou GAS',
      });
    }
    customerMeasurements = customerMeasurements.filter(m => m.measureType === type);
  }

  
  if (customerMeasurements.length === 0) {
    return res.status(404).json({
      error_code: 'MEASURES_NOT_FOUND',
      error_description: 'Nenhuma leitura encontrada para o cliente',
    });
  }

  return res.status(200).json({
    customer_code,
    measures: customerMeasurements,
  });
};