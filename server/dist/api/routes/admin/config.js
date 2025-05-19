"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser, auth_1.authorizeAdmin);
router.get('/', async (_req, res) => {
    try {
        const config = {
            app: {
                name: 'Electra',
                version: '1.0.0',
                logoUrl: '/images/logo.png',
                primaryColor: '#0284c7',
                secondaryColor: '#7dd3fc',
                contactEmail: 'support@electra.com',
                defaultLanguage: 'en',
                availableLanguages: ['en', 'es', 'fr']
            },
            elections: {
                defaultVoteDuration: 7,
                allowMultipleActiveElections: true,
                requireEmailVerification: true,
                allowAnonymousVoting: false,
                allowPublicResults: true,
                defaultVisibility: 'private'
            },
            email: {
                sendWelcomeEmail: true,
                sendVoteConfirmation: true,
                sendElectionInvitations: true,
                sendElectionReminders: true,
                sendResultsNotifications: true,
                reminderDaysBefore: 1
            },
            security: {
                sessionTimeout: 60,
                maxLoginAttempts: 5,
                passwordComplexity: 'medium',
                mfaEnabled: false,
                ipRestriction: false,
                allowedIpRanges: []
            }
        };
        res.json(config);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/app', async (req, res) => {
    try {
        const { name, logoUrl, primaryColor, secondaryColor, contactEmail, defaultLanguage, availableLanguages } = req.body;
        const updatedConfig = {
            name: name || 'Electra',
            version: '1.0.0',
            logoUrl: logoUrl || '/images/logo.png',
            primaryColor: primaryColor || '#0284c7',
            secondaryColor: secondaryColor || '#7dd3fc',
            contactEmail: contactEmail || 'support@electra.com',
            defaultLanguage: defaultLanguage || 'en',
            availableLanguages: availableLanguages || ['en', 'es', 'fr']
        };
        res.json({
            message: 'Application settings updated successfully',
            config: updatedConfig
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/elections', async (req, res) => {
    try {
        const { defaultVoteDuration, allowMultipleActiveElections, requireEmailVerification, allowAnonymousVoting, allowPublicResults, defaultVisibility } = req.body;
        const updatedConfig = {
            defaultVoteDuration: defaultVoteDuration || 7,
            allowMultipleActiveElections: allowMultipleActiveElections !== undefined ? allowMultipleActiveElections : true,
            requireEmailVerification: requireEmailVerification !== undefined ? requireEmailVerification : true,
            allowAnonymousVoting: allowAnonymousVoting !== undefined ? allowAnonymousVoting : false,
            allowPublicResults: allowPublicResults !== undefined ? allowPublicResults : true,
            defaultVisibility: defaultVisibility || 'private'
        };
        res.json({
            message: 'Election settings updated successfully',
            config: updatedConfig
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/email', async (req, res) => {
    try {
        const { sendWelcomeEmail, sendVoteConfirmation, sendElectionInvitations, sendElectionReminders, sendResultsNotifications, reminderDaysBefore } = req.body;
        const updatedConfig = {
            sendWelcomeEmail: sendWelcomeEmail !== undefined ? sendWelcomeEmail : true,
            sendVoteConfirmation: sendVoteConfirmation !== undefined ? sendVoteConfirmation : true,
            sendElectionInvitations: sendElectionInvitations !== undefined ? sendElectionInvitations : true,
            sendElectionReminders: sendElectionReminders !== undefined ? sendElectionReminders : true,
            sendResultsNotifications: sendResultsNotifications !== undefined ? sendResultsNotifications : true,
            reminderDaysBefore: reminderDaysBefore || 1
        };
        res.json({
            message: 'Email notification settings updated successfully',
            config: updatedConfig
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/security', async (req, res) => {
    try {
        const { sessionTimeout, maxLoginAttempts, passwordComplexity, mfaEnabled, ipRestriction, allowedIpRanges } = req.body;
        if (passwordComplexity && !['low', 'medium', 'high'].includes(passwordComplexity)) {
            return res.status(400).json({
                message: 'Invalid password complexity. Must be low, medium, or high.'
            });
        }
        const updatedConfig = {
            sessionTimeout: sessionTimeout || 60,
            maxLoginAttempts: maxLoginAttempts || 5,
            passwordComplexity: passwordComplexity || 'medium',
            mfaEnabled: mfaEnabled !== undefined ? mfaEnabled : false,
            ipRestriction: ipRestriction !== undefined ? ipRestriction : false,
            allowedIpRanges: allowedIpRanges || []
        };
        res.json({
            message: 'Security settings updated successfully',
            config: updatedConfig
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.post('/reset', async (_req, res) => {
    try {
        res.json({
            message: 'Configuration reset to default settings successfully'
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/email-templates', async (_req, res) => {
    try {
        const templates = [
            {
                id: '1',
                name: 'Welcome Email',
                subject: 'Welcome to Electra',
                htmlTemplate: '<h1>Welcome to Electra, {{name}}!</h1><p>Your account has been created successfully.</p>',
                textTemplate: 'Welcome to Electra, {{name}}! Your account has been created successfully.',
                variables: ['name'],
                isActive: true
            },
            {
                id: '2',
                name: 'Election Invitation',
                subject: 'You are invited to vote in {{electionName}}',
                htmlTemplate: '<h1>Hello {{name}},</h1><p>You have been invited to vote in the {{electionName}} election.</p>',
                textTemplate: 'Hello {{name}}, You have been invited to vote in the {{electionName}} election.',
                variables: ['name', 'electionName'],
                isActive: true
            },
            {
                id: '3',
                name: 'Vote Confirmation',
                subject: 'Your vote has been recorded',
                htmlTemplate: '<h1>Thank you for voting, {{name}}!</h1><p>Your vote in the {{electionName}} election has been recorded successfully.</p>',
                textTemplate: 'Thank you for voting, {{name}}! Your vote in the {{electionName}} election has been recorded successfully.',
                variables: ['name', 'electionName'],
                isActive: true
            }
        ];
        res.json(templates);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/email-templates/:id', async (req, res) => {
    try {
        const templateId = req.params.id;
        const { name, subject, htmlTemplate, textTemplate, isActive } = req.body;
        const updatedTemplate = {
            id: templateId,
            name: name || 'Welcome Email',
            subject: subject || 'Welcome to Electra',
            htmlTemplate: htmlTemplate || '<h1>Welcome to Electra, {{name}}!</h1><p>Your account has been created successfully.</p>',
            textTemplate: textTemplate || 'Welcome to Electra, {{name}}! Your account has been created successfully.',
            variables: ['name'],
            isActive: isActive !== undefined ? isActive : true
        };
        res.json({
            message: 'Email template updated successfully',
            template: updatedTemplate
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
//# sourceMappingURL=config.js.map