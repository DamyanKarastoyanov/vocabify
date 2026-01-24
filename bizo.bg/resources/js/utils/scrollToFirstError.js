/**
 * Simple utility to scroll to the first form field with validation error
 */
export const scrollToFirstError = () => {
    // Find all bz-input-field-holder elements
    const fieldHolders = document.querySelectorAll(".bz-input-field-holder");

    // Array to store all error elements found
    const errorElements = [];

    // Check each field holder for direct p child elements (error messages)
    fieldHolders.forEach((holder) => {
        const pElements = holder.querySelectorAll(":scope > p");

        pElements.forEach((p) => {
            const text = p.textContent?.trim();

            // Assume any direct P child with text is an error
            if (text && text.length > 0) {
                errorElements.push({
                    errorElement: p,
                    fieldHolder: holder,
                    text: text,
                });
            }
        });
    });

    if (errorElements.length === 0) {
        return;
    }

    // Get the first error element
    const firstError = errorElements[0];
    const fieldHolder = firstError.fieldHolder;

    // Find the input field within the same field holder
    const inputField = fieldHolder.querySelector(
        'input, select, textarea, [role="combobox"], [role="textbox"]',
    );

    if (inputField) {
        // Scroll to the input field
        inputField.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
        });

        // Focus the field after a short delay
        setTimeout(() => {
            if (inputField.focus) {
                inputField.focus();
            }
        }, 300);
    } else {
        // Fallback: scroll to the error element itself
        firstError.errorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
};
