import { Router } from 'express';
import { authenticateUser, authorizeAdmin, AuthenticatedRequest } from '../../../middleware/auth';
import { Response } from 'express';

const router = Router();

// Middleware that applies to all routes in this router
router.use(authenticateUser, authorizeAdmin);

/**
 * @route   GET /api/admin/config
 * @desc    Get all system configuration settings
 * @access  Admin only
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock response
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
        defaultVoteDuration: 7, // days
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
        sessionTimeout: 60, // minutes
        maxLoginAttempts: 5,
        passwordComplexity: 'medium', // low, medium, high
        mfaEnabled: false,
        ipRestriction: false,
        allowedIpRanges: []
      }
    };
    
    // In a real implementation, fetch from database
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/config/app
 * @desc    Update application settings
 * @access  Admin only
 */
router.put('/app', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      name, 
      logoUrl, 
      primaryColor, 
      secondaryColor, 
      contactEmail,
      defaultLanguage,
      availableLanguages
    } = req.body;
    
    // Mock response with updated values
    const updatedConfig = {
      name: name || 'Electra',
      version: '1.0.0', // Not updatable
      logoUrl: logoUrl || '/images/logo.png',
      primaryColor: primaryColor || '#0284c7',
      secondaryColor: secondaryColor || '#7dd3fc',
      contactEmail: contactEmail || 'support@electra.com',
      defaultLanguage: defaultLanguage || 'en',
      availableLanguages: availableLanguages || ['en', 'es', 'fr']
    };
    
    // In a real implementation, update in database
    res.json({
      message: 'Application settings updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/config/elections
 * @desc    Update election settings
 * @access  Admin only
 */
router.put('/elections', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      defaultVoteDuration, 
      allowMultipleActiveElections, 
      requireEmailVerification, 
      allowAnonymousVoting,
      allowPublicResults,
      defaultVisibility
    } = req.body;
    
    // Mock response with updated values
    const updatedConfig = {
      defaultVoteDuration: defaultVoteDuration || 7,
      allowMultipleActiveElections: allowMultipleActiveElections !== undefined ? allowMultipleActiveElections : true,
      requireEmailVerification: requireEmailVerification !== undefined ? requireEmailVerification : true,
      allowAnonymousVoting: allowAnonymousVoting !== undefined ? allowAnonymousVoting : false,
      allowPublicResults: allowPublicResults !== undefined ? allowPublicResults : true,
      defaultVisibility: defaultVisibility || 'private'
    };
    
    // In a real implementation, update in database
    res.json({
      message: 'Election settings updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/config/email
 * @desc    Update email notification settings
 * @access  Admin only
 */
router.put('/email', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      sendWelcomeEmail, 
      sendVoteConfirmation, 
      sendElectionInvitations, 
      sendElectionReminders,
      sendResultsNotifications,
      reminderDaysBefore
    } = req.body;
    
    // Mock response with updated values
    const updatedConfig = {
      sendWelcomeEmail: sendWelcomeEmail !== undefined ? sendWelcomeEmail : true,
      sendVoteConfirmation: sendVoteConfirmation !== undefined ? sendVoteConfirmation : true,
      sendElectionInvitations: sendElectionInvitations !== undefined ? sendElectionInvitations : true,
      sendElectionReminders: sendElectionReminders !== undefined ? sendElectionReminders : true,
      sendResultsNotifications: sendResultsNotifications !== undefined ? sendResultsNotifications : true,
      reminderDaysBefore: reminderDaysBefore || 1
    };
    
    // In a real implementation, update in database
    res.json({
      message: 'Email notification settings updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/config/security
 * @desc    Update security settings
 * @access  Admin only
 */
router.put('/security', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      sessionTimeout, 
      maxLoginAttempts, 
      passwordComplexity, 
      mfaEnabled,
      ipRestriction,
      allowedIpRanges
    } = req.body;
    
    // Validate passwordComplexity
    if (passwordComplexity && !['low', 'medium', 'high'].includes(passwordComplexity)) {
      return res.status(400).json({ 
        message: 'Invalid password complexity. Must be low, medium, or high.' 
      });
    }
    
    // Mock response with updated values
    const updatedConfig = {
      sessionTimeout: sessionTimeout || 60,
      maxLoginAttempts: maxLoginAttempts || 5,
      passwordComplexity: passwordComplexity || 'medium',
      mfaEnabled: mfaEnabled !== undefined ? mfaEnabled : false,
      ipRestriction: ipRestriction !== undefined ? ipRestriction : false,
      allowedIpRanges: allowedIpRanges || []
    };
    
    // In a real implementation, update in database
    res.json({
      message: 'Security settings updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/config/reset
 * @desc    Reset configuration to default settings
 * @access  Admin only
 */
router.post('/reset', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock response - in a real implementation, this would reset to defaults
    res.json({
      message: 'Configuration reset to default settings successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/admin/config/email-templates
 * @desc    Get email templates
 * @access  Admin only
 */
router.get('/email-templates', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock response
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
    
    // In a real implementation, fetch from database
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/config/email-templates/:id
 * @desc    Update an email template
 * @access  Admin only
 */
router.put('/email-templates/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const templateId = req.params.id;
    const { name, subject, htmlTemplate, textTemplate, isActive } = req.body;
    
    // Mock response with updated values
    const updatedTemplate = {
      id: templateId,
      name: name || 'Welcome Email',
      subject: subject || 'Welcome to Electra',
      htmlTemplate: htmlTemplate || '<h1>Welcome to Electra, {{name}}!</h1><p>Your account has been created successfully.</p>',
      textTemplate: textTemplate || 'Welcome to Electra, {{name}}! Your account has been created successfully.',
      variables: ['name'],
      isActive: isActive !== undefined ? isActive : true
    };
    
    // In a real implementation, update in database
    res.json({
      message: 'Email template updated successfully',
      template: updatedTemplate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 