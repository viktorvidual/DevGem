import { useEffect, useState } from "react";

export default function useVerificationHook (codeLength) {
    const [code, setCode] = useState(null);

    const inputStates = []

    const inputClass = "code-digit"

    const handleKeyDown = (e) =>
    ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();

    for (let i = 0; i < codeLength.length; i++) {
        const[digit, setDigit] = useState('');
        inputStates.push({ digit, setDigit });
    }

    useEffect(() => {
        const finalCode = inputStates
          .map((input) => {
            return input.digit;
          })
          .join("");
    
        // provide the complete code only if it is complete
        if (finalCode.length === codeLength) {
          setCode(finalCode);
        } else setCode(null);
      }, [inputStates]);

    const handleChange = (e, index) => {
    const entry = e.target.value; // stores user's entry

	// limit user entry per input to 1 numeric character
    if (entry.length <= 1 && !Number.isNaN(entry)) {

      // set and limit code per input box to 1 digit
      inputStates[index].setDigit(e.target.value);

      if (entry.length === 1) {
        /* user entered a digit
	       move focus to next empty input box unless it's the last one,
        */
        if (index < codeLength - 1) {
          const nextInput = document.querySelectorAll(`.${inputClass}`)[index + 1];
          if (nextInput.value === "") nextInput.focus();
        }
      } else if (entry.length === 0) {
		/* user deleted a code
	       move focus to the previous input box
        */
        const prevInput = document.querySelectorAll<HTMLInputElement>(`.${inputClass}`)[index - 1];
  
        // focus if prevInput is defined
        if (prevInput !== undefined) prevInput.focus();
      }
    } else return;
  };
        
  return { code, inputStates, inputClass, handleChange, handleKeyDown };

  
}