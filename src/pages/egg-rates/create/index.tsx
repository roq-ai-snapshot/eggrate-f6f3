import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createEggRate } from 'apiSdk/egg-rates';
import { Error } from 'components/error';
import { eggRateValidationSchema } from 'validationSchema/egg-rates';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { SupplierInterface } from 'interfaces/supplier';
import { getSuppliers } from 'apiSdk/suppliers';
import { EggRateInterface } from 'interfaces/egg-rate';

function EggRateCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EggRateInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEggRate(values);
      resetForm();
      router.push('/egg-rates');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EggRateInterface>({
    initialValues: {
      rate: 0,
      city: '',
      supplier_id: (router.query.supplier_id as string) ?? null,
    },
    validationSchema: eggRateValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Egg Rate
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="rate" mb="4" isInvalid={!!formik.errors?.rate}>
            <FormLabel>Rate</FormLabel>
            <NumberInput
              name="rate"
              value={formik.values?.rate}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('rate', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.rate && <FormErrorMessage>{formik.errors?.rate}</FormErrorMessage>}
          </FormControl>
          <FormControl id="city" mb="4" isInvalid={!!formik.errors?.city}>
            <FormLabel>City</FormLabel>
            <Input type="text" name="city" value={formik.values?.city} onChange={formik.handleChange} />
            {formik.errors.city && <FormErrorMessage>{formik.errors?.city}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<SupplierInterface>
            formik={formik}
            name={'supplier_id'}
            label={'Select Supplier'}
            placeholder={'Select Supplier'}
            fetcher={getSuppliers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'egg_rate',
    operation: AccessOperationEnum.CREATE,
  }),
)(EggRateCreatePage);
