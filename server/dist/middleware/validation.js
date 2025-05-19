"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemas = exports.candidateSchemas = exports.electionSchemas = exports.profileSchemas = exports.authSchemas = exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const error_1 = require("./error");
const validate = (schema) => {
    return (req, _res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        if (error) {
            const errorDetails = {};
            error.details.forEach((detail) => {
                const path = detail.path.join('.');
                errorDetails[path] = detail.message;
            });
            return next(new error_1.ValidationError('Validation failed', errorDetails));
        }
        req.body = value;
        return next();
    };
};
exports.validate = validate;
exports.authSchemas = {
    login: joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: joi_1.default.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
    }),
    register: joi_1.default.object({
        name: joi_1.default.string().min(2).required().messages({
            'string.min': 'Name must be at least 2 characters',
            'any.required': 'Name is required'
        }),
        email: joi_1.default.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: joi_1.default.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
    }),
    voterLogin: joi_1.default.object({
        voterId: joi_1.default.string().required().messages({
            'any.required': 'Voter ID is required'
        }),
        accessCode: joi_1.default.string().required().messages({
            'any.required': 'Access code is required'
        })
    }),
    forgotPassword: joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        })
    }),
    resetPassword: joi_1.default.object({
        password: joi_1.default.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
    })
};
exports.profileSchemas = {
    updateProfile: joi_1.default.object({
        name: joi_1.default.string().min(2).messages({
            'string.min': 'Name must be at least 2 characters'
        }),
        email: joi_1.default.string().email().messages({
            'string.email': 'Please provide a valid email address'
        })
    }).min(1).messages({
        'object.min': 'At least one field is required'
    }),
    changePassword: joi_1.default.object({
        currentPassword: joi_1.default.string().required().messages({
            'any.required': 'Current password is required'
        }),
        newPassword: joi_1.default.string().min(6).required().messages({
            'string.min': 'New password must be at least 6 characters',
            'any.required': 'New password is required'
        })
    })
};
exports.electionSchemas = {
    createElection: joi_1.default.object({
        title: joi_1.default.string().min(5).max(100).required().messages({
            'string.min': 'Title must be at least 5 characters',
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'Title is required'
        }),
        description: joi_1.default.string().min(10).max(1000).required().messages({
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description cannot exceed 1000 characters',
            'any.required': 'Description is required'
        }),
        startDate: joi_1.default.date().greater('now').required().messages({
            'date.greater': 'Start date must be in the future',
            'any.required': 'Start date is required'
        }),
        endDate: joi_1.default.date().greater(joi_1.default.ref('startDate')).required().messages({
            'date.greater': 'End date must be after start date',
            'any.required': 'End date is required'
        }),
        isPublic: joi_1.default.boolean().default(false)
    }),
    updateElection: joi_1.default.object({
        title: joi_1.default.string().min(5).max(100).messages({
            'string.min': 'Title must be at least 5 characters',
            'string.max': 'Title cannot exceed 100 characters'
        }),
        description: joi_1.default.string().min(10).max(1000).messages({
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description cannot exceed 1000 characters'
        }),
        startDate: joi_1.default.date().greater('now').messages({
            'date.greater': 'Start date must be in the future'
        }),
        endDate: joi_1.default.date().greater(joi_1.default.ref('startDate')).messages({
            'date.greater': 'End date must be after start date'
        }),
        status: joi_1.default.string().valid('draft', 'upcoming', 'active', 'completed', 'cancelled'),
        isPublic: joi_1.default.boolean(),
        resultsPublished: joi_1.default.boolean()
    }).min(1).messages({
        'object.min': 'At least one field is required'
    }),
    castVote: joi_1.default.object({
        candidateId: joi_1.default.string().required().messages({
            'any.required': 'Candidate ID is required'
        })
    })
};
exports.candidateSchemas = {
    createCandidate: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required().messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Name is required'
        }),
        description: joi_1.default.string().max(1000).messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),
        position: joi_1.default.string().max(100).messages({
            'string.max': 'Position cannot exceed 100 characters'
        }),
        imageUrl: joi_1.default.string().uri().messages({
            'string.uri': 'Image URL must be a valid URI'
        })
    }),
    updateCandidate: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters'
        }),
        description: joi_1.default.string().max(1000).messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),
        position: joi_1.default.string().max(100).messages({
            'string.max': 'Position cannot exceed 100 characters'
        }),
        imageUrl: joi_1.default.string().uri().messages({
            'string.uri': 'Image URL must be a valid URI'
        })
    }).min(1).messages({
        'object.min': 'At least one field is required'
    })
};
exports.userSchemas = {
    createUser: joi_1.default.object({
        name: joi_1.default.string().min(2).required().messages({
            'string.min': 'Name must be at least 2 characters',
            'any.required': 'Name is required'
        }),
        email: joi_1.default.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: joi_1.default.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),
        role: joi_1.default.string().valid('admin', 'voter').required().messages({
            'any.only': 'Role must be either admin or voter',
            'any.required': 'Role is required'
        })
    }),
    updateUser: joi_1.default.object({
        name: joi_1.default.string().min(2).messages({
            'string.min': 'Name must be at least 2 characters'
        }),
        email: joi_1.default.string().email().messages({
            'string.email': 'Please provide a valid email address'
        }),
        isActive: joi_1.default.boolean(),
        role: joi_1.default.string().valid('admin', 'voter')
    }).min(1).messages({
        'object.min': 'At least one field is required'
    })
};
//# sourceMappingURL=validation.js.map