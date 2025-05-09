
import { Typography } from "@mui/joy";
import "./BasicSkeleton.css"

export default function BasicSkeleton() {
  return (
    <>
      <div className="body">
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className="base">
          <span>
            <div className="face"></div>
          </span>
        </div>
      </div>
      <div className="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Typography sx={{
        color: "#1B74E4",
        position: "absolute",
        left: "50%",
        top: "58%",
        marginLeft: "-80px"
      }} level="h4">IDE spacewalk loading…</Typography>
    </>
  );
}