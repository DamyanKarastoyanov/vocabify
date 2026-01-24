import * as yup from "yup";

const VehicleDataValidationSchema = yup.object().shape({
    number: yup
        .string()
        .required("Регистрационният номер на автомобила е задължителен")
        .min(3, "Регистрационният номер трябва да бъде поне 3 символа"),
    talon: yup
        .string()
        .required("Номерът на талона е задължителен")
        .length(9, "Номерът на талона трябва да бъде 9 символа"),
});

export default VehicleDataValidationSchema;
