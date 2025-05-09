import { useContext, useEffect, useState } from "react";
import { AddonsContext } from "../../context/AddonsContext.ts";
import { AuthContext } from "../../context/AuthContext.ts";
import { ADMIN, ASC } from "../../common/common.ts";
import _ from "lodash";

export type Order = 'asc' | 'desc';

export const useFilters = (order: string) => {
  const { allAddons } = useContext(AddonsContext);
  const { loggedInUser } = useContext(AuthContext);
  const userAddons = loggedInUser?.role === ADMIN
    ? allAddons
    : allAddons.filter(addon => (addon.userUid === loggedInUser?.uid && addon.ownerUid === loggedInUser.uid)
      || (addon.contributors && loggedInUser && (Object.values(addon?.contributors).includes(loggedInUser.uid) || addon.ownerUid === loggedInUser.uid)));

  const [filteredAddons, setFilteredAddons] = useState(
    loggedInUser?.role === ADMIN
      ? allAddons
      : allAddons.filter(addon => addon.userUid === loggedInUser?.uid));

  const [valueTargetIDE, setValueTargetIDE] = useState('All');
  const [valueSearch, setValueSearch] = useState('');
  const [valueTag, setValueTag] = useState('All');
  const [valueStatus, setValueStatus] = useState('All');

  const targetIDEs = ["All", ...userAddons.map(el => el.targetIDE)
    .filter((el, index, arr) => arr.indexOf(el) === index)];

  const tags = ["All", ...userAddons
    .flatMap((addon) => Object.keys(addon.tags))
    .filter((el, index, arr) => arr.indexOf(el) === index)];

  useEffect(() => {
    setFilteredAddons(prev => allAddons.filter(el => prev.some(item => item.addonId === el.addonId)));
  }, [allAddons])

  useEffect(() => {
    (function () {
      let updatedAddonList = [...userAddons];

      if (valueStatus !== "All") {
        updatedAddonList = updatedAddonList
          .filter(el => el["status"].toLowerCase() === valueStatus.toLowerCase())
      }

      if (valueTargetIDE !== "All") {
        updatedAddonList = updatedAddonList
          .filter(el => el["targetIDE"].toLowerCase() === valueTargetIDE.toLowerCase())
      }

      if (valueTag !== "All") {
        updatedAddonList = updatedAddonList
          .filter(el => Object.keys(el["tags"]).includes(valueTag))
      }


      if (valueSearch !== "") {
        updatedAddonList = updatedAddonList
          .filter((el) => {
            return el.name
              .split(" ")
              .filter((el) =>
                el.toLowerCase().startsWith(valueSearch.toLowerCase())
              ).length > 0
          })
      }

      const sorted = updatedAddonList.sort((a, b) => order === ASC ? a.createdOn - b.createdOn : b.createdOn - a.createdOn);

      if (!_.isEqual(sorted, filteredAddons)) {
        setFilteredAddons([...updatedAddonList]);
      }
    })();
  }, [valueSearch, valueStatus, valueTag, valueTargetIDE, userAddons, order])

  return {
    filteredAddons,
    targetIDEs,
    tags,
    setValueSearch,
    setValueStatus,
    setValueTag,
    setValueTargetIDE,
    setFilteredAddons
  }
}