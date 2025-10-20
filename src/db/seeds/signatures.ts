import { db } from '@/db';
import { signatures } from '@/db/schema';

async function main() {
    const sampleSignatures = [
        {
            name: 'Sarah Johnson',
            title: 'Marketing Manager at TechCorp',
            imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b27c?w=150&h=150&fit=crop&crop=face',
            linkedinUrl: 'https://linkedin.com/in/sarah-johnson-marketing',
            instagramUrl: 'https://instagram.com/sarahjohnson_marketing',
            whatsappUrl: 'https://wa.me/15551234567',
            html: `<div style="font-family: Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.4;">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="padding-right: 20px; vertical-align: top;">
                            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b27c?w=150&h=150&fit=crop&crop=face" width="80" height="80" style="border-radius: 50%;">
                        </td>
                        <td style="vertical-align: top;">
                            <div style="font-weight: bold; font-size: 16px; color: #2c5aa0;">Sarah Johnson</div>
                            <div style="color: #666; margin: 2px 0;">Marketing Manager</div>
                            <div style="color: #666; margin: 2px 0;">TechCorp</div>
                            <div style="margin: 8px 0;">
                                <div>📧 sarah.johnson@techcorp.com</div>
                                <div>📱 +1 (555) 123-4567</div>
                                <div>🌐 www.techcorp.com</div>
                            </div>
                            <div style="margin-top: 10px;">
                                <a href="https://linkedin.com/in/sarah-johnson-marketing" style="text-decoration: none; margin-right: 10px;">
                                    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn">
                                </a>
                                <a href="https://instagram.com/sarahjohnson_marketing" style="text-decoration: none; margin-right: 10px;">
                                    <img src="https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white" alt="Instagram">
                                </a>
                                <a href="https://wa.me/15551234567" style="text-decoration: none;">
                                    <img src="https://img.shields.io/badge/WhatsApp-25D366?style=flat&logo=whatsapp&logoColor=white" alt="WhatsApp">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>`,
            createdAt: Math.floor(new Date('2024-01-05').getTime() / 1000),
            updatedAt: Math.floor(new Date('2024-01-05').getTime() / 1000),
        },
        {
            name: 'Alex Chen',
            title: 'Senior Full Stack Developer',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            linkedinUrl: 'https://linkedin.com/in/alex-chen-dev',
            instagramUrl: null,
            whatsappUrl: null,
            html: `<div style="font-family: 'Courier New', monospace; color: #333; font-size: 13px; line-height: 1.5; background: #f8f9fa; padding: 15px; border-left: 4px solid #007acc; max-width: 400px;">
                <div style="font-weight: bold; font-size: 18px; color: #007acc; margin-bottom: 8px;">Alex Chen</div>
                <div style="color: #666; font-family: Arial, sans-serif; margin-bottom: 12px;">Senior Full Stack Developer</div>
                <div style="margin-bottom: 12px;">
                    <div style="margin: 3px 0;">🔧 React • Node.js • TypeScript • Python</div>
                    <div style="margin: 3px 0;">📧 alex.chen@techsolutions.dev</div>
                    <div style="margin: 3px 0;">🌐 alexchen.dev</div>
                </div>
                <div style="margin-top: 15px;">
                    <a href="https://linkedin.com/in/alex-chen-dev" style="text-decoration: none; color: #0077B5; font-weight: bold; margin-right: 15px;">
                        LinkedIn →
                    </a>
                    <a href="https://github.com/alexchen" style="text-decoration: none; color: #333; font-weight: bold;">
                        GitHub →
                    </a>
                </div>
                <div style="margin-top: 12px; font-size: 11px; color: #888; font-family: Arial, sans-serif;">
                    "Code is poetry written in logic"
                </div>
            </div>`,
            createdAt: Math.floor(new Date('2024-01-12').getTime() / 1000),
            updatedAt: Math.floor(new Date('2024-01-15').getTime() / 1000),
        },
        {
            name: 'Michael Rodriguez',
            title: 'Sales Director | Enterprise Solutions',
            imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            linkedinUrl: 'https://linkedin.com/in/michael-rodriguez-sales',
            instagramUrl: null,
            whatsappUrl: 'https://wa.me/15559876543',
            html: `<div style="font-family: Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.4;">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding-right: 25px; vertical-align: top; border-right: 2px solid #1f4e79; padding-bottom: 20px;">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" width="90" height="90" style="border-radius: 8px; border: 2px solid #1f4e79;">
                        </td>
                        <td style="vertical-align: top; padding-left: 25px;">
                            <div style="font-weight: bold; font-size: 18px; color: #1f4e79; margin-bottom: 4px;">Michael Rodriguez</div>
                            <div style="color: #c8102e; font-weight: 600; font-size: 15px; margin-bottom: 2px;">Sales Director</div>
                            <div style="color: #666; margin-bottom: 15px;">Enterprise Solutions Division</div>
                            <div style="margin-bottom: 15px;">
                                <div style="margin: 4px 0;"><strong>📧</strong> m.rodriguez@enterprisesolutions.com</div>
                                <div style="margin: 4px 0;"><strong>📞</strong> +1 (555) 987-6543</div>
                                <div style="margin: 4px 0;"><strong>📱</strong> +1 (555) 987-6544 (Direct)</div>
                                <div style="margin: 4px 0;"><strong>🏢</strong> Enterprise Solutions Inc.</div>
                                <div style="margin: 4px 0;"><strong>🌐</strong> www.enterprisesolutions.com</div>
                            </div>
                            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                                <a href="https://linkedin.com/in/michael-rodriguez-sales" style="display: inline-block; background: #0077B5; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-right: 10px;">
                                    Connect on LinkedIn
                                </a>
                                <a href="https://wa.me/15559876543" style="display: inline-block; background: #25D366; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                                    WhatsApp Business
                                </a>
                            </div>
                            <div style="margin-top: 12px; font-size: 12px; color: #888; font-style: italic;">
                                "Driving growth through strategic partnerships and innovative solutions"
                            </div>
                        </td>
                    </tr>
                </table>
            </div>`,
            createdAt: Math.floor(new Date('2024-01-18').getTime() / 1000),
            updatedAt: Math.floor(new Date('2024-01-22').getTime() / 1000),
        }
    ];

    await db.insert(signatures).values(sampleSignatures);
    
    console.log('✅ Email signatures seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});