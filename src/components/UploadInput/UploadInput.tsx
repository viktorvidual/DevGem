import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Button, FormControl, FormHelperText, FormLabel, SvgIcon } from '@mui/joy';
import ErrorHelper from '../../views/ErrorHelper/ErrorHelper.tsx';
import { DummyInitialFile } from '../EditAddon/EditAddon.tsx';
import { FormInput, UPLOAD_iCON } from '../../common/common.ts';

interface Props {
  setValue: (value: File) => void;
  validateValue: (value: string, type: string) => Promise<string | null>;
  isSubmitted?: boolean;
  setSubmitError?: Dispatch<SetStateAction<Map<string, null | string>>>;
  isRequired: boolean;
  acceptedFormats: string;
  inputLabel: string;
  initialValue?: DummyInitialFile;
}

const UploadInput = (props: Props) => {
  const [fileName, setFileName] = useState<string>(props.initialValue?.name || '');
  const [error, setError] = useState<string | null>(null);
  const [isNewFileAdded, SetIsNewFileAdded] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];

      setFileName(file.name);
      props.setValue(file);

      SetIsNewFileAdded(true);
    }
  };

  useEffect(() => {

    if (props.initialValue && !isNewFileAdded) {
      return;
    }
    
    (async () => {
      const data = await props.validateValue(fileName, props.inputLabel);

      setError(data);
      if (props.inputLabel === 'Plugin file' && props.setSubmitError) {
        props.setSubmitError((prev) => prev.set("upload", data));
      } else if (props.inputLabel === 'Logo' && props.setSubmitError) {
        props.setSubmitError((prev) => prev.set("logo", data));
      }
    })();
  }, [fileName]);

  return (
    <FormControl>
      <FormLabel>{props.inputLabel}</FormLabel>
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        variant="outlined"
        color="neutral"
        startDecorator={
          <SvgIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={UPLOAD_iCON}
              />
            </svg>
          </SvgIcon>
        }
        sx={{
          borderColor: (error && props.isSubmitted && props.isRequired)
            || (props.inputLabel === 'Logo' && error && fileName !== '' && props.isSubmitted)
            ? 'var(--joy-palette-danger-outlinedBorder, var(--joy-palette-danger-300, #F09898));' : undefined,
            height: "3.4em",
        }}
      >
        {fileName || 'Upload a file'}
        <FormInput
          type="file"
          onChange={handleFileChange}
          accept={props.acceptedFormats} />
      </Button>
      {(props.isRequired && error && props.isSubmitted)
        || (props.inputLabel === 'Logo' && error && fileName !== '' && props.isSubmitted) ?
        (<ErrorHelper error={error} />
        ) : (
          <FormHelperText>{props.acceptedFormats} format</FormHelperText>
        )}
    </FormControl>
  )
}

export default UploadInput