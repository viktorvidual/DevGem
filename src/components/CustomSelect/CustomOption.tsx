import { Avatar } from '@mui/joy';
import { OptionProps, components } from 'react-select';
import { OptionCustom } from '../SelectCreatable/selectCreatableHelpers.ts';

const { Option } = components;

export const CustomOption = (props: OptionProps<OptionCustom, false>) => (
  <Option {...props}>
    <div style={{ display: "flex" }}>
      <Avatar src={props.data.image} alt={props.data.label} size='sm'/>
      <div>
        <div>{props.data.value}</div>
        <div style={{fontSize: "0.8em"}}>{props.data.details}</div>
      </div>
    </div>
  </Option>
);