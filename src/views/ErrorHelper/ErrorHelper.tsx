import { FormHelperText } from '@mui/joy';
import { InfoOutlined } from '@mui/icons-material';

type Props = {
  error: string | null;
}

const ErrorHelper = (props: Props) => {
  return (
    <FormHelperText
      sx={{
        color: 'var(--joy-palette-danger-outlinedBorder, var(--joy-palette-danger-300, #F09898))',
      }}>
      <InfoOutlined />
      {props.error}
    </FormHelperText>
  )
}

export default ErrorHelper