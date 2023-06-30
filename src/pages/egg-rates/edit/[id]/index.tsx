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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getEggRateById, updateEggRateById } from 'apiSdk/egg-rates';
import { Error } from 'components/error';
import { eggRateValidationSchema } from 'validationSchema/egg-rates';
import { EggRateInterface } from 'interfaces/egg-rate';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { SupplierInterface } from 'interfaces/supplier';
import { getSuppliers } from 'apiSdk/suppliers';

function EggRateEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EggRateInterface>(
    () => (id ? `/egg-rates/${id}` : null),
    () => getEggRateById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EggRateInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEggRateById(id, values);
      mutate(updated);
      resetForm();
      router.push('/egg-rates');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EggRateInterface>({
    initialValues: data,
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
            Edit Egg Rate
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(EggRateEditPage);
