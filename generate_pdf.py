"""
Generate the redesigned AI Pitch Decoder PDF.
Design inspired by editorial/magazine layouts with bold typography.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Paragraph, Frame, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# ── Colors ──────────────────────────────────────────────
BG_LIGHT = HexColor("#f5f4f0")       # warm off-white page background
BG_DARK  = HexColor("#141413")       # near-black for dark sections
GOLD     = HexColor("#a1835d")       # LuminaQ accent
GOLD_LIGHT = HexColor("#c4a97a")     # lighter gold
TEXT_DARK = HexColor("#141413")      # primary text
TEXT_MID  = HexColor("#555555")      # body text
TEXT_LIGHT = HexColor("#888888")     # muted
TEXT_WHITE = HexColor("#f0f0f0")
RED_FLAG = HexColor("#c0392b")       # red flag color
GREEN_OK = HexColor("#27754a")       # green/good color
YELLOW_W = HexColor("#b8860b")       # yellow/warning
BORDER_LIGHT = HexColor("#d4d2ca")   # subtle border

W, H = A4  # 595.28 x 841.89 points
MARGIN_L = 55
MARGIN_R = 55
MARGIN_T = 70
MARGIN_B = 60
CONTENT_W = W - MARGIN_L - MARGIN_R

# ── Font Registration ───────────────────────────────────
# Try to register system fonts; fall back to Helvetica/Times
def register_fonts():
    font_dirs = [
        "C:/Windows/Fonts",
        os.path.expanduser("~/AppData/Local/Microsoft/Windows/Fonts"),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts"),
    ]

    fonts_to_try = {
        "Inter": ["Inter-Regular.ttf", "Inter-Light.ttf", "Inter-Medium.ttf", "Inter-Bold.ttf", "Inter-SemiBold.ttf"],
        "Playfair": ["PlayfairDisplay-Regular.ttf", "PlayfairDisplay-Bold.ttf", "PlayfairDisplay-Italic.ttf", "PlayfairDisplay-BoldItalic.ttf"],
    }

    registered = {}

    for font_family, filenames in fonts_to_try.items():
        for filename in filenames:
            for d in font_dirs:
                path = os.path.join(d, filename)
                if os.path.exists(path):
                    name = filename.replace(".ttf", "").replace("-", "")
                    try:
                        pdfmetrics.registerFont(TTFont(name, path))
                        registered[name] = True
                    except:
                        pass

    return registered

registered = register_fonts()

# Font name helpers
def has_font(name):
    return name in registered

SERIF = "PlayfairDisplayRegular" if has_font("PlayfairDisplayRegular") else "Times-Roman"
SERIF_BOLD = "PlayfairDisplayBold" if has_font("PlayfairDisplayBold") else "Times-Bold"
SERIF_ITALIC = "PlayfairDisplayItalic" if has_font("PlayfairDisplayItalic") else "Times-Italic"
SERIF_BOLD_ITALIC = "PlayfairDisplayBoldItalic" if has_font("PlayfairDisplayBoldItalic") else "Times-BoldItalic"
SANS = "InterRegular" if has_font("InterRegular") else "Helvetica"
SANS_LIGHT = "InterLight" if has_font("InterLight") else "Helvetica"
SANS_MEDIUM = "InterMedium" if has_font("InterMedium") else "Helvetica"
SANS_BOLD = "InterBold" if has_font("InterBold") else "Helvetica-Bold"
SANS_SEMI = "InterSemiBold" if has_font("InterSemiBold") else "Helvetica-Bold"


class PDFBuilder:
    def __init__(self, filename):
        self.c = canvas.Canvas(filename, pagesize=A4)
        self.c.setTitle("The AI Pitch Decoder - LuminaQ")
        self.c.setAuthor("Satish Rohit Singh")
        self.page_num = 0

    def new_page(self, bg_color=BG_LIGHT):
        if self.page_num > 0:
            self.c.showPage()
        self.page_num += 1
        # Background
        self.c.setFillColor(bg_color)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)

    def footer(self, dark=False):
        color = TEXT_LIGHT if not dark else HexColor("#555555")
        self.c.setFillColor(color)
        self.c.setFont(SANS_LIGHT, 8)
        self.c.drawString(MARGIN_L, 30, "luminaq.ae")
        self.c.drawRightString(W - MARGIN_R, 30, f"Page {self.page_num}")
        # thin line
        self.c.setStrokeColor(BORDER_LIGHT if not dark else HexColor("#333333"))
        self.c.setLineWidth(0.5)
        self.c.line(MARGIN_L, 42, W - MARGIN_R, 42)

    def draw_text(self, x, y, text, font=None, size=10, color=TEXT_DARK, max_width=None):
        font = font or SANS
        self.c.setFont(font, size)
        self.c.setFillColor(color)
        if max_width:
            # Simple word wrap
            words = text.split()
            lines = []
            current = ""
            for word in words:
                test = current + " " + word if current else word
                if self.c.stringWidth(test, font, size) <= max_width:
                    current = test
                else:
                    if current:
                        lines.append(current)
                    current = word
            if current:
                lines.append(current)
            for i, line in enumerate(lines):
                self.c.drawString(x, y - i * (size * 1.4), line)
            return y - len(lines) * (size * 1.4)
        else:
            self.c.drawString(x, y, text)
            return y - size * 1.4

    def draw_para(self, x, y, text, font=None, size=10, color=TEXT_DARK, width=None, leading=None):
        """Draw wrapped paragraph using Platypus Paragraph."""
        font = font or SANS
        width = width or CONTENT_W
        leading = leading or size * 1.5
        style = ParagraphStyle(
            'custom',
            fontName=font,
            fontSize=size,
            textColor=color,
            leading=leading,
            spaceAfter=0,
        )
        p = Paragraph(text, style)
        pw, ph = p.wrap(width, 1000)
        p.drawOn(self.c, x, y - ph)
        return y - ph

    def draw_gold_line(self, x, y, width=80):
        self.c.setStrokeColor(GOLD)
        self.c.setLineWidth(2)
        self.c.line(x, y, x + width, y)

    def draw_dark_band(self, y, height):
        """Draw a full-width dark band."""
        self.c.setFillColor(BG_DARK)
        self.c.rect(0, y, W, height, fill=1, stroke=0)

    # ── PAGE: Cover ─────────────────────────────────────
    def page_cover(self):
        self.new_page(BG_LIGHT)

        # Top gold accent bar
        self.c.setFillColor(GOLD)
        self.c.rect(MARGIN_L, H - 45, 60, 3, fill=1, stroke=0)

        # Logo text
        self.c.setFont(SANS_MEDIUM, 11)
        self.c.setFillColor(TEXT_LIGHT)
        # Small "LUMINAQ" at top
        self.c.setFillColor(GOLD)
        self.c.setFont(SANS, 13)
        self.c.drawString(MARGIN_L, H - 75, "L U M I N A Q")

        # Main title - editorial style with emphasis word
        y = H - 160
        self.c.setFillColor(TEXT_DARK)
        self.c.setFont(SERIF_BOLD, 48)
        self.c.drawString(MARGIN_L, y, "THE AI")
        y -= 58
        self.c.setFont(SERIF_BOLD, 48)
        self.c.drawString(MARGIN_L, y, "Pitch Decoder.")

        # Gold underline
        y -= 20
        self.draw_gold_line(MARGIN_L, y, 100)

        # Subtitle
        y -= 45
        self.c.setFont(SANS_LIGHT, 14)
        self.c.setFillColor(TEXT_MID)
        self.c.drawString(MARGIN_L, y, "10 Questions That Separate Real AI")
        y -= 22
        self.c.drawString(MARGIN_L, y, "Innovation from Expensive Demos")

        # Tag line in a bordered box
        y -= 55
        self.c.setStrokeColor(BORDER_LIGHT)
        self.c.setLineWidth(1)
        self.c.setFillColor(HexColor("#edecea"))
        self.c.roundRect(MARGIN_L, y - 10, CONTENT_W, 40, 2, fill=1, stroke=1)
        self.c.setFont(SANS_MEDIUM, 11)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L + 15, y + 8, "A Guide for Non-Technical Investors")

        # Author section at bottom
        y = 180
        self.c.setStrokeColor(BORDER_LIGHT)
        self.c.setLineWidth(0.5)
        self.c.line(MARGIN_L, y + 20, MARGIN_L + 200, y + 20)

        self.c.setFont(SANS_SEMI, 12)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y - 5, "Satish Rohit Singh")

        self.c.setFont(SANS_LIGHT, 9.5)
        self.c.setFillColor(TEXT_LIGHT)
        self.c.drawString(MARGIN_L, y - 22, "Founder | AI Expert & Mentor | Group Head \u2013 AI & Data Science")

        self.c.setFont(SANS_MEDIUM, 10)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, y - 45, "luminaq.ae")

    # ── PAGE: The Problem ───────────────────────────────
    def page_problem(self):
        self.new_page(BG_LIGHT)
        self.footer()

        # Header
        self.c.setFont(SANS, 9)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, H - MARGIN_T, "L U M I N A Q")

        y = H - 130

        # Big editorial headline
        self.c.setFont(SERIF_BOLD, 42)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "THE problem.")

        y -= 45
        self.draw_gold_line(MARGIN_L, y, 60)

        # Quote block with left gold bar
        y -= 35
        self.c.setFillColor(GOLD)
        self.c.rect(MARGIN_L, y - 55, 3, 65, fill=1, stroke=0)

        quote = (
            "\u201cYou\u2019re in the pitch meeting. The founder says "
            "\u2018fine-tuned LLM with proprietary embeddings.\u2019 "
            "You nod. You understand nothing.\u201d"
        )
        self.draw_para(MARGIN_L + 18, y + 8, f"<i>{quote}</i>",
                       font=SERIF_ITALIC, size=11, color=TEXT_MID,
                       width=CONTENT_W - 20, leading=16)

        # Body text
        y -= 80
        body = (
            "If this sounds familiar, you\u2019re not alone. Most angel investors "
            "and family offices face the same challenge:"
        )
        y = self.draw_para(MARGIN_L, y, body, font=SANS, size=10.5,
                          color=TEXT_MID, width=CONTENT_W, leading=16)

        # Arrow list
        y -= 12
        arrows = [
            "Evaluating cutting-edge AI claims without a technical background",
            "No CTO on speed dial to validate founder claims",
            "Investment decisions based on vibes, decks, and demo energy",
            "The asymmetry: founders know more than you, and they know it",
        ]
        for item in arrows:
            self.c.setFont(SANS, 10)
            self.c.setFillColor(GOLD)
            self.c.drawString(MARGIN_L + 8, y, "\u2192")
            self.c.setFillColor(TEXT_MID)
            y = self.draw_para(MARGIN_L + 28, y + 3, item, font=SANS, size=10,
                              color=TEXT_MID, width=CONTENT_W - 30, leading=15)
            y -= 6

        # "The result?" heading
        y -= 15
        self.c.setFont(SANS_BOLD, 12)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "The result?")

        # Stats band - dark
        y -= 30
        band_h = 70
        self.c.setFillColor(BG_DARK)
        self.c.roundRect(MARGIN_L, y - band_h + 15, CONTENT_W, band_h, 2, fill=1, stroke=0)

        stats = [("$200B", "Wasted yearly on AI hype"), ("85%", "Of AI startups fail to deliver"), ("18mo", "Average runway before pivot")]
        col_w = CONTENT_W / 3
        for i, (num, label) in enumerate(stats):
            cx = MARGIN_L + col_w * i + col_w / 2
            self.c.setFont(SERIF_BOLD, 22)
            self.c.setFillColor(TEXT_WHITE)
            self.c.drawCentredString(cx, y - 18, num)
            self.c.setFont(SANS_LIGHT, 8)
            self.c.setFillColor(HexColor("#999999"))
            self.c.drawCentredString(cx, y - 35, label)

        # CTA line
        y -= band_h - 15
        y -= 25
        self.c.setFont(SERIF_BOLD, 14)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, y, "This guide changes that.")

    # ── PAGE: How to Use ────────────────────────────────
    def page_how_to_use(self):
        self.new_page(BG_LIGHT)
        self.footer()

        self.c.setFont(SANS, 9)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, H - MARGIN_T, "L U M I N A Q")

        y = H - 130
        self.c.setFont(SERIF_BOLD, 42)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "HOW to use")
        y -= 50
        self.c.drawString(MARGIN_L, y, "this guide.")

        y -= 25
        self.draw_gold_line(MARGIN_L, y, 60)

        # Steps - editorial numbered layout
        steps = [
            ("01", "Review Before Any AI Pitch", "Read through the 10 questions before or after any AI startup pitch meeting."),
            ("02", "Ask Each Question", "Use these questions during your evaluation. Note the quality and specificity of each response."),
            ("03", "Score Each Area", "Rate each response: Green (strong), Yellow (needs more info), or Red (warning sign)."),
            ("04", "Make Confident Decisions", "Use the scorecard at the back to compile your assessment and make evidence-based decisions."),
        ]

        y -= 40
        for num, title, desc in steps:
            # Number in large serif
            self.c.setFont(SERIF_BOLD, 28)
            self.c.setFillColor(GOLD)
            self.c.drawString(MARGIN_L, y - 5, num)

            # Title
            self.c.setFont(SANS_SEMI, 12)
            self.c.setFillColor(TEXT_DARK)
            self.c.drawString(MARGIN_L + 55, y, title)

            # Description
            self.draw_para(MARGIN_L + 55, y - 16, desc, font=SANS_LIGHT, size=9.5,
                          color=TEXT_LIGHT, width=CONTENT_W - 60, leading=14)

            # Separator line
            y -= 65
            self.c.setStrokeColor(BORDER_LIGHT)
            self.c.setLineWidth(0.5)
            self.c.line(MARGIN_L, y + 15, W - MARGIN_R, y + 15)

        # Decision rule box
        y -= 15
        self.c.setFillColor(HexColor("#fdf2f0"))
        self.c.roundRect(MARGIN_L, y - 45, CONTENT_W, 55, 2, fill=1, stroke=0)
        # Red left bar
        self.c.setFillColor(RED_FLAG)
        self.c.rect(MARGIN_L, y - 45, 4, 55, fill=1, stroke=0)

        self.c.setFont(SANS_BOLD, 10)
        self.c.setFillColor(RED_FLAG)
        self.c.drawString(MARGIN_L + 18, y - 5, "\u26A0  DECISION RULE")

        self.c.setFont(SANS, 10)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L + 18, y - 25, "3 or more Red Flags = Walk away, or get expert review before proceeding. No exceptions.")

    # ── PAGE: Question Template ─────────────────────────
    def page_question(self, num, question, why_text, good_answer, good_checks, red_flags, followup):
        self.new_page(BG_LIGHT)
        self.footer()

        # Header
        self.c.setFont(SANS, 9)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, H - MARGIN_T, "L U M I N A Q")

        y = H - MARGIN_T

        # Dark number band
        band_y = y - 45
        self.c.setFillColor(BG_DARK)
        self.c.roundRect(MARGIN_L, band_y, 55, 35, 2, fill=1, stroke=0)
        self.c.setFont(SERIF_BOLD, 20)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawCentredString(MARGIN_L + 27.5, band_y + 9, f"{num:02d}")

        # "QUESTION XX" label
        self.c.setFont(SANS, 8.5)
        self.c.setFillColor(TEXT_LIGHT)
        label_text = f"Q U E S T I O N  {num:02d}"
        self.c.drawString(MARGIN_L + 65, band_y + 13, label_text)

        # Question text - big serif
        y = band_y - 18
        style = ParagraphStyle(
            'question',
            fontName=SERIF_BOLD,
            fontSize=18,
            textColor=TEXT_DARK,
            leading=25,
        )
        p = Paragraph(f"\u201c{question}\u201d", style)
        pw, ph = p.wrap(CONTENT_W, 200)
        p.drawOn(self.c, MARGIN_L, y - ph)
        y -= ph

        # Gold separator
        y -= 10
        self.c.setStrokeColor(GOLD)
        self.c.setLineWidth(1)
        self.c.line(MARGIN_L, y, W - MARGIN_R, y)

        # WHY IT MATTERS
        y -= 22
        self.c.setFont(SANS_BOLD, 8.5)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "W H Y   I T   M A T T E R S")

        y -= 8
        y = self.draw_para(MARGIN_L, y, why_text, font=SANS, size=9.5,
                          color=TEXT_MID, width=CONTENT_W, leading=14.5)

        # GOOD ANSWER box
        y -= 15
        box_top = y

        # Calculate box height dynamically
        style_italic = ParagraphStyle('gi', fontName=SERIF_ITALIC if has_font("PlayfairDisplayItalic") else "Times-Italic",
                                       fontSize=9, textColor=TEXT_MID, leading=13)
        p_answer = Paragraph(f"\u201c{good_answer}\u201d", style_italic)
        aw, ah = p_answer.wrap(CONTENT_W - 40, 300)

        checks_height = len(good_checks) * 16
        box_h = ah + checks_height + 50

        self.c.setFillColor(HexColor("#f0efeb"))
        self.c.roundRect(MARGIN_L, y - box_h + 15, CONTENT_W, box_h, 2, fill=1, stroke=0)

        # Green header
        self.c.setFont(SANS_BOLD, 9)
        self.c.setFillColor(GREEN_OK)
        self.c.drawString(MARGIN_L + 15, y - 2, "\u2705  GOOD ANSWER SOUNDS LIKE")

        y -= 20
        p_answer.drawOn(self.c, MARGIN_L + 15, y - ah)
        y -= ah + 8

        for check in good_checks:
            self.c.setFont(SANS, 8.5)
            self.c.setFillColor(GREEN_OK)
            self.c.drawString(MARGIN_L + 15, y, "\u2713")
            self.c.setFillColor(TEXT_MID)
            self.c.drawString(MARGIN_L + 30, y, check)
            y -= 16

        # RED FLAGS box
        y -= 12
        rf_h = len(red_flags) * 16 + 35
        self.c.setFillColor(HexColor("#fdf5f4"))
        self.c.roundRect(MARGIN_L, y - rf_h + 20, CONTENT_W, rf_h, 2, fill=1, stroke=0)
        # Red left bar
        self.c.setFillColor(RED_FLAG)
        self.c.rect(MARGIN_L, y - rf_h + 20, 4, rf_h, fill=1, stroke=0)

        self.c.setFont(SANS_BOLD, 9)
        self.c.setFillColor(RED_FLAG)
        self.c.drawString(MARGIN_L + 15, y + 2, "\u26A0  RED FLAGS")

        y -= 14
        for flag in red_flags:
            self.c.setFont(SANS, 8.5)
            self.c.setFillColor(RED_FLAG)
            self.c.drawString(MARGIN_L + 15, y, "\u2717")
            self.c.setFillColor(TEXT_MID)
            self.c.drawString(MARGIN_L + 30, y, flag)
            y -= 16

        # Follow-up
        y -= 12
        self.c.setFillColor(HexColor("#f7f6f2"))
        self.c.roundRect(MARGIN_L, y - 25, CONTENT_W, 35, 2, fill=1, stroke=0)
        self.c.setFillColor(GOLD)
        self.c.rect(MARGIN_L, y - 25, 4, 35, fill=1, stroke=0)

        self.c.setFont(SANS_BOLD, 8.5)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L + 15, y + 1, "FOLLOW-UP:")
        fw = self.c.stringWidth("FOLLOW-UP:  ", SANS_BOLD, 8.5)
        self.draw_para(MARGIN_L + 15 + fw, y + 4, f"<i>\u201c{followup}\u201d</i>",
                      font=SERIF_ITALIC if has_font("PlayfairDisplayItalic") else "Times-Italic",
                      size=8.5, color=TEXT_MID, width=CONTENT_W - 40 - fw, leading=13)

    # ── PAGE: Scorecard ─────────────────────────────────
    def page_scorecard(self):
        self.new_page(BG_LIGHT)
        self.footer()

        self.c.setFont(SANS, 9)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, H - MARGIN_T, "L U M I N A Q")

        y = H - 130
        self.c.setFont(SERIF_BOLD, 36)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "THE scorecard.")

        y -= 20
        self.draw_gold_line(MARGIN_L, y, 60)

        # Fields
        y -= 30
        self.c.setFont(SANS_BOLD, 10)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "Startup:")
        self.c.setStrokeColor(BORDER_LIGHT)
        self.c.setLineWidth(0.5)
        self.c.line(MARGIN_L + 55, y - 2, MARGIN_L + 300, y - 2)

        y -= 22
        self.c.drawString(MARGIN_L, y, "Date:")
        self.c.line(MARGIN_L + 40, y - 2, MARGIN_L + 180, y - 2)

        # Table
        y -= 30
        rows = [
            ("1", "AI vs. Rules"),
            ("2", "Training Data"),
            ("3", "Core Dependency / Defensibility"),
            ("4", "Accuracy Metrics"),
            ("5", "Failure Cases"),
            ("6", "Technical Moat"),
            ("7", "Build Time / Maturity"),
            ("8", "Unit Economics"),
            ("9", "Team Depth"),
            ("10", "Customer References"),
        ]

        # Header row
        col_widths = [35, 250, 65, 65, 65]
        header_h = 25
        row_h = 22

        # Dark header
        self.c.setFillColor(BG_DARK)
        self.c.rect(MARGIN_L, y - header_h, sum(col_widths), header_h, fill=1, stroke=0)

        headers = ["#", "Question Area", "Green", "Yellow", "Red"]
        hx = MARGIN_L
        for i, (hdr, cw) in enumerate(zip(headers, col_widths)):
            self.c.setFont(SANS_BOLD, 8)
            self.c.setFillColor(TEXT_WHITE)
            if i >= 2:
                self.c.drawCentredString(hx + cw / 2, y - header_h + 8, hdr)
            else:
                self.c.drawString(hx + 8, y - header_h + 8, hdr)
            hx += cw

        y -= header_h

        for i, (num, area) in enumerate(rows):
            bg = HexColor("#f0efeb") if i % 2 == 0 else BG_LIGHT
            self.c.setFillColor(bg)
            self.c.rect(MARGIN_L, y - row_h, sum(col_widths), row_h, fill=1, stroke=0)

            rx = MARGIN_L
            self.c.setFont(SANS_SEMI, 9)
            self.c.setFillColor(GOLD)
            self.c.drawString(rx + 10, y - row_h + 7, num)
            rx += col_widths[0]

            self.c.setFont(SANS, 9)
            self.c.setFillColor(TEXT_DARK)
            self.c.drawString(rx + 8, y - row_h + 7, area)
            rx += col_widths[1]

            for j in range(3):
                self.c.setFont(SANS, 10)
                self.c.setFillColor(TEXT_LIGHT)
                self.c.drawCentredString(rx + col_widths[2 + j] / 2, y - row_h + 7, "\u25CB")
                rx += col_widths[2 + j]

            y -= row_h

        # Totals row
        self.c.setFillColor(BG_DARK)
        self.c.rect(MARGIN_L, y - row_h, sum(col_widths), row_h, fill=1, stroke=0)
        self.c.setFont(SANS_BOLD, 9)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawRightString(MARGIN_L + col_widths[0] + col_widths[1] - 5, y - row_h + 7, "TOTALS")
        rx = MARGIN_L + col_widths[0] + col_widths[1]
        for j in range(3):
            self.c.drawCentredString(rx + col_widths[2 + j] / 2, y - row_h + 7, "___")
            rx += col_widths[2 + j]
        y -= row_h

        # Notes section
        y -= 20
        self.c.setFont(SANS_BOLD, 10)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "NOTES:")
        y -= 15
        for _ in range(3):
            self.c.setStrokeColor(BORDER_LIGHT)
            self.c.setLineWidth(0.5)
            self.c.line(MARGIN_L, y, W - MARGIN_R, y)
            y -= 20

        # Decision framework box
        y -= 10
        self.c.setFillColor(HexColor("#f0efeb"))
        self.c.roundRect(MARGIN_L, y - 65, CONTENT_W, 70, 2, fill=1, stroke=0)

        self.c.setFont(SANS_BOLD, 9)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L + 15, y - 8, "DECISION FRAMEWORK")

        decisions = [
            (GREEN_OK, "7+ Greens", "Strong candidate \u2014 proceed with standard due diligence"),
            (YELLOW_W, "4\u20136 Greens", "Needs deeper technical due diligence before proceeding"),
            (RED_FLAG, "3+ Reds", "Walk away or get expert review \u2014 no exceptions"),
        ]
        dy = y - 25
        for color, label, desc in decisions:
            self.c.setFont(SANS_BOLD, 9)
            self.c.setFillColor(color)
            self.c.drawString(MARGIN_L + 15, dy, label)
            self.c.setFont(SANS, 9)
            self.c.setFillColor(TEXT_MID)
            self.c.drawString(MARGIN_L + 100, dy, f"\u2192  {desc}")
            dy -= 16

        # Verdict
        y -= 90
        self.c.setFont(SANS_BOLD, 12)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "VERDICT:")

        verdicts = [("\u25A1 PASS", GREEN_OK), ("\u25A1 INVESTIGATE", YELLOW_W), ("\u25A1 NO", RED_FLAG)]
        vx = MARGIN_L + 80
        for label, color in verdicts:
            self.c.setFont(SANS_BOLD, 11)
            self.c.setFillColor(color)
            self.c.drawString(vx, y, label)
            vx += 120

    # ── PAGE: Quick Reference ───────────────────────────
    def page_quick_ref(self):
        self.new_page(BG_LIGHT)
        self.footer()

        self.c.setFont(SANS, 9)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, H - MARGIN_T, "L U M I N A Q")

        y = H - 125
        self.c.setFont(SERIF_BOLD, 34)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "QUICK reference.")

        y -= 18
        self.draw_gold_line(MARGIN_L, y, 60)

        items = [
            ("01", "Why AI, not rules?", "AI necessity & genuine ML value", "\u201cAI is just better\u201d with no specifics"),
            ("02", "Training data source?", "Data moat & legal compliance", "\u201cWe scraped it from the internet\u201d"),
            ("03", "What if Google ships this?", "Defensibility beyond the model", "Dismisses platform risk entirely"),
            ("04", "Accuracy metrics?", "Technical rigor & honest measurement", "Only reports vague \u201caccuracy\u201d"),
            ("05", "When does the AI fail?", "Honesty & operational maturity", "\u201cIt doesn\u2019t really fail\u201d"),
            ("06", "What\u2019s the technical moat?", "Barriers to replication", "Moat is \u201cour secret algorithm\u201d"),
            ("07", "Prototype to product timeline?", "Engineering depth & technical debt", "\u201cBuilt it in a weekend\u201d for complex product"),
            ("08", "Unit economics at scale?", "Path to profitability", "\u201cWe\u2019ll figure out margins later\u201d"),
            ("09", "Who\u2019s shipped production ML?", "Team capability vs. credentials", "All PhDs, no production experience"),
            ("10", "6-month customer reference?", "Real-world validation", "Makes excuses about NDA restrictions"),
        ]

        y -= 25
        for num, title, tests, red_flag in items:
            # Number
            self.c.setFont(SERIF_BOLD, 18)
            self.c.setFillColor(GOLD)
            self.c.drawString(MARGIN_L, y - 5, num)

            # Title
            self.c.setFont(SANS_SEMI, 10)
            self.c.setFillColor(TEXT_DARK)
            self.c.drawString(MARGIN_L + 42, y, title)

            # Tests
            self.c.setFont(SANS, 8)
            self.c.setFillColor(TEXT_LIGHT)
            self.c.drawString(MARGIN_L + 42, y - 14, f"Tests: {tests}")

            # Key red flag
            self.c.setFont(SANS_BOLD, 8)
            self.c.setFillColor(RED_FLAG)
            krf_label = "Key red flag: "
            self.c.drawString(MARGIN_L + 42, y - 27, krf_label)
            kw = self.c.stringWidth(krf_label, SANS_BOLD, 8)
            self.c.setFont(SANS, 8)
            self.c.setFillColor(TEXT_MID)
            self.c.drawString(MARGIN_L + 42 + kw, y - 27, red_flag)

            y -= 52
            # Separator
            self.c.setStrokeColor(BORDER_LIGHT)
            self.c.setLineWidth(0.3)
            self.c.line(MARGIN_L + 42, y + 15, W - MARGIN_R, y + 15)

        # Pro tip
        y -= 5
        self.c.setFillColor(HexColor("#f7f3ee"))
        self.c.roundRect(MARGIN_L, y - 35, CONTENT_W, 42, 2, fill=1, stroke=0)
        self.c.setFillColor(GOLD)
        self.c.rect(MARGIN_L, y - 35, 4, 42, fill=1, stroke=0)

        self.c.setFont(SANS_BOLD, 8.5)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L + 15, y - 2, "PRO TIP:")
        self.draw_para(MARGIN_L + 15, y - 13,
                      "Question #5 (failure cases) is the single best honesty test. If a founder can\u2019t show you where the AI fails, they haven\u2019t tested it properly\u2014or they\u2019re hiding something.",
                      font=SANS, size=8, color=TEXT_MID, width=CONTENT_W - 35, leading=12)

    # ── PAGE: About ─────────────────────────────────────
    def page_about(self):
        self.new_page(BG_LIGHT)
        self.footer()

        self.c.setFont(SANS, 9)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, H - MARGIN_T, "L U M I N A Q")

        y = H - 130
        self.c.setFont(SERIF_BOLD, 36)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "ABOUT the author.")

        y -= 20
        self.draw_gold_line(MARGIN_L, y, 60)

        y -= 35
        self.c.setFont(SANS_BOLD, 14)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "Satish Rohit Singh")

        y -= 18
        self.c.setFont(SANS_LIGHT, 10)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, y, "Founder | AI Expert & Mentor | Group Head \u2013 AI & Data Science")

        y -= 25
        bio = (
            "With 15+ years of AI, Data Science, Platform Modernization, Enterprise IT and Data Architecture "
            "experience, Satish bridges the gap between complex AI technology and practical business decisions. "
            "As founder of LuminaQ, he provides technical due diligence services specifically designed for "
            "investors who need to evaluate AI startups without a technical co-founder on speed dial."
        )
        y = self.draw_para(MARGIN_L, y, bio, font=SANS, size=10, color=TEXT_MID,
                          width=CONTENT_W, leading=16)

        y -= 10
        approach = (
            "His approach is simple: strip away the jargon, test the claims, and give investors "
            "a clear verdict they can act on."
        )
        y = self.draw_para(MARGIN_L, y, approach, font=SANS, size=10, color=TEXT_MID,
                          width=CONTENT_W, leading=16)

        # Credentials
        y -= 25
        self.c.setFont(SANS_BOLD, 8.5)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "C R E D E N T I A L S")

        y -= 15
        creds = [
            "Corporate AI Mentor for Emirates Institute of Finance, Vinsys, Mindworx, Simplilearn, and The Knowledge Academy",
            "AI educator with a growing YouTube and Instagram following focused on practical AI expertise",
            "15+ years in enterprise data architecture and machine learning infrastructure",
            "Published research in Springer Nature on XAI (Explainable AI)",
            "Based in Abu Dhabi, serving investors across the GCC and globally",
        ]
        for cred in creds:
            self.c.setFont(SANS, 9)
            self.c.setFillColor(GOLD)
            self.c.drawString(MARGIN_L + 5, y + 1, "\u2192")
            y = self.draw_para(MARGIN_L + 22, y + 3, cred, font=SANS, size=9,
                              color=TEXT_MID, width=CONTENT_W - 25, leading=14)
            y -= 8

        # Connect
        y -= 20
        self.c.setFont(SANS_BOLD, 8.5)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "C O N N E C T")

        y -= 18
        connects = [("Web:", "luminaq.ae"), ("YouTube:", "AI Education & Insights"), ("LinkedIn:", "Satish Rohit Singh")]
        for label, value in connects:
            self.c.setFont(SANS_BOLD, 9)
            self.c.setFillColor(GOLD)
            self.c.drawString(MARGIN_L, y, label)
            lw = self.c.stringWidth(label + "  ", SANS_BOLD, 9)
            self.c.setFont(SANS, 9)
            self.c.setFillColor(TEXT_MID)
            self.c.drawString(MARGIN_L + lw, y, value)
            y -= 18

    # ── PAGE: What's Next ───────────────────────────────
    def page_whats_next(self):
        self.new_page(BG_LIGHT)
        self.footer()

        self.c.setFont(SANS, 9)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L, H - MARGIN_T, "L U M I N A Q")

        y = H - 130
        self.c.setFont(SERIF_BOLD, 38)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L, y, "WHAT\u2019S next.")

        y -= 20
        self.draw_gold_line(MARGIN_L, y, 60)

        y -= 30
        self.draw_para(MARGIN_L, y,
                      "You now have a framework most angel investors never get. Here\u2019s how to use it:",
                      font=SANS, size=11, color=TEXT_MID, width=CONTENT_W, leading=17)

        # Path A - bordered card
        y -= 45
        self.c.setFillColor(HexColor("#ffffff"))
        self.c.setStrokeColor(BORDER_LIGHT)
        self.c.setLineWidth(1)
        self.c.roundRect(MARGIN_L, y - 85, CONTENT_W, 90, 2, fill=1, stroke=1)
        self.c.setFillColor(TEXT_DARK)
        self.c.rect(MARGIN_L, y - 85, 4, 90, fill=1, stroke=0)

        self.c.setFont(SANS_BOLD, 10)
        self.c.setFillColor(TEXT_DARK)
        self.c.drawString(MARGIN_L + 18, y - 10, "PATH A:  DO IT YOURSELF")

        self.draw_para(MARGIN_L + 18, y - 28,
                      "Use this scorecard on your next 3 AI pitches. You\u2019ll be shocked how quickly you start spotting patterns you used to miss.",
                      font=SANS, size=9.5, color=TEXT_MID, width=CONTENT_W - 40, leading=15)

        self.c.setFont(SANS_LIGHT, 9)
        self.c.setFillColor(TEXT_LIGHT)
        self.c.drawString(MARGIN_L + 18, y - 65, "Print the scorecard. Bring it to meetings. Take notes. The questions do the heavy lifting.")

        # Path B - dark card
        y -= 115
        self.c.setFillColor(BG_DARK)
        self.c.roundRect(MARGIN_L, y - 105, CONTENT_W, 110, 2, fill=1, stroke=0)

        self.c.setFont(SANS_BOLD, 9)
        self.c.setFillColor(GOLD)
        self.c.drawString(MARGIN_L + 18, y - 15, "PATH B:  GET EXPERT BACKUP")

        self.c.setFont(SANS_SEMI, 10.5)
        self.c.setFillColor(TEXT_WHITE)
        self.c.drawString(MARGIN_L + 18, y - 35, "Want a second opinion on a specific deal?")

        self.draw_para(MARGIN_L + 18, y - 52,
                      "Book a 45-minute Pitch Audit. I\u2019ll review the deck with you, ask the questions founders hate, and give you a straight verdict.",
                      font=SANS_LIGHT, size=9.5, color=HexColor("#bbbbbb"), width=CONTENT_W - 40, leading=14)

        # CTA button
        btn_w = 200
        btn_h = 32
        btn_x = MARGIN_L + 18
        btn_y = y - 95
        self.c.setFillColor(GOLD)
        self.c.roundRect(btn_x, btn_y, btn_w, btn_h, 16, fill=1, stroke=0)
        self.c.setFont(SANS_BOLD, 9.5)
        self.c.setFillColor(white)
        self.c.drawCentredString(btn_x + btn_w / 2, btn_y + 10, "BOOK A PITCH AUDIT  \u2192")

        self.c.setFont(SANS_LIGHT, 8)
        self.c.setFillColor(HexColor("#777777"))
        self.c.drawString(btn_x, btn_y - 15, "luminaq.ae")

        # Bottom note
        y -= 150
        self.c.setFont(SERIF_ITALIC if has_font("PlayfairDisplayItalic") else "Times-Italic", 11)
        self.c.setFillColor(TEXT_LIGHT)
        self.c.drawString(MARGIN_L, y, "Questions? Reach out directly \u2014 I read every message.")

    # ── PAGE: Back Cover ────────────────────────────────
    def page_back_cover(self):
        self.new_page(BG_LIGHT)

        # Centered content
        cy = H / 2 + 40

        self.c.setFont(SERIF_BOLD, 18)
        self.c.setFillColor(GOLD)
        self.c.drawCentredString(W / 2, cy, "THE AI PITCH DECODER")

        # Gold line
        cy -= 25
        self.c.setStrokeColor(GOLD)
        self.c.setLineWidth(1)
        self.c.line(W / 2 - 40, cy, W / 2 + 40, cy)

        cy -= 30
        self.c.setFont(SANS, 13)
        self.c.setFillColor(GOLD)
        self.c.drawCentredString(W / 2, cy, "L U M I N A Q")

        cy -= 25
        self.c.setFont(SANS_LIGHT, 9)
        self.c.setFillColor(TEXT_LIGHT)
        self.c.drawCentredString(W / 2, cy, "luminaq.ae")

        cy -= 35
        self.c.setFont(SANS_LIGHT, 8)
        self.c.setFillColor(TEXT_LIGHT)
        self.c.drawCentredString(W / 2, cy, "\u00A9 2026 Satish Rohit Singh. All rights reserved.")

    def build(self):
        # Cover
        self.page_cover()

        # The Problem
        self.page_problem()

        # How to Use
        self.page_how_to_use()

        # 10 Questions
        questions = [
            {
                "num": 1,
                "q": "What specifically does your AI do that couldn\u2019t be done with a simple rule-based system?",
                "why": "Many startups label basic automation as \u201cAI\u201d to justify higher valuations. This question forces founders to articulate genuine machine learning value\u2014where the system learns, adapts, or handles complexity beyond what static rules can manage. If the answer is vague, the AI might just be a wrapper around simple if/then logic.",
                "good": "Our system processes unstructured radiology reports and identifies 47 anomaly patterns that evolve as new data comes in. A rule-based system would need manual updates for each new pattern\u2014we\u2019ve already adapted to 12 new patterns without human intervention.",
                "checks": ["Specific examples of learning/adaptation", "Quantified complexity that rules can\u2019t handle", "Clear articulation of where ML adds value"],
                "reds": ["\u201cOur AI is just better\u201d with no specifics", "Can\u2019t explain why ML is needed vs. simple automation", "The \u201cAI\u201d is essentially a decision tree or lookup table"],
                "follow": "Can you show me a specific case where the AI handled something a rule-based system would have missed?",
            },
            {
                "num": 2,
                "q": "Where does your training data come from, and do you have the right to use it?",
                "why": "Data is the foundation of any AI system. If the training data is scraped without permission, biased, or too small, the AI\u2019s outputs will be unreliable. Legal exposure from improperly sourced data can destroy a company post-investment. This is the most common hidden liability in AI startups.",
                "good": "We have licensing agreements with three hospital networks covering 2.1 million anonymized records. Our data team includes a compliance officer who audits every new data source against GDPR and HIPAA requirements.",
                "checks": ["Named data sources with clear licensing", "Documented compliance processes", "Sufficient volume and diversity of training data"],
                "reds": ["\u201cWe scraped it from the internet\u201d", "Vague about data sources or licensing", "Training set is suspiciously small for the claims being made"],
                "follow": "Can I see your data licensing agreements and compliance documentation?",
            },
            {
                "num": 3,
                "q": "If OpenAI or Google released a similar feature tomorrow, what happens to your business?",
                "why": "This tests the startup\u2019s true defensibility. If a major platform could replicate their core offering in a single release, the investment is essentially a bet that big tech won\u2019t notice the opportunity\u2014a bet you\u2019ll usually lose. The best AI startups have moats that go deeper than the model itself.",
                "good": "Our moat isn\u2019t the model\u2014it\u2019s 4 years of proprietary data from our 200+ enterprise clients, plus deep workflow integration that took 18 months to build per vertical. Google could build a similar model, but they\u2019d need to replicate our data pipeline and industry relationships.",
                "checks": ["Acknowledges the threat honestly", "Points to moats beyond the model (data, distribution, integration)", "Has a clear answer, not a deflection"],
                "reds": ["Dismisses the threat entirely (\u201cGoogle doesn\u2019t care about our space\u201d)", "Moat is solely \u201cfirst mover advantage\u201d", "Claims proprietary technology they can\u2019t explain"],
                "follow": "Walk me through what a competitor would need to replicate\u2014not just the model, but the full product.",
            },
            {
                "num": 4,
                "q": "What are your model\u2019s accuracy metrics, and how do you measure them?",
                "why": "Accuracy without context is meaningless. A model that\u2019s 95% accurate sounds great until you learn the baseline (random guessing) is 90%. Understanding how metrics are measured\u2014precision, recall, F1, against what benchmark\u2014separates real AI from marketing AI.",
                "good": "On our test set of 50,000 labeled examples, we achieve 94.2% precision and 91.7% recall for fraud detection. The industry baseline using rule-based systems is 78% precision. We measure against a held-out test set that\u2019s refreshed quarterly.",
                "checks": ["Specific numbers, not ranges", "Multiple metrics (not just \u201caccuracy\u201d)", "Comparison to a meaningful baseline"],
                "reds": ["Only reports \u201caccuracy\u201d with no context", "Can\u2019t explain what the metrics mean practically", "Numbers change when you ask twice"],
                "follow": "What does a false positive cost your customer, and what does a false negative cost?",
            },
            {
                "num": 5,
                "q": "When does your AI fail, and what happens when it does?",
                "why": "This is the honesty test. Every AI system fails\u2014the question is whether the team knows where, how often, and what they\u2019ve done about it. A founder who can\u2019t describe failure modes either hasn\u2019t tested properly or isn\u2019t being straight with you. Both are disqualifying.",
                "good": "We see degraded performance with handwritten inputs\u2014accuracy drops to about 72%. We\u2019ve built a confidence scoring system that flags low-confidence outputs for human review. About 8% of cases go to manual review currently.",
                "checks": ["Specific failure scenarios described openly", "Confidence scoring or fallback systems in place", "Quantified failure rates"],
                "reds": ["\u201cIt doesn\u2019t really fail\u201d", "No monitoring or fallback system described", "Gets defensive when pressed on edge cases"],
                "follow": "Can you show me your error monitoring dashboard and how you handle edge cases in production?",
            },
            {
                "num": 6,
                "q": "What is your technical moat\u2014what would it take for a well-funded competitor to catch up?",
                "why": "This forces specificity about defensibility. Time, data, and domain expertise are real moats. \u201cOur team is really smart\u201d is not. You want to understand the specific barriers to replication, measured in months/years and dollars.",
                "good": "Replicating our system would require roughly 3 years of domain-specific data collection from 200+ manufacturing plants, regulatory approvals in 6 jurisdictions, and a team that understands both ML and industrial process engineering\u2014a combination that\u2019s extremely rare to hire for.",
                "checks": ["Quantified time/cost to replicate", "Multiple reinforcing moats (data + domain + distribution)", "Realistic assessment, not bravado"],
                "reds": ["Moat is \u201cour proprietary algorithm\u201d with no elaboration", "Claims years of lead time but product launched 6 months ago", "Can\u2019t articulate barriers beyond team talent"],
                "follow": "If I gave a strong team $10M and 18 months, where would they still fall short?",
            },
            {
                "num": 7,
                "q": "How long did it take to go from prototype to working product, and what were the hardest engineering challenges?",
                "why": "This reveals technical honesty and maturity. If the team spent 2 years on a seemingly simple product, there are either deep technical challenges (good) or deep technical debt (bad). The nature of the challenges tells you whether the team has genuine ML expertise or is duct-taping APIs together.",
                "good": "Prototype took 3 months, but getting to production-grade accuracy took 14 months. The hardest parts were reducing inference latency below 200ms for real-time use and handling the long tail of edge cases in medical terminology.",
                "checks": ["Honest timeline with specific challenges", "Engineering challenges relate to real ML problems", "Clear distinction between prototype and production quality"],
                "reds": ["\u201cWe built it in a weekend hackathon\u201d for a complex product", "Challenges are all business-related, none technical", "Vague about engineering specifics"],
                "follow": "What\u2019s the biggest technical compromise you\u2019ve made, and what would you do differently with more resources?",
            },
            {
                "num": 8,
                "q": "What are your unit economics for AI inference, and how do they scale?",
                "why": "AI infrastructure is expensive. GPU costs, API fees, and data processing can eat margins alive\u2014especially as usage scales. If a startup can\u2019t tell you what each API call or prediction costs, they haven\u2019t thought about profitability at scale.",
                "good": "Each prediction costs us $0.003 in compute. We charge customers $0.15 per prediction, giving us a 98% gross margin on inference. At 10x current volume, our per-unit cost drops to $0.001 due to batching optimizations.",
                "checks": ["Specific per-unit cost figures", "Clear relationship between cost and pricing", "Understanding of how costs change at scale"],
                "reds": ["\u201cWe\u2019ll figure out margins later\u201d", "Reliance on third-party API pricing they don\u2019t control (e.g., OpenAI)", "No awareness of GPU/compute costs"],
                "follow": "What happens to your margins if your primary compute provider raises prices by 50%?",
            },
            {
                "num": 9,
                "q": "Who on your team has actually built and deployed ML models in production before?",
                "why": "Research ML and production ML are vastly different disciplines. A team of PhDs who\u2019ve only published papers may struggle with the messy reality of production systems. You want at least one person who\u2019s shipped a real ML system that serves real users at scale.",
                "good": "Our CTO spent 5 years at Stripe building their fraud detection pipeline that processes 10M transactions daily. Our Head of ML previously led the recommendation system at Spotify for 3 years, serving 400M users.",
                "checks": ["Named individuals with specific production ML experience", "Experience at companies known for ML excellence", "Track record of shipping, not just researching"],
                "reds": ["All credentials are academic (PhDs, papers published)", "ML experience is limited to tutorials or Kaggle competitions", "\u201cWe\u2019re hiring our ML lead\u201d (meaning they don\u2019t have one yet)"],
                "follow": "Can I speak directly with your technical lead about the architecture decisions they\u2019ve made?",
            },
            {
                "num": 10,
                "q": "Can you connect me with a customer who\u2019s been using the product for at least 6 months?",
                "why": "This is the ultimate validation test. If a startup can\u2019t produce a single reference customer with meaningful tenure, the product either doesn\u2019t work well enough to retain users, or it\u2019s too new to have been truly validated. Six months is the minimum to reveal real-world performance issues.",
                "good": "Absolutely. I\u2019ll connect you with our VP of Operations at Acme Corp\u2014they\u2019ve been live for 11 months and recently expanded from one department to company-wide deployment. They can speak to both implementation challenges and ROI.",
                "checks": ["Immediate willingness to share references", "Customers with 6+ months of usage", "References who can speak to measurable outcomes"],
                "reds": ["Only offers very recent customers (< 3 months)", "Makes excuses about NDA restrictions", "\u201cOur customers are too busy to talk\u201d"],
                "follow": "I\u2019d like to speak with a customer who almost churned or had a difficult implementation\u2014can you share that reference too?",
            },
        ]

        for q in questions:
            self.page_question(q["num"], q["q"], q["why"], q["good"], q["checks"], q["reds"], q["follow"])

        # Scorecard
        self.page_scorecard()

        # Quick Reference
        self.page_quick_ref()

        # About
        self.page_about()

        # What's Next
        self.page_whats_next()

        # Back Cover
        self.page_back_cover()

        self.c.save()
        print(f"PDF generated: {self.page_num} pages")


if __name__ == "__main__":
    output = r"c:\Work\Personal Projects\luminaq\public\ai-pitch-decoder-v2.pdf"
    builder = PDFBuilder(output)
    builder.build()
    print(f"Saved to: {output}")
