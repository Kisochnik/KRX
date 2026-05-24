export type Locale = "ru" | "en";

export type TranslationKeys = {
  app: {
    name: string;
    tagline: string;
    premium: string;
  };
  nav: {
    feed: string;
    explore: string;
    messages: string;
    notifications: string;
    profile: string;
    bookmarks: string;
    settings: string;
    createServer: string;
  };
  feed: {
    title: string;
    updated: string;
    live: string;
    tabs: {
      forYou: string;
      following: string;
      live: string;
      media: string;
    };
    compose: string;
    publish: string;
    yourStory: string;
    views: string;
  };
  explore: {
    title: string;
    subtitle: string;
    search: string;
    showMore: string;
    categories: {
      all: string;
      design: string;
      music: string;
      games: string;
      crypto: string;
      streams: string;
      photo: string;
      threeD: string;
    };
  };
  messages: {
    title: string;
    secure: string;
    search: string;
    placeholder: string;
    selectChat: string;
    status: {
      online: string;
      idle: string;
      dnd: string;
      offline: string;
    };
  };
  notifications: {
    title: string;
    unread: string;
    markAll: string;
    types: {
      like: string;
      follow: string;
      mention: string;
      repost: string;
      message: string;
    };
  };
  profile: {
    edit: string;
    tabs: {
      posts: string;
      replies: string;
      media: string;
      likes: string;
    };
    followers: string;
    following: string;
    postsCount: string;
  };
  trends: {
    title: string;
    showMore: string;
  };
  suggestions: {
    title: string;
    follow: string;
  };
  online: {
    title: string;
    count: string;
  };
  search: {
    default: string;
    posts: string;
    dialogs: string;
  };
  post: {
    comments: string;
    reposts: string;
    likes: string;
    bookmark: string;
    share: string;
  };
  time: {
    justNow: string;
    minutes: string;
    hours: string;
    days: string;
  };
  servers: {
    title: string;
    general: string;
    dev: string;
    design: string;
    music: string;
  };
  footer: {
    about: string;
    pay: string;
    api: string;
    rules: string;
    privacy: string;
    copyright: string;
  };
};

export type TranslationSchema = TranslationKeys;
