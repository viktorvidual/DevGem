// eslint-disable-next-line no-unused-vars
import { NavLink } from "react-router-dom";
import { MY_ADDONS_PATH, SUCCESS_UPLOAD_MESSAGE } from "../../common/common.ts";
import { Card, Container } from "@mui/joy";

/**
 * The SuccessPosting component displays a success message after creating a new post.
 *
 * @component
 * @returns {JSX.Element} - JSX representing the SuccessPosting component.
 */
export default function SuccessUploadAddon() {
  return (
    <Container
      className="w-100 mt-3"
      style={{ minHeight: "100vh", maxWidth: "80%", marginLeft: "0" }}
    >
      <Card className=" border border-0 mx-auto my-auto">
        <h2 className="mt-4">{SUCCESS_UPLOAD_MESSAGE}</h2>
        <h5 className="mb-4">
          Track the activity or make changes to your addon in{" "}
          <NavLink to={`/${MY_ADDONS_PATH}`}>My addons</NavLink>
        </h5>
      </Card>
    </Container>
  );
}
