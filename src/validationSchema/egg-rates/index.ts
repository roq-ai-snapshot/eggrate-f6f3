import * as yup from 'yup';

export const eggRateValidationSchema = yup.object().shape({
  rate: yup.number().integer().required(),
  city: yup.string().required(),
  supplier_id: yup.string().nullable().required(),
});
