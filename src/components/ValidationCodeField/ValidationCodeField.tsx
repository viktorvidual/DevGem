import useVerificationHook from "../../lib/useVerificationHook";

export default function ValidationCodeField () {
	const { code, inputStates, inputClass, handleChange, handleKeyDown } =
    useVerificationHook(4);

   return (
	<>
	<div>
		{inputStates.map((state, ii) => {
		return (
			<input
			type="number"
			value={state.digit}
			className={inputClass}
			onChange={(e) => handleChange(e, ii)}
			onKeyDown={handleKeyDown}
			/>
		);
		})}
	</div>
	<div>
		<p>
              <b>Code:</b>{" "}
              {code ? code : "Fill up the boxes to see the code here..."}
            </p>
	</div>
   </>
)
}
