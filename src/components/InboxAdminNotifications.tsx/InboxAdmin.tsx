import React, { useState, useEffect } from "react";
import TableWithPendingAddons from "./TableWithNewAddons";
import { fetchAddonsAndUpdateState } from "../../services/addon.services";


export const AdminInbox: React.FC = () => {
    const [addons, setAddons] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchAddonsAndUpdateState(setAddons,'');

    return () => {
      unsubscribe();
    };
  }, []);

    return (
      <>
        <h1 style={{textAlign:'start'}}>Notifications</h1>
        <TableWithPendingAddons incomeAddons={addons}/>
      </>
    )
}