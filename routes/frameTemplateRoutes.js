const express = require('express');
const router = express.Router();
const frameTemplateController = require('../controllers/frameTemplateController');

/**
 * @route   GET /api/frame_templates
 * @desc    Retrieve all frame templates
 */
router.get('/', frameTemplateController.getAllTemplates);

/**
 * @route   GET /api/frame_templates/:id
 * @desc    Retrieve a specific frame template by ID
 */
router.get('/:id', frameTemplateController.getTemplateById);

/**
 * @route   POST /api/frame_templates
 * @desc    Create a new frame template
 */
router.post('/', frameTemplateController.createTemplate);

/**
 * @route   PUT /api/frame_templates/:id
 * @desc    Update a specific frame template by ID
 */
router.put('/:id', frameTemplateController.updateTemplate);

/**
 * @route   DELETE /api/frame_templates/:id
 * @desc    Delete a specific frame template by ID
 */
router.delete('/:id', frameTemplateController.deleteTemplate);

module.exports = router;
