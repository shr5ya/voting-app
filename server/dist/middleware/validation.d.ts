import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
export declare const validate: (schema: Joi.ObjectSchema) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const authSchemas: {
    login: any;
    register: any;
    voterLogin: any;
    forgotPassword: any;
    resetPassword: any;
};
export declare const profileSchemas: {
    updateProfile: any;
    changePassword: any;
};
export declare const electionSchemas: {
    createElection: any;
    updateElection: any;
    castVote: any;
};
export declare const candidateSchemas: {
    createCandidate: any;
    updateCandidate: any;
};
export declare const userSchemas: {
    createUser: any;
    updateUser: any;
};
//# sourceMappingURL=validation.d.ts.map