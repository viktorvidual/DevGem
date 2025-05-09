import { Dispatch, SetStateAction, useContext, useState } from 'react';
import Select from 'react-select';
import { OptionCustom } from '../SelectCreatable/selectCreatableHelpers.ts';
import { CustomOption } from './CustomOption.tsx';
import { AuthContext } from '../../context/AuthContext.ts';
import { convertToOptionsFormat } from './customSelect.helpers.ts';

type Props = {
  onChange: Dispatch<SetStateAction<string[]>>;
  isMulti: boolean;
  currentMaintainers: string[];
};

function CustomSelect({ onChange, isMulti, currentMaintainers }: Props) {
  const { allUsers } = useContext(AuthContext);
  const [options, setOptions] = useState<OptionCustom[]>(() => allUsers ? convertToOptionsFormat(allUsers) : []);

  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsMenuOpen(value.length > 0);
    if (allUsers) {
      setOptions(value.length > 0 ? convertToOptionsFormat(allUsers)
        .filter(el => (el.details?.startsWith(value)
          || el.value.startsWith(value))
          && !currentMaintainers.includes(el.id))
        : convertToOptionsFormat(allUsers));
    }
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleSelectChange = (value: OptionCustom | OptionCustom[] | null) => {
    if (isMulti && Array.isArray(value)) {
      onChange(value.map(option => option.id));
    } else if (!isMulti && value && !Array.isArray(value)) {
      onChange([value.id]);
    }
  };

  return (
    <Select
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSelectChange}
      onMenuClose={handleMenuClose}
      options={options}
      menuIsOpen={isMenuOpen}
      components={{ Option: CustomOption }}
      isMulti={isMulti}
    />
  );
}

export default CustomSelect;