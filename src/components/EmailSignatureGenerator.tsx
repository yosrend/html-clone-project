"use client";

import { useState, useEffect } from 'react';
import { toast as sonnerToast } from "sonner";
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from './ThemeToggle';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface FormData {
  name: string;
  title: string;
  userImage: string;
  linkedinUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function generateCroppedImage(
  src: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  const image = await createImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No canvas context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9);
  });
}

function normalizeWhatsAppUrl(input: string): string {
  if (!input) return '';
  let phone = '';
  const cleanInput = input.trim();

  // Handle wa.me format
  if (cleanInput.match(/^https?:\/\/wa\.me\/|^wa\.me\//)) {
    const urlStr = cleanInput.startsWith('http') ? cleanInput : 'https://wa.me/' + cleanInput.replace(/^wa\.me\//, '');
    try {
      const url = new URL(urlStr);
      phone = url.pathname.replace(/\//g, '').replace(/[^\d]/g, '');
    } catch {
      // invalid wa.me
    }
  } else if (cleanInput.startsWith('http')) {
    try {
      const url = new URL(cleanInput);
      phone = (url.searchParams.get('phone') || '').replace(/[^\d]/g, '');
    } catch {
      // invalid URL
    }
  } else {
    // Assume phone number
    phone = cleanInput.replace(/[^\d]/g, '');
  }

  if (phone.length < 10) return '';
  return `https://api.whatsapp.com/send?phone=${phone}`;
}

function generateEmailSignatureHtml(
  formData: FormData, 
  displayImage: string, 
  linkedinToggle: boolean, 
  instagramToggle: boolean, 
  whatsappToggle: boolean
): string {
  const { name, title, userImage, linkedinUrl, instagramUrl, whatsappUrl } = formData;

  const website = "www.bistrochat.com";
  const websiteParts = website.split('.');
  const websiteText = websiteParts.slice(0, -1).join('.');
  const websiteDomain = websiteParts[websiteParts.length - 1];

  const aiSystemText = "Ai Restaurant Reservation System";
  const quoteLine1 = "“unleash ";
  const quoteLine2 = "your iconic ";
  const quoteLine3 = "hospitality”";

  const qrCodeImage = "https://cloudfilesdm.com/postcards/qr-code_-web1-ff4d12fd.png";
  const linkedinIcon = "https://cloudfilesdm.com/postcards/c231400b1feab7fd7b8741734755b7d7.png";
  const instagramIcon = "https://cloudfilesdm.com/postcards/fdaa7deebf8b194aec96c9d4d1069569.png";
  const whatsappIcon = "https://cloudfilesdm.com/postcards/3ccabb4eeded9b30912a1e04ea0ffadb.png";
  const bgIcon = "https://cloudfilesdm.com/postcards/bg-icon-ad50ac51.png";
  const userImageUrl = userImage || displayImage || "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Group-1773-1759278642509.png";

  // Add toggles logic
  const enabledSocials: {url: string; icon: string}[] = [];
  if (linkedinToggle) {
    enabledSocials.push({url: linkedinUrl, icon: linkedinIcon});
  }
  if (instagramToggle) {
    enabledSocials.push({url: instagramUrl, icon: instagramIcon});
  }
  if (whatsappToggle) {
    const normalizedUrl = normalizeWhatsAppUrl(whatsappUrl);
    enabledSocials.push({url: normalizedUrl, icon: whatsappIcon});
  }
  const socialRow = enabledSocials.map((s, i) => `
    <td class="pc-g-rpt pc-g-rpb pc-w800-itemsVSpacings-0" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="left" valign="middle"> <a class="pc-font-alt" href="${s.url}" target="_blank" style="text-decoration: none; display: inline-block; vertical-align: top;"> <img src="${s.icon}" class="" width="19" height="19" style="display: block; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 19px; height: 19px;" alt="" /> </a> </td>
        </tr>
      </table>
    </td>
    ${i < enabledSocials.length - 1 ? '<td class="pc-w800-itemsHSpacings-20" valign="middle" style="padding-right: 6.4px; padding-left: 6.4px; mso-padding-left-alt: 0; margin-left: 6.4px;" />' : ''}
  `).join('');
  const socialSection = enabledSocials.length > 0 ? `
    <tr>
      <td class="pc-w800-halign-center" align="left" valign="top">
        <table class="pc-w800-halign-center" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="width:unset;" valign="top">
              <table class="pc-width-hug" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tbody>
                  <tr>
                    ${socialRow}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  ` : '';

  const websiteSection = `
    <tr>
      <td class="pc-w800-halign-center" align="left" valign="top">
        <table class="pc-w800-halign-center" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td class="pc-w800-spacing-5-0-5-0" valign="top" style="padding: 5px 0px 5px 0px; height: auto;">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                <tr>
                  <td valign="top" class="pc-w800-align-center" align="left">
                    <div class="pc-font-alt pc-w800-align-center" style="text-decoration: none;">
                      <div style="font-size:14px;line-height:20px;text-align:left;text-align-last:left;color:#ffffff;font-family:'Arial', Helvetica, sans-serif;letter-spacing:-0.16px;font-style:normal;">
                        <div style="font-family:'Arial', Helvetica, sans-serif;"><a href="${website}" rel="noreferrer" style="text-decoration:none;color:inherit;color: rgb(255, 255, 255); font-family: 'Arial', Helvetica, sans-serif;"><span style="font-family: 'Arial', Helvetica, sans-serif; font-size: 14px; line-height: 20px; font-weight: 700; text-decoration: underline;">www.bistrochat.</span><span style="font-family: 'Arial', Helvetica, sans-serif; font-size: 14px; line-height: 20px; font-weight: 700; text-decoration: underline;">com</span></a> </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  // First style block - updated to 800px
  const style1 = `
    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100% !important;
        width: 100% !important;
        -webkit-font-smoothing: antialiased;
    }

    * {
        -ms-text-size-adjust: 100%;
    }

    #outlook a {
        padding: 0;
    }

    .ReadMsgBody,
    .ExternalClass {
        width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass td,
    .ExternalClass div,
    .ExternalClass span,
    .ExternalClass font {
        line-height: 100%;
    }

    table,
    td,
    th {
        mso-table-lspace: 0 !important;
        mso-table-rspace: 0 !important;
        border-collapse: collapse;
    }

    u+.body table,
    u+.body td,
    u+.body th {
        will-change: transform;
    }

    body,
    td,
    th,
    p,
    div,
    li,
    a,
    span {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        mso-line-height-rule: exactly;
    }

    img {
        border: 0;
        outline: 0;
        line-height: 100%;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
    }

    a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
    }

    .body .pc-project-body {
        background-color: transparent !important;
    }

    @media screen and (-webkit-min-device-pixel-ratio:0) {
        .pc-img-h-pct {
            height: auto !important;
        }
    }

    @media (min-width: 800px) {
        .pc-lg-hide {
            display: none;
        }

        .pc-lg-bg-img-hide {
            background-image: none !important;
        }
    }
  `;

  // Second style block - keep as is, since responsive to 640px
  const style2 = `
    @media (max-width: 640px) {
        .pc-project-body {
            min-width: 0px !important;
        }

        .pc-project-container,
        .pc-component {
            width: 100% !important;
        }

        .pc-sm-hide {
            display: none !important;
        }

        .pc-sm-bg-img-hide {
            background-image: none !important;
        }

        .pc-w800-itemsVSpacings-20 {
            padding-top: 9.6px !important;
            padding-bottom: 9.6px !important;
        }

        .pc-w800-itemsHSpacings-0 {
            padding-left: 0px !important;
            padding-right: 0px !important;
        }

        .pc-w800-valign-top {
            vertical-align: top !important;
        }

        td.pc-w800-halign-center,
        th.pc-w800-halign-center {
            text-align: center !important;
            text-align-last: center !important;
        }

        table.pc-w800-halign-center {
            float: none !important;
            margin-right: auto !important;
            margin-left: auto !important;
        }

        img.pc-w800-halign-center {
            margin-right: auto !important;
            margin-left: auto !important;
        }

        div.pc-w800-align-center,
        th.pc-w800-align-center,
        a.pc-w800-align-center,
        td.pc-w800-align-center {
            text-align: center !important;
            text-align-last: center !important;
        }

        table.pc-w800-align-center {
            float: none !important;
            margin-right: auto !important;
            margin-left: auto !important;
        }

        img.pc-w800-align-center {
            margin-right: auto !important;
            margin-left: auto !important;
        }

        table.pc-w800-spacing-5-0-5-0 {
            margin: 4px 0px 4px 0px !important;
        }

        td.pc-w800-spacing-5-0-5-0,
        th.pc-w800-spacing-5-0-5-0 {
            margin: 0 !important;
            padding: 4px 0px 4px 0px !important;
        }

        .pc-w800-itemsVSpacings-0 {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
        }

        .pc-w800-itemsHSpacings-20 {
            padding-left: 9.6px !important;
            padding-right: 9.6px !important;
        }

        table.pc-w800-spacing-0-0-5-0 {
            margin: 0px 0px 4px 0px !important;
        }

        td.pc-w800-spacing-0-0-5-0,
        th.pc-w800-spacing-0-0-5-0 {
            margin: 0 !important;
            padding: 0px 0px 4px 0px !important;
        }

        .pc-w800-text-align-center {
            text-align: center !important;
            text-align-last: center !important;
        }

        .pc-w800-valign-middle {
            vertical-align: middle !important;
        }

        .pc-w800-width-45pc {
            width: 45% !important;
        }

        .pc-w800-font-size-28px {
            font-size: 22.4px !important;
        }

        .pc-w800-padding-35-35-35-35 {
            padding: 28px 28px 28px 28px !important;
        }

        .pc-g-ib {
            display: inline-block !important;
        }

        .pc-g-b {
            display: block !important;
        }

        .pc-g-rb {
            display: block !important;
            width: auto !important;
        }

        .pc-g-wf {
            width: 100% !important;
        }

        .pc-g-rpt {
            padding-top: 0 !important;
        }

        .pc-g-rpr {
            padding-right: 0 !important;
        }

        .pc-g-rpb {
            padding-bottom: 0 !important;
        }

        .pc-g-rpl {
            padding-left: 0 !important;
        }
    }

    @media (max-width: 560px) {
        .pc-w560-padding-30-30-30-30 {
            padding: 24px 24px 24px 24px !important;
        }
    }

    .pc-font-alt { font-family: Arial, Helvetica, sans-serif !important; }
  `;

  // Body content - updated to 800px
  const bodyContent = `
    <table class="pc-project-body" style="table-layout: fixed; width: 100%; min-width: 800px; background-color: transparent;" bgcolor="transparent" border="0" cellspacing="0" cellpadding="0" role="presentation">
        <tr>
            <td align="center" valign="top" style="width:auto;">
                <table class="pc-project-container" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                <tr>
                                    <td valign="top"> 
                                        <table class="pc-component" style="width: 800px; max-width: 800px;" align="center" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                            <tr> 
                                                <td valign="top" class="pc-w560-padding-30-30-30-30 pc-w800-padding-28-28-28-28" style="background-image: url('${bgIcon}'); background-size: auto; background-position: center; background-repeat: no-repeat; padding: 20px 20px 20px 20px; height: unset; border-radius: 16px 16px 16px 16px; background-color: #2d3655;" bgcolor="#2d3655" background="${bgIcon}"> 
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                        <tr>
                                                            <td class="pc-w800-valign-top pc-w800-halign-center" align="left">
                                                                <table class="pc-w800-halign-center" align="left" width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                    <tr>
                                                                        <td valign="top">
                                                                            <table class="pc-width-fill pc-g-b pc-w800-halign-center" width="100%" height="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                <tbody class="pc-g-b">
                                                                                    <tr class="pc-g-ib pc-g-wf">
                                                                                        <td class="pc-g-rb pc-g-rpt pc-g-wf pc-w800-itemsVSpacings-20" align="left" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
                                                                                            <table class="pc-w800-halign-center" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                <tr>
                                                                                                    <td class="pc-w800-halign-center pc-w800-valign-top" align="left" valign="middle">
                                                                                                        <table class="pc-w800-halign-center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                            <tr>
                                                                                                                <td class="pc-w800-halign-center" align="left" valign="top" style="line-height: 1px; font-size: 1px;">
                                                                                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                                        <tr>
                                                                                                                            <td class="pc-w800-halign-center" align="left" valign="top" style="padding: 0px 0px 12px 0px; height: auto;"> <img src="${userImageUrl}" class="pc-w800-align-center" width="148" height="148" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 148px; height: 148px; max-width: 100%; border: 0; border-radius: 50%;" /> </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td class="pc-g-rb pc-g-wf pc-w800-itemsVSpacings-20" align="left" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
                                                                                            <table class="pc-w800-halign-center" style="width: 100%; height: 100%;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                <tr>
                                                                                                    <td class="pc-w800-halign-center pc-w800-valign-top" align="left" valign="middle">
                                                                                                        <table class="pc-w800-halign-center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                            <tr>
                                                                                                                <td class="pc-w800-halign-center" align="left" valign="top" style="line-height: 1px; font-size: 1px;"> </td>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <td class="pc-w800-halign-center" align="left" valign="top">
                                                                                                                    <table class="pc-w800-halign-center" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                                        <tr>
                                                                                                                            <td valign="top" style="padding: 0px 0px 9.6px 0px; height: auto;">
                                                                                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                                                                                                    <tr>
                                                                                                                                        <td valign="top" class="pc-w800-align-center" align="left">
                                                                                                                                            <div class="pc-font-alt pc-w800-align-center" style="text-decoration: none;">
                                                                                                                                                <div style="font-size:20.8px;line-height:19.2px;text-align:left;text-align-last:left;color:#ffffff;font-family:'Arial', Helvetica, sans-serif;letter-spacing:-0.16px;font-style:normal;">
                                                                                                                                                    <div style="font-family:'Arial', Helvetica, sans-serif;"><span style="font-family: 'Arial', Helvetica, sans-serif; font-size: 20.8px; line-height: 19.2px; font-weight: 700;">${name}</span> </div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <td class="pc-w800-halign-center" align="left" valign="top">
                                                                                                                    <table class="pc-w800-halign-center" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                                        <tr>
                                                                                                                            <td class="pc-w800-spacing-5-0-5-0" valign="top" style="padding: 0px 0px 4.8px 0px; height: auto;">
                                                                                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                                                                                                    <tr>
                                                                                                                                        <td valign="top" class="pc-w800-align-center" align="left">
                                                                                                                                            <div class="pc-font-alt pc-w800-align-center" style="text-decoration: none;">
                                                                                                                                                <div style="font-size:13.6px;line-height:19.2px;text-align:left;text-align-last:left;color:#ffffff;font-family:'Arial', Helvetica, sans-serif;letter-spacing:-0.16px;font-style:normal;">
                                                                                                                                                    <div style="font-family:'Arial', Helvetica, sans-serif;"><span style="font-family: 'Arial', Helvetica, sans-serif; font-size: 13.6px; line-height: 19.2px; font-weight: 700;">${title}</span> </div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            ${websiteSection}
                                                                                                            ${socialSection}
                                                                                                            <tr>
                                                                                                                <td class="pc-w800-halign-center" align="left" valign="top">
                                                                                                                    <table class="pc-w800-halign-center" align="left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                                        <tr>
                                                                                                                            <td class="pc-w800-spacing-0-0-5-0" valign="top" style="padding: 4.8px 0px 4.8px 0px; height: auto;">
                                                                                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                                                                                                    <tr>
                                                                                                                                        <td valign="top" class="pc-w800-align-center" align="left" style="padding: 4.8px 0px 4.8px 0px; height: auto;">
                                                                                                                                            <div class="pc-font-alt pc-w800-align-center" style="text-decoration: none;">
                                                                                                                                                <div style="font-size:14.4px;line-height:19.2px;text-align:left;text-align-last:left;color:#ffffff;font-family:'Arial', Helvetica, sans-serif;font-style:normal;letter-spacing:-0.16px;">
                                                                                                                                                    <div style="font-family:'Arial', Helvetica, sans-serif;" class="pc-w800-text-align-center"><span style="font-family: 'Arial', Helvetica, sans-serif; font-weight: 400; font-size: 14.4px; line-height: 19.2px;">${aiSystemText}</span> </div>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td class="pc-g-rb pc-g-wf pc-w800-itemsVSpacings-20" align="left" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
                                                                                            <table class="pc-w800-width-45pc pc-w800-halign-center" style="height: 100%;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                <tr>
                                                                                                    <td class="pc-w800-halign-center pc-w800-valign-middle" align="left" valign="middle">
                                                                                                        <table class="pc-w800-halign-center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                            <tr>
                                                                                                                <td class="pc-w800-halign-center" align="left" valign="top">
                                                                                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w800-halign-center" align="left">
                                                                                                                        <tr>
                                                                                                                            <td valign="top" class="pc-w800-align-center" align="left">
                                                                                                                                <div class="pc-font-alt pc-w800-align-center" style="text-decoration: none;">
                                                                                                                                    <div style="font-size:25.6px;line-height:32px;text-align:center;text-align-last:center;color:#ffffff;font-family:'Arial', Helvetica, sans-serif;font-style:normal;letter-spacing:-0.16px;">
                                                                                                                                        <div style="font-family:'Arial', Helvetica, sans-serif;" class="pc-w800-text-align-center"><span style="font-family: 'Arial', Helvetica, sans-serif; font-weight: 700; font-size: 25.6px; line-height: 32px;" class="pc-w800-font-size-28px">${quoteLine1}</span> <br><span style="font-family: 'Arial', Helvetica, sans-serif; font-weight: 700; font-size: 25.6px; line-height: 32px;" class="pc-w800-font-size-28px">${quoteLine2}</span> <br><span style="font-family: 'Arial', Helvetica, sans-serif; font-weight: 700; font-size: 25.6px; line-height: 32px;" class="pc-w800-font-size-28px">${quoteLine3}</span> </div>
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                        <td class="pc-g-rb pc-g-rpb pc-g-wf pc-w800-itemsVSpacings-20" align="left" valign="middle" style="padding-top: 0px; padding-bottom: 0px;">
                                                                                            <table class="pc-w800-halign-center" style="width: 90%; height: 100%;" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                <tr>
                                                                                                    <td class="pc-w800-halign-center pc-w800-valign-top" align="left" valign="middle" style="padding: 0px 9.6px 0px 9.6px; mso-padding-left-alt: 0; margin-left:9.6px; height: auto;">
                                                                                                        <table class="pc-w800-halign-center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                            <tr>
                                                                                                                <td class="pc-w800-halign-center" align="left" valign="top" style="line-height: 1px; font-size: 1px;">
                                                                                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                                                                                                        <tr>
                                                                                                                            <td class="pc-w800-halign-center" align="left" valign="top" style="padding: 0px 0px 12px 0px; height: auto;"> <img src="${qrCodeImage}" class="pc-w800-align-center" width="78" height="78" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 78px; height: 78px; border: 0;" /> </td>
                                                                                                                        </tr>
                                                                                                                    </table>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table> 
                                                </td>
                                            </tr>
                                        </table> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                            <tr>
                                                
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
  `;

  // Return for preview: styles + body wrapper + content
  return `
    <style>${style1}</style>
    <style>${style2}</style>
    <div class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; font-weight: normal; color: #2D3A41; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-variant-ligatures: normal; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; background-color: transparent;" bgcolor="transparent">
      ${bodyContent}
    </div>
  `;
}

async function getHtmlWithEmbeddedImage(html: string, userImageUrl: string): Promise<string> {
  let result = html;
  if (userImageUrl.startsWith('/api/images/')) {
    try {
      const response = await fetch(userImageUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (reader.error) {
            reject(reader.error);
          } else {
            const dataUrl = reader.result as string;
            const search = `src="${userImageUrl}"`;
            result = html.replace(search, `src="${dataUrl}"`);
            resolve(result);
          }
        };
      });
    } catch (error) {
      console.error('Embed error:', error);
      throw error;
    }
  }
  return Promise.resolve(html);
}

export default function EmailSignatureGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: 'Hacene Taibi',
    title: 'CEO / Co-Founder @bistrochat',
    userImage: '',
    linkedinUrl: '',
    instagramUrl: '',
    whatsappUrl: ''
  });
  const [displayImage, setDisplayImage] = useState('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/Group-1773-1759278642509.png');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('upload');
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [linkedinToggle, setLinkedinToggle] = useState(true);
  const [instagramToggle, setInstagramToggle] = useState(true);
  const [whatsappToggle, setWhatsappToggle] = useState(true);

  useEffect(() => {
    const html = generateEmailSignatureHtml(formData, displayImage, linkedinToggle, instagramToggle, whatsappToggle);
    setGeneratedHtml(html);
  }, [formData, displayImage, linkedinToggle, instagramToggle, whatsappToggle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    let field: keyof FormData;
    switch(id) {
      case 'linkedin-url': field = 'linkedinUrl'; break;
      case 'instagram-url': field = 'instagramUrl'; break;
      case 'whatsapp-url': field = 'whatsappUrl'; break;
      case 'user-image': field = 'userImage'; break;
      default: field = id as keyof FormData;
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (id === 'user-image') {
      setDisplayImage(value);
    }
  };

  const handleInstagramBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      const processedValue = value.replace(/^@+/, '');
      const fullUrl = `https://www.instagram.com/${processedValue}`;
      setFormData((prev) => ({ ...prev, instagramUrl: fullUrl }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      sonnerToast("Only image files are allowed.", { variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      sonnerToast("File too large. Maximum 5MB.", { variant: "destructive" });
      return;
    }

    setImageSrc(URL.createObjectURL(file));
    setShowCropper(true);
    e.target.value = '';
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setUploadingImage(true);
    try {
      const croppedImageBlob = await generateCroppedImage(imageSrc, croppedAreaPixels);
      const formDataToSend = new FormData();
      formDataToSend.append('file', croppedImageBlob, 'cropped-image.jpg');

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setDisplayImage(data.imageUrl);
        setFormData((prev) => ({ ...prev, userImage: data.imageUrl }));
        sonnerToast("Image cropped and uploaded successfully!", {
          description: "Your circular profile image is now set for the signature.",
        });
      } else {
        sonnerToast("Upload failed", { description: data.error || "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      console.error('Crop error:', error);
      sonnerToast("Cropping failed", { description: "Please try again.", variant: "destructive" });
    } finally {
      setUploadingImage(false);
      setShowCropper(false);
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      setImageSrc('');
      setCroppedAreaPixels(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      sonnerToast("Only image files are allowed.", { variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      sonnerToast("File too large. Maximum 5MB.", { variant: "destructive" });
      return;
    }

    setUploadingImage(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setFormData(prev => ({ ...prev, userImage: data.imageUrl }));
        sonnerToast("Image uploaded successfully!", { description: "Your uploaded image is now set for the signature." });
      } else {
        sonnerToast("Upload failed", { description: data.error || "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      sonnerToast("Upload error", { description: "Please try again.", variant: "destructive" });
    } finally {
      setUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleCopy = async () => {
    let htmlToCopy: string;
    try {
      htmlToCopy = await getHtmlWithEmbeddedImage(generatedHtml, formData.userImage || displayImage);
    } catch (error) {
      htmlToCopy = generatedHtml;
      sonnerToast("Copied without embedded image. Use Download for offline viewing.", { variant: "default" });
    }
    if (htmlToCopy) {
      try {
        await navigator.clipboard.writeText(htmlToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        sonnerToast("HTML copied to clipboard!");
      } catch (error) {
        console.error('Copy error:', error);
        const textArea = document.createElement('textarea');
        textArea.value = htmlToCopy;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '0';
        textArea.style.top = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            sonnerToast("HTML copied via fallback!");
          } else {
            throw new Error('execCommand copy failed');
          }
        } catch (err) {
          document.body.removeChild(textArea);
          console.error('Fallback copy failed:', err);
          // Last resort: download
          const blob = new Blob([htmlToCopy], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'email-signature.html';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          sonnerToast("Downloaded as fallback!");
        }
      }
    }
  };

  return (
    <div className="w-full mx-auto p-2 sm:p-4 md:p-6 lg:p-8 max-w-4xl">
      <div className="flex flex-col gap-4 lg:gap-8">
        {/* Preview Section */}
        <Card className="w-full shadow-none border-none">
          <CardHeader className="pb-0 sm:pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 pt-8">
            <CardTitle className="text-xl sm:text-2xl">Bistrochat Email Generator</CardTitle>
            <ThemeToggle />
          </CardHeader>
          <CardContent className="px-0 py-2 sm:py-4">
            <div className="flex justify-center">
              <div
                className="w-full h-auto rounded-md overflow-hidden mx-auto"
                style={{ maxWidth: '800px' }}
                dangerouslySetInnerHTML={{ __html: generatedHtml }} />
            </div>
          </CardContent>
        </Card>

        {/* Input Form Section */}
        <Card className="w-full shadow-none border-none">
          <CardHeader className="pb-1 sm:pb-2 pt-8 px-8">
            <CardTitle className="text-xl sm:text-2xl">Enter Your Details</CardTitle>
            <CardDescription className="text-sm sm:text-base mb-1">Fill in the form to generate your custom email signature.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8 py-2 sm:py-3 pb-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Name (max 30 chars)</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength={30}
                  placeholder="Enter your name"
                  className="text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm sm:text-base">Job Title/Position (max 30 chars)</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={30}
                  placeholder="Enter your job title"
                  className="text-base"
                />
              </div>
              
              <div>
                <Label className="text-lg font-semibold mb-3 sm:mb-4 block">Profile Image</Label>
                <Separator className="my-3 sm:my-4" />
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'url' | 'upload')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="upload"
                      className="data-[state=active]:bg-black dark:data-[state=active]:bg-background data-[state=active]:text-white dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-')]]:size-4 text-xs sm:text-sm"
                    >
                      Upload
                    </TabsTrigger>
                    <TabsTrigger
                      value="url"
                      className="data-[state=active]:bg-black dark:data-[state=active]:bg-background data-[state=active]:text-white dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-')]]:size-4 text-xs sm:text-sm"
                    >
                      URL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="mt-3 sm:mt-4">
                    <Input
                      id="user-image"
                      placeholder="Paste image URL here"
                      value={formData.userImage}
                      onChange={handleInputChange}
                      className="text-base"
                    />
                  </TabsContent>
                  <TabsContent value="upload" className="mt-3 sm:mt-4 space-y-3">
                    <Input
                      id="user-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <p className="text-xs text-muted-foreground">Max file size: 5MB. Only images allowed.</p>
                    {displayImage && (
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">Current image</p>
                        <img src={displayImage} alt="Preview" className="w-20 h-20 rounded-full object-cover block mx-auto mt-2" />
                      </div>
                    )}
                    {uploadingImage && <p className="text-xs sm:text-sm text-primary">Uploading cropped image...</p>}
                  </TabsContent>
                </Tabs>

                <Dialog open={showCropper} onOpenChange={(open) => {
                  setShowCropper(open);
                  if (!open && imageSrc) {
                    URL.revokeObjectURL(imageSrc);
                    setImageSrc('');
                    setCroppedAreaPixels(null);
                  }
                }}>
                  <DialogContent className="max-w-2xl w-full max-h-[90vh] sm:max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Crop Your Profile Image to Circle</DialogTitle>
                      <DialogDescription>
                        Adjust the crop area to select a perfect circular profile image (1:1 ratio).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="relative h-96 w-full">
                      {imageSrc && (
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          cropShape="round"
                          showGrid={false}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          objectFit="contain"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-center space-x-2 mt-4 mb-4">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setZoom(prev => Math.max(1, prev - 0.1))}
                      >
                        Zoom Out
                      </Button>
                      <Slider
                        value={[zoom]}
                        onValueChange={(value) => setZoom(value[0])}
                        min={1}
                        max={3}
                        step={0.1}
                        className="w-48"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                      >
                        Zoom In
                      </Button>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCropper(false);
                          if (imageSrc) URL.revokeObjectURL(imageSrc);
                          setImageSrc('');
                          setCroppedAreaPixels(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleApplyCrop}
                        disabled={!croppedAreaPixels || uploadingImage}
                      >
                        {uploadingImage ? "Uploading..." : "Apply Crop & Upload"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Separator className="my-3 sm:my-4" />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin-url" className="text-sm sm:text-base">LinkedIn Profile URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="linkedin-url"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="flex-1 text-base"
                    />
                    <Switch
                      checked={linkedinToggle}
                      onCheckedChange={setLinkedinToggle}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram-url" className="text-sm sm:text-base">Instagram Profile URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="instagram-url"
                      type="url"
                      value={formData.instagramUrl}
                      onChange={handleInputChange}
                      onBlur={handleInstagramBlur}
                      placeholder="https://instagram.com/username"
                      className="flex-1 text-base"
                    />
                    <Switch
                      checked={instagramToggle}
                      onCheckedChange={setInstagramToggle}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-url" className="text-sm sm:text-base">WhatsApp URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="whatsapp-url"
                      type="url"
                      value={formData.whatsappUrl}
                      onChange={handleInputChange}
                      placeholder="https://wa.me/phone"
                      className="flex-1 text-base"
                    />
                    <Switch
                      checked={whatsappToggle}
                      onCheckedChange={setWhatsappToggle}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleCopy}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-base py-3"
                variant={copied ? "default" : "default"}
                disabled={!generatedHtml || copied}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  'Copy HTML Code'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}