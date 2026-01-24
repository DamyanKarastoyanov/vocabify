export function validateRegister(data) {
    const errors = {};

    if (!data.name || data.name.trim() === '') {
        errors.name = 'Name is required.';
    } else if (data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters.';
    } else if (data.name.trim().length > 255) {
        errors.name = 'Name must not exceed 255 characters.';
    }

    if (!data.email || data.email.trim() === '') {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!data.password || data.password === '') {
        errors.password = 'Password is required.';
    } else if (data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    }

    if (!data.password_confirmation || data.password_confirmation === '') {
        errors.password_confirmation = 'Please confirm your password.';
    } else if (data.password !== data.password_confirmation) {
        errors.password_confirmation = 'Passwords do not match.';
    }

    return errors;
}
