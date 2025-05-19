import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from './error';

/**
 * Factory function to create a validator middleware
 * @param schema - Joi validation schema
 * @returns Middleware function
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails: Record<string, string> = {};
      
      error.details.forEach((detail) => {
        const path = detail.path.join('.');
        errorDetails[path] = detail.message;
      });
      
      return next(new ValidationError('Validation failed', errorDetails));
    }

    // Replace request body with validated data
    req.body = value;
    return next();
  };
};

// Auth validation schemas
export const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    })
  }),
  
  register: Joi.object({
    name: Joi.string().min(2).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    })
  }),
  
  voterLogin: Joi.object({
    voterId: Joi.string().required().messages({
      'any.required': 'Voter ID is required'
    }),
    accessCode: Joi.string().required().messages({
      'any.required': 'Access code is required'
    })
  }),
  
  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
  }),
  
  resetPassword: Joi.object({
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    })
  })
};

// Profile validation schemas
export const profileSchemas = {
  updateProfile: Joi.object({
    name: Joi.string().min(2).messages({
      'string.min': 'Name must be at least 2 characters'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Please provide a valid email address'
    })
  }).min(1).messages({
    'object.min': 'At least one field is required'
  }),
  
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.min': 'New password must be at least 6 characters',
      'any.required': 'New password is required'
    })
  })
};

// Election validation schemas
export const electionSchemas = {
  createElection: Joi.object({
    title: Joi.string().min(5).max(100).required().messages({
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 1000 characters',
      'any.required': 'Description is required'
    }),
    startDate: Joi.date().greater('now').required().messages({
      'date.greater': 'Start date must be in the future',
      'any.required': 'Start date is required'
    }),
    endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
      'date.greater': 'End date must be after start date',
      'any.required': 'End date is required'
    }),
    isPublic: Joi.boolean().default(false)
  }),
  
  updateElection: Joi.object({
    title: Joi.string().min(5).max(100).messages({
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title cannot exceed 100 characters'
    }),
    description: Joi.string().min(10).max(1000).messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 1000 characters'
    }),
    startDate: Joi.date().greater('now').messages({
      'date.greater': 'Start date must be in the future'
    }),
    endDate: Joi.date().greater(Joi.ref('startDate')).messages({
      'date.greater': 'End date must be after start date'
    }),
    status: Joi.string().valid('draft', 'upcoming', 'active', 'completed', 'cancelled'),
    isPublic: Joi.boolean(),
    resultsPublished: Joi.boolean()
  }).min(1).messages({
    'object.min': 'At least one field is required'
  }),
  
  castVote: Joi.object({
    candidateId: Joi.string().required().messages({
      'any.required': 'Candidate ID is required'
    })
  })
};

// Candidate validation schemas
export const candidateSchemas = {
  createCandidate: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
    description: Joi.string().max(1000).messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
    position: Joi.string().max(100).messages({
      'string.max': 'Position cannot exceed 100 characters'
    }),
    imageUrl: Joi.string().uri().messages({
      'string.uri': 'Image URL must be a valid URI'
    })
  }),
  
  updateCandidate: Joi.object({
    name: Joi.string().min(2).max(100).messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),
    description: Joi.string().max(1000).messages({
      'string.max': 'Description cannot exceed 1000 characters'
    }),
    position: Joi.string().max(100).messages({
      'string.max': 'Position cannot exceed 100 characters'
    }),
    imageUrl: Joi.string().uri().messages({
      'string.uri': 'Image URL must be a valid URI'
    })
  }).min(1).messages({
    'object.min': 'At least one field is required'
  })
};

// User validation schemas
export const userSchemas = {
  createUser: Joi.object({
    name: Joi.string().min(2).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'voter').required().messages({
      'any.only': 'Role must be either admin or voter',
      'any.required': 'Role is required'
    })
  }),
  
  updateUser: Joi.object({
    name: Joi.string().min(2).messages({
      'string.min': 'Name must be at least 2 characters'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Please provide a valid email address'
    }),
    isActive: Joi.boolean(),
    role: Joi.string().valid('admin', 'voter')
  }).min(1).messages({
    'object.min': 'At least one field is required'
  })
}; 