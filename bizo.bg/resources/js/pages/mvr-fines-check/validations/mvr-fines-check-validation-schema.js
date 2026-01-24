import * as yup from "yup";

const MVRFinesCheckValidationSchema = yup.object().shape({
    egn: yup
        .string()
        .required("ЕГН е задължително")
        .length(10, "ЕГН трябва да бъде точно 10 символа"),
    driving_licence_number: yup
        .string()
        .required("Номерът на шофьорската книжка е задължителен")
        .max(
            20,
            "Номерът на шофьорската книжка не може да бъде повече от 20 символа",
        ),
    termsAccepted: yup
        .boolean()
        .oneOf([true], "")
        .required(
            "Трябва да приемете общите условия и политиката за защита на личните данни",
        ),
});

export default MVRFinesCheckValidationSchema;
