# -*- coding: utf-8 -*-

from odoo import models, fields, api


class WebsitePageContentItem(models.Model):
    _name = 'xodozin.website.page.content.item'
    _description = 'Xodozin Website Page Content Item'
    _order = 'sequence, id'

    name = fields.Char(string='Item Name', required=True, translate=True)
    page_id = fields.Many2one('xodozin.website.page', string='Page', required=True, ondelete='cascade')
    sequence = fields.Integer(string='Sequence', default=10)
    active = fields.Boolean(string='Active', default=True)
    
    # Type Selection
    item_type = fields.Selection([
        ('section', 'Section'),
        ('text', 'Text'),
        ('image', 'Image'),
        ('button', 'Button'),
        ('gallery', 'Gallery'),
        ('testimonials', 'Testimonials'),
        ('pricing', 'Pricing Table'),
        ('faq', 'FAQ'),
        ('cta_banner', 'CTA Banner'),
    ], string='Item Type', required=True, default='section')
    
    # Content Fields
    title = fields.Char(string='Title', translate=True)
    subtitle = fields.Char(string='Subtitle', translate=True)
    content = fields.Html(string='Content', translate=True, sanitize_attributes=False)
    image = fields.Binary(string='Image')
    image_filename = fields.Char(string='Image Filename')
    image_url = fields.Char(string='Image URL', help='External image URL')
    
    # Gallery Fields
    gallery_image_ids = fields.One2many(
        'website.page.content.item.gallery.image',
        'item_id',
        string='Gallery Images'
    )
    
    # Testimonials Fields
    testimonial_ids = fields.One2many(
        'website.page.content.item.testimonial',
        'item_id',
        string='Testimonials'
    )
    
    # Pricing Fields
    pricing_plan_ids = fields.One2many(
        'website.page.content.item.pricing.plan',
        'item_id',
        string='Pricing Plans'
    )
    
    # FAQ Fields
    faq_item_ids = fields.One2many(
        'website.page.content.item.faq',
        'item_id',
        string='FAQ Items'
    )
    
    # Button/CTA Fields
    button_text = fields.Char(string='Button Text', translate=True)
    button_url = fields.Char(string='Button URL')
    button_action = fields.Selection([
        ('navigate', 'Navigate'),
        ('scroll', 'Scroll to Section'),
        ('external', 'External Link'),
    ], string='Button Action', default='navigate')
    
    # Visual Settings
    background_color = fields.Char(
        string='Background Color',
        help='Hex color code (e.g., #F2cc8f) or CSS color name'
    )
    text_align = fields.Selection([
        ('left', 'Left'),
        ('center', 'Center'),
        ('right', 'Right'),
    ], string='Text Alignment', default='left')
    spacing_top = fields.Integer(string='Spacing Top (px)', default=0)
    spacing_bottom = fields.Integer(string='Spacing Bottom (px)', default=0)
    max_width = fields.Char(
        string='Max Width',
        help='CSS max-width value (e.g., 1200px, 80%, none)',
        default='1200px'
    )
    animation_type = fields.Selection([
        ('none', 'None'),
        ('fade', 'Fade In'),
        ('slide', 'Slide Up'),
        ('slide-left', 'Slide Left'),
        ('slide-right', 'Slide Right'),
    ], string='Animation Type', default='fade')
    
    # Additional Settings
    css_classes = fields.Char(
        string='CSS Classes',
        help='Additional CSS classes to apply to this item'
    )
    
    # Metadata
    create_date = fields.Datetime(string='Created On', readonly=True)
    write_date = fields.Datetime(string='Last Updated', readonly=True)

    @api.model
    def get_items_by_page(self, page_id):
        """Get all active items for a page, ordered by sequence"""
        return self.search([
            ('page_id', '=', page_id),
            ('active', '=', True)
        ], order='sequence, id')


class WebsitePageContentItemGalleryImage(models.Model):
    _name = 'xodozin.website.page.content.item.gallery.image'
    _description = 'Gallery Image'
    _order = 'sequence, id'

    item_id = fields.Many2one('xodozin.website.page.content.item', string='Content Item', required=True, ondelete='cascade')
    sequence = fields.Integer(string='Sequence', default=10)
    image = fields.Binary(string='Image', required=True)
    image_filename = fields.Char(string='Image Filename')
    image_url = fields.Char(string='Image URL', help='External image URL')
    alt_text = fields.Char(string='Alt Text', translate=True, help='Alternative text for accessibility')
    caption = fields.Char(string='Caption', translate=True)


class WebsitePageContentItemTestimonial(models.Model):
    _name = 'xodozin.website.page.content.item.testimonial'
    _description = 'Testimonial'
    _order = 'sequence, id'

    item_id = fields.Many2one('xodozin.website.page.content.item', string='Content Item', required=True, ondelete='cascade')
    sequence = fields.Integer(string='Sequence', default=10)
    name = fields.Char(string='Name', required=True, translate=True)
    role = fields.Char(string='Role/Title', translate=True)
    content = fields.Text(string='Testimonial', required=True, translate=True)
    image = fields.Binary(string='Avatar')
    image_filename = fields.Char(string='Image Filename')
    rating = fields.Integer(string='Rating', default=5, help='Rating from 1 to 5')


class WebsitePageContentItemPricingPlan(models.Model):
    _name = 'xodozin.website.page.content.item.pricing.plan'
    _description = 'Pricing Plan'
    _order = 'sequence, id'

    item_id = fields.Many2one('xodozin.website.page.content.item', string='Content Item', required=True, ondelete='cascade')
    sequence = fields.Integer(string='Sequence', default=10)
    name = fields.Char(string='Plan Name', required=True, translate=True)
    price = fields.Float(string='Price', required=True)
    currency = fields.Char(string='Currency', default='R$')
    period = fields.Char(string='Period', translate=True, help='e.g., /month, /year')
    description = fields.Text(string='Description', translate=True)
    features = fields.Html(string='Features', translate=True, help='List of features (HTML)')
    button_text = fields.Char(string='Button Text', translate=True, default='Choose Plan')
    button_url = fields.Char(string='Button URL')
    highlighted = fields.Boolean(string='Highlighted', help='Highlight this plan')


class WebsitePageContentItemFAQ(models.Model):
    _name = 'xodozin.website.page.content.item.faq'
    _description = 'FAQ Item'
    _order = 'sequence, id'

    item_id = fields.Many2one('xodozin.website.page.content.item', string='Content Item', required=True, ondelete='cascade')
    sequence = fields.Integer(string='Sequence', default=10)
    question = fields.Char(string='Question', required=True, translate=True)
    answer = fields.Html(string='Answer', required=True, translate=True)
