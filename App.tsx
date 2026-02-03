
import React, { useState, useEffect, useCallback } from 'react';
import { RakutenProduct, Genre } from './types';
import { fetchRanking } from './services/rakutenApi';
import ProductCard from './components/ProductCard';
import Toast from './components/Toast';

const GENRES = [
  { id: Genre.ALL, label: '総合', icon: 'fa-trophy' },
  { id: Genre.FASHION, label: 'ファッション', icon: 'fa-tshirt' },
  { id: Genre.COSMETICS, label: 'コスメ', icon: 'fa-magic' },
  { id: Genre.FOOD, label: '食品', icon: 'fa-utensils' },
  { id: Genre.SWEETS, label: 'スイーツ', icon: 'fa-cookie' },
  { id: Genre.BABY, label: 'ベビー', icon: 'fa-baby' },
  { id: Genre.ELECTRONICS, label: '家電', icon: 'fa-laptop' },
  { id: Genre.DAILY_GOODS, label: '日用品', icon: 'fa-shopping-cart' },
  { id: Genre.BOOKS, label: '本・雑誌', icon: 'fa-book' },
  { id: Genre.TOYS, label: 'おもちゃ', icon: 'fa-gamepad' },
  { id: Genre.INTERIOR, label: 'インテリア', icon: 'fa-couch' },
  { id: Genre.KITCHEN, label: 'キッチン', icon: 'fa-blender' },
  { id: Genre.SPORTS, label: 'スポーツ', icon: 'fa-running' },
  { id: Genre.GIFT, label: 'ギフト', icon: 'fa-gift' },
];

function App() {
  const [products, setProducts] = useState<RakutenProduct[]>([]);
  const [genre, setGenre] = useState<Genre>(Genre.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const loadData = useCallback(async (selectedGenre: Genre) => {
    setIsLoading(true);
    try {
      const data = await fetchRanking(selectedGenre);
      setProducts(data);
      const now = new Date();
      setLastUpdated(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    } catch (error) {
      console.error('Failed to load ranking:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(genre);
  }, [genre, loadData]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(`${type}をコピーしました！`);
      setIsToastVisible(true);
    });
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50 font-sans antialiased text-slate-900">
      {/* ヘッダーエリア */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* 上段: ロゴと更新ボタン */}
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <i className="fas fa-crown text-white text-sm"></i>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-black tracking-tighter text-slate-900 uppercase">
                  ROOM<span className="text-red-600">Rank</span>
                </h1>
                {lastUpdated && (
                  <span className="text-[10px] font-bold text-slate-400">
                    更新: {lastUpdated}
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => loadData(genre)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
            >
              <i className={`fas fa-sync-alt ${isLoading ? 'animate-spin' : ''}`}></i>
              <span>更新</span>
            </button>
          </div>

          {/* 下段: 横スワイプジャンルナビ */}
          <div className="relative border-t border-slate-50">
            {/* フェードエフェクト */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none"></div>
            
            <nav className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-4 scroll-smooth snap-x">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGenre(g.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all snap-start ${
                    genre === g.id 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-100 -translate-y-0.5' 
                      : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <i className={`fas ${g.icon} ${genre === g.id ? 'text-white' : 'text-slate-400'} text-[11px]`}></i>
                  {g.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-slate-400">楽天市場から本物のデータを取得中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={`${product.rank}-${product.itemName}-${genre}`} 
                product={product} 
                onCopy={handleCopy} 
              />
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 text-center border-t border-slate-200">
        <p className="text-[11px] text-slate-400 font-medium">
          ※楽天市場公式Ranking APIを使用して本物のデータを取得しています。
        </p>
      </footer>

      <Toast 
        message={toastMessage} 
        isVisible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}

export default App;
