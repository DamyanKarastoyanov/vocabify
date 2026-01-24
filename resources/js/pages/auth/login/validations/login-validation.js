export function validateLogin(data) {
    const errors = {};

    if (!data.email || data.email.trim() === '') {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!data.password || data.password === '') {
        errors.password = 'Password is required.';
    }

    return errors;
}
