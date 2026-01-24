import * as yup from "yup";

const vehicleFormValidationSchema = yup.object().shape({
    reg_number: yup
        .string()
        .required("Регистрационният номер е задължителен")
        .max(10, "Регистрационният номер не може да бъде повече от 10 символа"),

    talon: yup
        .string()
        .required("Номерът на талон е задължителен")
        .max(20, "Номерът на талон не може да бъде повече от 20 символа"),
});

export default vehicleFormValidationSchema;
