const frameTemplateModel = require('../models/frameTemplateModel');

/**
 * Frame Template Controller
 * Handles HTTP requests/responses for Frame Template endpoints.
 */
const frameTemplateController = {
  /**
   * @desc    Get all frame templates
   * @route   GET /api/frame_templates
   * @access  Public
   */
  getAllTemplates: async (req, res, next) => {
    try {
      const templates = await frameTemplateModel.getAllTemplates();
      return res.status(200).json({
        success: true,
        count: templates.length,
        data: templates
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Get single frame template by ID
   * @route   GET /api/frame_templates/:id
   * @access  Public
   */
  getTemplateById: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        res.status(400);
        throw new Error('Invalid ID format. ID must be a number.');
      }

      const template = await frameTemplateModel.getTemplateById(id);

      if (!template) {
        res.status(404);
        throw new Error(`Frame template not found with ID: ${id}`);
      }

      return res.status(200).json({
        success: true,
        data: template
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Create a new frame template
   * @route   POST /api/frame_templates
   * @access  Public
   */
  createTemplate: async (req, res, next) => {
    try {
      const { name, category, image_url, slot_count, layout_config } = req.body;

      if (!name || !category || !image_url || slot_count === undefined || !layout_config) {
        res.status(400);
        throw new Error('Please provide all required fields: name, category, image_url, slot_count, layout_config');
      }

      if (isNaN(slot_count)) {
        res.status(400);
        throw new Error('slot_count must be a number.');
      }

      const newTemplate = await frameTemplateModel.createTemplate({
        name,
        category,
        image_url,
        slot_count: parseInt(slot_count, 10),
        layout_config
      });

      return res.status(201).json({
        success: true,
        message: 'Frame template created successfully.',
        data: newTemplate
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Update a frame template by ID
   * @route   PUT /api/frame_templates/:id
   * @access  Public
   */
  updateTemplate: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, category, image_url, slot_count, layout_config } = req.body;

      if (isNaN(id)) {
        res.status(400);
        throw new Error('Invalid ID format. ID must be a number.');
      }

      if (!name || !category || !image_url || slot_count === undefined || !layout_config) {
        res.status(400);
        throw new Error('Please provide all required fields: name, category, image_url, slot_count, layout_config');
      }

      if (isNaN(slot_count)) {
        res.status(400);
        throw new Error('slot_count must be a number.');
      }

      // Check if template exists
      const existing = await frameTemplateModel.getTemplateById(id);
      if (!existing) {
        res.status(404);
        throw new Error(`Frame template not found with ID: ${id}`);
      }

      await frameTemplateModel.updateTemplate(id, {
        name,
        category,
        image_url,
        slot_count: parseInt(slot_count, 10),
        layout_config
      });

      return res.status(200).json({
        success: true,
        message: 'Frame template updated successfully.',
        data: {
          id: parseInt(id, 10),
          name,
          category,
          image_url,
          slot_count: parseInt(slot_count, 10),
          layout_config
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * @desc    Delete a frame template by ID
   * @route   DELETE /api/frame_templates/:id
   * @access  Public
   */
  deleteTemplate: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        res.status(400);
        throw new Error('Invalid ID format. ID must be a number.');
      }

      const existing = await frameTemplateModel.getTemplateById(id);
      if (!existing) {
        res.status(404);
        throw new Error(`Frame template not found with ID: ${id}`);
      }

      await frameTemplateModel.deleteTemplate(id);

      return res.status(200).json({
        success: true,
        message: `Frame template with ID ${id} deleted successfully.`
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = frameTemplateController;
