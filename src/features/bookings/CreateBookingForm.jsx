import Input from '../../ui/Input';
import Form from '../../ui/Form';

import Textarea from '../../ui/Textarea';
import { useForm } from 'react-hook-form';

import FormRow from '../../ui/FormRow';

import useCreateBooking from './useCreateBooking';
import { useParams } from 'react-router-dom';
import { differenceInCalendarDays } from 'date-fns';
import useCabins from '../cabins/useCabins';
import { useEffect } from 'react';
import useSettings from '../settings/useSettings';
import { createOrGetGuest } from '../../services/apiGuests';
import { useCountryFlagUrl } from './useCountryFlagUrl';

function CreateBookingForm({ cabinToEdit = {}, onCloseModal }) {
  const { isCreating, createBooking } = useCreateBooking();

  const { cabinId } = useParams();

  const { cabins = [], isLoading: isLoadingCabins } = useCabins();
  const cabin = cabins.find((c) => String(c.id) === String(cabinId));
  const cabinPrice = cabin?.regularPrice || 0;

  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      cabinId,
      cabinPrice,
      extrasPrice: 0,
      hasBreakfast: false,
      totalPrice: 0,
      numNights: 0,
      numGuests: 0,
    },
  });

  const { settings } = useSettings();
  const breakfastPrice = settings?.breakfastPrice || 0;

  useEffect(() => {
    if (cabin && cabin.regularPrice) {
      setValue('cabinPrice', cabin.regularPrice);
    }
  }, [cabin, setValue]);

  const watchStart = watch('startDate');
  const watchEnd = watch('endDate');
  const watchBreakfast = watch('hasBreakfast');
  const watchCountry = watch('countryFlag');

  useEffect(() => {
    if (!watchStart || !watchEnd) return;

    const start = new Date(watchStart);
    const end = new Date(watchEnd);
    const numNights = differenceInCalendarDays(end, start);
    const numGuests = Number(getValues('numGuests'));

    if (numNights < 1 || numGuests < 1) return;

    const extras = watchBreakfast ? numNights * breakfastPrice * numGuests : 0;
    const total = numNights * cabinPrice + extras;

    setValue('totalPrice', total);
    setValue('numNights', numNights);
    setValue('extrasPrice', extras);
  }, [
    watchStart,
    watchEnd,
    watchBreakfast,
    setValue,
    cabinPrice,
    breakfastPrice,
    getValues,
  ]);

  const { data: flagUrl } = useCountryFlagUrl(watchCountry);

  const { errors } = formState;

  async function onSubmit(data) {
    try {
      // Шаг 1: Получаем/создаём гостя
      const guest = await createOrGetGuest({
        fullName: data.fullName,
        email: data.email,
        nationality: data.nationality,
        nationalID: data.nationalID,
        countryFlag: flagUrl || '',
      });

      // Шаг 2: Формируем данные брони (исключаем fullName и email!)
      const {
        fullName,
        email,
        nationality,
        nationalID,
        countryFlag,
        ...rest // всё остальное — для бронирования
      } = data;

      const bookingData = {
        ...rest,
        numGuests: Number(data.numGuests),
        isPaid: data.isPaid === 'true' || data.isPaid === true,
        numNights: Number(data.numNights),
        cabinId: Number(data.cabinId),
        guestId: guest.id, // используем id гостя
      };

      // Шаг 3: Отправляем в Supabase
      createBooking(bookingData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
        onError: (err) => {
          console.error('❌ Ошибка при создании брони:', err);
        },
      });
    } catch (err) {
      console.error('❌ Ошибка при создании гостя:', err);
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label={'Cabin id'} error={errors?.name?.message}>
        <Input
          value={cabinId}
          type="number"
          id="cabinId"
          {...register('cabinId', { required: 'This field is required' })}
          disabled={true}
        />
      </FormRow>

      <FormRow label={'Fullname'} error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          {...register('fullName', { required: 'This field is required' })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label={'email'} error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          {...register('email', { required: 'This field is required' })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Nationality">
        <Input
          type="text"
          id="nationality"
          {...register('nationality', { required: 'This field is required' })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="National ID">
        <Input
          type="text"
          id="nationalID"
          {...register('nationalID', { required: 'This field is required' })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Country flag URL">
        <Input
          type="text"
          id="countryFlag"
          {...register('countryFlag', { required: 'This field is required' })}
          disabled={isCreating}
        />
      </FormRow>

      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="datetime-local"
          disabled={isCreating}
          id="startDate"
          {...register('startDate', {
            required: 'This field is required',
            validate: (value) => {
              const date = new Date(value);
              const hours = date.getHours();
              if (hours < 14) return 'Check-in time must be after 14:00';
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="datetime-local"
          disabled={isCreating}
          id="endDate"
          {...register('endDate', {
            required: 'This field is required',
            validate: (endValue) => {
              const startValue = getValues('startDate');
              if (!startValue) return 'Start date is required';

              const start = new Date(startValue);
              const end = new Date(endValue);

              if (differenceInCalendarDays(end, start) < 3) {
                return 'Minimum stay is 3 nights';
              }

              const endHours = end.getHours();
              if (endHours > 12) {
                return 'Check-out must be before 12:00';
              }

              if (end <= start) {
                return 'End date must be after start date';
              }

              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="Status">
        <select {...register('status', { required: 'This field is required' })}>
          <option value="unconfirmed">Unconfirmed</option>
          <option value="checked-in">Checked-in</option>
        </select>
      </FormRow>

      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          {...register('numGuests', {
            required: 'Required',
            min: { value: 1, message: 'Must be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label={'Cabin price'} error={errors?.cabinPrice?.message}>
        <Input
          type="number"
          disabled={true}
          defaultValue={cabinPrice}
          id="cabinPrice"
          {...register('cabinPrice', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label={'Extras Price'} error={errors?.extrasPrice?.message}>
        <Input
          type="number"
          id="extrasPrice"
          disabled={true}
          defaultValue={0}
          {...register('extrasPrice', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Has Breakfast">
        <input type="checkbox" {...register('hasBreakfast')} />
      </FormRow>

      <FormRow label={'Total Price'} error={errors?.totalPrice?.message}>
        <Input
          type="number"
          id="totalPrice"
          disabled={true}
          defaultValue={0}
          {...register('totalPrice', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Is Paid">
        <select {...register('isPaid')}>
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </select>
      </FormRow>

      <input type="hidden" {...register('numNights')} />

      <FormRow
        label={'Description for booking'}
        error={errors?.observations?.message}
      >
        <Textarea
          type="text"
          id="observations"
          disabled={isCreating}
          defaultValue=""
          {...register('observations', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <button className="btn bg-white text-black" type="reset">
          Cancel
        </button>
        <button className="btn" disabled={isCreating}>
          {isEditSession ? 'Edit cabin' : 'Add cabin'}
        </button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
