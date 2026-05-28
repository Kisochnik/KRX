import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const OTP_TTL_MS = 5 * 60 * 1000;

// In-memory store for codes (for a real app, use Redis or a DB)
const otpStore = new Map<string, { code: string; expires: number }>();

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function buildEmailHtml(code: string, email: string): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Код подтверждения KVARON_X</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #060608; font-family: 'Space Grotesk', sans-serif; color: #ffffff; }
  </style>
</head>
<body style="background:#060608; padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">

          <!-- Logo header -->
          <tr>
            <td style="padding-bottom: 32px; text-align: center;">
              <div style="display:inline-block; border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding: 10px 20px; background: rgba(255,255,255,0.04);">
                <span style="font-family:'Space Mono',monospace; font-size:13px; font-weight:700; letter-spacing:0.25em; color:rgba(255,255,255,0.9); text-transform:uppercase;">KVARON_X</span>
              </div>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 40px 36px; backdrop-filter: blur(20px);">

              <!-- Top accent line -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom: 32px;">
                    <div style="height:1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);"></div>
                  </td>
                </tr>

                <!-- Icon + title -->
                <tr>
                  <td style="padding-bottom: 8px; text-align: center;">
                    <div style="display:inline-block; width:52px; height:52px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius:14px; line-height:52px; font-size:22px; margin-bottom:16px;">
                      🔐
                    </div>
                    <h1 style="font-family:'Space Grotesk',sans-serif; font-size:22px; font-weight:700; color:#ffffff; letter-spacing:-0.02em; margin-top:8px;">
                      Подтверждение почты
                    </h1>
                    <p style="font-size:13px; color:rgba(255,255,255,0.45); margin-top:6px; line-height:1.5;">
                      Код подтверждения для <span style="color:rgba(255,255,255,0.7);">${email}</span>
                    </p>
                  </td>
                </tr>

                <!-- Code block -->
                <tr>
                  <td style="padding: 28px 0;">
                    <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 28px; text-align: center;">
                      <p style="font-family:'Space Mono',monospace; font-size:11px; letter-spacing:0.2em; color:rgba(255,255,255,0.3); text-transform:uppercase; margin-bottom:14px;">
                        Ваш код
                      </p>
                      <div style="font-family:'Space Mono',monospace; font-size:42px; font-weight:700; letter-spacing:0.15em; color:#ffffff; line-height:1;">
                        ${code.slice(0, 3)}&thinsp;${code.slice(3)}
                      </div>
                      <p style="font-size:11px; color:rgba(255,255,255,0.25); margin-top:14px; font-family:'Space Mono',monospace; letter-spacing:0.1em; text-transform:uppercase;">
                        Действует 5 минут
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Warning -->
                <tr>
                  <td style="padding-bottom: 24px;">
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 14px 16px;">
                      <p style="font-size:12px; color:rgba(255,255,255,0.35); line-height:1.6;">
                        ⚠️ &nbsp;Если вы не запрашивали этот код — проигнорируйте письмо. Никому не сообщайте код, включая сотрудников KVARON_X.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Bottom accent line -->
                <tr>
                  <td>
                    <div style="height:1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);"></div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="font-family:'Space Mono',monospace; font-size:10px; letter-spacing:0.15em; color:rgba(255,255,255,0.2); text-transform:uppercase;">
                KVARON_X · Premium Social · ${new Date().getFullYear()}
              </p>
              <p style="font-size:11px; color:rgba(255,255,255,0.15); margin-top:6px;">
                Это автоматическое письмо. Не отвечайте на него.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, purpose = "register" } = body as { email: string; purpose?: string };

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ success: false, error: "Неверный формат email." }, { status: 400 });
    }

    const code = generate6DigitCode();
    const key = email.trim().toLowerCase();
    otpStore.set(key, { code, expires: Date.now() + OTP_TTL_MS });

    // Auto-cleanup after expiry
    setTimeout(() => otpStore.delete(key), OTP_TTL_MS + 1000);

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      // Dev fallback: return code in response (remove in production!)
      console.warn("[KVARON_X] EMAIL_USER or EMAIL_PASS not set. Code:", code);
      return NextResponse.json({
        success: true,
        dev: true,
        code, // only in dev/no-SMTP mode
        message: "Код сгенерирован (SMTP не настроен — код в ответе для разработки).",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });

    const subjectMap: Record<string, string> = {
      register: "Код подтверждения KVARON_X",
      recovery: "Восстановление пароля KVARON_X",
    };

    await transporter.sendMail({
      from: `"KVARON_X" <${emailUser}>`,
      to: email.trim(),
      subject: subjectMap[purpose] ?? "Код подтверждения KVARON_X",
      html: buildEmailHtml(code, email.trim()),
    });

    return NextResponse.json({ success: true, message: "Код отправлен на вашу почту." });
  } catch (err) {
    console.error("[send-code]", err);
    return NextResponse.json({ success: false, error: "Ошибка при отправке письма." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Verify endpoint (called from client to check code)
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const code = searchParams.get("code");

  if (!email || !code) {
    return NextResponse.json({ success: false, error: "Не передан email или код." }, { status: 400 });
  }

  const entry = otpStore.get(email);
  if (!entry) return NextResponse.json({ success: false, error: "Код не найден или уже использован." }, { status: 404 });
  if (Date.now() > entry.expires) {
    otpStore.delete(email);
    return NextResponse.json({ success: false, error: "Срок действия кода истёк." }, { status: 410 });
  }
  if (entry.code !== code) {
    return NextResponse.json({ success: false, error: "Неверный код." }, { status: 401 });
  }

  otpStore.delete(email);
  return NextResponse.json({ success: true });
}
