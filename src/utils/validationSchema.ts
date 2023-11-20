import * as yup from 'yup';
import { isValidObjectId } from 'mongoose';
import { categories } from './audio_category';

export const CreateUserSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name is missing!")
        .min(3, "Name is too short!")
        .max(20, "Name is too long!"),
    email: yup
        .string()
        .required("Email is missing!")
        .email("Invalid email id"),
    password: yup
        .string()
        .trim()
        .required("Password is missing!")
        .min(8, "Password is too short!")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Password is too simple!")
});

export const TokenAndIDValidation = yup.object().shape({
    token: yup
        .string()
        .trim()
        .required("Invalid token!"),
    userId: yup
        .string()
        .required("Invalid userId!")
        .test('is-mongo-object-id', 'Invalid userId!', value => value == null ? false : isValidObjectId(value))
});
export const updatePasswordSchema = yup.object().shape({
    token: yup
        .string()
        .trim()
        .required("Invalid token!"),
    userId: yup
        .string()
        .required("Invalid userId!")
        .test('is-mongo-object-id', 'Invalid userId!', value => value == null ? false : isValidObjectId(value)),

        password: yup
        .string()
        .trim()
        .required("Password is missing!")
        .min(6, "Password is too short!")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Password is too simple!")
});


export const SignInValidationSchema = yup.object().shape({
    email: yup.string().required("Email is missing!").email("Invalid email id!"),
    password: yup
    .string()
    .trim()
    .required("Password is missing!")
})

export const AudioValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing!"),
    about: yup.string().required("About is missing!"),
    category: yup
      .string()
      .oneOf(categories, "Invalid category!")
      .required("Category is missing!"),
  });
  