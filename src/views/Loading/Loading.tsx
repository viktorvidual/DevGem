// eslint-disable-next-line no-unused-vars
import "./Loading.css";
/**
 * The Loading component displays a loading animation using CSS styles.
 *
 * This component is used to indicate that content is being loaded or processed.
 *
 * @component
 * @returns {JSX.Element} Rendered component displaying a loading animation.
 * @example
 * return (
 *   <Loading />
 * );
 */
export default function Loading() {
  return (
    <div className="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
