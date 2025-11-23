# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request
import json


class WebsitePageController(http.Controller):

    @http.route('/api/website/page/<path:url>', type='http', auth='public', methods=['GET'], csrf=False)
    def get_page_content(self, url):
        """API endpoint to get page content by URL"""
        try:
            # Remove leading slash if present
            if url.startswith('/'):
                url = url[1:]
            
            # Add leading slash for search
            search_url = f'/{url}' if not url.startswith('/') else url
            
            page = request.env['xodozin.website.page'].sudo().search([
                ('url', '=', search_url),
                ('active', '=', True)
            ], limit=1)
            
            if not page:
                return request.make_response(
                    json.dumps({'error': 'Page not found'}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )
            
            # Get content items
            items = page.content_item_ids.filtered(lambda x: x.active).sorted('sequence')
            
            # Build response
            page_data = {
                'id': page.id,
                'name': page.name,
                'url': page.url,
                'seo_title': page.seo_title or page.name,
                'seo_description': page.seo_description,
                'og_image': page.og_image and f'/web/image/xodozin.website.page/{page.id}/og_image' or None,
                'items': []
            }
            
            for item in items:
                item_data = {
                    'id': item.id,
                    'name': item.name,
                    'item_type': item.item_type,
                    'title': item.title,
                    'subtitle': item.subtitle,
                    'content': item.content,
                    'image_url': item.image_url,
                    'image': item.image and f'/web/image/xodozin.website.page.content.item/{item.id}/image' or None,
                    'button_text': item.button_text,
                    'button_url': item.button_url,
                    'button_action': item.button_action,
                    'background_color': item.background_color,
                    'text_align': item.text_align,
                    'spacing_top': item.spacing_top,
                    'spacing_bottom': item.spacing_bottom,
                    'max_width': item.max_width,
                    'animation_type': item.animation_type,
                    'css_classes': item.css_classes,
                }
                
                # Add type-specific data
                if item.item_type == 'gallery':
                    item_data['gallery_image_ids'] = [
                        {
                            'id': img.id,
                            'image_url': img.image_url,
                            'image': img.image and f'/web/image/xodozin.website.page.content.item.gallery.image/{img.id}/image' or None,
                            'alt_text': img.alt_text,
                            'caption': img.caption,
                        }
                        for img in item.gallery_image_ids.sorted('sequence')
                    ]
                
                elif item.item_type == 'testimonials':
                    item_data['testimonial_ids'] = [
                        {
                            'id': t.id,
                            'name': t.name,
                            'role': t.role,
                            'content': t.content,
                            'rating': t.rating,
                            'image_url': None,
                            'image': t.image and f'/web/image/xodozin.website.page.content.item.testimonial/{t.id}/image' or None,
                        }
                        for t in item.testimonial_ids.sorted('sequence')
                    ]
                
                elif item.item_type == 'pricing':
                    item_data['pricing_plan_ids'] = [
                        {
                            'id': p.id,
                            'name': p.name,
                            'price': p.price,
                            'currency': p.currency,
                            'period': p.period,
                            'description': p.description,
                            'features': p.features,
                            'button_text': p.button_text,
                            'button_url': p.button_url,
                            'highlighted': p.highlighted,
                        }
                        for p in item.pricing_plan_ids.sorted('sequence')
                    ]
                
                elif item.item_type == 'faq':
                    item_data['faq_item_ids'] = [
                        {
                            'id': f.id,
                            'question': f.question,
                            'answer': f.answer,
                        }
                        for f in item.faq_item_ids.sorted('sequence')
                    ]
                
                page_data['items'].append(item_data)
            
            headers = [
                ('Content-Type', 'application/json; charset=utf-8'),
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type'),
            ]
            return request.make_response(
                json.dumps(page_data, ensure_ascii=False),
                headers=headers
            )
            
        except Exception as e:
            headers = [
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type'),
            ]
            return request.make_response(
                json.dumps({'error': str(e)}),
                headers=headers,
                status=500
            )
    
    @http.route('/api/website/page/<path:url>', type='http', auth='public', methods=['OPTIONS'], csrf=False)
    def get_page_content_options(self, url):
        """Handle CORS preflight requests"""
        headers = [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type'),
            ('Access-Control-Max-Age', '3600'),
        ]
        return request.make_response('', headers=headers)
