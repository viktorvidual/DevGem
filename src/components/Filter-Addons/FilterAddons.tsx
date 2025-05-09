import AddonsDetails from "../Addons-Library/AddonsDetails";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./FilterAddons.css";
import { Button } from "@mui/material";
import { fetchAddonsAndUpdateState } from "../../services/addon.services.ts";
import { useLocation } from "react-router-dom";
import { Addon } from "../../context/AddonsContext.ts";
import { filterAddons, filterAddonsByPaymentStatus, sortAddons } from "./Helper-Functions.ts";
import { useCardsPerRowCalc } from "../../lib/useCardsPerRowCalc.ts";
import SortByView from "../../views/sortByView/sortByView.tsx";

const FilterAddons: React.FC = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const { filter } = useParams<{ filter: string; ide?: string }>();
  const [filteredAddons, setFilteredAddons] = useState<Addon[]>([]);
  const [originalFilteredAddons, setOriginalFilteredAddons] = useState<Addon[]>([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search");
  const searchSelectedIDE = new URLSearchParams(location.search).get("searchSelectedIDE");
  const {numCards, style} = useCardsPerRowCalc();
  const [addonsPerPage, setAddonsPerPage] = useState<number>(numCards);
  const [sortBy, setSortBy] = useState('');
  
  useEffect(() => {
    if (addonsPerPage === 0) {
      setAddonsPerPage(numCards);
    }
  }, [numCards]);
  
  useEffect(() => {
    const unsubscribe = fetchAddonsAndUpdateState(setAddons,'');

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    
    const filtered = filterAddons(addons, searchSelectedIDE, filter, searchQuery);
    const sorted = sortAddons(filtered, filter);
    const filterByPublished = sorted.filter((addon: Addon) => addon.status === 'published')
    const filterByPaymentStatus = filterAddonsByPaymentStatus(filterByPublished, currentFilter)

    setOriginalFilteredAddons(filterByPaymentStatus);
    const finallyFilter = filterByPaymentStatus.slice(0, addonsPerPage);
    setFilteredAddons(finallyFilter);
    
  }, [addons, currentFilter, addonsPerPage])

  useEffect(() => {
    if (sortBy.length > 0) {
      const filterBySort = sortAddons(filteredAddons, sortBy);
      setFilteredAddons(filterBySort);
      console.log(filterBySort);
      
    }
  },[sortBy])

  const incrementItemsPerPage = () => {
    setAddonsPerPage(addonsPerPage + numCards);
  };

  return (
    <div>
      <div>
        {searchQuery ? (
          <h1
            style={{
              textAlign: "left",
              fontSize: "1.8em",
              marginLeft: "20px",
              color: "gray",
            }}
          >
            You searched by name: {searchQuery}
          </h1>
        ) : (
          <h1
            style={{
              textAlign: "left",
              fontSize: "1.8em",
              marginLeft: "20px",
              color: "gray",
            }}
          >
            You searched by category: {filter}
          </h1>
        )}
      </div>
      {filteredAddons.length > 0 && (
       <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <div>
         <Button
           onClick={() => setCurrentFilter("all")}
           style={{
             color: currentFilter === "all" ? "red" : "black",
           }}
         >
           All
         </Button>
         <Button
           onClick={() => setCurrentFilter("paid")}
           style={{
             color: currentFilter === "paid" ? "red" : "black",
           }}
         >
           Paid
         </Button>
         <Button
           onClick={() => setCurrentFilter("free")}
           style={{
             color: currentFilter === "free" ? "red" : "black",
           }}
         >
           Free
         </Button>
       </div>
       <div style={{marginRight: "60px", marginBottom: "5px"}}>
         <SortByView setSortBy={setSortBy}/>
       </div>
     </div>
      )}
      {filteredAddons.length > 0 ? (
        <div className="addon-card-grid" style={style}>
          {filteredAddons.map((addon) => (
            <AddonsDetails key={addon.addonId} {...addon} />
          ))}
        </div>
      ) : (
        <>
          <div className="filter-container">
          <Button
            onClick={() => setCurrentFilter("all")}
            style={{
              color: currentFilter === "all" ? "red" : "black",
            }}
          >
            All
          </Button>
          <Button
            onClick={() => setCurrentFilter("paid")}
            style={{
              color: currentFilter === "paid" ? "red" : "black",
            }}
          >
            Paid
          </Button>
          <Button
            onClick={() => setCurrentFilter("free")}
            style={{
              color: currentFilter === "free" ? "red" : "black",
            }}
          >
            Free
          </Button>
        </div>
        <h1 style={{ textAlign: "center", fontSize: "1.5em", marginLeft: "20px" }}>
          There are no addons available in this section!
          </h1>
        </>
      )}

      {originalFilteredAddons.length > addonsPerPage && filteredAddons.length >= addonsPerPage && (
        <Button
          onClick={() => incrementItemsPerPage()}
          style={{ marginTop: "20px" }}
        >
          Show More
        </Button>
      )}
    </div>
  );
};
export default FilterAddons;
