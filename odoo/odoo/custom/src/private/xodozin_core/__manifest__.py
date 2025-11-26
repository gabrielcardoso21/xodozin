# -*- coding: utf-8 -*-
{
    'name': 'Xodozin Core - Website Content Management',
    'version': '1.0.0',
    'category': 'Website',
    'summary': 'Configurable website content management system',
    'description': """
        This module provides a flexible content management system for website pages.
        It allows creating configurable content items that can be rendered in React.
        
        Features:
        - Configurable page content items
        - Multiple content types (section, text, image, gallery, testimonials, pricing, FAQ, CTA)
        - Visual customization (colors, spacing, animations)
        - SEO fields
    """,
    'author': 'Xodozin',
    'depends': [
        'base',
        'website',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/website_page_views.xml',
        'views/website_page_content_item_views.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
