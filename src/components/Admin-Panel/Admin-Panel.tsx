import React, { useContext, useState, useEffect } from "react";
import { CardInvertedColors } from "./Card";
import "./AdminPanel.css";
import { AuthContext } from "../../context/AuthContext";
import { fetchAddonsAndUpdateState} from "../../services/addon.services";
import PeopleTable from "./PeopleTable";
import { Inbox } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { ADMIN_INBOX_PATH } from "../../common/common";
import { fetchAllIDEs } from "../../services/user.services";
import { IDE } from "../SelectCreatable/selectCreatableHelpers.ts";
import { Addon } from "../../context/AddonsContext.ts";


const AdminPanel: React.FC = () => {
  const { loggedInUser, allUsers } = useContext(AuthContext);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [IDEs, setAllIDEs] = useState<IDE[]>([]);
  const [pendingAddons, setPendingAddons] = useState(false);
  useEffect(() => {
    const unsubscribeAboutIDEs = fetchAllIDEs(setAllIDEs);
    const unsubscribeAboutAddons = fetchAddonsAndUpdateState(setAddons, setPendingAddons);

  return () => {
    unsubscribeAboutAddons();
    unsubscribeAboutIDEs();
  };
  }, []);

  return (
    <>
      <Typography variant="h5"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: '15px',
          marginBottom: '2em',
          fontWeight: "bold"
        }}
      >
        <span>Welcome back, {loggedInUser?.firstName}!</span>
        <Link
          to={ADMIN_INBOX_PATH}
        >
          <Button>
            <Inbox />
            {pendingAddons && <div className="notification-indicator" />}
          </Button>
        </Link>
      </Typography>
      <div className="card-grid-admin-panel" style={{gap: 50}}>
        <CardInvertedColors child="Total Users" count={allUsers ? allUsers.length : 0} />
        <CardInvertedColors child="Total Addons" count={addons.length} />
        <CardInvertedColors child="Total IDEs" count={IDEs.length} />
      </div>
      <div style={{ width: "100%", overflowX: "auto", marginTop: "30px" }}>
        <h2 style={{ textAlign: "left" }}>All Users</h2>
        <PeopleTable/>
      </div>
    </>
  );
};

export default AdminPanel;
