#!/usr/bin/env python3
"""
Eng. Mohamed Sami Haikal — Company Profile & Portfolio 2026
High-Precision 7-Page Landscape (16:9) PDF Generator
Perfected Typography, Multi-line Arabic Word Wrapping, and Clean Photography
"""

import os
import re
from PIL import Image, ImageDraw, ImageFont

WIDTH = 1920
HEIGHT = 1080

# Color Palette Constants
BG_DARK = (13, 16, 19)         # #0D1013
BG_SLATE = (19, 23, 29)        # #13171D
BG_CARD = (26, 31, 38)         # #1A1F26
GOLD_PRIMARY = (197, 168, 128)  # #C5A880
GOLD_LIGHT = (226, 207, 182)   # #E2CFB6
GOLD_DARK = (159, 128, 85)     # #9F8055
TEXT_WHITE = (255, 255, 255)
TEXT_LIGHT = (243, 244, 246)   # #F3F4F6
TEXT_MUTED = (130, 139, 152)   # #828B98
BORDER_SUBTLE = (45, 52, 62)
BORDER_GOLD = (197, 168, 128)

def get_font_paths():
    ar_path = '/System/Library/Fonts/SFArabic.ttf'
    if not os.path.exists(ar_path):
        ar_path = '/System/Library/Fonts/GeezaPro.ttc'

    en_path = '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'
    if not os.path.exists(en_path):
        en_path = '/System/Library/Fonts/Helvetica.ttc'

    en_sans = '/System/Library/Fonts/Supplemental/Arial.ttf'
    if not os.path.exists(en_sans):
        en_sans = '/System/Library/Fonts/Helvetica.ttc'

    return ar_path, en_path, en_sans

FONT_AR_PATH, FONT_EN_PATH, FONT_SANS_PATH = get_font_paths()

# Arabic Shaping Table
ARABIC_TABLE = {
    0x0621: (0xFE80, 0xFE80, 0xFE80, 0xFE80, False), # Hamza
    0x0622: (0xFE81, 0xFE82, 0xFE81, 0xFE82, False), # Alef with Madda
    0x0623: (0xFE83, 0xFE84, 0xFE83, 0xFE84, False), # Alef with Hamza Above
    0x0624: (0xFE85, 0xFE86, 0xFE85, 0xFE86, False), # Waw with Hamza Above
    0x0625: (0xFE87, 0xFE88, 0xFE87, 0xFE88, False), # Alef with Hamza Below
    0x0626: (0xFE89, 0xFE8A, 0xFE8B, 0xFE8C, True),  # Yeh with Hamza Above
    0x0627: (0xFE8D, 0xFE8E, 0xFE8D, 0xFE8E, False), # Alef
    0x0628: (0xFE8F, 0xFE90, 0xFE91, 0xFE92, True),  # Beh
    0x0629: (0xFE93, 0xFE94, 0xFE93, 0xFE94, False), # Teh Marbuta
    0x062A: (0xFE95, 0xFE96, 0xFE97, 0xFE98, True),  # Teh
    0x062B: (0xFE99, 0xFE9A, 0xFE9B, 0xFE9C, True),  # Theh
    0x062C: (0xFE9D, 0xFE9E, 0xFE9F, 0xFEA0, True),  # Jeem
    0x062D: (0xFEA1, 0xFEA2, 0xFEA3, 0xFEA4, True),  # Hah
    0x062E: (0xFEA5, 0xFEA6, 0xFEA7, 0xFEA8, True),  # Khah
    0x062F: (0xFEA9, 0xFEAA, 0xFEA9, 0xFEAA, False), # Dal
    0x0630: (0xFEAB, 0xFEAC, 0xFEAB, 0xFEAC, False), # Thal
    0x0631: (0xFEAD, 0xFEAE, 0xFEAD, 0xFEAE, False), # Reh
    0x0632: (0xFEAF, 0xFEB0, 0xFEAF, 0xFEB0, False), # Zain
    0x0633: (0xFEB1, 0xFEB2, 0xFEB3, 0xFEB4, True),  # Seen
    0x0634: (0xFEB5, 0xFEB6, 0xFEB7, 0xFEB8, True),  # Sheen
    0x0635: (0xFEB9, 0xFEBA, 0xFEBB, 0xFEBC, True),  # Sad
    0x0636: (0xFEBD, 0xFEBE, 0xFEBF, 0xFEC0, True),  # Dad
    0x0637: (0xFEC1, 0xFEC2, 0xFEC3, 0xFEC4, True),  # Tah
    0x0638: (0xFEC5, 0xFEC6, 0xFEC7, 0xFEC8, True),  # Zah
    0x0639: (0xFEC9, 0xFECA, 0xFECB, 0xFECC, True),  # Ain
    0x063A: (0xFECD, 0xFECE, 0xFECF, 0xFED0, True),  # Ghain
    0x0641: (0xFED1, 0xFED2, 0xFED3, 0xFED4, True),  # Feh
    0x0642: (0xFED5, 0xFED6, 0xFED7, 0xFED8, True),  # Qaf
    0x0643: (0xFED9, 0xFEDA, 0xFEDB, 0xFEDC, True),  # Kaf
    0x0644: (0xFEDD, 0xFEDE, 0xFEDF, 0xFEE0, True),  # Lam
    0x0645: (0xFEE1, 0xFEE2, 0xFEE3, 0xFEE4, True),  # Meem
    0x0646: (0xFEE5, 0xFEE6, 0xFEE7, 0xFEE8, True),  # Noon
    0x0647: (0x0647, 0xFEEA, 0xFEEB, 0xFEEC, True),  # Heh
    0x0648: (0xFEED, 0xFEEE, 0xFEED, 0xFEEE, False), # Waw
    0x0649: (0xFEEF, 0xFEF0, 0xFBE8, 0xFBE9, True),  # Alef Maksura
    0x064A: (0xFEF1, 0xFEF2, 0xFEF3, 0xFEF4, True),  # Yeh
}

def ar(text):
    if not text:
        return ""
    # Process ligatures
    ligatures = [
        ('\u0644\u0622', '\uFEF5'),
        ('\u0644\u0623', '\uFEF7'),
        ('\u0644\u0625', '\uFEF9'),
        ('\u0644\u0627', '\uFEFB'),
    ]
    for pair, lig in ligatures:
        text = text.replace(pair, lig)

    n = len(text)
    reshaped = []
    for i, ch in enumerate(text):
        code = ord(ch)
        if code in ARABIC_TABLE:
            iso, fin, ini, med, dual = ARABIC_TABLE[code]
            prev_connects = False
            if i > 0:
                p_code = ord(text[i-1])
                if p_code in ARABIC_TABLE and ARABIC_TABLE[p_code][4]:
                    prev_connects = True

            next_connects = False
            if i < n - 1:
                n_code = ord(text[i+1])
                if n_code in ARABIC_TABLE:
                    next_connects = True

            if prev_connects and next_connects and dual:
                reshaped.append(chr(med))
            elif prev_connects:
                reshaped.append(chr(fin))
            elif next_connects and dual:
                reshaped.append(chr(ini))
            else:
                reshaped.append(chr(iso))
        elif code in [0xFEF5, 0xFEF7, 0xFEF9, 0xFEFB]:
            prev_connects = False
            if i > 0:
                p_code = ord(text[i-1])
                if p_code in ARABIC_TABLE and ARABIC_TABLE[p_code][4]:
                    prev_connects = True
            reshaped.append(chr(code + 1) if prev_connects else chr(code))
        else:
            reshaped.append(ch)

    line = ''.join(reshaped)
    # Split tokens to reverse Arabic RTL runs correctly
    tokens = re.split(r'([\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]+)', line)
    rtl_tokens = []
    for t in tokens:
        if re.search(r'[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]', t):
            rtl_tokens.append(t[::-1])
        else:
            rtl_tokens.append(t)
    return ''.join(reversed(rtl_tokens))

def get_font(size, arabic=True, sans=False):
    if arabic:
        path = FONT_AR_PATH
    elif sans:
        path = FONT_SANS_PATH
    else:
        path = FONT_EN_PATH

    if not path or not os.path.exists(path):
        return ImageFont.load_default()
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def wrap_ar(text, font, max_w, draw):
    words = text.split()
    lines = []
    cur = []
    for w in words:
        test = cur + [w]
        reshaped = ar(' '.join(test))
        bbox = draw.textbbox((0, 0), reshaped, font=font)
        if bbox[2] - bbox[0] <= max_w or not cur:
            cur.append(w)
        else:
            lines.append(' '.join(cur))
            cur = [w]
    if cur:
        lines.append(' '.join(cur))
    return lines

def draw_header_meta(draw, page_num, title_ar, title_en):
    # Top bar
    draw.rectangle([(60, 40), (1860, 95)], fill=(20, 24, 30))
    draw.rectangle([(60, 94), (1860, 95)], fill=GOLD_PRIMARY)

    font_badge = get_font(20, arabic=False)
    draw.text((85, 55), f"PAGE 0{page_num} / 07", fill=GOLD_PRIMARY, font=font_badge)
    draw.text((260, 55), "|", fill=(80, 80, 80), font=font_badge)
    draw.text((290, 55), title_en, fill=TEXT_MUTED, font=font_badge)

    font_ar_meta = get_font(22, arabic=True)
    draw.text((1830, 53), ar(title_ar), fill=GOLD_LIGHT, font=font_ar_meta, anchor='ra')

def draw_luxury_borders(draw):
    draw.rectangle([(30, 20), (1890, 1060)], outline=(40, 48, 58), width=1)
    c_len = 25
    for (x1, y1), (x2, y2), (x3, y3) in [
        ((30, 20), (30 + c_len, 20), (30, 20 + c_len)),
        ((1890, 20), (1890 - c_len, 20), (1890, 20 + c_len)),
        ((30, 1060), (30 + c_len, 1060), (30, 1060 - c_len)),
        ((1890, 1060), (1890 - c_len, 1060), (1890, 1060 - c_len))
    ]:
        draw.line([ (x1, y1), (x2, y2) ], fill=GOLD_PRIMARY, width=2)
        draw.line([ (x1, y1), (x3, y3) ], fill=GOLD_PRIMARY, width=2)

# ==============================================================================
# PAGE 1: COVER
# ==============================================================================
def render_page_1():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw)

    # Right side 3D Render / Architectural building
    if os.path.exists('assets/cover.jpg'):
        c_img = Image.open('assets/cover.jpg').convert('RGB')
        c_w, c_h = 980, 980
        c_img_resized = c_img.resize((c_w, int(c_w * c_img.height / c_img.width)), Image.Resampling.LANCZOS)
        if c_img_resized.height > c_h:
            top = (c_img_resized.height - c_h) // 2
            c_img_cropped = c_img_resized.crop((0, top, c_w, top + c_h))
        else:
            c_img_cropped = c_img_resized
        img.paste(c_img_cropped, (880, 50))

        # Soft dark gradient over left edge of image
        grad = Image.new('L', (300, 980))
        for x in range(300):
            alpha = int(255 * (1.0 - x / 300.0))
            for y in range(980):
                grad.putpixel((x, y), alpha)
        shadow = Image.new('RGB', (300, 980), color=BG_DARK)
        img.paste(shadow, (880, 50), mask=grad)

    draw.rectangle([(880, 50), (1860, 1030)], outline=BORDER_GOLD, width=1)

    # Logo
    if os.path.exists('assets/logo.png'):
        logo = Image.open('assets/logo.png')
        logo.thumbnail((320, 110), Image.Resampling.LANCZOS)
        draw.rectangle([(100, 90), (100 + logo.width + 30, 90 + logo.height + 20)], fill=(22, 26, 32), outline=GOLD_PRIMARY, width=1)
        img.paste(logo, (115, 100), mask=logo if logo.mode == 'RGBA' else None)

    # Tagline Pill
    draw.rectangle([(100, 260), (580, 305)], fill=(28, 34, 42), outline=GOLD_PRIMARY, width=1)
    draw.text((120, 273), "COMPANY PROFILE & PORTFOLIO 2026", fill=GOLD_LIGHT, font=get_font(18, arabic=False))

    # Main Engineer Title
    draw.text((780, 340), ar("المهندس محمد سامي هيكل"), fill=TEXT_WHITE, font=get_font(52, arabic=True), anchor='ra')
    draw.text((105, 435), "ENG. MOHAMED SAMI HAIKAL", fill=GOLD_PRIMARY, font=get_font(28, arabic=False))

    # Subtitle
    draw.text((780, 485), ar("تصميم داخلي وتشطيبات متكاملة وحلول معمارية"), fill=GOLD_LIGHT, font=get_font(26, arabic=True), anchor='ra')

    # Executive Overview
    desc_lines = [
        "نبتكر مساحات تجمع بين الفخامة والوظيفية، ونحول الرؤى التصميمية",
        "إلى واقع ملموس بدقة متناهية للمشاريع السكنية، الفندقية، والقطع البحرية."
    ]
    curr_y = 545
    for line in desc_lines:
        draw.text((780, curr_y), ar(line), fill=TEXT_MUTED, font=get_font(20, arabic=True), anchor='ra')
        curr_y += 36

    # 3 Badges
    badges = [
        ("100%", "مطابقة التصميم الواقعي", "3D VISUALIZATION"),
        ("Turnkey", "تسليم مفتاح متكامل", "FIT-OUT EXECUTION"),
        ("Direct", "إشراف هندسي ميداني", "SITE SUPERVISION")
    ]
    bx = 100
    for val, lbl_ar, lbl_en in badges:
        draw.rectangle([(bx, 680), (bx + 215, 785)], fill=(22, 27, 34), outline=BORDER_SUBTLE, width=1)
        draw.text((bx + 107, 705), val, fill=GOLD_PRIMARY, font=get_font(26, arabic=False), anchor='mm')
        draw.text((bx + 200, 740), ar(lbl_ar), fill=TEXT_LIGHT, font=get_font(15, arabic=True), anchor='ra')
        draw.text((bx + 107, 765), lbl_en, fill=TEXT_MUTED, font=get_font(10, arabic=False), anchor='mm')
        bx += 235

    # Bottom Contact Bar
    draw.rectangle([(100, 860), (790, 955)], fill=(18, 22, 28), outline=BORDER_GOLD, width=1)
    draw.text((125, 885), "DIRECT CONTACT & CONSULTATION", fill=GOLD_PRIMARY, font=get_font(14, arabic=False))
    draw.text((125, 915), "+20 10 62628864  |  01094577221  |  mmdsamy3@gmail.com", fill=TEXT_LIGHT, font=get_font(16, arabic=False, sans=True))

    return img

# ==============================================================================
# PAGE 2: ABOUT US & VISION (عن المكتب والرؤية)
# ==============================================================================
def render_page_2():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw)
    draw_header_meta(draw, 2, "عن المكتب والرؤية", "ABOUT US & EXECUTIVE VISION")

    # Left Column: Cleaned Photo of Engineer on site (#image 1#)
    eng_photo = 'assets/optimized/engineer_onsite.jpg'
    if os.path.exists(eng_photo):
        im1 = Image.open(eng_photo).convert('RGB')
        im1_res = im1.resize((680, 890), Image.Resampling.LANCZOS)
        img.paste(im1_res, (80, 130))
        draw.rectangle([(80, 130), (760, 1020)], outline=BORDER_GOLD, width=2)
        # Caption box
        draw.rectangle([(95, 930), (745, 1005)], fill=(13, 16, 19))
        draw.text((725, 945), ar("الإشراف الهندسي المباشر ومناقشة المخططات في الموقع"), fill=TEXT_WHITE, font=get_font(18, arabic=True), anchor='ra')
        draw.text((115, 975), "On-Site Architectural Supervision & Blueprint Execution", fill=GOLD_PRIMARY, font=get_font(13, arabic=False))

    rx = 1840

    # Sub-heading
    draw.text((rx, 145), ar("عن المهندس محمد سامي هيكل"), fill=GOLD_PRIMARY, font=get_font(26, arabic=True), anchor='ra')
    draw.text((820, 185), "INNOVATING LUXURY & FUNCTIONAL LIVING SPACES", fill=TEXT_MUTED, font=get_font(15, arabic=False))

    # Executive Quote Box
    draw.rectangle([(820, 220), (1840, 390)], fill=BG_CARD, outline=BORDER_GOLD, width=1)
    draw.line([(1839, 220), (1839, 390)], fill=GOLD_PRIMARY, width=4)
    quote_lines = [
        "\"نبتكر مساحات تجمع بين الفخامة والوظيفية، ونحول الرؤى التصميمية إلى واقع ملموس",
        "بدقة تنفيذية متناهية. نتمتع بخبرة واسعة في إدارة وتنفيذ مشاريع التشطيبات الفاخرة،",
        "بدءاً من المساحات السكنية والتجارية، وصولاً إلى المشاريع الخاصة والتخصصية كالفنادق والقطع البحرية.\""
    ]
    qy = 250
    for q in quote_lines:
        draw.text((1815, qy), ar(q), fill=TEXT_LIGHT, font=get_font(19, arabic=True), anchor='ra')
        qy += 40

    # Core Values Title
    draw.text((rx, 430), ar("قِيَمُنا الجوهرية في العمل"), fill=GOLD_LIGHT, font=get_font(24, arabic=True), anchor='ra')
    draw.text((820, 435), "CORE VALUES & STANDARDS", fill=TEXT_MUTED, font=get_font(14, arabic=False))

    # 3 Value Cards
    values = [
        ("01", "الدقة في التنفيذ", "PRECISION IN EXECUTION",
         "مطابقة الواقع المنفذ للمخططات والتصاميم الهندسية بدقة تامة، والالتزام بأدق التفاصيل والمواد المعتمدة دون أي خلل."),
        ("02", "السلامة والجودة", "SAFETY & QUALITY STANDARDS",
         "الالتزام بأعلى معايير السلامة المهنية واحترافية فرق العمل بالموقع، وضمان المتانة والجودة القياسية العالمية."),
        ("03", "الإشراف المباشر", "DIRECT SITE SUPERVISION",
         "متابعة ميدانية مستمرة لكافة مراحل التشطيب من المهندس شخصياً، لضمان سير الأعمال طبقاً للمواصفات والجدول الزمني.")
    ]
    vy = 485
    for num, title_ar, title_en, desc_ar in values:
        draw.rectangle([(820, vy), (1840, vy + 155)], fill=BG_SLATE, outline=BORDER_SUBTLE, width=1)
        # Number badge
        draw.rectangle([(845, vy + 38), (925, vy + 118)], fill=(32, 38, 48), outline=GOLD_PRIMARY, width=1)
        draw.text((885, vy + 78), num, fill=GOLD_PRIMARY, font=get_font(28, arabic=False), anchor='mm')

        draw.text((1815, vy + 22), ar(title_ar), fill=TEXT_WHITE, font=get_font(22, arabic=True), anchor='ra')
        draw.text((950, vy + 28), title_en, fill=GOLD_PRIMARY, font=get_font(13, arabic=False))

        # Multi-line wrap
        lines = wrap_ar(desc_ar, get_font(17, arabic=True), 830, draw)
        ly = vy + 68
        for l in lines:
            draw.text((1815, ly), ar(l), fill=TEXT_MUTED, font=get_font(17, arabic=True), anchor='ra')
            ly += 28

        vy += 175

    return img

# ==============================================================================
# PAGE 3: OUR SERVICES & PROCESS (خدماتنا المتكاملة وطريقة العمل)
# ==============================================================================
def render_page_3():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw)
    draw_header_meta(draw, 3, "خدماتنا المتكاملة وطريقة العمل", "COMPREHENSIVE SERVICES & WORKFLOW")

    # 4 Services Cards Row
    services = [
        ("01", "التصميم الداخلي والنمذجة", "Interior & 3D Visualization",
         "تحويل الأفكار إلى مخططات تنفيذية ولقطات واقعية ثلاثية الأبعاد بدقة هندسية عالية تحاكي الواقع تماماً."),
        ("02", "التنفيذ وتسليم المفتاح", "Turnkey Fit-Out Solutions",
         "إدارة وتنفيذ شاملة لكافة أعمال التشطيبات والديكورات والأعمال الكهروميكانيكية بأعلى معايير الإتقان."),
        ("03", "الإشراف الهندسي والميداني", "Engineering & Quality Oversight",
         "ضبط الجودة الصارم والالتزام بالمواصفات القياسية للجودة والسلامة المهنية طوال كافة مراحل العمل."),
        ("04", "المشاريع الخاصة والتخصصية", "Specialized & Marine Fit-Out",
         "تشطيب وتجهيز الفنادق، اليخوت الفاخرة، الغواصات، والمنشآت الرياضية والتجارية المتطورة.")
    ]
    card_w = 420
    card_h = 320
    sx = 80
    for num, title_ar, title_en, desc_ar in services:
        draw.rectangle([(sx, 125), (sx + card_w, 125 + card_h)], fill=BG_CARD, outline=BORDER_GOLD, width=1)
        # Header in card
        draw.rectangle([(sx + 20, 145), (sx + 80, 195)], fill=(32, 38, 48), outline=GOLD_PRIMARY, width=1)
        draw.text((sx + 50, 170), num, fill=GOLD_PRIMARY, font=get_font(22, arabic=False), anchor='mm')
        draw.text((sx + 95, 168), title_en, fill=TEXT_MUTED, font=get_font(13, arabic=False))

        # Title AR
        draw.text((sx + card_w - 20, 215), ar(title_ar), fill=TEXT_WHITE, font=get_font(19, arabic=True), anchor='ra')

        # Desc AR with wrapping
        lines = wrap_ar(desc_ar, get_font(15, arabic=True), card_w - 40, draw)
        dy = 255
        for l in lines:
            draw.text((sx + card_w - 20, dy), ar(l), fill=TEXT_MUTED, font=get_font(15, arabic=True), anchor='ra')
            dy += 26

        sx += 450

    # Middle Section: Work Process
    draw.text((1840, 480), ar("مراحل ومنهجية العمل المتكاملة"), fill=GOLD_PRIMARY, font=get_font(22, arabic=True), anchor='ra')
    draw.text((80, 485), "WORKFLOW & METHODOLOGY (5 PHASES)", fill=TEXT_MUTED, font=get_font(14, arabic=False))

    # 5 Process Steps
    steps = [
        ("1", "المعاينة والدراسة", "Site Survey"),
        ("2", "التصميم ثلاثي الأبعاد", "3D Modeling"),
        ("3", "اختيار الخامات", "Materials"),
        ("4", "التنفيذ الميداني", "Execution"),
        ("5", "التسليم الجاهز", "Turnkey Handover")
    ]
    step_w = 330
    px = 80
    for s_num, s_ar, s_en in steps:
        draw.rectangle([(px, 520), (px + step_w, 610)], fill=BG_SLATE, outline=BORDER_SUBTLE, width=1)
        draw.text((px + 40, 565), s_num, fill=GOLD_PRIMARY, font=get_font(24, arabic=False), anchor='mm')
        draw.text((px + step_w - 20, 545), ar(s_ar), fill=TEXT_WHITE, font=get_font(17, arabic=True), anchor='ra')
        draw.text((px + step_w - 20, 580), s_en, fill=GOLD_LIGHT, font=get_font(13, arabic=False), anchor='ra')
        px += 360

    # Bottom: Cleaned team photos (#image patch 1#)
    draw.text((1840, 650), ar("فرق العمل الميداني بالزي الرسمي والهوية المعتمدة"), fill=GOLD_LIGHT, font=get_font(18, arabic=True), anchor='ra')
    draw.text((80, 655), "FIELD EXECUTION & BRANDED SAFETY VESTS", fill=TEXT_MUTED, font=get_font(13, arabic=False))

    patch_imgs = [
        'assets/optimized/team_1.jpg',
        'assets/optimized/team_2.jpg',
        'assets/optimized/team_3.jpg',
        'assets/optimized/team_4.jpg',
        'assets/optimized/team_5.jpg'
    ]
    im_w, im_h = 330, 310
    ix = 80
    for p_path in patch_imgs:
        if os.path.exists(p_path):
            p_img = Image.open(p_path).convert('RGB')
            p_res = p_img.resize((im_w, im_h), Image.Resampling.LANCZOS)
            img.paste(p_res, (ix, 690))
            draw.rectangle([(ix, 690), (ix + im_w, 690 + im_h)], outline=BORDER_GOLD, width=1)
        ix += 360

    return img

# ==============================================================================
# PAGE 4: HOTEL RENOVATION PROJECT (مشروع تطوير وتجهيز الفندق)
# ==============================================================================
def render_page_4():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw)
    draw_header_meta(draw, 4, "مشروع تطوير وتجهيز الفندق", "HOTEL RENOVATION & TURNKEY FIT-OUT")

    # Title & Text
    draw.text((1840, 125), ar("مشروع تطوير وتجهيز الفندق الفاخر"), fill=GOLD_PRIMARY, font=get_font(26, arabic=True), anchor='ra')
    draw.text((80, 135), "BEFORE & AFTER ARCHITECTURAL TRANSFORMATION", fill=TEXT_MUTED, font=get_font(15, arabic=False))

    quote_hotel = "إعادة إنعاش وتطوير المساحات الفندقية برؤية معمارية حديثة مع مراعاة أعلى درجات الجودة والفينش."
    draw.text((1840, 168), ar(quote_hotel), fill=TEXT_LIGHT, font=get_font(19, arabic=True), anchor='ra')

    before_path = 'assets/2/before/1000187118.jpg'
    after_path = 'assets/optimized/after_suite.jpg'

    # Before Box
    draw.rectangle([(80, 215), (920, 770)], fill=(20, 20, 20), outline=(220, 80, 80), width=2)
    if os.path.exists(before_path):
        b_img = Image.open(before_path).convert('RGB')
        b_res = b_img.resize((840, 555), Image.Resampling.LANCZOS)
        img.paste(b_res, (80, 215))
    # Before Tag
    draw.rectangle([(100, 235), (380, 285)], fill=(180, 40, 40))
    draw.text((120, 260), "BEFORE TRANSFORMATION", fill=TEXT_WHITE, font=get_font(14, arabic=False), anchor='lm')

    # After Box
    draw.rectangle([(980, 215), (1840, 770)], fill=(20, 20, 20), outline=GOLD_PRIMARY, width=2)
    if os.path.exists(after_path):
        a_img = Image.open(after_path).convert('RGB')
        a_res = a_img.resize((860, 555), Image.Resampling.LANCZOS)
        img.paste(a_res, (980, 215))
    # After Tag
    draw.rectangle([(1000, 235), (1300, 285)], fill=GOLD_PRIMARY)
    draw.text((1020, 260), "AFTER LUXURY FIT-OUT", fill=BG_DARK, font=get_font(14, arabic=False), anchor='lm')

    # Bottom Inset Gallery
    draw.text((1840, 795), ar("تفاصيل الغرف الفندقية والحمامات الرخامية المنفذة"), fill=GOLD_LIGHT, font=get_font(18, arabic=True), anchor='ra')
    draw.text((80, 800), "EXECUTIVE SUITES, KING BEDROOMS & MARBLE BATHROOMS", fill=TEXT_MUTED, font=get_font(13, arabic=False))

    inset_imgs = [
        ('assets/optimized/after_bed.jpg', 'غرفة النوم الملكية', 'King Bedroom Suite'),
        ('assets/optimized/after_toilet.jpg', 'الحمام الرخامي المزدوج', 'Luxury Marble Bathroom'),
        ('assets/optimized/after_door.jpg', 'مداخل الأجنحة والأبواب', 'Suite Entrances & Woodwork'),
        ('assets/optimized/after_kingbed.jpg', 'التجهيزات الفندقية والإضاءة', 'Architectural Mood Lighting')
    ]
    ix = 80
    for p_path, cap_ar, cap_en in inset_imgs:
        if os.path.exists(p_path):
            im = Image.open(p_path).convert('RGB')
            im_res = im.resize((410, 195), Image.Resampling.LANCZOS)
            img.paste(im_res, (ix, 830))
            draw.rectangle([(ix, 830), (ix + 410, 830 + 195)], outline=BORDER_GOLD, width=1)
            # caption
            draw.rectangle([(ix, 985), (ix + 410, 1025)], fill=(13, 16, 19))
            draw.text((ix + 395, 1000), ar(cap_ar), fill=TEXT_LIGHT, font=get_font(14, arabic=True), anchor='ra')
            draw.text((ix + 15, 1002), cap_en, fill=GOLD_PRIMARY, font=get_font(11, arabic=False))
        ix += 445

    return img

# ==============================================================================
# PAGE 5: MARINE & SPECIALIZED PROJECTS (المشاريع البحرية والقطاعات الخاصة)
# ==============================================================================
def render_page_5():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw)
    draw_header_meta(draw, 5, "المشاريع البحرية والقطاعات الخاصة", "MARINE & SPECIALIZED CRAFT FIT-OUT")

    # Header & Statement
    draw.text((1840, 125), ar("المشاريع البحرية والقطاعات الخاصة"), fill=GOLD_PRIMARY, font=get_font(26, arabic=True), anchor='ra')
    draw.text((80, 135), "BESPOKE YACHT & SUBMARINE INTERIOR FIT-OUTS", fill=TEXT_MUTED, font=get_font(15, arabic=False))

    quote_marine = "تنفيذ وتجهيز الديكورات والتعديلات الداخلية لليخوت والغواصات وفقاً لمعايير الأمان ومقاومة العوامل البحرية، مع الحفاظ على أقصى درجات الفخامة واستغلال المساحات."
    draw.text((1840, 168), ar(quote_marine), fill=TEXT_LIGHT, font=get_font(18, arabic=True), anchor='ra')

    vessels = [
        ('يخت فاخر متميز', 'LUXURY YACHT 01', 'assets/3/يخت ١/WhatsApp Image 2026-09-18 at 8.21.26 PM (1).jpeg',
         'تجهيز الصالونات وأخشاب التيك البحرية المعالجة ضد الرطوبة والأملاح مع مقاعد جلدية فاخرة.'),
        ('يخت سياحي متطور', 'SUPERYACHT 02', 'assets/3/يخت ٢/WhatsApp Image 2026-09-18 at 8.42.33 PM.jpeg',
         'تجديد الطوابق الخارجية والديكورات العصرية المقاومة للمياه والاهتزازات مع أنظمة إضاءة حديثة.'),
        ('يخت بحري خاص', 'MARINE CRAFT 03', 'assets/3/يخت ٣/WhatsApp Image 2026-09-18 at 8.26.03 PM (10).jpeg',
         'تشطيب الكبائن الداخلية وتوزيع الأثاث المدمج لاستغلال المساحات بأعلى كفاءة هندسية ممكنة.'),
        ('الغواصة المتخصصة', 'SPECIALIZED SUBMARINE', 'assets/3/غواصه/WhatsApp Image 2026-09-18 at 8.26.03 PM.jpeg',
         'تجهيز المقصورة الداخلية وفقاً لمعايير الأمان والسلامة ومقاومة الضغط والعوامل البحرية القاسية.')
    ]

    card_w = 420
    card_h = 760
    vx = 80
    for title_ar, title_en, path, desc_ar in vessels:
        draw.rectangle([(vx, 225), (vx + card_w, 225 + card_h)], fill=BG_CARD, outline=BORDER_GOLD, width=1)
        if os.path.exists(path):
            v_img = Image.open(path).convert('RGB')
            v_res = v_img.resize((card_w, 480), Image.Resampling.LANCZOS)
            img.paste(v_res, (vx, 225))
            draw.rectangle([(vx, 225), (vx + card_w, 225 + 480)], outline=BORDER_GOLD, width=1)

        # Body
        draw.text((vx + card_w - 20, 730), ar(title_ar), fill=GOLD_LIGHT, font=get_font(21, arabic=True), anchor='ra')
        draw.text((vx + 20, 736), title_en, fill=TEXT_MUTED, font=get_font(12, arabic=False))

        # Desc wrap
        lines = wrap_ar(desc_ar, get_font(15, arabic=True), card_w - 40, draw)
        dy = 775
        for l in lines:
            draw.text((vx + card_w - 20, dy), ar(l), fill=TEXT_LIGHT, font=get_font(15, arabic=True), anchor='ra')
            dy += 26

        # Feature Tag at bottom
        draw.rectangle([(vx + 20, 910), (vx + card_w - 20, 965)], fill=BG_SLATE, outline=BORDER_SUBTLE, width=1)
        draw.text((vx + card_w - 35, 925), ar("معايير السلامة ومقاومة الأملاح والرطوبة"), fill=GOLD_PRIMARY, font=get_font(13, arabic=True), anchor='ra')
        draw.text((vx + 35, 945), "Marine-Grade Craftsmanship", fill=TEXT_MUTED, font=get_font(11, arabic=False))

        vx += 450

    return img

# ==============================================================================
# PAGE 6: COMMERCIAL & SPORTS SPACES (المساحات الرياضية والتجارية)
# ==============================================================================
def render_page_6():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw)
    draw_header_meta(draw, 6, "المساحات الرياضية والتجارية", "COMMERCIAL & FITNESS STUDIO DESIGN")

    # Header & Statement
    draw.text((1840, 125), ar("تصميم وتجهيز المساحات الرياضية والتجارية"), fill=GOLD_PRIMARY, font=get_font(26, arabic=True), anchor='ra')
    draw.text((80, 135), "FITNESS STUDIO 3D ARCHITECTURAL RENDERING & 2D LAYOUT PLAN", fill=TEXT_MUTED, font=get_font(14, arabic=False))

    quote_comm = "تصميم استوديو رياضي عصري يراعي توزيع الحركة، الإضاءة الفعالة، والتحفيز البصري، مع دمج الهوية المعمارية والوظيفية."
    draw.text((1840, 168), ar(quote_comm), fill=TEXT_LIGHT, font=get_font(18, arabic=True), anchor='ra')

    persp_path = 'assets/optimized/gym_perspective.jpg'
    plan_path = 'assets/optimized/gym_plan.jpg'

    # Left: 3D Perspective
    draw.rectangle([(80, 215), (980, 780)], fill=(20, 20, 20), outline=BORDER_GOLD, width=1)
    if os.path.exists(persp_path):
        p_img = Image.open(persp_path).convert('RGB')
        p_res = p_img.resize((900, 565), Image.Resampling.LANCZOS)
        img.paste(p_res, (80, 215))
    draw.rectangle([(100, 235), (460, 285)], fill=(13, 16, 19), outline=GOLD_PRIMARY, width=1)
    draw.text((120, 260), "3D PHOTOREALISTIC PERSPECTIVE", fill=GOLD_PRIMARY, font=get_font(14, arabic=False), anchor='lm')

    # Right: 2D Zoning Plan
    draw.rectangle([(1020, 215), (1840, 780)], fill=(20, 20, 20), outline=BORDER_GOLD, width=1)
    if os.path.exists(plan_path):
        pl_img = Image.open(plan_path).convert('RGB')
        pl_res = pl_img.resize((820, 565), Image.Resampling.LANCZOS)
        img.paste(pl_res, (1020, 215))
    draw.rectangle([(1040, 235), (1390, 285)], fill=(13, 16, 19), outline=GOLD_PRIMARY, width=1)
    draw.text((1060, 260), "2D ARCHITECTURAL ZONING PLAN", fill=GOLD_PRIMARY, font=get_font(14, arabic=False), anchor='lm')

    # Bottom Architectural Specifications Matrix
    specs = [
        ("توزيع الحركة والانسيابية", "Zoning & Circulation", "تحديد مسارات حركة مريحة بين مناطق التدريب لمنع التكدس."),
        ("الإضاءة المعمارية التحفيزية", "Motivational Lighting", "إضاءة هندسية تعزز الطاقة البصرية وتبرز الهوية الرياضية."),
        ("عوازل الصوت والأرضيات", "Acoustic & Impact Flooring", "أرضيات مطاطية خاصة تمتص الصدمات والأصوات الناتجة عن الأوزان."),
        ("الهوية المعمارية والوظيفية", "Brand Identity & Function", "دمج الهوية البصرية العصرية مع الاستغلال الأمثل لكافة المساحات.")
    ]
    sp_w = 420
    spx = 80
    for sp_ar, sp_en, sp_desc in specs:
        draw.rectangle([(spx, 810), (spx + sp_w, 1020)], fill=BG_SLATE, outline=BORDER_SUBTLE, width=1)
        draw.text((spx + sp_w - 20, 840), ar(sp_ar), fill=GOLD_LIGHT, font=get_font(18, arabic=True), anchor='ra')
        draw.text((spx + 20, 843), sp_en, fill=TEXT_MUTED, font=get_font(12, arabic=False))

        lines = wrap_ar(sp_desc, get_font(15, arabic=True), sp_w - 40, draw)
        dy = 890
        for l in lines:
            draw.text((spx + sp_w - 20, dy), ar(l), fill=TEXT_LIGHT, font=get_font(15, arabic=True), anchor='ra')
            dy += 26

        spx += 450

    return img

# ==============================================================================
# PAGE 7: CONTACT US (لنبدأ مشروعك القادم)
# ==============================================================================
def render_page_7():
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_luxury_borders(draw)
    draw_header_meta(draw, 7, "تواصل معنا", "LET'S BUILD YOUR VISION")

    # Center Brand Plate
    draw.rectangle([(540, 140), (1380, 480)], fill=BG_CARD, outline=BORDER_GOLD, width=2)
    draw.line([(540, 140), (1380, 140)], fill=GOLD_PRIMARY, width=4)

    # Logo
    if os.path.exists('assets/logo.png'):
        logo = Image.open('assets/logo.png')
        logo.thumbnail((260, 95), Image.Resampling.LANCZOS)
        lx = (WIDTH - logo.width) // 2
        img.paste(logo, (lx, 170), mask=logo if logo.mode == 'RGBA' else None)

    # Title Name
    draw.text((960, 310), ar("المهندس محمد سامي هيكل"), fill=TEXT_WHITE, font=get_font(40, arabic=True), anchor='mm')
    draw.text((960, 365), "ENG. MOHAMED SAMI HAIKAL", fill=GOLD_PRIMARY, font=get_font(22, arabic=False), anchor='mm')
    draw.text((960, 410), ar("تصميم داخلي وتشطيبات متكاملة وتسليم مفتاح"), fill=GOLD_LIGHT, font=get_font(20, arabic=True), anchor='mm')
    draw.text((960, 445), "Interior Design & Turnkey Fit-Out Solutions", fill=TEXT_MUTED, font=get_font(14, arabic=False), anchor='mm')

    # Main Action Call
    draw.text((960, 520), ar("لنبدأ مشروعك القادم معاً"), fill=TEXT_WHITE, font=get_font(28, arabic=True), anchor='mm')
    draw.text((960, 560), ar("يسعدنا تقديم استشارة هندسية متكاملة وتحويل رؤيتكم إلى واقع فخم يفوق التوقعات"), fill=TEXT_MUTED, font=get_font(18, arabic=True), anchor='mm')

    # 4 Contact Cards Grid
    contacts = [
        ("الواتساب المباشر", "DIRECT WHATSAPP", "+20 10 62628864", "متاح على مدار الساعة للمحادثات الفورية والاستفسارات"),
        ("الاتصال الهاتفي", "DIRECT PHONE CALL", "01094577221", "للتواصل الهاتفي المباشر وتنسيق مواعيد المعاينات"),
        ("البريد الإلكتروني", "OFFICIAL EMAIL", "mmdsamy3@gmail.com", "لاستقبال المخططات ودراسات الجدوى وعروض الأسعار"),
        ("حساب انستجرام", "INSTAGRAM PROFILE", "@mohamed_samy_design", "لمشاهدة أحدث مقاطع الفيديو والأعمال الميدانية")
    ]

    card_w = 420
    card_h = 165
    positions = [
        (510, 615), (990, 615),
        (510, 810), (990, 810)
    ]
    for (t_ar, t_en, val, sub), (cx, cy) in zip(contacts, positions):
        draw.rectangle([(cx, cy), (cx + card_w, cy + card_h)], fill=BG_SLATE, outline=BORDER_GOLD, width=1)
        draw.text((cx + card_w - 20, cy + 28), ar(t_ar), fill=GOLD_LIGHT, font=get_font(17, arabic=True), anchor='ra')
        draw.text((cx + 25, cy + 30), t_en, fill=TEXT_MUTED, font=get_font(12, arabic=False))
        draw.text((cx + 25, cy + 78), val, fill=TEXT_WHITE, font=get_font(20, arabic=False, sans=True))
        draw.text((cx + card_w - 20, cy + 125), ar(sub), fill=TEXT_MUTED, font=get_font(13, arabic=True), anchor='ra')

    # Bottom Copyright
    draw.text((960, 1010), "ENG. MOHAMED SAMI HAIKAL © 2026 | ALL RIGHTS RESERVED | LUXURY ARCHITECTURAL FIT-OUT", fill=TEXT_MUTED, font=get_font(13, arabic=False), anchor='mm')

    return img

def main():
    print("Generating 7-Page Landscape Company Profile PDF (Enhanced Layout)...")
    pages = [
        render_page_1(),
        render_page_2(),
        render_page_3(),
        render_page_4(),
        render_page_5(),
        render_page_6(),
        render_page_7(),
    ]

    output_pdf = "Mohamed_Samy_Haikal_Company_Profile.pdf"
    print(f"Saving all 7 landscape pages to {output_pdf}...")
    pages[0].save(
        output_pdf,
        save_all=True,
        append_images=pages[1:],
        resolution=150.0,
        quality=95
    )
    size_mb = os.path.getsize(output_pdf) / (1024 * 1024)
    print(f"SUCCESS: Generated {output_pdf} ({size_mb:.2f} MB, {len(pages)} pages).")

    # Update preview images
    os.makedirs('assets/previews', exist_ok=True)
    for idx, p in enumerate(pages, start=1):
        path = f'assets/previews/page_{idx}.jpg'
        p.save(path, 'JPEG', quality=92)
        print(f"Updated preview: {path}")

if __name__ == '__main__':
    main()
