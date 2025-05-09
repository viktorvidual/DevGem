import { Dispatch, SetStateAction, useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import { OptionCustom, useSelectData } from "./selectCreatableHelpers.js";
import { getAllIDEs } from "../../services/IDE.services.js";
import { getAllTags } from "../../services/tag.services.js";
import { TAGS } from "../../common/common.js";
import { FormControl } from "@mui/joy";
import ErrorHelper from "../../views/ErrorHelper/ErrorHelper.tsx";
import { MultiValue, SingleValue } from "react-select";

interface Props {
  changeValues: (values: string[]) => void;
  targetId?: string | undefined;
  getAllValues: typeof getAllIDEs | typeof getAllTags;
  type: string;
  validateValue: (value: string[]) => string | null;
  isSubmitted: boolean;
  initialValue?: string[];
  setSubmitError: Dispatch<SetStateAction<Map<string, null | string>>>;
}

export default function SelectCreatable({
  changeValues,
  targetId,
  getAllValues,
  type,
  validateValue,
  isSubmitted,
  setSubmitError,
  initialValue
}: Props) {
  const animatedComponents = makeAnimated();
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { loading, allValues, defaultValues } = useSelectData(targetId, changeValues, getAllValues, type);
  const [currentValue, setCurrentValue] = useState<string[]>(initialValue || []);
  
  useEffect(() => {
    const data = validateValue(currentValue);
    
    setError(data);
    setSubmitError((prev) => prev.set(type, data));
  }, [currentValue, type, setSubmitError, validateValue, defaultValues]);

  if (loading) {
    return null;
  }

  return (
    <FormControl>
      {currentValue && (<CreatableSelect
        defaultValue={defaultValues}
        inputValue={inputValue}
        onChange={(newValue: MultiValue<OptionCustom[] | OptionCustom> | SingleValue<OptionCustom[] | OptionCustom> | unknown) => {
          setSubmitError((prev) => prev.set(type, null));
          setError(null);
          if (Array.isArray(newValue)) {
            const simpleValues = newValue.map((option) => option.value);
            changeValues(simpleValues);
            setCurrentValue(simpleValues);
          } else if (typeof newValue === 'object' && newValue && !Array.isArray(newValue) && "value" in newValue && type !== TAGS) {

            changeValues([newValue.value as string]);
            setCurrentValue([newValue.value as string]);
          }
        }}
        onInputChange={(newValue) => setInputValue(newValue)}
        isClearable
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti={type === TAGS}
        options={allValues}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary75: 'hotpink',
            primary50: 'black',
          },
        })}
        styles={{
          control: (provided) => ({
            ...provided,
            minHeight: '3em',
            borderColor: error && isSubmitted ? 'var(--joy-palette-danger-outlinedBorder, var(--joy-palette-danger-300, #F09898))' : provided.borderColor,
          }),
        }}
      />)}
      {error && isSubmitted &&
        <ErrorHelper error={error} />}
    </FormControl>
  );
}
