import clsx from 'clsx';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { PageLayout } from '../modules/shared/components/PageLayout';

const Submit = () => {
  return (
    <PageLayout>
      <div className="max-w-lg space-y-6">
        <div className="">
          <p className="text-lg tracking-wider uppercase">Submission Rules</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Do not share your image with anyone until approved or denied. This is for your
              protection.
            </li>
            <li>Submission must be 1080x1080</li>
            <li>3MB cutoff for GIFs; 1MB pixels cutoff for PNGs, JPGs, etc.</li>
            <li>Token must not be divisible</li>
            <li>Token must be locked</li>
            <li>Do not send token until approved for series</li>
            <li>Issuance must be a minimum of 69</li>
            <li>Only 1 submission per artist until approved or denied</li>
            <li>
              if you just take an existing Bored Ape and add a hat or some drool, that&apos;s not
              really what we&apos;re looking for. While Drooling Apes can resemble Bored Apes, the
              drawing should be original, not just a copy of a Bored Ape.
            </li>
          </ol>
        </div>
        <SubmissionForm />
      </div>
      <Toaster />
    </PageLayout>
  );
};

const SubmissionForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm();

  return (
    <form
      className="flex flex-col items-start space-y-2"
      onSubmit={handleSubmit(async (data) => {
        const formData = new FormData();
        formData.append('apeName', data.apeName);
        formData.append('contact', data.contact);
        formData.append('file', data.file[0]);
        const response = await fetch('/api/submit', { method: 'POST', body: formData });
        if (response.ok) {
          toast.success('Your ape has been submitted!');
          reset();
        } else {
          toast.error('Something went wrong. Please try again or contact Aryan');
        }
      })}
    >
      <StyledLabel>
        <p className="text-sm font-medium">Asset Xchain Link (don&apos;t forget https://)</p>
        <StyledInput
          {...register('apeName')}
          placeholder="https://xchain.io/asset/..."
          required
          type="url"
        />
      </StyledLabel>
      <StyledLabel>
        <p className="text-sm font-medium">Your Contact (Telegram, Twitter or Email)</p>
        <StyledInput {...register('contact')} required />
      </StyledLabel>
      <input accept="image/png, image/jpeg, image/gif" type="file" {...register('file')} required />
      <ButtonBusySpinner
        className="bg-purple-500 p-2 rounded-md text-white"
        disabled={isSubmitting}
        isBusy={isSubmitting}
        type="submit"
      >
        Submit
      </ButtonBusySpinner>
    </form>
  );
};

const ButtonBusySpinner: React.FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    isBusy?: boolean;
  }
> = ({ children, className, isBusy, ...props }) => {
  return (
    <button {...props} className={clsx(className, 'flex justify-center items-center')}>
      <span className={clsx(isBusy && 'invisible')}> {children}</span>
      <span className="absolute animate-spin">{isBusy && <FaSpinner />}</span>
    </button>
  );
};
const StyledLabel: React.FC<
  React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
> = (props) => <label {...props} className="flex flex-col w-full space-y-1" />;

const StyledInput = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>((props, ref) => (
  <input
    {...props}
    ref={ref}
    className="border border-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 rounded-sm py-1 px-2 w-full"
  />
));
StyledInput.displayName = 'StyledInput';

export default Submit;