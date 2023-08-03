const yup = require('yup');
let userValidation = {}


userValidation.userValidate = yup.object().shape({

    name: yup.string().strict().required(),
    age: yup
        .number()
        .strict()
        .required('Age is required.')
        .min(1, 'Age must be at least 1.')
        .max(150, 'Age must be at most 150.'),
    city: yup.string().strict().required(),
    id: yup.number().strict().required()
})

userValidation.updateValidation = yup.object().shape({
    id: yup.number().strict().required(),
    name: yup.string().strict(),
    age: yup
        .number()
        .strict()
        .min(1, 'Age must be at least 1.')
        .max(150, 'Age must be at most 150.'),
    city: yup.string().strict()

})


userValidation.deleteValidation = yup.object().shape({
    id: yup.number().strict().required(),
})


module.exports = userValidation;




