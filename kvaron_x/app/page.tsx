export default function Home() {
  return (
    <main className="min-h-screen bg-krx-black text-krx-white flex">
      {/* Левая панель меню */}
      <aside className="w-64 border-r border-gray-800 p-6">
        <h1 className="text-2xl font-bold text-krx-blue mb-10">KRX</h1>
        <nav className="space-y-6">
          <a href="#" className="block hover:text-krx-blue">Home</a>
          <a href="#" className="block hover:text-krx-blue">News</a>
          <a href="#" className="block hover:text-krx-blue">Messages</a>
          <a href="#" className="block hover:text-krx-blue">Settings</a>
        </nav>
      </aside>

      {/* Центральная лента */}
      <section className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">Лента новостей</h2>
        <div className="bg-krx-panel p-5 rounded-2xl border border-gray-800 hover:border-krx-blue transition-all duration-300 shadow-lg mb-6">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-gray-600"></div>
    <div>
      <h3 className="font-bold">KRX User</h3>
      <p className="text-xs text-gray-400">@krx_official • 2 мин назад</p>
    </div>
  </div>
  <p className="text-sm mb-4">Это первый пост в KVARON_X! Добро пожаловать в новую эру общения.</p>
  <div className="flex gap-4">
    <button className="text-krx-blue hover:text-white transition">Лайк</button>
    <button className="text-gray-400 hover:text-white transition">Репост</button>
  </div>
</div>
          <p>Это первый пост в KVARON_X!</p>
          <button className="mt-4 bg-krx-blue px-4 py-2 rounded-full text-sm">
            Лайкнуть
          </button>
        </div>
      </section>

      {/* Правая панель */}
      <aside className="w-80 border-l border-gray-800 p-6">
        <h2 className="font-semibold mb-4">Тренды</h2>
        <div className="text-gray-400 text-sm">#KRX_Launch</div>
      </aside>
    </main>
  );
}