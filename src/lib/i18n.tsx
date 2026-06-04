import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ua" | "ru";

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  en: {
    "app.tagline": "Next-generation social network",
    "nav.feed": "Feed",
    "nav.news": "News",
    "nav.notifications": "Notifications",
    "nav.friends": "Friends",
    "nav.messages": "Messages",
    "nav.games": "Games",
    "nav.music": "Music",
    "nav.shop": "Shop",
    "nav.profile": "Profile",
    "nav.bookmarks": "Bookmarks",
    "nav.settings": "Settings",
    "auth.login": "Sign in",
    "auth.register": "Create account",
    "auth.logout": "Log out",
    "auth.email_or_nick": "Nickname or Email",
    "auth.password": "Password",
    "auth.forgot": "Forgot password?",
    "auth.no_account": "Don't have an account?",
    "auth.have_account": "Already have an account?",
    "auth.nickname": "Nickname",
    "auth.email": "Email",
    "auth.phone": "Phone",
    "auth.birthday": "Date of birth",
    "auth.continue": "Continue",
    "auth.or": "or continue with",
    "auth.recover": "Recover password",
    "auth.choose_method": "Choose how to receive your code",
    "auth.code": "6-digit code",
    "auth.new_password": "New password",
    "auth.confirm_password": "Confirm password",
    "feed.for_you": "For you",
    "feed.following": "Following",
    "feed.live": "KRX Live",
    "feed.compose": "What's happening?",
    "feed.post": "Post",
    "common.search": "Search",
    "common.send": "Send",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.online": "online",
    "landing.cta": "Enter KRX",
    "landing.subtitle": "A minimalist home for your conversations, creators, and communities.",
    "landing.feature1.t": "Pure focus",
    "landing.feature1.d": "Black canvas, white type. Nothing between you and the signal.",
    "landing.feature2.t": "Everything in one",
    "landing.feature2.d": "Feed, chats, music, games and a store — under one roof.",
    "landing.feature3.t": "Built for speed",
    "landing.feature3.d": "Fluid animations, instant navigation, zero clutter.",
  },
  ua: {
    "app.tagline": "Соціальна мережа нового покоління",
    "nav.feed": "Стрічка",
    "nav.news": "Новини",
    "nav.notifications": "Сповіщення",
    "nav.friends": "Друзі",
    "nav.messages": "Повідомлення",
    "nav.games": "Ігри",
    "nav.music": "Музика",
    "nav.shop": "Магазин",
    "nav.profile": "Профіль",
    "nav.bookmarks": "Закладки",
    "nav.settings": "Налаштування",
    "auth.login": "Увійти",
    "auth.register": "Створити акаунт",
    "auth.logout": "Вийти",
    "auth.email_or_nick": "Нікнейм або Email",
    "auth.password": "Пароль",
    "auth.forgot": "Забули пароль?",
    "auth.no_account": "Немає акаунту?",
    "auth.have_account": "Вже маєте акаунт?",
    "auth.nickname": "Нікнейм",
    "auth.email": "Email",
    "auth.phone": "Телефон",
    "auth.birthday": "Дата народження",
    "auth.continue": "Продовжити",
    "auth.or": "або увійдіть через",
    "auth.recover": "Відновити пароль",
    "auth.choose_method": "Оберіть спосіб отримання коду",
    "auth.code": "6-значний код",
    "auth.new_password": "Новий пароль",
    "auth.confirm_password": "Підтвердьте пароль",
    "feed.for_you": "Для вас",
    "feed.following": "Підписки",
    "feed.live": "KRX Live",
    "feed.compose": "Що нового?",
    "feed.post": "Опублікувати",
    "common.search": "Пошук",
    "common.send": "Надіслати",
    "common.save": "Зберегти",
    "common.cancel": "Скасувати",
    "common.online": "онлайн",
    "landing.cta": "Увійти до KRX",
    "landing.subtitle": "Мінімалістичний простір для розмов, авторів і спільнот.",
    "landing.feature1.t": "Чистий фокус",
    "landing.feature1.d": "Чорне полотно, білий шрифт. Нічого зайвого між вами та сигналом.",
    "landing.feature2.t": "Все в одному",
    "landing.feature2.d": "Стрічка, чати, музика, ігри та магазин — під одним дахом.",
    "landing.feature3.t": "Створено для швидкості",
    "landing.feature3.d": "Плавні анімації, миттєва навігація, нуль зайвого.",
  },
  ru: {
    "app.tagline": "Социальная сеть нового поколения",
    "nav.feed": "Лента",
    "nav.news": "Новости",
    "nav.notifications": "Уведомления",
    "nav.friends": "Друзья",
    "nav.messages": "Сообщения",
    "nav.games": "Игры",
    "nav.music": "Музыка",
    "nav.shop": "Магазин",
    "nav.profile": "Профиль",
    "nav.bookmarks": "Закладки",
    "nav.settings": "Настройки",
    "auth.login": "Войти",
    "auth.register": "Создать аккаунт",
    "auth.logout": "Выйти",
    "auth.email_or_nick": "Никнейм или Email",
    "auth.password": "Пароль",
    "auth.forgot": "Забыли пароль?",
    "auth.no_account": "Нет аккаунта?",
    "auth.have_account": "Уже есть аккаунт?",
    "auth.nickname": "Никнейм",
    "auth.email": "Email",
    "auth.phone": "Телефон",
    "auth.birthday": "Дата рождения",
    "auth.continue": "Продолжить",
    "auth.or": "или войдите через",
    "auth.recover": "Восстановить пароль",
    "auth.choose_method": "Выберите способ получения кода",
    "auth.code": "6-значный код",
    "auth.new_password": "Новый пароль",
    "auth.confirm_password": "Подтвердите пароль",
    "feed.for_you": "Для вас",
    "feed.following": "Подписки",
    "feed.live": "KRX Live",
    "feed.compose": "Что нового?",
    "feed.post": "Опубликовать",
    "common.search": "Поиск",
    "common.send": "Отправить",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.online": "онлайн",
    "landing.cta": "Войти в KRX",
    "landing.subtitle": "Минималистичный дом для разговоров, авторов и сообществ.",
    "landing.feature1.t": "Чистый фокус",
    "landing.feature1.d": "Чёрный холст, белый шрифт. Ничего между вами и сигналом.",
    "landing.feature2.t": "Всё в одном",
    "landing.feature2.d": "Лента, чаты, музыка, игры и магазин — под одной крышей.",
    "landing.feature3.t": "Создан для скорости",
    "landing.feature3.d": "Плавные анимации, мгновенная навигация, ноль лишнего.",
  },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("krx_lang") as Lang)) || null;
    if (saved && ["en", "ua", "ru"].includes(saved)) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("krx_lang", l);
  };

  const t = (key: string) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
