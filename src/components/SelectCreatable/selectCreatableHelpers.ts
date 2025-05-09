import { useEffect, useState, useContext } from 'react';
import { getAllTags } from '../../services/tag.services.ts';
import { getAllIDEs } from '../../services/IDE.services.ts';
import { AddonsContext } from '../../context/AddonsContext.ts';
import { TAGS } from '../../common/common.ts';
export interface OptionCustom {
  label: string;
  value: string;
  image?: string;
  details?: string;
  id: string;
}
export interface Tag {
  tagId: string;
  name: string;
  createdOn: Date;
}

export interface IDE {
  IDEId: string;
  name: string;
  createdOn: Date;
}

export function useSelectData(
  targetId: string | undefined,
  changeValues: (values: string[]) => void,
  getAllValues: typeof getAllIDEs | typeof getAllTags,
  type: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [allValues, setAllValues] = useState<OptionCustom[]>([]);
  const [defaultValues, setDefaultValues] = useState<OptionCustom[]>([]);
  const { allAddons } = useContext(AddonsContext);

  const createOption = (label: string): OptionCustom => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
    id: crypto.randomUUID(),
  });
  
  useEffect(() => {
    setLoading(true);

    (async function () {
      try {
        const addon = allAddons.filter(el => el.addonId === targetId)[0];
        let defaultData;
        if (type === TAGS) {
          
          defaultData = allAddons && targetId ? Object.keys(addon.tags) : [];
        } else {
          defaultData = allAddons && targetId ? [addon.targetIDE] : [];
        }
        
        const defaultValuesList = defaultData.map((el) =>
          createOption(el)
        );
        setDefaultValues(defaultValuesList);
        const simpleValues = defaultData.map((el) => el);
        changeValues(simpleValues);

        const data = await getAllValues();
        const arr: OptionCustom[] = data.map((el: Tag | IDE) => ({
          value: el.name,
          label: el.name,
          id: crypto.randomUUID(),
        }));
        setAllValues(arr);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [targetId]);

  return {
    loading,
    allValues,
    defaultValues
  }
}