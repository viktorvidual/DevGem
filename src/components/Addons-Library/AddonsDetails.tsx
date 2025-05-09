import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./Addons-Details.css";
import { truncateText } from "./Helper-Functions";
import { DETAILED_ADDON_VIEW_ID_PATH, NUM_WORDS_IN_CARDS } from "../../common/common";
import { useNavigate } from "react-router-dom";
import RatingWithValue from "../Reviews/RatingWithValue";
import { Addon } from "../../context/AddonsContext.ts";

const AddonsDetails: React.FC<Addon> = (addon: Addon) => {
  const navigate = useNavigate();

  if (addon.status !== 'published') {
    return null;
  }
  const strippedHtml = addon.description.replace(/<[^>]+>/g, ' ');

  const handleClick = () => {
    navigate(`${DETAILED_ADDON_VIEW_ID_PATH}${addon.addonId}`);
  }

  return (
    <Card onClick={handleClick} className="card" sx={{
      width: 370, display: 'flex', flexDirection: 'column', height: '100%',
      boxSizing: 'border-box', boxShadow: "none", padding: 0, borderRadius: '10px', cursor: 'pointer', textAlign: "left"
    }}>
      <CardHeader
        style={{ minHeight: "7em" }}
        avatar={
          addon.logo && (
            <img
              src={addon.logo}
              alt="Addon Image"
              style={{ width: "70px", marginLeft: '3px' }}
            />
          )
        }
        title={
          <div style={{ fontSize: '19px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 5, }} className="custom-title-class">
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: "500", marginBottom: '3px' }}>
              {addon.name}
            </div>
            <div style={{ fontSize: '0.7em', color: "#19191CB3", textAlign: 'left' }}>{addon.company}</div>
            <RatingWithValue addonId={addon.addonId}></RatingWithValue>
          </div>
        }
      />
      <CardContent style={{
        flexDirection: "column",
        minHeight: "7em"
      }}>
        <Typography variant="body2" color="text.secondary" style={{ textAlign: 'start' }}>
          {truncateText(strippedHtml, NUM_WORDS_IN_CARDS)}
        </Typography>

      </CardContent>
      <CardContent className="addon-info" sx={{ gap: 1, display: "flex" }} >
        <Typography sx={{ flex: 2, px: 0, textAlign: "left", color: "#19191CB3", fontWeight: "150", fontSize: "0.9em" }}>
          {addon.downloads ? addon.downloads : 0} downloads
        </Typography>
        <Typography sx={{ ml: -1, color: "#19191CB3", fontWeight: "150", fontSize: "0.9em" }}>
          {addon.isFree ? "free" : "paid"}
        </Typography>
      </CardContent>

    </Card>
  );
};

export default AddonsDetails;
