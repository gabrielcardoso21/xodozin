# -*- coding: utf-8 -*-

from odoo import models, fields, api


class WebsitePage(models.Model):
    _name = 'website.page'
    _description = 'Website Page'
    _order = 'sequence, name'

    name = fields.Char(string='Page Name', required=True, translate=True)
    url = fields.Char(string='URL', required=True, help='URL path for this page (e.g., /kits, /rituais)')
    sequence = fields.Integer(string='Sequence', default=10)
    active = fields.Boolean(string='Active', default=True)
    
    # SEO Fields
    seo_title = fields.Char(string='SEO Title', translate=True, help='Title for search engines')
    seo_description = fields.Text(string='SEO Description', translate=True, help='Meta description for search engines')
    og_image = fields.Binary(string='Open Graph Image', help='Image for social media sharing')
    og_image_filename = fields.Char(string='OG Image Filename')
    
    # Content Items
    content_item_ids = fields.One2many(
        'website.page.content.item',
        'page_id',
        string='Content Items',
        help='Content items that will be rendered on this page'
    )
    
    # Metadata
    create_date = fields.Datetime(string='Created On', readonly=True)
    write_date = fields.Datetime(string='Last Updated', readonly=True)
    create_uid = fields.Many2one('res.users', string='Created By', readonly=True)
    write_uid = fields.Many2one('res.users', string='Last Updated By', readonly=True)

    _sql_constraints = [
        ('url_unique', 'unique(url)', 'URL must be unique!'),
    ]

    @api.model
    def get_page_by_url(self, url):
        """Get page by URL"""
        return self.search([('url', '=', url), ('active', '=', True)], limit=1)
