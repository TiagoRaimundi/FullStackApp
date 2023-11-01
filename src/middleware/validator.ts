import { RequestHandler } from "express";
import * as yup from 'yup';

export const validate = (schema: yup.ObjectSchema<any>): RequestHandler => {
  return async (req, res, next) => {
    // Check if the body is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Empty body is not accepted!"
      });
    }

    const schemaToValidate = yup.object({
      body: schema,
    });

    try {
      // Validate the req.body against the schema
      await schemaToValidate.validate({
        body: req.body
      }, {
        abortEarly: false, // Set to false to return all validation errors, not just the first one
      });

      next(); // If validation is successful, proceed to the next middleware
    } catch (error) {
      // If validation fails, return the errors
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      } else {
        // If an unexpected error occurs, pass it to the error-handling middleware
        next(error);
      }
    }
  };
};
