export function validateDatasetImport(data) {
    const errors = {};

    if (!data.name || data.name.trim() === '') {
        errors.name = 'Dataset name is required.';
    } else if (data.name.length > 255) {
        errors.name = 'Dataset name must not exceed 255 characters.';
    }

    if (!data.target_language_code || data.target_language_code.trim() === '') {
        errors.target_language_code = 'Target language code is required.';
    } else if (data.target_language_code.length < 2 || data.target_language_code.length > 5) {
        errors.target_language_code = 'Target language code must be between 2 and 5 characters.';
    }

    if (!data.middle_language_code || data.middle_language_code.trim() === '') {
        errors.middle_language_code = 'Middle language code is required.';
    } else if (data.middle_language_code.length < 2 || data.middle_language_code.length > 5) {
        errors.middle_language_code = 'Middle language code must be between 2 and 5 characters.';
    }

    if (!data.content || data.content.trim() === '') {
        errors.content = 'Dataset content is required.';
    }

    return errors;
}
